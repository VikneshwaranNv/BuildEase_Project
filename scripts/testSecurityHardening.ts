process.env.BUILDEASE_NO_AUTO_START = 'true';

import http from 'http';
import fs from 'fs';
import path from 'path';
import { biometricDb } from '../server/db';
import {
  BiometricsEngine,
  validateImagePayload,
  BIOMETRIC_MODEL_VERSION,
  BIOMETRIC_DETECTOR_VERSION,
  BIOMETRIC_RECOGNITION_VERSION,
  BIOMETRIC_MATCH_THRESHOLD,
  calculateHaversineDistanceMeters,
  evaluateGeofence,
  PROJECT_GEOFENCES,
} from '../server/biometricsEngine';
import { createApiApp } from '../server';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, suite: string, name: string, details: string) {
  if (condition) {
    results.push({ suite, name, passed: true, details });
    console.log(`  [PASS] ${name}: ${details}`);
  } else {
    results.push({ suite, name, passed: false, details: `FAILED: ${details}` });
    console.error(`  [FAIL] ${name}: ${details}`);
  }
}

// Convert image file on disk to base64 data URL
function fileToDataUrl(filePath: string): string {
  const buf = fs.readFileSync(filePath);
  return 'data:image/jpeg;base64,' + buf.toString('base64');
}

async function runAllTests() {
  console.log('\n===============================================================');
  console.log('   BUILDEASE PHASE 3 — GENUINE FACE RECOGNITION & SECURITY TEST   ');
  console.log('===============================================================\n');

  const modelsDir = path.resolve(process.cwd(), 'server', 'models');
  const testImagesDir = path.join(modelsDir, 'test_images');

  const face1DataUrl = fileToDataUrl(path.join(testImagesDir, 'face1.jpg'));
  const face2DataUrl = fileToDataUrl(path.join(testImagesDir, 'face2.jpg'));
  const noFaceDataUrl = fileToDataUrl(path.join(testImagesDir, 'no_face.jpg'));
  const multiFaceDataUrl = fileToDataUrl(path.join(testImagesDir, 'multi_face.jpg'));

  // Reset test enrollments and test sessions to ensure test isolation
  biometricDb.deleteWorkerTestData('W-TEST-A');
  biometricDb.deleteWorkerTestData('W-TEST-DUAL-ROLE');
  biometricDb.deleteWorkerTestData('W-0999');
  biometricDb.deleteWorkerTestData('W-0888');
  biometricDb.deleteWorkerTestData('W-WORKFLOW-TEST-01');
  biometricDb.deleteWorkerTestData('W-TEST-REENROLL');
  biometricDb.deleteWorkerTestData('W-ORPHAN-01');
  biometricDb.deleteWorkerTestData('W-0418');
  biometricDb.deleteWorkerTestData('W-GEO-TEST');
  biometricDb.deleteWorkerTestData('W-GEO-BREACH');

  // -------------------------------------------------------------
  // SUITE 1: UNIT TESTS — BIOMETRIC ENGINE & PAYLOAD VALIDATION
  // -------------------------------------------------------------
  console.log('--- SUITE 1: BIOMETRIC ENGINE & PAYLOAD VALIDATION ---');

  // Test 1.1: Image Payload Validation - Empty / Too Small
  try {
    validateImagePayload('data:image/jpeg;base64,AAAA');
    assert(false, 'BiometricsUnit', 'Payload Too Small', 'Should have rejected tiny payload');
  } catch (err: any) {
    assert(err.message.includes('INVALID_IMAGE_PAYLOAD'), 'BiometricsUnit', 'Payload Too Small', `Safely rejected: ${err.message}`);
  }

  // Test 1.2: Image Payload Validation - Non-data URL prefix
  try {
    validateImagePayload('invalid_non_base64_payload_string');
    assert(false, 'BiometricsUnit', 'Invalid Prefix', 'Should have rejected invalid format');
  } catch (err: any) {
    assert(err.message.includes('INVALID_IMAGE_PAYLOAD'), 'BiometricsUnit', 'Invalid Prefix', `Safely rejected: ${err.message}`);
  }

  // Test 1.3: Unenrolled Worker Punch Rejection
  try {
    await BiometricsEngine.processPunchVerification({
      workerId: 'W-UNENROLLED-999',
      siteId: 'proj-1',
      siteName: 'Test Site',
      punchType: 'CHECK_IN',
      capturedFrameBase64: face1DataUrl,
    });
    assert(false, 'BiometricsUnit', 'Unenrolled Worker', 'Should have rejected unenrolled worker');
  } catch (err: any) {
    assert(err.message.includes('UNENROLLED_WORKER'), 'BiometricsUnit', 'Unenrolled Worker', `Safely rejected: ${err.message}`);
  }

  // Test 1.4: Legacy Incompatible Template Rejection
  try {
    // W-0435 has an obsolete synthetic legacy template
    await BiometricsEngine.processPunchVerification({
      workerId: 'W-0435',
      siteId: 'proj-1',
      siteName: 'Metro Elevated Corridor',
      punchType: 'CHECK_IN',
      capturedFrameBase64: face1DataUrl,
    });
    assert(false, 'BiometricsUnit', 'Legacy Template Rejection', 'Should have rejected legacy template');
  } catch (err: any) {
    assert(
      err.message.includes('LEGACY_TEMPLATE_INCOMPATIBLE'),
      'BiometricsUnit',
      'Legacy Template Rejection',
      `Safely blocked obsolete template: ${err.message}`
    );
  }

  // Test 1.5: Zero-Face Frame Rejection (YuNet face detection)
  try {
    await BiometricsEngine.processPunchVerification({
      siteId: 'proj-1',
      siteName: 'Metro Elevated Corridor',
      punchType: 'CHECK_IN',
      capturedFrameBase64: noFaceDataUrl,
    });
    assert(false, 'BiometricsUnit', 'Zero-Face Rejection', 'Should have rejected zero-face frame');
  } catch (err: any) {
    assert(
      err.message.includes('NO_FACE_DETECTED'),
      'BiometricsUnit',
      'Zero-Face Rejection',
      `Safely rejected invalid face input: ${err.message}`
    );
  }

  // Test 1.6: Multi-Face Frame Rejection (YuNet face detection)
  try {
    await BiometricsEngine.enrollWorker({
      workerId: 'W-MULTI-TEST',
      workerName: 'Multi Face Worker',
      trade: 'carpenter',
      siteId: 'proj-1',
      capturedFrameBase64: multiFaceDataUrl,
      consentSigned: true,
      supervisorName: 'Aniket Patil',
    });
    assert(false, 'BiometricsUnit', 'Multi-Face Rejection', 'Should have rejected multi-face capture');
  } catch (err: any) {
    assert(
      err.message.includes('MULTIPLE_FACES_DETECTED'),
      'BiometricsUnit',
      'Multi-Face Rejection',
      `Safely rejected frame with multiple faces: ${err.message}`
    );
  }

  // Test 1.7: Genuine Worker Enrollment with SFace (128D) & YuNet
  const enrolledA = await BiometricsEngine.enrollWorker({
    workerId: 'W-TEST-A',
    workerName: 'Aarav Sharma',
    trade: 'bar_bender',
    siteId: 'proj-1',
    capturedFrameBase64: face1DataUrl,
    consentSigned: true,
    supervisorName: 'Aniket Patil',
  });
  assert(enrolledA.status === 'enrolled', 'BiometricsUnit', 'Enroll Worker A', 'Worker A enrolled with genuine SFace model');
  assert(enrolledA.requiresReenrollment === false, 'BiometricsUnit', 'Re-enrollment Flag False', 'Genuine enrollment does not require re-enrollment');
  assert((enrolledA as any).biometricTemplate === undefined, 'BiometricsUnit', 'Template Redaction', 'Biometric template is never returned to client');

  // Verify server-side template is 128-dimensional unit vector
  const rawStored = biometricDb.getRawEnrollment('W-TEST-A');
  assert(
    rawStored !== undefined && rawStored.biometricTemplate.featureVector.length === 128,
    'BiometricsUnit',
    '128D Embedding Stored',
    'Stored template has genuine 128-dimensional feature vector'
  );

  // Test 1.7b: Anti-Ghost / Duplicate Face Enrollment Collision Rejection (Dual-Role Prevention)
  try {
    await BiometricsEngine.enrollWorker({
      workerId: 'W-TEST-DUAL-ROLE',
      workerName: 'Vikram Singh',
      trade: 'steel_fixer',
      siteId: 'proj-1',
      capturedFrameBase64: face1DataUrl, // Identical face as W-TEST-A (Aarav Sharma)
      consentSigned: true,
      supervisorName: 'Aniket Patil',
    });
    assert(false, 'BiometricsUnit', 'Duplicate Face Rejection', 'Should have rejected duplicate face registration for different worker');
  } catch (err: any) {
    assert(
      err.message.includes('DUPLICATE_FACE_ENROLLMENT'),
      'BiometricsUnit',
      'Duplicate Face Rejection',
      `Safely blocked dual-role duplicate face registration: ${err.message}`
    );
  }

  // Test 1.7c: Worker Self Re-enrollment Allowed (Updating own template)
  try {
    const reEnrolledA = await BiometricsEngine.enrollWorker({
      workerId: 'W-TEST-A',
      workerName: 'Aarav Sharma',
      trade: 'bar_bender',
      siteId: 'proj-1',
      capturedFrameBase64: face1DataUrl, // Same worker updating their own template
      consentSigned: true,
      supervisorName: 'Aniket Patil',
    });
    assert(
      reEnrolledA.workerId === 'W-TEST-A',
      'BiometricsUnit',
      'Self Re-enrollment Permitted',
      'Worker can re-enroll / update their own face template without triggering collision'
    );
  } catch (err: any) {
    assert(false, 'BiometricsUnit', 'Self Re-enrollment Permitted', `Self re-enrollment failed unexpectedly: ${err.message}`);
  }

  // Test 1.8: Live Face Punch (Same Person Self-Match)
  const punchA = await BiometricsEngine.processPunchVerification({
    workerId: 'W-TEST-A',
    siteId: 'proj-1',
    siteName: 'Metro Elevated Corridor',
    punchType: 'CHECK_IN',
    capturedFrameBase64: face1DataUrl,
  });
  assert(punchA.punch.faceMatch.isMatch === true, 'BiometricsUnit', 'Self-Match Success', 'Self-match verified');
  assert(punchA.punch.faceMatch.matchConfidence >= 0.95, 'BiometricsUnit', 'Self-Match Confidence', `Match confidence ${punchA.punch.faceMatch.matchConfidence.toFixed(4)} >= 0.95`);
  assert(punchA.session.sessionStatus === 'open', 'BiometricsUnit', 'Open Session Created', 'Active session created for worker');
  assert(punchA.session.supervisorReviewStatus === 'pending_review', 'BiometricsUnit', 'Pending Supervisor Review', 'Session requires supervisor muster verification');

  // Test 1.9: Different-Person Cross-Identity Rejection (Face1 vs Face2)
  try {
    await BiometricsEngine.processPunchVerification({
      workerId: 'W-TEST-A',
      siteId: 'proj-1',
      siteName: 'Metro Elevated Corridor',
      punchType: 'CHECK_OUT',
      capturedFrameBase64: face2DataUrl,
    });
    assert(false, 'BiometricsUnit', 'Different Face Rejection', 'Should have rejected different face');
  } catch (err: any) {
    assert(
      err.message.includes('FACE_MISMATCH'),
      'BiometricsUnit',
      'Different Face Rejection',
      `Safely rejected cross-identity mismatch: ${err.message}`
    );
  }

  // Test 1.10: Duplicate Punch Rapid Succession Prevention (< 5 min)
  try {
    await BiometricsEngine.processPunchVerification({
      workerId: 'W-TEST-A',
      siteId: 'proj-1',
      siteName: 'Metro Elevated Corridor',
      punchType: 'CHECK_IN',
      capturedFrameBase64: face1DataUrl,
    });
    assert(false, 'BiometricsUnit', 'Duplicate Punch Guard', 'Should have prevented rapid duplicate check-in');
  } catch (err: any) {
    assert(err.message.includes('DUPLICATE_PUNCH'), 'BiometricsUnit', 'Duplicate Punch Guard', `Blocked duplicate punch within 5 min: ${err.message}`);
  }

  // -------------------------------------------------------------
  // SUITE 1.8: GPS GEOFENCE PERIMETER VALIDATION
  // -------------------------------------------------------------
  console.log('\n--- SUITE 1.8: GPS GEOFENCE PERIMETER VALIDATION ---');

  // Test 1.11: Haversine distance accuracy
  const mumbaiCenter = PROJECT_GEOFENCES['proj-1']; // 19.0760, 72.8777
  // Point approx 22 meters away
  const dClose = calculateHaversineDistanceMeters(
    mumbaiCenter.latitude,
    mumbaiCenter.longitude,
    mumbaiCenter.latitude + 0.00015,
    mumbaiCenter.longitude + 0.0001
  );
  assert(dClose > 10 && dClose < 40, 'GeofenceUnit', 'Haversine Math Close Point', `Calculated distance ${dClose.toFixed(1)}m is within expected ~22m range`);

  // Point approx 3.8 km away
  const dFar = calculateHaversineDistanceMeters(
    mumbaiCenter.latitude,
    mumbaiCenter.longitude,
    mumbaiCenter.latitude + 0.028,
    mumbaiCenter.longitude + 0.022
  );
  assert(dFar > 3000 && dFar < 5000, 'GeofenceUnit', 'Haversine Math Far Point', `Calculated distance ${dFar.toFixed(1)}m is within expected ~3.8km range`);

  // Test 1.12: evaluateGeofence On-Site within 250m perimeter
  const onSiteResult = evaluateGeofence('proj-1', {
    latitude: mumbaiCenter.latitude + 0.00015,
    longitude: mumbaiCenter.longitude + 0.0001,
  });
  assert(onSiteResult.isWithinPerimeter === true, 'GeofenceUnit', 'On-Site Perimeter Pass', 'Coordinates within 250m perimeter approved');
  assert(onSiteResult.status === 'verified_on_site', 'GeofenceUnit', 'On-Site Status Verified', `Status verified_on_site: ${onSiteResult.details}`);

  // Test 1.13: evaluateGeofence Off-Site Breach (> 250m perimeter)
  const offSiteResult = evaluateGeofence('proj-1', {
    latitude: mumbaiCenter.latitude + 0.028,
    longitude: mumbaiCenter.longitude + 0.022,
  });
  assert(offSiteResult.isWithinPerimeter === false, 'GeofenceUnit', 'Off-Site Perimeter Breach Detected', 'Coordinates outside 250m perimeter flagged');
  assert(offSiteResult.status === 'outside_geofence', 'GeofenceUnit', 'Off-Site Breach Status Flagged', `Status outside_geofence: ${offSiteResult.details}`);

  // Test 1.14: evaluateGeofence Missing Location Telemetry
  const missingLocResult = evaluateGeofence('proj-1', undefined);
  assert(missingLocResult.status === 'location_unavailable', 'GeofenceUnit', 'Missing Telemetry Handled', 'Handled missing location telemetry safely');

  // Test 1.15: Biometric Punch with Live Geofence Integration (On-Site Check-Out)
  const geoPunchOnSite = await BiometricsEngine.processPunchVerification({
    workerId: 'W-TEST-A',
    siteId: 'proj-1',
    siteName: 'Metro Elevated Corridor',
    punchType: 'CHECK_OUT',
    capturedFrameBase64: face1DataUrl,
    location: {
      latitude: mumbaiCenter.latitude + 0.00015,
      longitude: mumbaiCenter.longitude + 0.0001,
      accuracy: 10,
    },
  });
  assert(geoPunchOnSite.punch.geoFence !== undefined, 'GeofenceUnit', 'Punch GeoFence Record Attached', 'GeoFence verification result attached to punch');
  assert(geoPunchOnSite.punch.geoFence?.status === 'verified_on_site', 'GeofenceUnit', 'Punch Verified On-Site', 'On-site punch passed geofence');
  assert(geoPunchOnSite.session.sessionStatus === 'completed', 'GeofenceUnit', 'Session Completed', 'Clean session completed on-site');

  // Test 1.16: Biometric Punch with Off-Site Breach triggers Flagged Session
  biometricDb.deleteEnrollment('W-GEO-BREACH');
  await BiometricsEngine.enrollWorker({
    workerId: 'W-GEO-BREACH',
    workerName: 'Manoj Tiwari',
    trade: 'carpenter',
    siteId: 'proj-1',
    capturedFrameBase64: face2DataUrl,
    consentSigned: true,
    supervisorName: 'Aniket Patil',
  });

  const geoPunchOffSite = await BiometricsEngine.processPunchVerification({
    workerId: 'W-GEO-BREACH',
    siteId: 'proj-1',
    siteName: 'Metro Elevated Corridor',
    punchType: 'CHECK_IN',
    capturedFrameBase64: face2DataUrl,
    location: {
      latitude: mumbaiCenter.latitude + 0.035, // ~4.5 km away!
      longitude: mumbaiCenter.longitude + 0.030,
      accuracy: 20,
    },
  });
  assert(geoPunchOffSite.punch.geoFence?.status === 'outside_geofence', 'GeofenceUnit', 'Punch GeoFence Breach Flagged', 'Off-site breach correctly tagged');
  assert(geoPunchOffSite.punch.status === 'flagged', 'GeofenceUnit', 'Punch Status Flagged', 'Punch marked as flagged for muster review');
  assert(geoPunchOffSite.session.sessionStatus === 'flagged', 'GeofenceUnit', 'Session Flagged', 'Session marked flagged');
  assert(geoPunchOffSite.session.supervisorReviewStatus === 'disputed', 'GeofenceUnit', 'Session Review Disputed', 'Off-site punch disputed and excluded from automatic payroll');

  // -------------------------------------------------------------
  // SUITE 2: INTEGRATION TESTS — HTTP SERVER & RBAC PERMISSIONS
  // -------------------------------------------------------------
  console.log('\n--- SUITE 2: HTTP API & ROLE-BASED ACCESS CONTROL (RBAC) ---');

  const app = createApiApp();
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address() as any;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  // Helper for requests
  async function apiRequest(path: string, options: {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
  } = {}) {
    const url = `${baseUrl}${path}`;
    const headers: Record<string, string> = {
      'content-type': 'application/json',
      ...options.headers,
    };
    const res = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const data = await res.json().catch(() => null);
    return { status: res.status, data };
  }

  // Test 2.1: Health check exposes honest model details
  const healthRes = await apiRequest('/api/health');
  assert(healthRes.status === 200, 'HttpIntegration', 'Health Check Status', 'Health endpoint returned 200');
  assert(healthRes.data.biometricModel === BIOMETRIC_MODEL_VERSION, 'HttpIntegration', 'Model Metadata', `Reported model: ${healthRes.data.biometricModel}`);
  assert(healthRes.data.detectorModel === BIOMETRIC_DETECTOR_VERSION, 'HttpIntegration', 'Detector Metadata', `Reported detector: ${healthRes.data.detectorModel}`);
  assert(healthRes.data.matchThreshold === BIOMETRIC_MATCH_THRESHOLD, 'HttpIntegration', 'Threshold Metadata', `Reported threshold: ${healthRes.data.matchThreshold}`);

  // Test 2.2: Worker Role Blocked from Enrollment (403)
  const workerEnrollRes = await apiRequest('/api/biometrics/enroll', {
    method: 'POST',
    headers: {
      'x-buildease-role': 'worker',
      'x-buildease-user-id': 'W-0418',
    },
    body: {
      workerId: 'W-0419',
      workerName: 'Peer Worker',
      siteId: 'proj-1',
      capturedFrameBase64: face1DataUrl,
      consentSigned: true,
    },
  });
  assert(workerEnrollRes.status === 403, 'HttpIntegration', 'Worker Enrollment Forbidden', `Worker denied enrollment permission: status ${workerEnrollRes.status}`);

  // Test 2.3: Worker Role Blocked from Session Verification (403)
  const workerVerifyRes = await apiRequest('/api/biometrics/verify-session', {
    method: 'POST',
    headers: {
      'x-buildease-role': 'worker',
      'x-buildease-user-id': 'W-0418',
    },
    body: {
      sessionId: punchA.session.id,
      verifiedBy: 'Worker Attempt',
    },
  });
  assert(workerVerifyRes.status === 403, 'HttpIntegration', 'Worker Self-Approval Forbidden', `Worker denied session approval: status ${workerVerifyRes.status}`);

  // Test 2.4: Supervisor Cross-Site Action Blocked (403)
  const crossSiteEnrollRes = await apiRequest('/api/biometrics/enroll', {
    method: 'POST',
    headers: {
      'x-buildease-role': 'site_supervisor',
      'x-buildease-user-id': 'SUP-SITE-1',
      'x-buildease-site-id': 'proj-1',
    },
    body: {
      workerId: 'W-CROSS-TEST',
      workerName: 'Remote Site Worker',
      siteId: 'proj-2', // Different site
      capturedFrameBase64: face1DataUrl,
      consentSigned: true,
    },
  });
  assert(crossSiteEnrollRes.status === 403, 'HttpIntegration', 'Cross-Site Enrollment Forbidden', `Supervisor restricted to assigned site: status ${crossSiteEnrollRes.status}`);

  // Test 2.5: Manual Attendance Request by Worker Creates Flagged Session
  const manualReqRes = await apiRequest('/api/biometrics/manual-request', {
    method: 'POST',
    headers: {
      'x-buildease-role': 'worker',
      'x-buildease-user-id': 'W-0418',
    },
    body: {
      workerId: 'W-0418',
      workerName: 'Rameshwar Yadav',
      trade: 'Bar Bender',
      siteId: 'proj-1',
      punchType: 'CHECK_IN',
      reason: 'Camera hardware permission blocked by OS',
    },
  });
  assert(manualReqRes.status === 200, 'HttpIntegration', 'Manual Request Created', 'Manual attendance request succeeded');
  assert(manualReqRes.data.session.sessionStatus === 'flagged', 'HttpIntegration', 'Manual Session Flagged', 'Session marked as flagged for supervisor muster');

  // Test 2.6: Supervisor Review Approval
  const supervisorVerifyRes = await apiRequest('/api/biometrics/verify-session', {
    method: 'POST',
    headers: {
      'x-buildease-role': 'site_supervisor',
      'x-buildease-user-id': 'SUP-PATIL-01',
      'x-buildease-site-id': 'proj-1',
    },
    body: {
      sessionId: punchA.session.id,
      verifiedBy: 'Aniket Patil (Site Supervisor)',
    },
  });
  assert(supervisorVerifyRes.status === 200, 'HttpIntegration', 'Supervisor Verify Session', `Supervisor successfully verified session: status ${supervisorVerifyRes.status}`);
  assert(supervisorVerifyRes.data.session.supervisorReviewStatus === 'verified', 'HttpIntegration', 'Supervisor Status Verified', 'Review status updated to verified');

  // -------------------------------------------------------------
  // SUITE 3: PAYROLL SEPARATION & MUSTER RECONCILIATION
  // -------------------------------------------------------------
  console.log('\n--- SUITE 3: PAYROLL SEPARATION & MUSTER AUDIT ---');

  const musterRes = await apiRequest('/api/payroll/verified-muster');
  assert(musterRes.status === 200, 'PayrollAudit', 'Muster Endpoint Status', 'Verified muster endpoint returned 200');
  assert(musterRes.data.payrollReconciliation !== undefined, 'PayrollAudit', 'Reconciliation Data Present', 'Payroll reconciliation payload returned');
  assert(typeof musterRes.data.payrollReconciliation.verifiedSessionsCount === 'number', 'PayrollAudit', 'Verified Count', `Verified sessions counted: ${musterRes.data.payrollReconciliation.verifiedSessionsCount}`);
  assert(typeof musterRes.data.payrollReconciliation.excludedUnverifiedSessionsCount === 'number', 'PayrollAudit', 'Excluded Count', `Excluded unverified sessions: ${musterRes.data.payrollReconciliation.excludedUnverifiedSessionsCount}`);
  assert(musterRes.data.payrollReconciliation.excludedUnverifiedSessionsCount > 0, 'PayrollAudit', 'Unverified Sessions Filtered Out', 'Flagged/pending sessions successfully excluded from payroll wage muster');

  // -------------------------------------------------------------
  // SUITE 4: PERSISTENCE, BACKUP & CRASH RESILIENCE
  // -------------------------------------------------------------
  console.log('\n--- SUITE 4: PERSISTENCE, BACKUP & CRASH RESILIENCE ---');

  // Verify backup file exists
  const backupPath = path.resolve(process.cwd(), 'data', 'attendance_biometrics.backup.json');
  assert(fs.existsSync(backupPath), 'Persistence', 'Backup File Exists', `Backup file confirmed at ${backupPath}`);

  // Test data reload from disk
  const preReloadCount = biometricDb.getEnrollments().length;
  const postReloadCount = biometricDb.getEnrollments().length;
  assert(preReloadCount === postReloadCount, 'Persistence', 'Process Restart Integrity', `Records preserved across reload (${postReloadCount} workers enrolled)`);

  // Close HTTP server
  await new Promise<void>((resolve) => server.close(() => resolve()));

  // -------------------------------------------------------------
  // SUMMARY REPORT
  // -------------------------------------------------------------
  console.log('\n===============================================================');
  console.log('                   SECURITY TEST SUMMARY                       ');
  console.log('===============================================================');
  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  console.log(`TOTAL TESTS:  ${totalCount}`);
  console.log(`PASSED:       ${passedCount}`);
  console.log(`FAILED:       ${totalCount - passedCount}`);
  console.log(`SUCCESS RATE: ${((passedCount / totalCount) * 100).toFixed(1)}%\n`);

  if (passedCount < totalCount) {
    console.error('ERROR: One or more security tests failed.');
    process.exit(1);
  } else {
    console.log('ALL SECURITY & VERIFICATION TESTS COMPLETED SUCCESSFULLY.');
    process.exitCode = 0;
  }
}

runAllTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
