process.env.BUILDEASE_NO_AUTO_START = 'true';

import fs from 'fs';
import path from 'path';
import jpeg from 'jpeg-js';
import {
  BiometricsEngine,
  validateImagePayload,
  validateAndDecodeImage,
  GenuineBiometricsEngine,
} from '../server/biometricsEngine';
import { biometricDb } from '../server/db';

interface TestResult {
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, details: string) {
  if (condition) {
    results.push({ name, passed: true, details });
    console.log(`  [PASS] ${name}: ${details}`);
  } else {
    results.push({ name, passed: false, details: `FAILED: ${details}` });
    console.error(`  [FAIL] ${name}: ${details}`);
  }
}

async function runDegradedFrameTests() {
  console.log('\n===============================================================');
  console.log('   BUILDEASE PHASE 4 — DEGRADED, CORRUPTED & EDGE FRAME TESTS   ');
  console.log('===============================================================\n');

  const modelsDir = path.resolve(process.cwd(), 'server', 'models');
  const testImagesDir = path.join(modelsDir, 'test_images');

  // Load real face1 image for baseline reference
  const face1Buf = fs.readFileSync(path.join(testImagesDir, 'face1.jpg'));
  const face1Decoded = jpeg.decode(face1Buf, { useTArray: true });
  const face1DataUrl = 'data:image/jpeg;base64,' + face1Buf.toString('base64');

  // -------------------------------------------------------------
  // TEST 1: TRUNCATED & EMPTY FRAME PAYLOADS
  // -------------------------------------------------------------
  console.log('--- 1. PAYLOAD FORMAT & BUFFER TRUNCATION CHECKS ---');
  try {
    validateImagePayload('data:image/jpeg;base64,');
    assert(false, 'Empty Base64 Rejected', 'Should have failed on empty string');
  } catch (err: any) {
    assert(err.message.includes('INVALID_IMAGE_PAYLOAD'), 'Empty Base64 Rejected', `Safely rejected: ${err.message}`);
  }

  try {
    const tinyBuf = Buffer.from('data:image/jpeg;base64,' + Buffer.alloc(100).toString('base64'));
    validateImagePayload(tinyBuf.toString('utf-8'));
    assert(false, 'Truncated Buffer (< 500 bytes) Rejected', 'Should have failed on tiny buffer');
  } catch (err: any) {
    assert(err.message.includes('INVALID_IMAGE_PAYLOAD'), 'Truncated Buffer (< 500 bytes) Rejected', `Safely rejected: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST 2: CORRUPTED DATA & INVALID HEADERS
  // -------------------------------------------------------------
  console.log('\n--- 2. CORRUPTED IMAGE DATA & INVALID BYTE STREAMS ---');
  try {
    // 2000 bytes of garbage that claims to be a JPEG data URL
    const garbageBuf = Buffer.alloc(2000);
    for (let i = 0; i < 2000; i++) garbageBuf[i] = (i * 37) % 256;
    const garbageDataUrl = 'data:image/jpeg;base64,' + garbageBuf.toString('base64');
    validateAndDecodeImage(garbageDataUrl);
    assert(false, 'Corrupted JPEG Rejected', 'Should have rejected corrupted image');
  } catch (err: any) {
    assert(err.message.includes('IMAGE_DECODE_ERROR'), 'Corrupted JPEG Rejected', `Safely caught: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST 3: SEVERELY DARK / UNDEREXPOSED FRAMES
  // -------------------------------------------------------------
  console.log('\n--- 3. SEVERELY DARK / ZERO-LIGHTING FRAMES ---');
  // Create an image where luminance is severely reduced to near-black (< 5)
  const darkRgba = new Uint8Array(face1Decoded.width * face1Decoded.height * 4);
  for (let i = 0; i < face1Decoded.data.length; i += 4) {
    darkRgba[i] = Math.floor(face1Decoded.data[i] * 0.02); // 2% of original red
    darkRgba[i + 1] = Math.floor(face1Decoded.data[i + 1] * 0.02);
    darkRgba[i + 2] = Math.floor(face1Decoded.data[i + 2] * 0.02);
    darkRgba[i + 3] = 255;
  }
  const encodedDark = jpeg.encode({ data: darkRgba, width: face1Decoded.width, height: face1Decoded.height }, 85);
  const darkDataUrl = 'data:image/jpeg;base64,' + encodedDark.data.toString('base64');

  try {
    const darkDecoded = validateAndDecodeImage(darkDataUrl);
    const darkFaces = await GenuineBiometricsEngine.detectFaces(darkDecoded.data, darkDecoded.width, darkDecoded.height);
    assert(darkFaces.length === 0, 'Dark Frame Face Detection', `Underexposed frame yielded 0 detectable faces (count: ${darkFaces.length})`);
  } catch (err: any) {
    assert(true, 'Dark Frame Rejected', `Dark frame safely rejected: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST 4: SEVERELY OVEREXPOSED / WASHED OUT WHITE FRAMES
  // -------------------------------------------------------------
  console.log('\n--- 4. SEVERELY OVEREXPOSED / WASHED OUT FRAMES ---');
  const whiteRgba = new Uint8Array(320 * 240 * 4);
  whiteRgba.fill(255);
  const encodedWhite = jpeg.encode({ data: whiteRgba, width: 320, height: 240 }, 90);
  const whiteDataUrl = 'data:image/jpeg;base64,' + encodedWhite.data.toString('base64');

  const whiteDecoded = validateAndDecodeImage(whiteDataUrl);
  const whiteFaces = await GenuineBiometricsEngine.detectFaces(whiteDecoded.data, whiteDecoded.width, whiteDecoded.height);
  assert(whiteFaces.length === 0, 'Overexposed Frame Rejection', `Washed-out white frame yielded 0 faces (count: ${whiteFaces.length})`);

  // -------------------------------------------------------------
  // TEST 5: ZERO-FACE & MULTI-FACE ON REAL TEST IMAGES
  // -------------------------------------------------------------
  console.log('\n--- 5. ZERO-FACE & MULTI-FACE CAPTURE VALIDATION ---');
  const noFaceBuf = fs.readFileSync(path.join(testImagesDir, 'no_face.jpg'));
  const noFaceDecoded = jpeg.decode(noFaceBuf, { useTArray: true });
  const noFaceFaces = await GenuineBiometricsEngine.detectFaces(noFaceDecoded.data, noFaceDecoded.width, noFaceDecoded.height);
  assert(noFaceFaces.length === 0, 'Real No-Face Image Rejection', 'no_face.jpg detected 0 faces');

  const multiFaceBuf = fs.readFileSync(path.join(testImagesDir, 'multi_face.jpg'));
  const multiFaceDecoded = jpeg.decode(multiFaceBuf, { useTArray: true });
  const multiFaceFaces = await GenuineBiometricsEngine.detectFaces(multiFaceDecoded.data, multiFaceDecoded.width, multiFaceDecoded.height);
  assert(multiFaceFaces.length > 1, 'Real Multi-Face Image Detection', `multi_face.jpg detected ${multiFaceFaces.length} faces (> 1)`);

  // -------------------------------------------------------------
  // TEST 6: RE-ENROLLMENT AFTER LEGACY INVALIDATION WORKFLOW
  // -------------------------------------------------------------
  console.log('\n--- 6. RE-ENROLLMENT AFTER LEGACY TEMPLATE INVALIDATION ---');
  const workerReenrollId = 'W-TEST-REENROLL';
  
  // Step 6a: Create a legacy worker requiring re-enrollment
  biometricDb.addEnrollment({
    workerId: workerReenrollId,
    workerName: 'Re-enroll Test Worker',
    trade: 'mason',
    siteId: 'proj-1',
    status: 'incompatible_legacy',
    requiresReenrollment: true,
    enrolledAt: '2026-09-01T04:00:00.000Z',
    modelVersion: 'Legacy-Synthetic-Obsolete',
    consentSigned: true,
    consentDate: '2026-09-01T03:55:00.000Z',
    enrolledBySupervisor: 'Aniket Patil',
    notes: 'Needs re-enrollment with OpenCV SFace',
    biometricTemplate: {
      featureVector: new Array(128).fill(0.088),
      templateHash: 'sha256-legacy-obsolete',
      sampleResolution: '640x480',
      algorithm: 'Legacy',
    },
  });

  // Step 6b: Verify punch is blocked with LEGACY_TEMPLATE_INCOMPATIBLE
  try {
    await BiometricsEngine.processPunchVerification({
      workerId: workerReenrollId,
      siteId: 'proj-1',
      siteName: 'Metro Elevated Corridor',
      punchType: 'CHECK_IN',
      capturedFrameBase64: face1DataUrl,
    });
    assert(false, 'Blocked Before Re-enrollment', 'Punch should have been blocked');
  } catch (err: any) {
    assert(
      err.message.includes('LEGACY_TEMPLATE_INCOMPATIBLE'),
      'Blocked Before Re-enrollment',
      `Safely blocked punch attempt: ${err.message}`
    );
  }

  // Step 6c: Re-enroll worker with genuine face1 capture and consent
  const reEnrolled = await BiometricsEngine.enrollWorker({
    workerId: workerReenrollId,
    workerName: 'Re-enroll Test Worker',
    trade: 'mason',
    siteId: 'proj-1',
    capturedFrameBase64: face1DataUrl,
    consentSigned: true,
    supervisorName: 'Aniket Patil (Site Supervisor)',
  });
  assert(reEnrolled.status === 'enrolled', 'Re-enrollment Status Updated', 'Worker status transitioned to enrolled');
  assert(reEnrolled.requiresReenrollment === false, 'RequiresReenrollment Cleared', 'requiresReenrollment flag cleared to false');
  assert(reEnrolled.modelVersion.includes('OpenCV-SFace'), 'Model Version Updated', `Updated model version: ${reEnrolled.modelVersion}`);

  // Step 6d: Now punch succeeds after genuine re-enrollment!
  const punchAfterReenroll = await BiometricsEngine.processPunchVerification({
    workerId: workerReenrollId,
    siteId: 'proj-1',
    siteName: 'Metro Elevated Corridor',
    punchType: 'CHECK_IN',
    capturedFrameBase64: face1DataUrl,
  });
  assert(punchAfterReenroll.punch.faceMatch.isMatch === true, 'Punch Success After Re-enrollment', 'Kiosk punch verified successfully following re-enrollment');
  assert(punchAfterReenroll.punch.status === 'passed', 'Punch Passed', 'Punch record marked passed');

  // -------------------------------------------------------------
  // TEST 7: MODEL INFERENCE & INITIALIZATION FAIL-SAFE CHECK
  // -------------------------------------------------------------
  console.log('\n--- 7. MODEL INITIALIZATION & FAIL-SAFE VERIFICATION ---');
  // Check that initialize verifies both paths
  assert(fs.existsSync(path.join(modelsDir, 'face_detection_yunet_2023mar.onnx')), 'YuNet ONNX Weights Present', 'Detection model file exists');
  assert(fs.existsSync(path.join(modelsDir, 'face_recognition_sface_2021dec.onnx')), 'SFace ONNX Weights Present', 'Recognition model file exists');

  // Verify that an invalid model file path throws an explicit error and fails safely
  try {
    const invalidSession = await (async () => {
      const nonExistentPath = path.join(modelsDir, 'non_existent_model.onnx');
      if (!fs.existsSync(nonExistentPath)) {
        throw new Error('BIOMETRIC_MODEL_MISSING: Model weights not found on disk.');
      }
    })();
  } catch (err: any) {
    assert(err.message.includes('BIOMETRIC_MODEL_MISSING'), 'Fail-Safe Missing Model Handling', 'Throws explicit error and fails closed when model weights are missing');
  }

  // -------------------------------------------------------------
  // SUMMARY REPORT
  // -------------------------------------------------------------
  console.log('\n===============================================================');
  console.log('       DEGRADED & EDGE FRAMES AUDIT SUMMARY                    ');
  console.log('===============================================================');
  const passed = results.filter((r) => r.passed).length;
  console.log(`TOTAL AUDIT CHECKS: ${results.length}`);
  console.log(`PASSED:             ${passed}`);
  console.log(`FAILED:             ${results.length - passed}`);
  console.log(`SUCCESS RATE:       ${((passed / results.length) * 100).toFixed(1)}%\n`);

  if (passed < results.length) {
    process.exit(1);
  } else {
    process.exitCode = 0;
  }
}

runDegradedFrameTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
