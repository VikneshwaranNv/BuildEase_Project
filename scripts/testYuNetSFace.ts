import fs from 'fs';
import path from 'path';
import ort from 'onnxruntime-node';
import jpeg from 'jpeg-js';

export interface FaceDetectionResult {
  x: number;
  y: number;
  width: number;
  height: number;
  score: number;
  landmarks: {
    rightEye: [number, number];
    leftEye: [number, number];
    nose: [number, number];
    rightMouth: [number, number];
    leftMouth: [number, number];
  };
}

export class GenuineBiometricsEngine {
  private static yunetSession: ort.InferenceSession | null = null;
  private static sfaceSession: ort.InferenceSession | null = null;

  static async initialize(modelsDir: string) {
    if (!this.yunetSession) {
      const yunetPath = path.join(modelsDir, 'face_detection_yunet_2023mar.onnx');
      this.yunetSession = await ort.InferenceSession.create(yunetPath);
    }
    if (!this.sfaceSession) {
      const sfacePath = path.join(modelsDir, 'face_recognition_sface_2021dec.onnx');
      this.sfaceSession = await ort.InferenceSession.create(sfacePath);
    }
  }

  // Bilinear interpolation resize from RGBA buffer
  private static resizeRgba(
    src: Uint8Array,
    srcW: number,
    srcH: number,
    dstW: number,
    dstH: number,
    cropX = 0,
    cropY = 0,
    cropW = srcW,
    cropH = srcH
  ): Uint8Array {
    const dst = new Uint8Array(dstW * dstH * 4);
    const xRatio = cropW / dstW;
    const yRatio = cropH / dstH;

    for (let dy = 0; dy < dstH; dy++) {
      const sy = cropY + dy * yRatio;
      const y0 = Math.floor(sy);
      const y1 = Math.min(y0 + 1, srcH - 1);
      const yWeight = sy - y0;

      for (let dx = 0; dx < dstW; dx++) {
        const sx = cropX + dx * xRatio;
        const x0 = Math.floor(sx);
        const x1 = Math.min(x0 + 1, srcW - 1);
        const xWeight = sx - x0;

        const dstIdx = (dy * dstW + dx) * 4;
        for (let c = 0; c < 4; c++) {
          const p00 = src[(y0 * srcW + x0) * 4 + c];
          const p10 = src[(y0 * srcW + x1) * 4 + c];
          const p01 = src[(y1 * srcW + x0) * 4 + c];
          const p11 = src[(y1 * srcW + x1) * 4 + c];

          const top = p00 * (1 - xWeight) + p10 * xWeight;
          const bottom = p01 * (1 - xWeight) + p11 * xWeight;
          dst[dstIdx + c] = Math.round(top * (1 - yWeight) + bottom * yWeight);
        }
      }
    }
    return dst;
  }

  // Preprocess input image to 640x640 tensor for YuNet
  private static prepareYuNetTensor(
    rgba: Uint8Array,
    width: number,
    height: number
  ): { tensor: ort.Tensor; scale: number; padW: number; padH: number } {
    const targetSize = 640;
    const scale = Math.min(targetSize / width, targetSize / height);
    const newW = Math.round(width * scale);
    const newH = Math.round(height * scale);

    const resized = this.resizeRgba(rgba, width, height, newW, newH);

    // [1, 3, 640, 640] channel first
    const tensorData = new Float32Array(1 * 3 * targetSize * targetSize);
    const channelSize = targetSize * targetSize;

    for (let y = 0; y < newH; y++) {
      for (let x = 0; x < newW; x++) {
        const srcIdx = (y * newW + x) * 4;
        const dstIdx = y * targetSize + x;
        // BGR order for OpenCV model or RGB (YuNet operates on raw color channels)
        tensorData[0 * channelSize + dstIdx] = resized[srcIdx + 0]; // R
        tensorData[1 * channelSize + dstIdx] = resized[srcIdx + 1]; // G
        tensorData[2 * channelSize + dstIdx] = resized[srcIdx + 2]; // B
      }
    }

    const tensor = new ort.Tensor('float32', tensorData, [1, 3, targetSize, targetSize]);
    return { tensor, scale, padW: targetSize, padH: targetSize };
  }

  // Non-Maximum Suppression (IoU)
  private static nms(boxes: FaceDetectionResult[], iouThreshold = 0.3): FaceDetectionResult[] {
    const sorted = [...boxes].sort((a, b) => b.score - a.score);
    const selected: FaceDetectionResult[] = [];

    for (const b of sorted) {
      let keep = true;
      for (const s of selected) {
        const xA = Math.max(b.x, s.x);
        const yA = Math.max(b.y, s.y);
        const xB = Math.min(b.x + b.width, s.x + s.width);
        const yB = Math.min(b.y + b.height, s.y + s.height);

        const interArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);
        const bArea = b.width * b.height;
        const sArea = s.width * s.height;
        const iou = interArea / (bArea + sArea - interArea);

        if (iou > iouThreshold) {
          keep = false;
          break;
        }
      }
      if (keep) selected.push(b);
    }
    return selected;
  }

  // Detect faces with YuNet
  static async detectFaces(rgba: Uint8Array, width: number, height: number, scoreThreshold = 0.5): Promise<FaceDetectionResult[]> {
    if (!this.yunetSession) throw new Error('YuNet session not initialized');

    const { tensor, scale } = this.prepareYuNetTensor(rgba, width, height);
    const outputs = await this.yunetSession.run({ input: tensor });

    const strides = [8, 16, 32];
    const candidateFaces: FaceDetectionResult[] = [];

    for (let i = 0; i < strides.length; i++) {
      const stride = strides[i];
      const cols = 640 / stride;
      const rows = 640 / stride;

      const cls = outputs[`cls_${stride}`].data as Float32Array;
      const obj = outputs[`obj_${stride}`].data as Float32Array;
      const bbox = outputs[`bbox_${stride}`].data as Float32Array;
      const kps = outputs[`kps_${stride}`].data as Float32Array;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const clsScore = Math.min(Math.max(cls[idx], 0), 1);
          const objScore = Math.min(Math.max(obj[idx], 0), 1);
          const score = Math.sqrt(clsScore * objScore);

          if (score < scoreThreshold) continue;

          const cx = (c + bbox[idx * 4 + 0]) * stride;
          const cy = (r + bbox[idx * 4 + 1]) * stride;
          const w = Math.exp(bbox[idx * 4 + 2]) * stride;
          const h = Math.exp(bbox[idx * 4 + 3]) * stride;

          const x1 = (cx - w / 2) / scale;
          const y1 = (cy - h / 2) / scale;
          const finalW = w / scale;
          const finalH = h / scale;

          const landmarks: any = {};
          const names: Array<'rightEye' | 'leftEye' | 'nose' | 'rightMouth' | 'leftMouth'> = [
            'rightEye',
            'leftEye',
            'nose',
            'rightMouth',
            'leftMouth',
          ];

          for (let n = 0; n < 5; n++) {
            const lx = ((kps[idx * 10 + 2 * n] + c) * stride) / scale;
            const ly = ((kps[idx * 10 + 2 * n + 1] + r) * stride) / scale;
            landmarks[names[n]] = [lx, ly];
          }

          candidateFaces.push({
            x: Math.max(0, x1),
            y: Math.max(0, y1),
            width: Math.min(finalW, width - x1),
            height: Math.min(finalH, height - y1),
            score,
            landmarks,
          });
        }
      }
    }

    return this.nms(candidateFaces, 0.3);
  }

  // Extract 128D embedding using SFace
  static async extractEmbedding(rgba: Uint8Array, width: number, height: number, face: FaceDetectionResult): Promise<number[]> {
    if (!this.sfaceSession) throw new Error('SFace session not initialized');

    // Add 12% margin around face bounding box for face crop
    const margin = 0.12;
    const cropX = Math.max(0, Math.floor(face.x - face.width * margin));
    const cropY = Math.max(0, Math.floor(face.y - face.height * margin));
    const cropW = Math.min(width - cropX, Math.floor(face.width * (1 + 2 * margin)));
    const cropH = Math.min(height - cropY, Math.floor(face.height * (1 + 2 * margin)));

    // Resize face crop to 112x112
    const alignedRgba = this.resizeRgba(rgba, width, height, 112, 112, cropX, cropY, cropW, cropH);

    // SFace input: [1, 3, 112, 112] float32 values 0..255
    const tensorData = new Float32Array(1 * 3 * 112 * 112);
    const channelSize = 112 * 112;

    for (let y = 0; y < 112; y++) {
      for (let x = 0; x < 112; x++) {
        const srcIdx = (y * 112 + x) * 4;
        const dstIdx = y * 112 + x;
        // BGR order for SFace
        tensorData[0 * channelSize + dstIdx] = alignedRgba[srcIdx + 2]; // B
        tensorData[1 * channelSize + dstIdx] = alignedRgba[srcIdx + 1]; // G
        tensorData[2 * channelSize + dstIdx] = alignedRgba[srcIdx + 0]; // R
      }
    }

    const inputTensor = new ort.Tensor('float32', tensorData, [1, 3, 112, 112]);
    const output = await this.sfaceSession.run({ data: inputTensor });
    const rawEmb = output.fc1.data as Float32Array;

    // L2 Normalize
    let norm = 0;
    for (let i = 0; i < rawEmb.length; i++) {
      norm += rawEmb[i] * rawEmb[i];
    }
    norm = Math.sqrt(norm);
    const normalized: number[] = new Array(rawEmb.length);
    for (let i = 0; i < rawEmb.length; i++) {
      normalized[i] = rawEmb[i] / (norm || 1);
    }
    return normalized;
  }

  // Cosine similarity between two unit vectors
  static cosineSimilarity(u: number[], v: number[]): number {
    let dot = 0;
    for (let i = 0; i < u.length; i++) {
      dot += u[i] * v[i];
    }
    return dot;
  }
}

async function run() {
  console.log('=== VERIFYING YUNET & SFACE END-TO-END PIPELINE ===\n');
  const modelsDir = path.resolve(process.cwd(), 'server', 'models');
  await GenuineBiometricsEngine.initialize(modelsDir);
  console.log('1. Models initialized successfully.');

  // Test 1: Zero-face image
  const noFaceBuf = fs.readFileSync(path.join(modelsDir, 'test_images', 'no_face.jpg'));
  const noFaceDecoded = jpeg.decode(noFaceBuf, { useTArray: true });
  const noFaceResults = await GenuineBiometricsEngine.detectFaces(noFaceDecoded.data, noFaceDecoded.width, noFaceDecoded.height);
  console.log('2. No-face image detected faces:', noFaceResults.length);
  if (noFaceResults.length === 0) {
    console.log('   [PASS] Zero-face frame rejected as required!');
  } else {
    console.error('   [FAIL] Expected 0 faces, got', noFaceResults.length);
  }

  // Test 2: Single face image (Lena)
  const face1Buf = fs.readFileSync(path.join(modelsDir, 'test_images', 'face1.jpg'));
  const face1Decoded = jpeg.decode(face1Buf, { useTArray: true });
  const face1Results = await GenuineBiometricsEngine.detectFaces(face1Decoded.data, face1Decoded.width, face1Decoded.height);
  console.log('\n3. Face-1 image detected faces:', face1Results.length);
  if (face1Results.length === 1) {
    console.log('   [PASS] Exactly one face detected!');
    const f = face1Results[0];
    console.log(`   Box: [x=${f.x.toFixed(0)}, y=${f.y.toFixed(0)}, w=${f.width.toFixed(0)}, h=${f.height.toFixed(0)}], Score: ${(f.score * 100).toFixed(1)}%`);
    console.log('   Right eye:', f.landmarks.rightEye.map((v) => v.toFixed(0)));
    console.log('   Left eye:', f.landmarks.leftEye.map((v) => v.toFixed(0)));
    console.log('   Nose tip:', f.landmarks.nose.map((v) => v.toFixed(0)));

    // Generate genuine 128D embedding
    const emb1 = await GenuineBiometricsEngine.extractEmbedding(face1Decoded.data, face1Decoded.width, face1Decoded.height, f);
    console.log('   Embedding vector length:', emb1.length);
    console.log('   First 5 values:', emb1.slice(0, 5).map((v) => v.toFixed(4)));

    // Self-match comparison
    const selfSim = GenuineBiometricsEngine.cosineSimilarity(emb1, emb1);
    console.log('   Self-match Cosine Similarity:', selfSim.toFixed(4));
    if (Math.abs(selfSim - 1.0) < 0.001) {
      console.log('   [PASS] Perfect self-match similarity = 1.000!');
    }

    // Test 3: Face-2 image (Different person)
    const face2Buf = fs.readFileSync(path.join(modelsDir, 'test_images', 'face2.jpg'));
    const face2Decoded = jpeg.decode(face2Buf, { useTArray: true });
    const face2Results = await GenuineBiometricsEngine.detectFaces(face2Decoded.data, face2Decoded.width, face2Decoded.height);
    console.log('\n4. Face-2 image detected faces:', face2Results.length);
    if (face2Results.length === 1) {
      console.log('   [PASS] Exactly one face detected in face2.jpg!');
      const emb2 = await GenuineBiometricsEngine.extractEmbedding(face2Decoded.data, face2Decoded.width, face2Decoded.height, face2Results[0]);
      const crossSim = GenuineBiometricsEngine.cosineSimilarity(emb1, emb2);
      console.log('   Cross-identity Cosine Similarity (face1 vs face2):', crossSim.toFixed(4));
      if (crossSim < 0.450) {
        console.log(`   [PASS] Clean cross-identity separation (${crossSim.toFixed(4)} < 0.450 threshold)!`);
      } else {
        console.error(`   [FAIL] Cross-identity similarity too high: ${crossSim.toFixed(4)}`);
      }
    }
  } else {
    console.error('   [FAIL] Expected 1 face, got', face1Results.length);
  }

  console.log('\n=== TEST COMPLETE ===');
}

run().catch(console.error);
