import {
  WorkerFaceEnrollment,
  AttendancePunch,
  AttendanceSession,
  BiometricVerificationPayload,
  BiometricEnrollmentPayload,
  IvrPhonePunchPayload,
} from '../types/biometrics';

export interface ClientAuthContext {
  role?: string;
  userId?: string;
  siteId?: string;
  userName?: string;
}

export class BiometricsService {
  private static activeAuth: ClientAuthContext = {
    role: 'site_supervisor',
    userId: 'SUP-PATIL-01',
    siteId: 'proj-1',
    userName: 'Aniket Patil',
  };

  public static setActiveAuth(auth: ClientAuthContext) {
    this.activeAuth = { ...this.activeAuth, ...auth };
  }

  public static getActiveAuth(): ClientAuthContext {
    return this.activeAuth;
  }

  private static getHeaders(auth?: ClientAuthContext): Record<string, string> {
    const effective = { ...this.activeAuth, ...auth };
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (effective.role) headers['x-buildease-role'] = effective.role;
    if (effective.userId) headers['x-buildease-user-id'] = effective.userId;
    if (effective.siteId) headers['x-buildease-site-id'] = effective.siteId;
    if (effective.userName) headers['x-buildease-user-name'] = effective.userName;
    return headers;
  }

  public static async fetchEnrolledWorkers(auth?: ClientAuthContext): Promise<WorkerFaceEnrollment[]> {
    try {
      const res = await fetch('/api/biometrics/workers', {
        headers: this.getHeaders(auth),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.enrollments || [];
    } catch (err) {
      console.warn('[BiometricsService] Error fetching enrolled workers:', err);
      return [];
    }
  }

  public static async enrollWorkerFace(
    payload: BiometricEnrollmentPayload,
    auth?: ClientAuthContext
  ): Promise<{ success: boolean; enrollment?: WorkerFaceEnrollment; error?: string }> {
    try {
      const res = await fetch('/api/biometrics/enroll', {
        method: 'POST',
        headers: this.getHeaders(auth),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to enroll worker face.' };
      }
      return { success: true, enrollment: data.enrollment };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during enrollment.' };
    }
  }

  public static async verifyPunch(
    payload: BiometricVerificationPayload,
    auth?: ClientAuthContext
  ): Promise<{ success: boolean; punch?: AttendancePunch; session?: AttendanceSession; error?: string }> {
    try {
      const res = await fetch('/api/biometrics/verify-punch', {
        method: 'POST',
        headers: this.getHeaders(auth),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Biometric verification failed. Please try again or request manual review.',
        };
      }
      return { success: true, punch: data.punch, session: data.session };
    } catch (err: any) {
      return { success: false, error: err.message || 'Connection error to biometric verification server.' };
    }
  }

  public static async requestManualAttendance(
    payload: {
      workerId: string;
      workerName: string;
      trade: string;
      siteId: string;
      siteName: string;
      punchType: 'CHECK_IN' | 'CHECK_OUT';
      reason: string;
      notes?: string;
    },
    auth?: ClientAuthContext
  ): Promise<{ success: boolean; punch?: AttendancePunch; session?: AttendanceSession; error?: string }> {
    try {
      const res = await fetch('/api/biometrics/manual-request', {
        method: 'POST',
        headers: this.getHeaders(auth),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to submit manual attendance request.' };
      }
      return { success: true, punch: data.punch, session: data.session };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error submitting manual attendance request.' };
    }
  }

  public static async fetchPunches(auth?: ClientAuthContext): Promise<AttendancePunch[]> {
    try {
      const res = await fetch('/api/biometrics/punches', {
        headers: this.getHeaders(auth),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.punches || [];
    } catch (err) {
      console.warn('[BiometricsService] Error fetching punches:', err);
      return [];
    }
  }

  public static async fetchSessions(auth?: ClientAuthContext): Promise<AttendanceSession[]> {
    try {
      const res = await fetch('/api/biometrics/sessions', {
        headers: this.getHeaders(auth),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.sessions || [];
    } catch (err) {
      console.warn('[BiometricsService] Error fetching sessions:', err);
      return [];
    }
  }

  public static async verifySession(
    sessionId: string,
    verifiedBy: string,
    auth?: ClientAuthContext
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/biometrics/verify-session', {
        method: 'POST',
        headers: this.getHeaders(auth),
        body: JSON.stringify({ sessionId, verifiedBy }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Verification failed.' };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error.' };
    }
  }

  public static async flagSession(
    sessionId: string,
    flaggedBy: string,
    reason: string,
    auth?: ClientAuthContext
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/biometrics/flag-session', {
        method: 'POST',
        headers: this.getHeaders(auth),
        body: JSON.stringify({ sessionId, flaggedBy, reason }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Flagging session failed.' };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error.' };
    }
  }

  public static async batchVerifySessions(
    verifiedBy: string,
    siteId?: string,
    auth?: ClientAuthContext
  ): Promise<{ success: boolean; count: number; error?: string }> {
    try {
      const res = await fetch('/api/biometrics/batch-verify', {
        method: 'POST',
        headers: this.getHeaders(auth),
        body: JSON.stringify({ verifiedBy, siteId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, count: 0, error: data.error || 'Batch verification failed.' };
      }
      return { success: true, count: data.count || 0 };
    } catch (err: any) {
      return { success: false, count: 0, error: err.message || 'Network error.' };
    }
  }

  public static async submitIvrPhonePunch(
    payload: IvrPhonePunchPayload,
    auth?: ClientAuthContext
  ): Promise<{ success: boolean; punch?: AttendancePunch; session?: AttendanceSession; error?: string }> {
    try {
      const res = await fetch('/api/biometrics/ivr-phone-punch', {
        method: 'POST',
        headers: this.getHeaders(auth),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'IVR Phone punch verification failed.' };
      }
      return { success: true, punch: data.punch, session: data.session };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error submitting IVR phone punch.' };
    }
  }

  public static async fetchPayrollMuster(auth?: ClientAuthContext): Promise<any> {
    try {
      const res = await fetch('/api/payroll/verified-muster', {
        headers: this.getHeaders(auth),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[BiometricsService] Failed fetching payroll muster:', err);
      return null;
    }
  }
}
