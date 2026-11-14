export type EnrollmentStatus = 'enrolled' | 'pending' | 'revoked' | 'incompatible_legacy';

export type PunchType = 'CHECK_IN' | 'CHECK_OUT';

export type SessionStatus = 'open' | 'completed' | 'flagged' | 'abandoned';

export type SupervisorReviewStatus = 'pending_review' | 'verified' | 'disputed';

export interface WorkerFaceEnrollment {
  workerId: string;
  workerName: string;
  trade: string;
  siteId: string;
  status: EnrollmentStatus;
  requiresReenrollment?: boolean;
  enrolledAt: string; // Server UTC ISO string
  modelVersion: string;
  consentSigned: boolean;
  consentDate: string;
  enrolledBySupervisor: string;
  notes?: string;
  // Biometric template is kept server-side only in private storage; excluded from client payload
}

export interface PresentationAttackDetectionResult {
  isLive: boolean;
  livenessScore: number; // 0.0 - 1.0 (threshold e.g. >= 0.85)
  screenArtifactsDetected: boolean;
  paperEdgeDetected: boolean;
  lightingConsistencyScore: number;
  textureFrequencyScore: number;
  details: string;
}

export interface FaceMatchResult {
  isMatch: boolean;
  matchConfidence: number; // 0.0 - 1.0 (threshold e.g. >= 0.80)
  threshold: number;
  matchedWorkerId: string;
  distanceMetric: number; // Euclidean/Cosine distance
}

export interface GeoLocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number; // meters
}

export interface GeoFenceVerificationResult {
  isWithinPerimeter: boolean;
  distanceMeters: number;
  allowedRadiusMeters: number;
  siteCoordinates: { latitude: number; longitude: number };
  punchCoordinates?: GeoLocationCoordinates;
  status: 'verified_on_site' | 'outside_geofence' | 'location_unavailable';
  details: string;
}

export interface AttendancePunch {
  id: string; // PUNCH-YYYYMMDD-UUID
  workerId: string;
  workerName: string;
  trade: string;
  siteId: string;
  siteName: string;
  punchType: PunchType;
  serverUtcTimestamp: string; // Authoritative UTC
  siteLocalDisplayTime: string; // Formatted local time e.g. '08:02:15 AM'
  faceMatch: FaceMatchResult;
  liveness: PresentationAttackDetectionResult;
  geoFence?: GeoFenceVerificationResult;
  verificationMethod: string; // e.g. 'BuildEase-FaceVerify-v2.1'
  modelVersion: string;
  status: 'passed' | 'rejected' | 'flagged';
  failureReason?: string;
  auditMetadata: {
    deviceUserAgent: string;
    captureResolution: string;
    lightingCondition: 'optimal' | 'low_light' | 'overexposed';
    ipHash: string;
    supervisorAuditId?: string;
  };
}

export interface AttendanceSession {
  id: string; // SESS-YYYYMMDD-UUID
  workerId: string;
  workerName: string;
  trade: string;
  siteId: string;
  siteName: string;
  date: string; // YYYY-MM-DD
  checkInPunchId: string;
  checkOutPunchId?: string;
  checkInTime: string;
  checkOutTime?: string;
  durationMinutes: number;
  hoursWorked: number;
  overtimeHours: number;
  breakDurationMinutes: number;
  sessionStatus: SessionStatus;
  supervisorReviewStatus: SupervisorReviewStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  flagReason?: string;
  flaggedBy?: string;
  flaggedAt?: string;
  notes?: string;
}

export interface BiometricVerificationPayload {
  workerId?: string; // Optional if auto-matching against enrolled workers
  siteId: string;
  siteName: string;
  punchType: PunchType;
  capturedFrameBase64: string; // image/jpeg or image/png dataURL
  deviceInfo?: string;
  lightingEstimate?: 'optimal' | 'low_light' | 'overexposed';
  location?: GeoLocationCoordinates;
  capturedAt?: string; // Original offline capture timestamp (ISO UTC)
}

export interface OfflineQueuedPunch {
  id: string; // "OFF-YYYYMMDD-HHMMSS-RAND"
  workerId?: string;
  workerName?: string;
  trade?: string;
  siteId: string;
  siteName: string;
  punchType: PunchType;
  capturedFrameBase64: string;
  capturedAt: string; // ISO string timestamp
  deviceInfo: string;
  location?: GeoLocationCoordinates;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  retryCount: number;
  lastError?: string;
}

export interface BiometricEnrollmentPayload {
  workerId: string;
  workerName: string;
  trade: string;
  siteId: string;
  capturedFrameBase64: string;
  consentSigned: boolean;
  supervisorName: string;
}

export interface IvrPhonePunchPayload {
  workerId: string;
  workerName?: string;
  trade?: string;
  phoneNumber: string;
  siteId: string;
  siteName: string;
  gateCode: string;
  cellTowerId: string;
  punchType: PunchType;
}
