import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import ort from 'onnxruntime-node';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';
import { GoogleGenAI } from '@google/genai';
import {
  WorkerFaceEnrollment,
  PresentationAttackDetectionResult,
  FaceMatchResult,
  AttendancePunch,
  AttendanceSession,
  BiometricVerificationPayload,
  BiometricEnrollmentPayload,
  GeoLocationCoordinates,
  GeoFenceVerificationResult,
} from '../src/types/biometrics';
import { biometricDb, StoredWorkerEnrollment } from './db';

// Documented model versions & configurable parameters
export const BIOMETRIC_MODEL_VERSION = 'OpenCV-SFace-v1.0 (SphereFace2 / YuNet)';
export const BIOMETRIC_DETECTOR_VERSION = 'OpenCV-YuNet-2023mar';
export const BIOMETRIC_RECOGNITION_VERSION = 'OpenCV-SFace-2021dec';

// Configurable biometric match threshold (Default 0.450; OpenCV default is 0.363)
export const BIOMETRIC_MATCH_THRESHOLD = parseFloat(process.env.BIOMETRIC_MATCH_THRESHOLD || '0.450');

// Presentation Attack Detection (Level 1 Baseline Heuristic PAD)
export const LIVENESS_THRESHOLD = 0.85;

// ============================================================================
// GPS GEOFENCE CONFIGURATION & HAVERSINE VERIFICATION
// ============================================================================
export interface SiteGeofenceConfig {
  latitude: number;
  longitude: number;
  allowedRadiusMeters: number;
}

export const PROJECT_GEOFENCES: Record<string, SiteGeofenceConfig> = {
  'proj-1': { latitude: 19.0760, longitude: 72.8777, allowedRadiusMeters: 250 },
  'proj-2': { latitude: 18.5204, longitude: 73.8567, allowedRadiusMeters: 200 },
  'proj-3': { latitude: 21.1458, longitude: 79.0882, allowedRadiusMeters: 500 },
  'proj-4': { latitude: 19.9975, longitude: 73.7898, allowedRadiusMeters: 300 },
};

/**
 * Calculates great-circle distance between two geographical points using Haversine formula
 */
export function calculateHaversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth mean radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Evaluates whether a punch attempt falls within the authorized site perimeter
 */
export function evaluateGeofence(
  siteId: string,
  punchLocation?: GeoLocationCoordinates
): GeoFenceVerificationResult {
  const siteConfig = PROJECT_GEOFENCES[siteId] || { latitude: 19.0760, longitude: 72.8777, allowedRadiusMeters: 250 };

  if (!punchLocation || typeof punchLocation.latitude !== 'number' || typeof punchLocation.longitude !== 'number') {
    return {
      isWithinPerimeter: false,
      distanceMeters: -1,
      allowedRadiusMeters: siteConfig.allowedRadiusMeters,
      siteCoordinates: { latitude: siteConfig.latitude, longitude: siteConfig.longitude },
      status: 'location_unavailable',
      details: 'Location telemetry unavailable: Device GPS signal was not provided or browser permission was denied.',
    };
  }

  const distance = calculateHaversineDistanceMeters(
    siteConfig.latitude,
    siteConfig.longitude,
    punchLocation.latitude,
    punchLocation.longitude
  );

  const isWithin = distance <= siteConfig.allowedRadiusMeters;

  return {
    isWithinPerimeter: isWithin,
    distanceMeters: Math.round(distance),
    allowedRadiusMeters: siteConfig.allowedRadiusMeters,
    siteCoordinates: { latitude: siteConfig.latitude, longitude: siteConfig.longitude },
    punchCoordinates: punchLocation,
    status: isWithin ? 'verified_on_site' : 'outside_geofence',
    details: isWithin
      ? `Verified on-site: Device is ${Math.round(distance)}m from site coordinates (Perimeter limit: ${siteConfig.allowedRadiusMeters}m).`
      : `GEOFENCE_BREACH: Device is ${Math.round(distance)}m from site coordinates, exceeding ${siteConfig.allowedRadiusMeters}m allowed perimeter.`,
  };
}

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

export interface DecodedImage {
  data: Uint8Array; // RGBA byte buffer
  width: number;
  height: number;
  hash: string;
}

// ============================================================================
// GENUINE ONNX INFERENCE ENGINE (OpenCV YuNet + OpenCV SFace)
// ============================================================================
export class GenuineBiometricsEngine {
  private static yunetSession: ort.InferenceSession | null = null;
  private static sfaceSession: ort.InferenceSession | null = null;
  private static initPromise: Promise<void> | null = null;

  public static async initialize(): Promise<void> {
    if (this.yunetSession && this.sfaceSession) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      const modelsDir = path.resolve(process.cwd(), 'server', 'models');
      const yunetPath = path.join(modelsDir, 'face_detection_yunet_2023mar.onnx');
      const sfacePath = path.join(modelsDir, 'face_recognition_sface_2021dec.onnx');

      if (!fs.existsSync(yunetPath) || !fs.existsSync(sfacePath)) {
        throw new Error(
          `BIOMETRIC_MODEL_MISSING: Model weights not found in ${modelsDir}. Ensure YuNet and SFace ONNX files are downloaded.`
        );
      }

      const sessionOptions: ort.InferenceSession.SessionOptions = {
        logSeverityLevel: 3, // Suppress info/warning initializer logs
      };

      if (!this.yunetSession) {
        this.yunetSession = await ort.InferenceSession.create(yunetPath, sessionOptions);
      }
      if (!this.sfaceSession) {
        this.sfaceSession = await ort.InferenceSession.create(sfacePath, sessionOptions);
      }
    })();

    await this.initPromise;
  }

  // Bilinear interpolation resize from RGBA buffer
  public static resizeRgba(
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
  ): { tensor: ort.Tensor; scale: number } {
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
        // BGR order for OpenCV DNN or RGB
        tensorData[0 * channelSize + dstIdx] = resized[srcIdx + 0]; // R
        tensorData[1 * channelSize + dstIdx] = resized[srcIdx + 1]; // G
        tensorData[2 * channelSize + dstIdx] = resized[srcIdx + 2]; // B
      }
    }

    const tensor = new ort.Tensor('float32', tensorData, [1, 3, targetSize, targetSize]);
    return { tensor, scale };
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

  // Detect faces using OpenCV YuNet
  public static async detectFaces(
    rgba: Uint8Array,
    width: number,
    height: number,
    scoreThreshold = 0.5
  ): Promise<FaceDetectionResult[]> {
    await this.initialize();
    if (!this.yunetSession) throw new Error('YuNet session could not be initialized.');

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

  // Extract genuine 128D facial embedding using OpenCV SFace (SphereFace2)
  public static async extractEmbedding(
    rgba: Uint8Array,
    width: number,
    height: number,
    face: FaceDetectionResult
  ): Promise<number[]> {
    await this.initialize();
    if (!this.sfaceSession) throw new Error('SFace session could not be initialized.');

    // Crop face with 12% margin around YuNet bounding box
    const margin = 0.12;
    const cropX = Math.max(0, Math.floor(face.x - face.width * margin));
    const cropY = Math.max(0, Math.floor(face.y - face.height * margin));
    const cropW = Math.min(width - cropX, Math.floor(face.width * (1 + 2 * margin)));
    const cropH = Math.min(height - cropY, Math.floor(face.height * (1 + 2 * margin)));

    // Resize cropped face to standard SFace 112x112 input
    const alignedRgba = this.resizeRgba(rgba, width, height, 112, 112, cropX, cropY, cropW, cropH);

    // SFace input tensor: [1, 3, 112, 112] float32 values 0..255 (BGR order)
    const tensorData = new Float32Array(1 * 3 * 112 * 112);
    const channelSize = 112 * 112;

    for (let y = 0; y < 112; y++) {
      for (let x = 0; x < 112; x++) {
        const srcIdx = (y * 112 + x) * 4;
        const dstIdx = y * 112 + x;
        // SFace expects BGR order
        tensorData[0 * channelSize + dstIdx] = alignedRgba[srcIdx + 2]; // B
        tensorData[1 * channelSize + dstIdx] = alignedRgba[srcIdx + 1]; // G
        tensorData[2 * channelSize + dstIdx] = alignedRgba[srcIdx + 0]; // R
      }
    }

    const inputTensor = new ort.Tensor('float32', tensorData, [1, 3, 112, 112]);
    const output = await this.sfaceSession.run({ data: inputTensor });
    const rawEmb = output.fc1.data as Float32Array;

    // L2 Normalize to unit hypersphere
    let norm = 0;
    for (let i = 0; i < rawEmb.length; i++) {
      norm += rawEmb[i] * rawEmb[i];
    }
    norm = Math.sqrt(norm);
    const normalized: number[] = new Array(rawEmb.length);
    for (let i = 0; i < rawEmb.length; i++) {
      normalized[i] = parseFloat((rawEmb[i] / (norm || 1)).toFixed(6));
    }
    return normalized;
  }

  // Cosine similarity between two unit vectors: dot(u, v)
  public static cosineSimilarity(u: number[], v: number[]): number {
    let dot = 0;
    const len = Math.min(u.length, v.length);
    for (let i = 0; i < len; i++) {
      dot += u[i] * v[i];
    }
    return parseFloat(dot.toFixed(4));
  }
}

// ============================================================================
// IMAGE VALIDATION & DECODING
// ============================================================================

export function validateImagePayload(base64DataUrl: string): Buffer {
  if (!base64DataUrl || typeof base64DataUrl !== 'string') {
    throw new Error('INVALID_IMAGE_PAYLOAD: Image data URL must be a non-empty string.');
  }

  const match = base64DataUrl.match(/^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/);
  if (!match) {
    throw new Error('INVALID_IMAGE_PAYLOAD: Image must be a valid base64 data URL with JPEG, PNG, or WEBP mime type.');
  }

  const rawBase64 = match[2];
  const buffer = Buffer.from(rawBase64, 'base64');

  if (buffer.length < 500) {
    throw new Error('INVALID_IMAGE_PAYLOAD: Frame capture is truncated or empty (< 500 bytes).');
  }

  if (buffer.length > 5 * 1024 * 1024) {
    throw new Error('INVALID_IMAGE_PAYLOAD: Image frame exceeds 5MB payload limit.');
  }

  return buffer;
}

export function validateAndDecodeImage(base64DataUrl: string): DecodedImage {
  const buffer = validateImagePayload(base64DataUrl);
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');

  // 1. Try JPEG decode (0xFF, 0xD8)
  if (buffer.length > 2 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    try {
      const decoded = jpeg.decode(buffer, { useTArray: true });
      return {
        data: decoded.data,
        width: decoded.width,
        height: decoded.height,
        hash,
      };
    } catch (err: any) {
      throw new Error(`IMAGE_DECODE_ERROR: Corrupted JPEG frame capture: ${err.message}`);
    }
  }

  // 2. Try PNG decode (0x89, 0x50, 0x4E, 0x47)
  if (buffer.length > 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    try {
      const png = PNG.sync.read(buffer);
      return {
        data: new Uint8Array(png.data.buffer, png.data.byteOffset, png.data.byteLength),
        width: png.width,
        height: png.height,
        hash,
      };
    } catch (err: any) {
      throw new Error(`IMAGE_DECODE_ERROR: Corrupted PNG frame capture: ${err.message}`);
    }
  }

  // 3. Fallback JPEG
  try {
    const decoded = jpeg.decode(buffer, { useTArray: true });
    return {
      data: decoded.data,
      width: decoded.width,
      height: decoded.height,
      hash,
    };
  } catch {
    throw new Error('IMAGE_DECODE_ERROR: Unsupported or corrupted image format. Please submit a valid JPEG or PNG frame capture.');
  }
}

// ============================================================================
// PRESENTATION ATTACK DETECTION (PAD) — LEVEL 1 BASELINE HEURISTICS & GEMINI
// ============================================================================

function evaluateBaselineHeuristicPad(decoded: DecodedImage): {
  livenessScore: number;
  screenArtifactsDetected: boolean;
  paperEdgeDetected: boolean;
  lightingConsistencyScore: number;
  textureFrequencyScore: number;
  details: string;
} {
  const { data, width, height } = decoded;
  const totalPixels = width * height;

  let sumLuminance = 0;
  let variance = 0;
  let highFreqCount = 0;

  // Sample pixels evenly across frame
  const step = Math.max(1, Math.floor(totalPixels / 4000));
  let samples = 0;

  for (let i = 0; i < totalPixels; i += step) {
    const idx = i * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    sumLuminance += lum;
    samples++;
  }

  const meanLuminance = sumLuminance / (samples || 1);

  for (let i = 0; i < totalPixels; i += step) {
    const idx = i * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    variance += (lum - meanLuminance) * (lum - meanLuminance);
    if (Math.abs(lum - meanLuminance) > 65) {
      highFreqCount++;
    }
  }

  const stdDev = Math.sqrt(variance / (samples || 1));
  const highFreqRatio = highFreqCount / (samples || 1);

  // Optical Presentation Attack Heuristics (Level 1 Baseline Heuristics - Limited)
  const isTooUniform = stdDev < 15;
  const isHighFreqNoiseScreen = highFreqRatio > 0.52;
  const isPaperSheenFlat = stdDev < 18 && meanLuminance > 220;

  let livenessScore = 0.94;
  let screenArtifactsDetected = false;
  let paperEdgeDetected = false;
  let details = 'Level 1 Baseline Heuristic PAD (Limited: optical frequency & planar reflection analysis) passed.';

  if (isTooUniform || isPaperSheenFlat) {
    livenessScore = 0.62;
    paperEdgeDetected = true;
    details = 'Potential presentation attack: Flat planar reflectance or printed paper signature detected.';
  } else if (isHighFreqNoiseScreen) {
    livenessScore = 0.58;
    screenArtifactsDetected = true;
    details = 'Potential presentation attack: High-frequency digital moiré pattern / screen grid detected.';
  } else if (stdDev >= 22 && stdDev <= 75 && highFreqRatio >= 0.08 && highFreqRatio <= 0.42) {
    livenessScore = Math.min(0.99, 0.91 + (stdDev / 100) * 0.1);
  } else {
    livenessScore = 0.88;
  }

  return {
    livenessScore: parseFloat(livenessScore.toFixed(3)),
    screenArtifactsDetected,
    paperEdgeDetected,
    lightingConsistencyScore: parseFloat((stdDev > 20 ? 0.94 : 0.75).toFixed(2)),
    textureFrequencyScore: parseFloat((1 - highFreqRatio * 0.5).toFixed(2)),
    details,
  };
}

async function evaluateBiometricLivenessWithGemini(
  base64DataUrl: string
): Promise<{ isLive: boolean; score: number; details: string; error?: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const cleanBase64 = base64DataUrl.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: 'image/jpeg',
              },
            },
            {
              text: `Analyze this construction site biometric attendance camera frame for Presentation Attack Detection (PAD):
1. Is this a live physical human worker present in front of the camera, or an anti-spoof attack (such as a photograph held on a smartphone/tablet screen, printed paper photograph, cut-out mask, or video replay)?
2. Return JSON strictly in this format:
{"isLive": boolean, "livenessScore": number between 0.0 and 1.0, "reason": "brief technical explanation"}`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim();
    if (text) {
      const parsed = JSON.parse(text);
      return {
        isLive: Boolean(parsed.isLive),
        score: typeof parsed.livenessScore === 'number' ? parsed.livenessScore : 0.92,
        details: parsed.reason || 'Gemini multi-modal biometric evaluation complete.',
      };
    }
  } catch (err: any) {
    console.warn('[BiometricsEngine] Gemini PAD evaluation error:', err.message);
    // Security Rule: If configured AI service fails, do NOT pretend it passed.
    return {
      isLive: false,
      score: 0.0,
      details: `Gemini PAD service unavailable: ${err.message}`,
      error: err.message,
    };
  }
  return null;
}

// Format UTC date to site local display time (IST UTC+5:30)
function formatSiteLocalTime(utcIso: string): string {
  try {
    const date = new Date(utcIso);
    return date.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return '08:00:00 AM';
  }
}

// ============================================================================
// BIOMETRICS ENGINE PUBLIC SERVICE
// ============================================================================

export class BiometricsEngine {
  // 1. Worker Enrollment with Genuine Face Detection & Embedding Extraction
  public static async enrollWorker(payload: BiometricEnrollmentPayload): Promise<WorkerFaceEnrollment> {
    const { workerId, workerName, trade, siteId, capturedFrameBase64, consentSigned, supervisorName } = payload;

    if (!consentSigned) {
      throw new Error(
        'WORKER_CONSENT_REQUIRED: Worker must give signed biometric consent prior to enrollment under company policy.'
      );
    }

    if (!capturedFrameBase64) {
      throw new Error('INVALID_CAPTURE: A clear facial frame capture is required for template extraction.');
    }

    // Step A: Decode image buffer
    const decoded = validateAndDecodeImage(capturedFrameBase64);

    // Step B: Detect faces using OpenCV YuNet
    const detectedFaces = await GenuineBiometricsEngine.detectFaces(decoded.data, decoded.width, decoded.height);

    if (detectedFaces.length === 0) {
      throw new Error(
        'NO_FACE_DETECTED: No human face detected in enrollment frame. Please face the camera directly with good lighting.'
      );
    }

    if (detectedFaces.length > 1) {
      throw new Error(
        `MULTIPLE_FACES_DETECTED: Multiple faces detected (${detectedFaces.length}). Enrollment requires exactly one worker in the camera viewport.`
      );
    }

    const primaryFace = detectedFaces[0];

    // Step C: Evaluate presentation attack detection
    const padMetrics = evaluateBaselineHeuristicPad(decoded);
    if (padMetrics.livenessScore < 0.70) {
      throw new Error(
        'ENROLLMENT_LIVENESS_REJECTED: Face frame could not be verified as a live subject. Ensure optimal lighting and direct gaze.'
      );
    }

    // Step D: Extract genuine 128D facial embedding using OpenCV SFace
    const featureVector = await GenuineBiometricsEngine.extractEmbedding(
      decoded.data,
      decoded.width,
      decoded.height,
      primaryFace
    );

    // Step E: 1:N Biometric De-duplication Check (Anti-Ghost / Dual Role Collision Prevention)
    const existingEnrollments = biometricDb.getEnrollments();
    for (const other of existingEnrollments) {
      if (other.workerId === workerId) continue; // Allow worker to re-enroll / update their own template
      if (other.requiresReenrollment || other.status === 'incompatible_legacy') continue;

      const rawOther = biometricDb.getRawEnrollment(other.workerId);
      if (!rawOther || !rawOther.modelVersion?.includes('OpenCV-SFace')) continue;
      if (!rawOther.biometricTemplate?.featureVector) continue;

      const similarity = GenuineBiometricsEngine.cosineSimilarity(
        featureVector,
        rawOther.biometricTemplate.featureVector
      );

      if (similarity >= BIOMETRIC_MATCH_THRESHOLD) {
        throw new Error(
          `DUPLICATE_FACE_ENROLLMENT: This face is already enrolled under worker [${rawOther.workerId}] (${rawOther.workerName} · ${rawOther.trade}). Dual role registration or multiple accounts for the same worker is strictly prohibited.`
        );
      }
    }

    const nowUtc = new Date().toISOString();

    const storedEnrollment: StoredWorkerEnrollment = {
      workerId,
      workerName,
      trade,
      siteId,
      status: 'enrolled',
      requiresReenrollment: false,
      enrolledAt: nowUtc,
      modelVersion: BIOMETRIC_MODEL_VERSION,
      consentSigned: true,
      consentDate: nowUtc,
      enrolledBySupervisor: supervisorName,
      notes: 'Genuine OpenCV SFace (SphereFace2) 128D embedding registered with verified consent audit.',
      biometricTemplate: {
        featureVector,
        templateHash: `sha256-${decoded.hash.substring(0, 32)}`,
        sampleResolution: `${decoded.width}x${decoded.height}`,
        algorithm: 'OpenCV-SFace-SphereFace2-128D-Cosine-Norm',
      },
    };

    biometricDb.addEnrollment(storedEnrollment);

    // Return sanitized public enrollment info (redacting raw feature vector)
    const { biometricTemplate, ...publicInfo } = storedEnrollment;
    return publicInfo;
  }

  // 2. Live Verification and Attendance Punch
  public static async processPunchVerification(
    payload: BiometricVerificationPayload
  ): Promise<{ punch: AttendancePunch; session: AttendanceSession }> {
    const { workerId, siteId, siteName, punchType, capturedFrameBase64, deviceInfo, lightingEstimate, location } = payload;

    if (!capturedFrameBase64) {
      throw new Error('MISSING_FRAME: Live camera frame capture is required.');
    }

    // Step A: Decode live frame
    const decoded = validateAndDecodeImage(capturedFrameBase64);

    // Step B: Check target worker enrollment & reject legacy synthetic templates
    let targetEnrollment: StoredWorkerEnrollment | undefined;
    if (workerId) {
      targetEnrollment = biometricDb.getRawEnrollment(workerId);
      if (!targetEnrollment) {
        throw new Error(`UNENROLLED_WORKER: Worker [${workerId}] does not have an enrolled biometric face template.`);
      }

      if (
        targetEnrollment.requiresReenrollment ||
        targetEnrollment.status === 'incompatible_legacy' ||
        !targetEnrollment.modelVersion?.includes('OpenCV-SFace')
      ) {
        throw new Error(
          `LEGACY_TEMPLATE_INCOMPATIBLE: Worker [${workerId}] has an obsolete synthetic biometric template. Genuine OpenCV SFace re-enrollment with signed consent is required before recording attendance.`
        );
      }
    }

    // Step C: Detect faces with OpenCV YuNet
    const detectedFaces = await GenuineBiometricsEngine.detectFaces(decoded.data, decoded.width, decoded.height);

    if (detectedFaces.length === 0) {
      throw new Error('NO_FACE_DETECTED: No human face detected in camera viewport. Ensure direct gaze and good lighting.');
    }

    if (detectedFaces.length > 1) {
      throw new Error(
        `MULTIPLE_FACES_DETECTED: Multiple faces detected (${detectedFaces.length}). Kiosk verification requires exactly one worker in the frame.`
      );
    }

    const liveFace = detectedFaces[0];

    // Step D: Extract genuine 128D embedding with OpenCV SFace
    const liveVector = await GenuineBiometricsEngine.extractEmbedding(
      decoded.data,
      decoded.width,
      decoded.height,
      liveFace
    );

    // Step E: Presentation Attack Detection (Baseline Heuristics + Optional Gemini)
    const padMetrics = evaluateBaselineHeuristicPad(decoded);
    const geminiPad = await evaluateBiometricLivenessWithGemini(capturedFrameBase64);

    let finalLivenessScore = padMetrics.livenessScore;
    let finalLivenessDetails = padMetrics.details;
    let isAiServiceDegraded = false;

    if (geminiPad) {
      if (geminiPad.error) {
        // AI service failed: route to manual supervisor muster review rather than failing open
        isAiServiceDegraded = true;
        finalLivenessDetails = `Heuristic passed, but external AI PAD service failed (${geminiPad.error}). Flagged for supervisor review.`;
      } else {
        finalLivenessScore = parseFloat((padMetrics.livenessScore * 0.5 + geminiPad.score * 0.5).toFixed(3));
        finalLivenessDetails = `${padMetrics.details} (${geminiPad.details})`;
      }
    }

    const isLive =
      !isAiServiceDegraded &&
      finalLivenessScore >= LIVENESS_THRESHOLD &&
      !padMetrics.screenArtifactsDetected &&
      !padMetrics.paperEdgeDetected;

    const padResult: PresentationAttackDetectionResult = {
      isLive,
      livenessScore: finalLivenessScore,
      screenArtifactsDetected: padMetrics.screenArtifactsDetected,
      paperEdgeDetected: padMetrics.paperEdgeDetected,
      lightingConsistencyScore: padMetrics.lightingConsistencyScore,
      textureFrequencyScore: padMetrics.textureFrequencyScore,
      details: finalLivenessDetails,
    };

    // Step F: Identity Matching against Enrolled Worker(s)
    let matchedEnrollment: StoredWorkerEnrollment | undefined;
    let bestSimilarity = -1;
    let distanceMetric = 1.0;

    if (targetEnrollment) {
      matchedEnrollment = targetEnrollment;
      bestSimilarity = GenuineBiometricsEngine.cosineSimilarity(
        liveVector,
        targetEnrollment.biometricTemplate.featureVector
      );
      distanceMetric = parseFloat((1 - bestSimilarity).toFixed(4));
    } else {
      // Auto-detect kiosk mode: compare against all enrolled workers with compatible SFace models
      const allEnrollments = biometricDb.getEnrollments();
      const candidateMatches: { enrollment: StoredWorkerEnrollment; similarity: number }[] = [];

      for (const e of allEnrollments) {
        if (e.requiresReenrollment || e.status === 'incompatible_legacy') continue;
        const raw = biometricDb.getRawEnrollment(e.workerId);
        if (!raw || !raw.modelVersion?.includes('OpenCV-SFace')) continue;

        const sim = GenuineBiometricsEngine.cosineSimilarity(liveVector, raw.biometricTemplate.featureVector);
        if (sim >= BIOMETRIC_MATCH_THRESHOLD) {
          candidateMatches.push({ enrollment: raw, similarity: sim });
        }
        if (sim > bestSimilarity) {
          bestSimilarity = sim;
          matchedEnrollment = raw;
          distanceMetric = parseFloat((1 - sim).toFixed(4));
        }
      }

      if (candidateMatches.length > 1) {
        const workerList = candidateMatches
          .map((c) => `${c.enrollment.workerId} (${c.enrollment.workerName} · ${c.enrollment.trade})`)
          .join(', ');
        throw new Error(
          `IDENTITY_COLLISION_DETECTED: Biometric capture matches multiple enrolled workers: ${workerList}. Dual-role enrollment detected; supervisor muster review required.`
        );
      }
    }

    if (!matchedEnrollment) {
      throw new Error('NO_MATCHING_WORKER: No compatible enrolled worker template matched the live face capture.');
    }

    const isMatch = bestSimilarity >= BIOMETRIC_MATCH_THRESHOLD;
    const matchConfidence = parseFloat(Math.max(0, Math.min(1, bestSimilarity)).toFixed(3));

    const matchResult: FaceMatchResult = {
      isMatch,
      matchConfidence,
      threshold: BIOMETRIC_MATCH_THRESHOLD,
      matchedWorkerId: matchedEnrollment.workerId,
      distanceMetric,
    };

    // Step G: Authoritative Server UTC Timestamping (Preserves original field capture time if queued offline)
    const serverUtcTimestamp = payload.capturedAt && !isNaN(Date.parse(payload.capturedAt))
      ? payload.capturedAt
      : new Date().toISOString();
    const siteLocalDisplayTime = formatSiteLocalTime(serverUtcTimestamp);
    const punchId = `PUNCH-${Date.now()}-${matchedEnrollment.workerId.replace('-', '')}`;

    let punchStatus: 'passed' | 'rejected' | 'flagged' = 'passed';
    let failureReason: string | undefined;

    if (isAiServiceDegraded) {
      punchStatus = 'flagged';
      failureReason = 'LIVENESS_SERVICE_UNAVAILABLE: Anti-spoof AI service failed; punch flagged for supervisor manual muster sign-off.';
    } else if (!isLive) {
      punchStatus = 'rejected';
      failureReason = padMetrics.screenArtifactsDetected
        ? 'SPOOF_DETECTED_REPLAY_ATTACK: Digital screen moiré grid detected.'
        : padMetrics.paperEdgeDetected
        ? 'SPOOF_DETECTED_PAPER_ATTACK: Flat printed photograph edge detected.'
        : 'LIVENESS_FAILED: Biometric presentation attack threshold not reached.';
    } else if (!isMatch) {
      punchStatus = 'rejected';
      failureReason = `FACE_MISMATCH: Facial similarity (${bestSimilarity.toFixed(4)}) below required threshold (${BIOMETRIC_MATCH_THRESHOLD.toFixed(3)}).`;
    }

    // Step G2: GPS Geofence Perimeter Validation
    const geoFenceResult = evaluateGeofence(siteId, location);
    if (punchStatus === 'passed' && geoFenceResult.status === 'outside_geofence') {
      punchStatus = 'flagged';
      failureReason = geoFenceResult.details;
    }

    const punch: AttendancePunch = {
      id: punchId,
      workerId: matchedEnrollment.workerId,
      workerName: matchedEnrollment.workerName,
      trade: matchedEnrollment.trade,
      siteId,
      siteName,
      punchType,
      serverUtcTimestamp,
      siteLocalDisplayTime,
      faceMatch: matchResult,
      liveness: padResult,
      geoFence: geoFenceResult,
      verificationMethod: BIOMETRIC_MODEL_VERSION,
      modelVersion: BIOMETRIC_MODEL_VERSION,
      status: punchStatus,
      failureReason,
      auditMetadata: {
        deviceUserAgent: deviceInfo || 'BuildEase-Web-Capture',
        captureResolution: `${decoded.width}x${decoded.height}`,
        lightingCondition: lightingEstimate || 'optimal',
        ipHash: `ip-${decoded.hash.substring(0, 12)}`,
      },
    };

    // Record punch in immutable ledger
    biometricDb.addPunch(punch);

    if (punchStatus === 'rejected') {
      throw new Error(`BIOMETRIC_VERIFICATION_FAILED: ${failureReason}`);
    }

    // Step H: Attendance Session Lifecycle & Duplicate Protection (< 5 min)
    const today = serverUtcTimestamp.split('T')[0];
    const existingOpenSession = biometricDb.getOpenSessionForWorker(matchedEnrollment.workerId);

    let session: AttendanceSession;

    if (punchType === 'CHECK_IN') {
      if (existingOpenSession) {
        // Enforce duplicate check-in protection within 5 minutes
        const inPunch = biometricDb.getPunches().find((p) => p.id === existingOpenSession.checkInPunchId);
        if (inPunch) {
          const prevMs = new Date(inPunch.serverUtcTimestamp).getTime();
          const currMs = new Date(serverUtcTimestamp).getTime();
          const elapsedMinutes = (currMs - prevMs) / 60000;
          if (elapsedMinutes < 5) {
            throw new Error(
              `DUPLICATE_PUNCH: Worker [${matchedEnrollment.workerId}] already checked in at ${existingOpenSession.checkInTime} (${elapsedMinutes.toFixed(1)} min ago). Rapid duplicate check-ins within 5 minutes are rejected.`
            );
          }
        }

        // Anomaly: previous session left open without checkout
        existingOpenSession.sessionStatus = 'flagged';
        existingOpenSession.flagReason = `Double CHECK_IN anomaly: New check-in registered at ${siteLocalDisplayTime} while previous session remained open. Requires supervisor muster resolution.`;
        if (geoFenceResult.status === 'outside_geofence') {
          existingOpenSession.flagReason += ` [${geoFenceResult.details}]`;
        }
        biometricDb.addOrUpdateSession(existingOpenSession);
        session = existingOpenSession;
      } else {
        const isFlagged = punchStatus === 'flagged' || geoFenceResult.status === 'outside_geofence';
        session = {
          id: `SESS-${Date.now()}-${matchedEnrollment.workerId.replace('-', '')}`,
          workerId: matchedEnrollment.workerId,
          workerName: matchedEnrollment.workerName,
          trade: matchedEnrollment.trade,
          siteId,
          siteName,
          date: today,
          checkInPunchId: punchId,
          checkInTime: siteLocalDisplayTime,
          durationMinutes: 480,
          hoursWorked: 8.0,
          overtimeHours: 0,
          breakDurationMinutes: 0,
          sessionStatus: isFlagged ? 'flagged' : 'open',
          supervisorReviewStatus: isFlagged ? 'disputed' : 'pending_review', // RAW CHECK-IN: Must be verified by supervisor before payroll
          flagReason: isFlagged ? failureReason : undefined,
        };
        biometricDb.addOrUpdateSession(session);
      }
    } else {
      // CHECK_OUT
      if (existingOpenSession) {
        existingOpenSession.checkOutPunchId = punchId;
        existingOpenSession.checkOutTime = siteLocalDisplayTime;
        if (geoFenceResult.status === 'outside_geofence') {
          existingOpenSession.sessionStatus = 'flagged';
          existingOpenSession.supervisorReviewStatus = 'disputed';
          existingOpenSession.flagReason = geoFenceResult.details;
        } else {
          existingOpenSession.sessionStatus = existingOpenSession.sessionStatus === 'flagged' ? 'flagged' : 'completed';
        }

        try {
          const inPunch = biometricDb.getPunches().find((p) => p.id === existingOpenSession.checkInPunchId);
          if (inPunch) {
            const inTimeMs = new Date(inPunch.serverUtcTimestamp).getTime();
            const outTimeMs = new Date(serverUtcTimestamp).getTime();
            const diffMin = Math.max(0, Math.round((outTimeMs - inTimeMs) / 60000));
            existingOpenSession.durationMinutes = diffMin;
            existingOpenSession.hoursWorked = parseFloat((diffMin / 60).toFixed(1));
            existingOpenSession.overtimeHours = Math.max(0, parseFloat(((diffMin - 480) / 60).toFixed(1)));
          }
        } catch (e) {
          console.error('[Biometrics] Error computing session duration:', e);
        }

        biometricDb.addOrUpdateSession(existingOpenSession);
        session = existingOpenSession;
      } else {
        // Orphan check-out anomaly
        session = {
          id: `SESS-${Date.now()}-${matchedEnrollment.workerId.replace('-', '')}`,
          workerId: matchedEnrollment.workerId,
          workerName: matchedEnrollment.workerName,
          trade: matchedEnrollment.trade,
          siteId,
          siteName,
          date: today,
          checkInPunchId: punchId,
          checkOutPunchId: punchId,
          checkInTime: siteLocalDisplayTime,
          checkOutTime: siteLocalDisplayTime,
          durationMinutes: 0,
          hoursWorked: 0,
          overtimeHours: 0,
          breakDurationMinutes: 0,
          sessionStatus: 'flagged',
          supervisorReviewStatus: 'disputed',
          flagReason: 'ORPHAN_CHECK_OUT: CHECK_OUT registered with no preceding active CHECK_IN session.',
        };
        biometricDb.addOrUpdateSession(session);
      }
    }

    return { punch, session };
  }
}
