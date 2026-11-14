import fs from 'fs';
import path from 'path';
import {
  WorkerFaceEnrollment,
  AttendancePunch,
  AttendanceSession,
} from '../src/types/biometrics';

export interface StoredWorkerEnrollment extends WorkerFaceEnrollment {
  // Biometric template is kept strictly in server storage; never sent to client
  biometricTemplate: {
    featureVector: number[]; // 128-dimensional normalized biometric embedding
    templateHash: string; // Cryptographic SHA-256 hash of template
    sampleResolution: string;
    algorithm: string;
  };
}

export interface BiometricDatabaseSchema {
  version: string;
  enrollments: StoredWorkerEnrollment[];
  punches: AttendancePunch[];
  sessions: AttendanceSession[];
  auditLogs: {
    id: string;
    timestamp: string;
    action: string;
    performedBy: string;
    targetId: string;
    details: Record<string, any>;
  }[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'attendance_biometrics.json');

// Deterministic synthetic baseline vector generator for initial seed workers
function generateSeedEmbedding(seedStr: string): number[] {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const vector: number[] = [];
  for (let i = 0; i < 128; i++) {
    const val = Math.sin(hash + i * 1.6180339887) * Math.cos((hash ^ i) * 0.7071);
    vector.push(parseFloat(val.toFixed(6)));
  }
  // Normalize
  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vector.map((v) => parseFloat((v / norm).toFixed(6)));
}

const INITIAL_SEEDED_ENROLLMENTS: StoredWorkerEnrollment[] = [
  {
    workerId: 'W-0418',
    workerName: 'Rameshwar Yadav',
    trade: 'mason',
    siteId: 'proj-1',
    status: 'incompatible_legacy',
    requiresReenrollment: true,
    enrolledAt: '2026-09-15T04:30:00.000Z',
    modelVersion: 'BuildEase-LegacySynthetic (Requires SFace Re-enrollment)',
    consentSigned: true,
    consentDate: '2026-09-15T04:28:10.000Z',
    enrolledBySupervisor: 'Aniket Patil (Site Supervisor)',
    notes: 'Legacy synthetic vector; genuine SFace biometric re-enrollment required.',
    biometricTemplate: {
      featureVector: generateSeedEmbedding('W-0418-RameshwarYadav'),
      templateHash: 'sha256-legacy-synthetic-0418',
      sampleResolution: '640x480',
      algorithm: 'Legacy-Synthetic-Variance',
    },
  },
  {
    workerId: 'W-0422',
    workerName: 'Mohammad Shahid Khan',
    trade: 'steel_fixer',
    siteId: 'proj-1',
    status: 'incompatible_legacy',
    requiresReenrollment: true,
    enrolledAt: '2026-09-18T05:15:00.000Z',
    modelVersion: 'BuildEase-LegacySynthetic (Requires SFace Re-enrollment)',
    consentSigned: true,
    consentDate: '2026-09-18T05:12:00.000Z',
    enrolledBySupervisor: 'Aniket Patil (Site Supervisor)',
    notes: 'Legacy synthetic vector; genuine SFace biometric re-enrollment required.',
    biometricTemplate: {
      featureVector: generateSeedEmbedding('W-0422-ShahidKhan'),
      templateHash: 'sha256-legacy-synthetic-0422',
      sampleResolution: '640x480',
      algorithm: 'Legacy-Synthetic-Variance',
    },
  },
  {
    workerId: 'W-0435',
    workerName: 'Santosh Baburao Shinde',
    trade: 'carpenter',
    siteId: 'proj-1',
    status: 'incompatible_legacy',
    requiresReenrollment: true,
    enrolledAt: '2026-09-20T06:00:00.000Z',
    modelVersion: 'BuildEase-LegacySynthetic (Requires SFace Re-enrollment)',
    consentSigned: true,
    consentDate: '2026-09-20T05:58:30.000Z',
    enrolledBySupervisor: 'Aniket Patil (Site Supervisor)',
    notes: 'Legacy synthetic vector; genuine SFace biometric re-enrollment required.',
    biometricTemplate: {
      featureVector: generateSeedEmbedding('W-0435-SantoshShinde'),
      templateHash: 'sha256-legacy-synthetic-0435',
      sampleResolution: '640x480',
      algorithm: 'Legacy-Synthetic-Variance',
    },
  },
  {
    workerId: 'W-0450',
    workerName: 'Bikramjit Barman',
    trade: 'electrician',
    siteId: 'proj-2',
    status: 'incompatible_legacy',
    requiresReenrollment: true,
    enrolledAt: '2026-09-22T04:45:00.000Z',
    modelVersion: 'BuildEase-LegacySynthetic (Requires SFace Re-enrollment)',
    consentSigned: true,
    consentDate: '2026-09-22T04:42:00.000Z',
    enrolledBySupervisor: 'Vikram Joshi (Site Supervisor)',
    notes: 'Legacy synthetic vector; genuine SFace biometric re-enrollment required.',
    biometricTemplate: {
      featureVector: generateSeedEmbedding('W-0450-BikramjitBarman'),
      templateHash: 'sha256-legacy-synthetic-0450',
      sampleResolution: '640x480',
      algorithm: 'Legacy-Synthetic-Variance',
    },
  },
  {
    workerId: 'W-0461',
    workerName: 'Subhash Chandra Mondal',
    trade: 'welder',
    siteId: 'proj-3',
    status: 'incompatible_legacy',
    requiresReenrollment: true,
    enrolledAt: '2026-09-25T05:10:00.000Z',
    modelVersion: 'BuildEase-LegacySynthetic (Requires SFace Re-enrollment)',
    consentSigned: true,
    consentDate: '2026-09-25T05:07:00.000Z',
    enrolledBySupervisor: 'Vikram Joshi (Site Supervisor)',
    notes: 'Legacy synthetic vector; genuine SFace biometric re-enrollment required.',
    biometricTemplate: {
      featureVector: generateSeedEmbedding('W-0461-SubhashMondal'),
      templateHash: 'sha256-legacy-synthetic-0461',
      sampleResolution: '640x480',
      algorithm: 'Legacy-Synthetic-Variance',
    },
  },
  {
    workerId: 'W-0478',
    workerName: 'Prakash Mahato',
    trade: 'general_helper',
    siteId: 'proj-1',
    status: 'incompatible_legacy',
    requiresReenrollment: true,
    enrolledAt: '2026-10-01T04:00:00.000Z',
    modelVersion: 'BuildEase-LegacySynthetic (Requires SFace Re-enrollment)',
    consentSigned: true,
    consentDate: '2026-10-01T03:55:00.000Z',
    enrolledBySupervisor: 'Aniket Patil (Site Supervisor)',
    notes: 'Legacy synthetic vector; genuine SFace biometric re-enrollment required.',
    biometricTemplate: {
      featureVector: generateSeedEmbedding('W-0478-PrakashMahato'),
      templateHash: 'sha256-legacy-synthetic-0478',
      sampleResolution: '640x480',
      algorithm: 'Legacy-Synthetic-Variance',
    },
  },
  {
    workerId: 'W-0485',
    workerName: 'Ajay Kumar Maurya',
    trade: 'equipment_operator',
    siteId: 'proj-3',
    status: 'incompatible_legacy',
    requiresReenrollment: true,
    enrolledAt: '2026-10-02T04:15:00.000Z',
    modelVersion: 'BuildEase-LegacySynthetic (Requires SFace Re-enrollment)',
    consentSigned: true,
    consentDate: '2026-10-02T04:10:00.000Z',
    enrolledBySupervisor: 'Vikram Joshi (Site Supervisor)',
    notes: 'Legacy synthetic vector; genuine SFace biometric re-enrollment required.',
    biometricTemplate: {
      featureVector: generateSeedEmbedding('W-0485-AjayMaurya'),
      templateHash: 'sha256-legacy-synthetic-0485',
      sampleResolution: '640x480',
      algorithm: 'Legacy-Synthetic-Variance',
    },
  },
];

const INITIAL_SEEDED_PUNCHES: AttendancePunch[] = [];

const INITIAL_SEEDED_SESSIONS: AttendanceSession[] = [];

class BiometricDatabase {
  private data: BiometricDatabaseSchema;
  private writeQueue: Promise<void> = Promise.resolve();

  constructor() {
    this.data = this.load();
    this.migrateLegacyEnrollments();
  }

  private migrateLegacyEnrollments(): void {
    let migrated = 0;
    for (const e of this.data.enrollments) {
      if (
        (!e.modelVersion || !e.modelVersion.includes('OpenCV-SFace')) &&
        e.status !== 'incompatible_legacy'
      ) {
        e.status = 'incompatible_legacy';
        e.requiresReenrollment = true;
        e.modelVersion = `${e.modelVersion || 'Legacy'} (Deprecated - Requires SFace Re-enrollment)`;
        migrated++;
      }
    }
    if (migrated > 0) {
      console.log(`[BiometricDB] Migrated ${migrated} legacy synthetic template(s) to 'incompatible_legacy'. Genuine SFace re-enrollment required.`);
      this.addAuditLog('SYSTEM_MIGRATION', 'Migration Engine', 'ALL_ENROLLMENTS', {
        migratedCount: migrated,
        action: 'Flagged legacy synthetic templates as incompatible with OpenCV SFace model. Genuine re-enrollment required.',
      });
      this.save();
    }
  }

  private load(): BiometricDatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        try {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.enrollments) && Array.isArray(parsed.punches) && Array.isArray(parsed.sessions)) {
            return parsed;
          }
          throw new Error('Database schema structure is missing required collections');
        } catch (parseErr) {
          console.error('[BiometricDB] Parse error in database file. Preserving corrupted file:', parseErr);
          const corruptPath = `${DB_FILE}.corrupt.${Date.now()}`;
          try {
            fs.copyFileSync(DB_FILE, corruptPath);
            console.warn(`[BiometricDB] Corrupted database backed up to: ${corruptPath}`);
          } catch (copyErr) {
            console.error('[BiometricDB] Failed to create corruption snapshot:', copyErr);
          }

          // Attempt restore from backup file if available
          const backupFile = path.join(DATA_DIR, 'attendance_biometrics.backup.json');
          if (fs.existsSync(backupFile)) {
            try {
              const backupRaw = fs.readFileSync(backupFile, 'utf-8');
              const backupParsed = JSON.parse(backupRaw);
              console.warn('[BiometricDB] Successfully recovered database from backup file.');
              return backupParsed;
            } catch (backupErr) {
              console.error('[BiometricDB] Backup file also invalid:', backupErr);
            }
          }
        }
      }
    } catch (err) {
      console.error('[BiometricDB] Failed to access DB directory/file:', err);
    }

    const initial: BiometricDatabaseSchema = {
      version: '2.2.0',
      enrollments: INITIAL_SEEDED_ENROLLMENTS,
      punches: INITIAL_SEEDED_PUNCHES,
      sessions: INITIAL_SEEDED_SESSIONS,
      auditLogs: [
        {
          id: 'LOG-INIT',
          timestamp: new Date().toISOString(),
          action: 'SYSTEM_INITIALIZATION',
          performedBy: 'System Bootstrap',
          targetId: 'ALL',
          details: { seededEnrollments: INITIAL_SEEDED_ENROLLMENTS.length },
        },
      ],
    };

    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    } catch (e) {
      console.error('[BiometricDB] Error creating initial db file:', e);
    }
    return initial;
  }

  public async saveAsync(): Promise<void> {
    this.writeQueue = this.writeQueue.then(async () => {
      try {
        if (!fs.existsSync(DATA_DIR)) {
          fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        const tempFile = `${DB_FILE}.${Date.now()}.${Math.random().toString(36).substring(2, 6)}.tmp`;
        const serialized = JSON.stringify(this.data, null, 2);
        fs.writeFileSync(tempFile, serialized, 'utf-8');

        // Maintain atomic backup before replacing current DB
        const backupFile = path.join(DATA_DIR, 'attendance_biometrics.backup.json');
        if (fs.existsSync(DB_FILE)) {
          try {
            fs.copyFileSync(DB_FILE, backupFile);
          } catch {
            // non-fatal backup copy
          }
        }

        // On Windows, use copyFileSync + unlinkSync to bypass rename locks
        fs.copyFileSync(tempFile, DB_FILE);
        try {
          fs.unlinkSync(tempFile);
        } catch {
          // ignore cleanup error
        }
      } catch (err) {
        console.error('[BiometricDB] Failed to save DB file safely:', err);
      }
    });
    return this.writeQueue;
  }

  public save(): void {
    this.saveAsync().catch((err) => {
      console.error('[BiometricDB] Unhandled save error in write queue:', err);
    });
  }

  // Workers / Enrollments
  public getEnrollments(): WorkerFaceEnrollment[] {
    // SECURITY: Strip biometric template before sending to callers!
    return this.data.enrollments.map(({ biometricTemplate, ...publicInfo }) => publicInfo);
  }

  public getRawEnrollment(workerId: string): StoredWorkerEnrollment | undefined {
    return this.data.enrollments.find((e) => e.workerId === workerId);
  }

  public addEnrollment(enrollment: StoredWorkerEnrollment): void {
    const existingIdx = this.data.enrollments.findIndex((e) => e.workerId === enrollment.workerId);
    if (existingIdx >= 0) {
      this.data.enrollments[existingIdx] = enrollment;
    } else {
      this.data.enrollments.push(enrollment);
    }
    this.addAuditLog('WORKER_FACE_ENROLLED', enrollment.enrolledBySupervisor, enrollment.workerId, {
      status: enrollment.status,
      modelVersion: enrollment.modelVersion,
      consentSigned: enrollment.consentSigned,
    });
    this.save();
  }

  public deleteEnrollment(workerId: string): boolean {
    const idx = this.data.enrollments.findIndex((e) => e.workerId === workerId);
    if (idx >= 0) {
      this.data.enrollments.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  public deleteWorkerTestData(workerId: string): void {
    this.deleteEnrollment(workerId);
    this.data.sessions = this.data.sessions.filter((s) => s.workerId !== workerId);
    this.data.punches = this.data.punches.filter((p) => p.workerId !== workerId);
    this.save();
  }

  // Punches
  public getPunches(): AttendancePunch[] {
    return this.data.punches;
  }

  public getPunchesForSite(siteId: string): AttendancePunch[] {
    return this.data.punches.filter((p) => p.siteId === siteId);
  }

  public getPunchesForWorker(workerId: string): AttendancePunch[] {
    return this.data.punches.filter((p) => p.workerId === workerId);
  }

  public addPunch(punch: AttendancePunch): void {
    this.data.punches.unshift(punch);
    this.save();
  }

  // Sessions
  public getSessions(): AttendanceSession[] {
    return this.data.sessions;
  }

  public getSessionsForSite(siteId: string): AttendanceSession[] {
    return this.data.sessions.filter((s) => s.siteId === siteId);
  }

  public getSessionsForWorker(workerId: string): AttendanceSession[] {
    return this.data.sessions.filter((s) => s.workerId === workerId);
  }

  public getSession(id: string): AttendanceSession | undefined {
    return this.data.sessions.find((s) => s.id === id);
  }

  public getOpenSessionForWorker(workerId: string): AttendanceSession | undefined {
    return this.data.sessions.find((s) => s.workerId === workerId && s.sessionStatus === 'open');
  }

  public addOrUpdateSession(session: AttendanceSession): void {
    const idx = this.data.sessions.findIndex((s) => s.id === session.id);
    if (idx >= 0) {
      this.data.sessions[idx] = session;
    } else {
      this.data.sessions.unshift(session);
    }
    this.save();
  }

  // Manual Attendance Request (Alternative path for workers unable to use face verification)
  public addManualAttendanceRequest(params: {
    workerId: string;
    workerName: string;
    trade: string;
    siteId: string;
    siteName: string;
    punchType: 'CHECK_IN' | 'CHECK_OUT';
    reason: string;
    notes?: string;
    submittedBy: string;
  }): { punch: AttendancePunch; session: AttendanceSession } {
    const nowUtc = new Date().toISOString();
    const siteLocalDisplayTime = new Date(nowUtc).toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    const punchId = `PUNCH-MANUAL-${Date.now()}-${params.workerId.replace('-', '')}`;
    const today = nowUtc.split('T')[0];

    const punch: AttendancePunch = {
      id: punchId,
      workerId: params.workerId,
      workerName: params.workerName,
      trade: params.trade,
      siteId: params.siteId,
      siteName: params.siteName,
      punchType: params.punchType,
      serverUtcTimestamp: nowUtc,
      siteLocalDisplayTime,
      faceMatch: {
        isMatch: false,
        matchConfidence: 0,
        threshold: 0.80,
        matchedWorkerId: params.workerId,
        distanceMetric: 1.0,
      },
      liveness: {
        isLive: false,
        livenessScore: 0,
        screenArtifactsDetected: false,
        paperEdgeDetected: false,
        lightingConsistencyScore: 0,
        textureFrequencyScore: 0,
        details: `Manual attendance exception submitted. Reason: ${params.reason}. Requires physical muster roll verification.`,
      },
      verificationMethod: 'MANUAL_SUPERVISOR_REQUEST',
      modelVersion: 'BuildEase-ManualAudit-v2.1',
      status: 'flagged',
      failureReason: `Manual fallback: ${params.reason}`,
      auditMetadata: {
        deviceUserAgent: 'BuildEase-ManualRequest',
        captureResolution: 'none',
        lightingCondition: 'low_light',
        ipHash: 'manual-site-kiosk',
      },
    };

    this.addPunch(punch);

    const existingOpenSession = this.getOpenSessionForWorker(params.workerId);
    let session: AttendanceSession;

    if (params.punchType === 'CHECK_IN') {
      session = {
        id: `SESS-${Date.now()}-${params.workerId.replace('-', '')}`,
        workerId: params.workerId,
        workerName: params.workerName,
        trade: params.trade,
        siteId: params.siteId,
        siteName: params.siteName,
        date: today,
        checkInPunchId: punchId,
        checkInTime: siteLocalDisplayTime,
        durationMinutes: 480,
        hoursWorked: 8.0,
        overtimeHours: 0,
        breakDurationMinutes: 0,
        sessionStatus: 'flagged', // Flagged until supervisor verifies
        supervisorReviewStatus: 'pending_review',
        flagReason: `Manual attendance request: ${params.reason}`,
        notes: params.notes,
      };
      this.addOrUpdateSession(session);
    } else {
      if (existingOpenSession) {
        existingOpenSession.checkOutPunchId = punchId;
        existingOpenSession.checkOutTime = siteLocalDisplayTime;
        existingOpenSession.sessionStatus = 'flagged';
        existingOpenSession.flagReason = `Manual CHECK_OUT request: ${params.reason}`;
        this.addOrUpdateSession(existingOpenSession);
        session = existingOpenSession;
      } else {
        session = {
          id: `SESS-${Date.now()}-${params.workerId.replace('-', '')}`,
          workerId: params.workerId,
          workerName: params.workerName,
          trade: params.trade,
          siteId: params.siteId,
          siteName: params.siteName,
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
          flagReason: `Manual CHECK_OUT with no active CHECK_IN: ${params.reason}`,
        };
        this.addOrUpdateSession(session);
      }
    }

    this.addAuditLog('MANUAL_ATTENDANCE_REQUESTED', params.submittedBy, params.workerId, {
      punchId,
      sessionId: session.id,
      reason: params.reason,
      notes: params.notes,
    });

    return { punch, session };
  }

  // Supervisor verification & audit
  public verifySession(sessionId: string, verifiedBy: string): AttendanceSession | null {
    const session = this.data.sessions.find((s) => s.id === sessionId);
    if (!session) return null;
    session.supervisorReviewStatus = 'verified';
    session.sessionStatus = 'completed';
    session.verifiedBy = verifiedBy;
    session.verifiedAt = new Date().toISOString();
    this.addAuditLog('SESSION_SUPERVISOR_VERIFIED', verifiedBy, sessionId, {
      workerId: session.workerId,
      date: session.date,
      hoursWorked: session.hoursWorked,
    });
    this.save();
    return session;
  }

  public flagSession(sessionId: string, flaggedBy: string, reason: string): AttendanceSession | null {
    const session = this.data.sessions.find((s) => s.id === sessionId);
    if (!session) return null;
    session.supervisorReviewStatus = 'disputed';
    session.sessionStatus = 'flagged';
    session.flaggedBy = flaggedBy;
    session.flaggedAt = new Date().toISOString();
    session.flagReason = reason;
    this.addAuditLog('SESSION_SUPERVISOR_FLAGGED', flaggedBy, sessionId, {
      workerId: session.workerId,
      reason,
    });
    this.save();
    return session;
  }

  public batchVerifyPending(verifiedBy: string, siteId?: string): number {
    let count = 0;
    const now = new Date().toISOString();
    for (const session of this.data.sessions) {
      if (session.supervisorReviewStatus === 'pending_review') {
        if (!siteId || session.siteId === siteId) {
          session.supervisorReviewStatus = 'verified';
          session.sessionStatus = 'completed';
          session.verifiedBy = verifiedBy;
          session.verifiedAt = now;
          count++;
        }
      }
    }
    this.addAuditLog('BATCH_SUPERVISOR_VERIFY', verifiedBy, siteId || 'ALL_SITES', { count });
    this.save();
    return count;
  }

  public addAuditLog(
    action: string,
    performedBy: string,
    targetId: string,
    details: Record<string, any>
  ): void {
    this.data.auditLogs.unshift({
      id: `LOG-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      action,
      performedBy,
      targetId,
      details,
    });
  }

  public getAuditLogs() {
    return this.data.auditLogs;
  }
}

export const biometricDb = new BiometricDatabase();

