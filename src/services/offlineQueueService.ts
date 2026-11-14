import { OfflineQueuedPunch, BiometricVerificationPayload, AttendancePunch, AttendanceSession } from '../types/biometrics';
import { BiometricsService } from './biometricsService';

const STORAGE_KEY = 'buildease_offline_punches_v1';
const SIMULATE_OFFLINE_KEY = 'buildease_simulate_offline_mode';

type QueueListener = (queue: OfflineQueuedPunch[]) => void;

class OfflineQueueService {
  private listeners: Set<QueueListener> = new Set();
  private isSyncing = false;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.notifyListeners();
        // Automatically attempt background sync when network is restored
        this.syncAll().catch((err) => console.warn('[OfflineQueueService] Auto-sync error:', err));
      });
      window.addEventListener('offline', () => {
        this.notifyListeners();
      });
    }
  }

  public subscribe(listener: QueueListener): () => void {
    this.listeners.add(listener);
    listener(this.getQueue());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const queue = this.getQueue();
    this.listeners.forEach((listener) => {
      try {
        listener(queue);
      } catch (err) {
        console.error('[OfflineQueueService] Listener error:', err);
      }
    });
  }

  public isNetworkOnline(): boolean {
    if (typeof window === 'undefined') return true;
    if (this.isSimulatedOffline()) return false;
    return navigator.onLine;
  }

  public isSimulatedOffline(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(SIMULATE_OFFLINE_KEY) === 'true';
    } catch {
      return false;
    }
  }

  public setSimulatedOffline(enabled: boolean) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(SIMULATE_OFFLINE_KEY, enabled ? 'true' : 'false');
      this.notifyListeners();
    } catch (e) {
      console.warn('[OfflineQueueService] Failed to set simulated offline:', e);
    }
  }

  public getQueue(): OfflineQueuedPunch[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as OfflineQueuedPunch[];
    } catch (err) {
      console.warn('[OfflineQueueService] Failed to read queue:', err);
      return [];
    }
  }

  private saveQueue(queue: OfflineQueuedPunch[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
      this.notifyListeners();
    } catch (err) {
      console.error('[OfflineQueueService] Failed to persist queue:', err);
    }
  }

  public enqueue(
    item: Omit<OfflineQueuedPunch, 'id' | 'status' | 'retryCount'>
  ): OfflineQueuedPunch {
    const queue = this.getQueue();
    const id = `OFF-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newPunch: OfflineQueuedPunch = {
      ...item,
      id,
      status: 'pending',
      retryCount: 0,
    };

    queue.unshift(newPunch);
    this.saveQueue(queue);
    return newPunch;
  }

  public remove(id: string) {
    const queue = this.getQueue().filter((p) => p.id !== id);
    this.saveQueue(queue);
  }

  public updateStatus(id: string, status: OfflineQueuedPunch['status'], error?: string) {
    const queue = this.getQueue().map((p) => {
      if (p.id === id) {
        return {
          ...p,
          status,
          retryCount: p.retryCount + (status === 'failed' ? 1 : 0),
          lastError: error || p.lastError,
        };
      }
      return p;
    });
    this.saveQueue(queue);
  }

  public clearAll() {
    this.saveQueue([]);
  }

  public getPendingCount(): number {
    return this.getQueue().filter((p) => p.status === 'pending' || p.status === 'failed').length;
  }

  public async syncSingle(
    punch: OfflineQueuedPunch
  ): Promise<{ success: boolean; punch?: AttendancePunch; session?: AttendanceSession; error?: string }> {
    if (!this.isNetworkOnline()) {
      return { success: false, error: 'Device is offline. Connect to network to sync.' };
    }

    this.updateStatus(punch.id, 'syncing');

    try {
      const payload: BiometricVerificationPayload = {
        workerId: punch.workerId,
        siteId: punch.siteId,
        siteName: punch.siteName,
        punchType: punch.punchType,
        capturedFrameBase64: punch.capturedFrameBase64,
        deviceInfo: `${punch.deviceInfo} [Offline-Sync]`,
        lightingEstimate: 'optimal',
        location: punch.location,
        capturedAt: punch.capturedAt,
      };

      const res = await BiometricsService.verifyPunch(payload);

      if (res.success && res.punch && res.session) {
        // Successfully synced; remove from queue
        this.remove(punch.id);
        return { success: true, punch: res.punch, session: res.session };
      } else {
        const errMsg = res.error || 'Verification server rejected offline punch.';
        this.updateStatus(punch.id, 'failed', errMsg);
        return { success: false, error: errMsg };
      }
    } catch (err: any) {
      const errMsg = err.message || 'Network exception during sync.';
      this.updateStatus(punch.id, 'failed', errMsg);
      return { success: false, error: errMsg };
    }
  }

  public async syncAll(
    onProgress?: (synced: number, total: number) => void
  ): Promise<{
    total: number;
    success: number;
    failed: number;
    results: Array<{ id: string; punch?: AttendancePunch; session?: AttendanceSession; error?: string }>;
  }> {
    if (this.isSyncing) {
      return { total: 0, success: 0, failed: 0, results: [] };
    }

    const pending = this.getQueue().filter((p) => p.status === 'pending' || p.status === 'failed');
    if (pending.length === 0) {
      return { total: 0, success: 0, failed: 0, results: [] };
    }

    if (!this.isNetworkOnline()) {
      return {
        total: pending.length,
        success: 0,
        failed: pending.length,
        results: pending.map((p) => ({ id: p.id, error: 'Device is offline.' })),
      };
    }

    this.isSyncing = true;
    let successCount = 0;
    let failedCount = 0;
    const results: Array<{ id: string; punch?: AttendancePunch; session?: AttendanceSession; error?: string }> = [];

    try {
      for (let i = 0; i < pending.length; i++) {
        const punch = pending[i];
        const res = await this.syncSingle(punch);
        if (res.success) {
          successCount++;
          results.push({ id: punch.id, punch: res.punch, session: res.session });
        } else {
          failedCount++;
          results.push({ id: punch.id, error: res.error });
        }
        if (onProgress) {
          onProgress(i + 1, pending.length);
        }
      }
    } finally {
      this.isSyncing = false;
      this.notifyListeners();
    }

    return {
      total: pending.length,
      success: successCount,
      failed: failedCount,
      results,
    };
  }
}

export const offlineQueueService = new OfflineQueueService();
