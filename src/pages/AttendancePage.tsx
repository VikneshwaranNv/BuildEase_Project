import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Modal } from '../components/common/Modal';
import {
  CheckCircle2,
  Check,
  Flag,
  Info,
  Camera,
  UserCheck,
  ShieldCheck,
  Fingerprint,
  Layers,
  FileCheck2,
  Sparkles,
  AlertTriangle,
  MapPin,
  RefreshCw,
  Wifi,
  WifiOff,
  Database,
  Trash2,
  PhoneCall,
} from 'lucide-react';
import { localizeUnit, localizeSite, localizeAttendanceNote } from '../i18n/localize';
import { FacePunchModal } from '../components/attendance/FacePunchModal';
import { FaceEnrollmentModal } from '../components/attendance/FaceEnrollmentModal';
import { BiometricAuditModal } from '../components/attendance/BiometricAuditModal';
import { ButtonPhonePunchModal } from '../components/attendance/ButtonPhonePunchModal';
import { BiometricsService } from '../services/biometricsService';
import { offlineQueueService } from '../services/offlineQueueService';
import { WorkerFaceEnrollment, AttendancePunch, AttendanceSession, OfflineQueuedPunch } from '../types/biometrics';
import { AttendanceRecord, WorkerTrade } from '../types';

export const AttendancePage: React.FC = () => {
  const {
    role,
    t,
    attendanceRecords,
    workers,
    projects,
    verifyAttendanceRecord,
    flagAttendanceRecord,
    verifyAllPendingAttendance,
    addAttendanceRecord,
    refreshBiometricAttendance,
  } = useApp();

  const [activeView, setActiveView] = useState<'records' | 'enrollments'>('records');
  const [filterState, setFilterState] = useState<string>('all');
  const [selectedRecordToVerify, setSelectedRecordToVerify] = useState<string | null>(null);
  const [flagRecordId, setFlagRecordId] = useState<string | null>(null);
  const [flagReason, setFlagReason] = useState('');
  const [batchVerifyOpen, setBatchVerifyOpen] = useState(false);

  // Biometrics Modals & Server Data State
  const [isPunchModalOpen, setIsPunchModalOpen] = useState<boolean>(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState<boolean>(false);
  const [enrollWorkerId, setEnrollWorkerId] = useState<string | undefined>(undefined);
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [manualWorkerId, setManualWorkerId] = useState<string>('W-0418');
  const [manualSiteId, setManualSiteId] = useState<string>('proj-1');
  const [manualPunchType, setManualPunchType] = useState<'CHECK_IN' | 'CHECK_OUT'>('CHECK_IN');
  const [manualReason, setManualReason] = useState<string>('Camera hardware unavailable or permission denied');
  const [manualNotes, setManualNotes] = useState<string>('');
  const [isSubmittingManual, setIsSubmittingManual] = useState<boolean>(false);
  const [manualSuccessMsg, setManualSuccessMsg] = useState<string | null>(null);
  const [selectedAuditPunch, setSelectedAuditPunch] = useState<AttendancePunch | null>(null);
  const [punches, setPunches] = useState<AttendancePunch[]>([]);
  const [enrollments, setEnrollments] = useState<WorkerFaceEnrollment[]>([]);

  // Offline Queue State & Subscribers
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueuedPunch[]>(() => offlineQueueService.getQueue());
  const [isOfflineQueueModalOpen, setIsOfflineQueueModalOpen] = useState(false);
  const [isSyncingOfflineQueue, setIsSyncingOfflineQueue] = useState(false);
  const [offlineSyncFeedback, setOfflineSyncFeedback] = useState<string | null>(null);
  const [isButtonPhoneModalOpen, setIsButtonPhoneModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsub = offlineQueueService.subscribe((q) => {
      setOfflineQueue(q);
    });
    return () => unsub();
  }, []);

  const pendingOfflineCount = offlineQueue.filter((p) => p.status === 'pending' || p.status === 'failed').length;

  const handleSyncAllOffline = async () => {
    setIsSyncingOfflineQueue(true);
    setOfflineSyncFeedback(null);
    try {
      const res = await offlineQueueService.syncAll();
      await loadBiometricsData();
      if (res.success > 0) {
        setOfflineSyncFeedback(`Successfully synced ${res.success} offline punches to the server!`);
        try {
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(`${res.success} offline punches synced.`);
            window.speechSynthesis.speak(utterance);
          }
        } catch {
          // ignore
        }
      } else if (res.failed > 0) {
        setOfflineSyncFeedback(`${res.failed} punches failed to sync. Ensure network is active.`);
      } else {
        setOfflineSyncFeedback('No pending offline punches to sync.');
      }
    } catch (err: any) {
      setOfflineSyncFeedback(`Sync error: ${err.message || 'Unknown network error'}`);
    } finally {
      setIsSyncingOfflineQueue(false);
      setTimeout(() => setOfflineSyncFeedback(null), 5000);
    }
  };

  const handleSyncSingleOffline = async (punch: OfflineQueuedPunch) => {
    try {
      const res = await offlineQueueService.syncSingle(punch);
      if (res.success) {
        await loadBiometricsData();
      }
    } catch (err) {
      console.warn('Sync single error:', err);
    }
  };

  const handleDeleteOfflinePunch = (id: string) => {
    offlineQueueService.remove(id);
  };

  // Load server biometric records
  const loadBiometricsData = useCallback(async () => {
    try {
      const [pList, eList] = await Promise.all([
        BiometricsService.fetchPunches(),
        BiometricsService.fetchEnrolledWorkers(),
      ]);
      setPunches(pList);
      setEnrollments(eList);
      await refreshBiometricAttendance();
    } catch (err) {
      console.warn('[AttendancePage] Failed loading server biometrics data:', err);
    }
  }, [refreshBiometricAttendance]);

  useEffect(() => {
    loadBiometricsData();
  }, [loadBiometricsData]);

  // Handle successful live face verification punch
  const handlePunchSuccess = (punch: AttendancePunch, session: AttendanceSession) => {
    setPunches((prev) => [punch, ...prev]);

    const geoNote = punch.geoFence
      ? punch.geoFence.status === 'verified_on_site'
        ? ` · On-Site (${punch.geoFence.distanceMeters}m)`
        : punch.geoFence.status === 'outside_geofence'
        ? ` · GEOFENCE BREACH (${punch.geoFence.distanceMeters}m)`
        : ''
      : '';

    // Create or prepend corresponding AttendanceRecord into AppContext ledger
    const newRecord: AttendanceRecord = {
      id: session.id,
      workerId: punch.workerId,
      workerName: punch.workerName,
      trade: punch.trade as WorkerTrade,
      siteId: punch.siteId,
      siteName: punch.siteName,
      date: session.date,
      checkInTime: session.checkInTime,
      checkOutTime: session.checkOutTime,
      hoursWorked: session.hoursWorked,
      overtimeHours: session.overtimeHours,
      status: session.overtimeHours > 0 ? 'overtime' : 'present',
      verificationStatus:
        session.supervisorReviewStatus === 'verified'
          ? 'supervisor_verified'
          : session.supervisorReviewStatus === 'disputed' || session.sessionStatus === 'flagged'
          ? 'flagged'
          : 'raw_checkin',
      verifiedBy: session.verifiedBy,
      notes: `Live Face Verified (${punch.verificationMethod}) · Match: ${(punch.faceMatch.matchConfidence * 100).toFixed(0)}% · PAD: ${(punch.liveness.livenessScore * 100).toFixed(0)}%${geoNote}`,
    };

    addAttendanceRecord(newRecord);
    loadBiometricsData();
  };

  // Handle successful face enrollment
  const handleEnrollSuccess = (newEnrollment: WorkerFaceEnrollment) => {
    setEnrollments((prev) => {
      const filtered = prev.filter((e) => e.workerId !== newEnrollment.workerId);
      return [newEnrollment, ...filtered];
    });
    setEnrollWorkerId(undefined);
  };

  // Verify single record with server persistence
  const handleConfirmVerify = async () => {
    if (selectedRecordToVerify) {
      verifyAttendanceRecord(selectedRecordToVerify);
      await BiometricsService.verifySession(
        selectedRecordToVerify,
        role === 'contractor' ? 'Contractor Admin' : 'Aniket Patil (Site Supervisor)'
      );
      setSelectedRecordToVerify(null);
      await refreshBiometricAttendance();
    }
  };

  // Batch verify all pending check-ins with server persistence
  const handleConfirmBatchVerify = async () => {
    verifyAllPendingAttendance();
    await BiometricsService.batchVerifySessions(
      role === 'contractor' ? 'Contractor Admin' : 'Aniket Patil (Site Supervisor)'
    );
    setBatchVerifyOpen(false);
    await refreshBiometricAttendance();
  };

  // Flag attendance record with server persistence
  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (flagRecordId) {
      flagAttendanceRecord(flagRecordId, flagReason);
      await BiometricsService.flagSession(
        flagRecordId,
        role === 'contractor' ? 'Contractor Admin' : 'Aniket Patil (Site Supervisor)',
        flagReason
      );
      setFlagRecordId(null);
      setFlagReason('');
      await refreshBiometricAttendance();
    }
  };

  // Handle manual attendance review submission
  const handleManualRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingManual(true);
    try {
      const workerMatch = workers.find((w) => w.workerId === manualWorkerId);
      const workerName = workerMatch ? workerMatch.fullName : `Worker ${manualWorkerId}`;
      const workerTrade = workerMatch ? workerMatch.trade : ('general_helper' as WorkerTrade);
      const selectedSite = projects.find((p) => p.id === manualSiteId);
      const siteName = selectedSite ? selectedSite.name : 'Construction Site';
      const finalReason = manualNotes.trim() ? `${manualReason} - ${manualNotes.trim()}` : manualReason;

      const res = await BiometricsService.requestManualAttendance({
        workerId: manualWorkerId,
        workerName,
        trade: workerTrade,
        siteId: manualSiteId,
        siteName,
        punchType: manualPunchType,
        reason: finalReason,
        notes: manualNotes.trim() || undefined,
      });

      if (res && res.session && res.punch) {
        const punch = res.punch;
        setPunches((prev) => [punch, ...prev]);

        const newRecord: AttendanceRecord = {
          id: res.session.id,
          workerId: res.punch.workerId,
          workerName: res.punch.workerName,
          trade: res.punch.trade as WorkerTrade,
          siteId: res.punch.siteId,
          siteName: selectedSite ? selectedSite.name : res.punch.siteName,
          date: res.session.date,
          checkInTime: res.session.checkInTime,
          checkOutTime: res.session.checkOutTime,
          hoursWorked: res.session.hoursWorked,
          overtimeHours: res.session.overtimeHours,
          status: 'present',
          verificationStatus: 'flagged',
          notes: `Manual Review: ${finalReason}`,
        };

        addAttendanceRecord(newRecord);
        loadBiometricsData();
        setManualSuccessMsg(t('biometric_manual_submitted_success'));
        setTimeout(() => {
          setIsManualModalOpen(false);
          setManualSuccessMsg(null);
          setManualNotes('');
        }, 1200);
      }
    } catch (err: any) {
      console.error('[AttendancePage] Manual attendance request failed:', err);
    } finally {
      setIsSubmittingManual(false);
    }
  };

  // Filter records based on role and tab state
  const displayRecords =
    role === 'worker'
      ? attendanceRecords.filter((r) => r.workerId === 'W-0418')
      : attendanceRecords;

  const filteredRecords = displayRecords.filter((rec) => {
    if (filterState === 'all') return true;
    return rec.verificationStatus === filterState;
  });

  const rawPendingCount = attendanceRecords.filter(
    (r) => r.verificationStatus === 'raw_checkin'
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        tag={t('attendance_tag')}
        title={t('attendance_title')}
        subtitle={t('attendance_subtitle')}
        primaryAction={{
          label: t('biometric_launch_kiosk_btn'),
          icon: <Camera className="w-4 h-4" />,
          onClick: () => setIsPunchModalOpen(true),
        }}
        secondaryAction={
          role === 'contractor' || role === 'site_supervisor'
            ? {
                label: t('biometric_enroll_worker_btn'),
                icon: <UserCheck className="w-4 h-4" />,
                onClick: () => setIsEnrollModalOpen(true),
              }
            : {
                label: t('biometric_manual_review_btn'),
                icon: <Flag className="w-4 h-4" />,
                onClick: () => setIsManualModalOpen(true),
              }
        }
      >
        {(role === 'contractor' || role === 'site_supervisor') && (
          <button
            type="button"
            onClick={() => setIsManualModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] text-xs font-semibold rounded-lg bg-[#ECE5DA] hover:bg-[#2D333D] text-[#A77B50] border border-[#A77B50]/30 transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-[0.98]"
          >
            <Flag className="w-3.5 h-3.5 text-[#A77B50]" />
            <span>{t('biometric_manual_review_btn')}</span>
          </button>
        )}

        {(role === 'contractor' || role === 'site_supervisor') && rawPendingCount > 0 && (
          <button
            type="button"
            onClick={() => setBatchVerifyOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] text-xs font-semibold rounded-lg bg-[#ECE5DA] hover:bg-[#2D333D] text-[#10B981] border border-[#10B981]/30 transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-[0.98]"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span>{t('attendance_verify_pending_btn', { count: rawPendingCount })}</span>
          </button>
        )}

        {pendingOfflineCount > 0 && (
          <button
            type="button"
            onClick={handleSyncAllOffline}
            disabled={isSyncingOfflineQueue}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] text-xs font-semibold rounded-lg bg-[#A77B50]/15 hover:bg-[#A77B50]/25 text-[#A77B50] border border-[#A77B50]/40 transition-all shadow-sm cursor-pointer whitespace-nowrap disabled:opacity-50 active:scale-[0.98]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingOfflineQueue ? 'animate-spin' : ''}`} />
            <span>Sync Offline ({pendingOfflineCount})</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsButtonPhoneModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] text-xs font-semibold rounded-lg bg-[#F4F0E8] hover:bg-[#ECE5DA] text-[#10B981] border border-[#10B981]/30 transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-[0.98]"
          title="Simulate 2G keypad phone dialing toll-free line with daily gate PIN"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#10B981]" />
          <span>2G Button Phone (Gate PIN)</span>
        </button>
      </PageHeader>

      {/* Offline Sync Feedback Toast */}
      {offlineSyncFeedback && (
        <div className="bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] px-4 py-3 rounded-xl text-xs flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{offlineSyncFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setOfflineSyncFeedback(null)}
            className="text-[11px] hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2G Button Phone Site Gate Board Strip */}
      <div className="bg-[#F4F0E8] border border-[#51483D]/25 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs shadow-ivory-card">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#ECE5DA] border border-[#10B981]/30 flex flex-col items-center justify-center text-[#10B981] shrink-0">
            <span className="text-[9px] font-semibold text-[#10B981] leading-none">Gate PIN</span>
            <span className="font-bold font-mono text-base tracking-widest text-[#10B981] leading-tight">582</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#252521] text-sm">Site Entrance Gate Passcode (Today: 582)</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] font-semibold border border-[#10B981]/30">
                2G Feature Phone Kiosk
              </span>
            </div>
            <p className="text-xs text-[#96938B] mt-1">
              Workers with basic button phones dial <strong className="text-[#252521]">1800-284-533</strong> and enter this 3-digit gate code. Proves physical on-site presence via telecom cell tower.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsButtonPhoneModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-lg bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold text-xs transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-[0.98]"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Launch 2G Button Phone Simulator</span>
        </button>
      </div>

      {/* Offline Queue Status Strip */}
      {pendingOfflineCount > 0 && (
        <div className="bg-[#A77B50]/10 border border-[#A77B50]/30 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#A77B50]">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-[#A77B50] shrink-0" />
            <div>
              <div className="font-bold text-[#252521] text-sm flex items-center gap-2">
                <span>{pendingOfflineCount} Offline Field Punches Cached</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#A77B50]/20 text-[#A77B50] font-semibold border border-[#A77B50]/30">
                  Pending sync
                </span>
              </div>
              <p className="text-xs text-[#96938B] mt-0.5">
                Punches captured without field connectivity are safely queued in local device storage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsOfflineQueueModalOpen(true)}
              className="px-3 py-1.5 min-h-[40px] rounded-lg bg-[#ECE5DA] hover:bg-[#2D333D] border border-[#51483D]/25 text-[#252521] font-semibold text-xs transition-colors cursor-pointer active:scale-[0.98]"
            >
              View Queue ({pendingOfflineCount})
            </button>
            <button
              type="button"
              onClick={handleSyncAllOffline}
              disabled={isSyncingOfflineQueue}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 min-h-[40px] rounded-lg bg-[#A77B50] hover:bg-[#936B42] text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingOfflineQueue ? 'animate-spin' : ''}`} />
              <span>{isSyncingOfflineQueue ? 'Syncing...' : `Sync All (${pendingOfflineCount})`}</span>
            </button>
          </div>
        </div>
      )}

      {/* Educational notice regarding attendance state validity */}
      <div className="bg-[#F4F0E8] border border-[#51483D]/25 rounded-xl p-4 flex items-start gap-3 text-xs text-[#96938B]">
        <Info className="w-4 h-4 text-[#A77B50] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#252521] font-bold">{t('attendance_notice_title')} </strong>
          {t('attendance_notice_body')}
        </div>
      </div>

      {/* Main Mode Toggle: Attendance Ledger vs Biometric Registry */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F4F0E8] p-3 border border-[#51483D]/25 rounded-xl shadow-ivory-card">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setActiveView('records')}
              className={`px-3 py-1.5 font-medium rounded-md transition-all cursor-pointer min-h-[36px] ${
                activeView === 'records'
                  ? 'bg-[#F4F0E8] text-[#252521] font-semibold border border-[#51483D]/25'
                  : 'text-[#96938B] hover:text-[#252521]'
              }`}
            >
              {t('attendance_tab_all', { count: displayRecords.length })}
            </button>
            <button
              type="button"
              onClick={() => setActiveView('enrollments')}
              className={`px-3 py-1.5 font-medium rounded-md transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
                activeView === 'enrollments'
                  ? 'bg-[#F4F0E8] text-[#252521] font-semibold border border-[#51483D]/25'
                  : 'text-[#96938B] hover:text-[#252521]'
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5 text-[#A77B50]" />
              <span>{t('biometric_tab_enrollments')} ({enrollments.length})</span>
            </button>
          </div>

          {activeView === 'records' && (
            <div className="hidden sm:flex items-center gap-1.5 p-1 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setFilterState('all')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer min-h-[36px] ${
                  filterState === 'all'
                    ? 'bg-[#F4F0E8] text-[#252521] font-semibold border border-[#51483D]/25'
                    : 'text-[#96938B] hover:text-[#252521]'
                }`}
              >
                {t('action_filter')}: All
              </button>
              <button
                type="button"
                onClick={() => setFilterState('raw_checkin')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer min-h-[36px] ${
                  filterState === 'raw_checkin'
                    ? 'bg-[#F4F0E8] text-[#252521] font-semibold border border-[#51483D]/25'
                    : 'text-[#96938B] hover:text-[#252521]'
                }`}
              >
                {t('attendance_tab_raw')}
              </button>
              <button
                type="button"
                onClick={() => setFilterState('supervisor_verified')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer min-h-[36px] ${
                  filterState === 'supervisor_verified'
                    ? 'bg-[#F4F0E8] text-[#252521] font-semibold border border-[#51483D]/25'
                    : 'text-[#96938B] hover:text-[#252521]'
                }`}
              >
                {t('attendance_tab_verified')}
              </button>
              <button
                type="button"
                onClick={() => setFilterState('flagged')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer min-h-[36px] ${
                  filterState === 'flagged'
                    ? 'bg-[#F4F0E8] text-[#252521] font-semibold border border-[#51483D]/25'
                    : 'text-[#96938B] hover:text-[#252521]'
                }`}
              >
                {t('attendance_tab_flagged')}
              </button>
            </div>
          )}
        </div>

        <div className="text-xs text-[#96938B] flex items-center gap-2">
          <span className="font-semibold text-[#252521] tabular-nums">{t('attendance_date_today')}</span>
        </div>
      </div>

      {/* VIEW 1: Attendance Ledger Table */}
      {activeView === 'records' && (
        <div className="bg-[#F4F0E8] border border-[#51483D]/25 rounded-xl overflow-hidden shadow-ivory-card">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#252521] text-[#F4F0E8] border-b border-[#51483D]/25 font-semibold text-xs">
                <tr>
                  <th className="px-4 py-3">{t('table_worker_name')}</th>
                  <th className="px-3 py-3">{t('table_site_location')}</th>
                  <th className="px-3 py-3">{t('table_timestamps')}</th>
                  <th className="px-3 py-3">{t('table_shift_hours')}</th>
                  <th className="px-3 py-3">{t('table_verification_state')}</th>
                  <th className="px-3 py-3">{t('table_supervisor_signoff')}</th>
                  {(role === 'contractor' || role === 'site_supervisor') && (
                    <th className="px-4 py-3 text-right">{t('table_actions')}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#51483D]/15 bg-[#F4F0E8]">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={role === 'contractor' || role === 'site_supervisor' ? 7 : 6}
                      className="px-4 py-8 text-center text-xs text-[#96938B]"
                    >
                      {t('empty_records_title')}
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((rec) => {
                    const matchingPunch = punches.find(
                      (p) => (rec.id && (p.id === rec.id || p.id.includes(rec.id))) || p.workerId === rec.workerId
                    );
                    return (
                      <tr key={rec.id} className="hover:bg-[#ECE5DA] transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-[#252521]">{rec.workerName}</div>
                          <div className="text-[11px] text-[#96938B] mt-0.5">
                            <span className="font-mono text-[#A77B50] font-semibold">{rec.workerId}</span> · {t(`trade_${rec.trade}`)}
                          </div>
                        </td>
                        <td className="px-3 py-3.5 text-[#96938B] font-medium">{localizeSite(rec.siteName, t)}</td>
                        <td className="px-3 py-3.5 tabular-nums text-[#252521]">
                          <div>{t('table_in')}: {rec.checkInTime}</div>
                          {rec.checkOutTime ? (
                            <div className="text-[11px] text-[#96938B] mt-0.5">{t('table_out')}: {rec.checkOutTime}</div>
                          ) : (
                            <div className="text-[11px] text-[#A77B50] font-bold mt-0.5">{t('attendance_shift_active')}</div>
                          )}
                        </td>
                        <td className="px-3 py-3.5 tabular-nums font-bold text-[#252521]">
                          {rec.hoursWorked} {localizeUnit('hrs', t)}
                          {rec.overtimeHours > 0 && (
                            <span className="text-[11px] text-[#10B981] block font-bold mt-0.5">
                              +{rec.overtimeHours} {localizeUnit('hrs', t)} {localizeUnit('ot', t)}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3.5">
                          <StatusBadge status={rec.verificationStatus} size="sm" />
                          {matchingPunch && (
                            <div className="mt-1 flex flex-col items-start gap-1">
                              <button
                                type="button"
                                onClick={() => setSelectedAuditPunch(matchingPunch)}
                                className="inline-flex items-center gap-1 text-[10px] font-mono text-[#252521] bg-[#ECE5DA] hover:bg-[#2D333D] px-2 py-0.5 rounded border border-[#51483D]/25 hover:border-[#A77B50]/50 transition-colors cursor-pointer"
                                title={t('biometric_view_audit_btn')}
                              >
                                <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                                <span>{t('biometric_view_audit_btn')}</span>
                              </button>
                              {matchingPunch.geoFence && (
                                <span
                                  className={`inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded border ${
                                    matchingPunch.geoFence.status === 'verified_on_site'
                                      ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
                                      : matchingPunch.geoFence.status === 'outside_geofence'
                                      ? 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/40 font-bold'
                                      : 'bg-[#ECE5DA] text-[#96938B] border-[#51483D]/25'
                                  }`}
                                >
                                  <MapPin className="w-2.5 h-2.5" />
                                  <span>
                                    {matchingPunch.geoFence.status === 'verified_on_site'
                                      ? `On-Site (${matchingPunch.geoFence.distanceMeters}m)`
                                      : matchingPunch.geoFence.status === 'outside_geofence'
                                      ? `BREACH (${matchingPunch.geoFence.distanceMeters}m)`
                                      : 'No GPS'}
                                  </span>
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-3.5">
                          {rec.verifiedBy ? (
                            <div className="text-[#10B981] font-bold">{rec.verifiedBy}</div>
                          ) : (
                            <div className="text-[#96938B] italic">{t('attendance_awaiting_signoff')}</div>
                          )}
                          {rec.notes && <div className="text-[11px] text-[#96938B] mt-0.5">{localizeAttendanceNote(rec.notes, t)}</div>}
                        </td>

                        {(role === 'contractor' || role === 'site_supervisor') && (
                          <td className="px-4 py-3.5 text-right">
                            {rec.verificationStatus === 'raw_checkin' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedRecordToVerify(rec.id)}
                                  className="min-h-[36px] px-3 py-1.5 text-xs font-bold text-slate-950 bg-[#A77B50] hover:bg-[#936B42] rounded-md transition-all shadow-sm cursor-pointer active:scale-[0.98]"
                                >
                                  {t('action_verify')}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setFlagRecordId(rec.id)}
                                  className="min-h-[36px] min-w-[36px] flex items-center justify-center p-1.5 text-[#96938B] hover:text-[#EF4444] rounded-md hover:bg-[#ECE5DA] transition-colors cursor-pointer active:scale-[0.98]"
                                  title={t('attendance_modal_flag_title')}
                                >
                                  <Flag className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : rec.verificationStatus === 'flagged' ? (
                              <button
                                type="button"
                                onClick={() => setSelectedRecordToVerify(rec.id)}
                                className="min-h-[36px] px-2.5 py-1 text-xs font-semibold text-[#A77B50] hover:underline cursor-pointer"
                              >
                                {t('action_resolve_verify')}
                              </button>
                            ) : (
                              <span className="text-[11px] text-[#10B981] font-bold flex items-center justify-end gap-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>{t('attendance_signed')}</span>
                              </span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: Biometric Registry Table */}
      {activeView === 'enrollments' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-[#F4F0E8] border border-[#51483D]/25 rounded-xl flex items-center justify-between text-xs shadow-ivory-card">
            <div className="flex items-center gap-2.5 text-[#96938B]">
              <Layers className="w-4 h-4 text-[#A77B50]" />
              <span>
                Biometric Face Templates registered under ISO/IEC 30107-3 PAD compliance. Feature vectors are securely isolated server-side.
              </span>
            </div>
            {(role === 'contractor' || role === 'site_supervisor') && (
              <button
                type="button"
                onClick={() => setIsEnrollModalOpen(true)}
                className="px-3.5 py-2 min-h-[44px] text-xs font-bold text-slate-950 bg-[#A77B50] hover:bg-[#936B42] rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{t('biometric_enroll_worker_btn')}</span>
              </button>
            )}
          </div>

          <div className="bg-[#F4F0E8] border border-[#51483D]/25 rounded-xl overflow-hidden shadow-ivory-card">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#252521] text-[#F4F0E8] border-b border-[#51483D]/25 font-semibold text-xs">
                  <tr>
                    <th className="px-4 py-3">{t('table_worker_name')}</th>
                    <th className="px-3 py-3">{t('field_project_site')}</th>
                    <th className="px-3 py-3">Biometric Status</th>
                    <th className="px-3 py-3">Model Version</th>
                    <th className="px-3 py-3">Consent Audit</th>
                    <th className="px-3 py-3">Enrolled By</th>
                    <th className="px-4 py-3 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#51483D]/15 bg-[#F4F0E8]">
                  {enrollments.map((ew) => (
                    <tr key={ew.workerId} className="hover:bg-[#ECE5DA] transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-[#252521]">{ew.workerName}</div>
                        <div className="text-[11px] text-[#96938B] mt-0.5">
                          <span className="font-mono text-[#A77B50] font-semibold">{ew.workerId}</span> · {t(`trade_${ew.trade}`)}
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-[#96938B] font-mono">{ew.siteId}</td>
                      <td className="px-3 py-3.5">
                        {ew.status === 'incompatible_legacy' || ew.requiresReenrollment ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#A77B50]/20 text-[#A77B50] border border-[#A77B50]/40">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{t('biometric_status_legacy')}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                            <Check className="w-3 h-3" />
                            <span>{t('biometric_status_enrolled')}</span>
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3.5 font-mono text-[#96938B]">{ew.modelVersion}</td>
                      <td className="px-3 py-3.5">
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#10B981] font-semibold">
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>Affidavit Signed</span>
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-[#96938B]">{ew.enrolledBySupervisor}</td>
                      <td className="px-4 py-3.5 text-right">
                        {ew.status === 'incompatible_legacy' || ew.requiresReenrollment ? (
                          (role === 'contractor' || role === 'site_supervisor') && (
                            <button
                              type="button"
                              onClick={() => {
                                setEnrollWorkerId(ew.workerId);
                                setIsEnrollModalOpen(true);
                              }}
                              className="px-3 py-1.5 min-h-[36px] text-xs font-semibold text-slate-950 bg-[#A77B50] hover:bg-[#936B42] rounded-md transition-all cursor-pointer inline-flex items-center gap-1.5 font-bold shadow-xs active:scale-[0.98]"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>{t('biometric_btn_reenroll')}</span>
                            </button>
                          )
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsPunchModalOpen(true)}
                            className="px-3 py-1.5 min-h-[36px] text-xs font-semibold text-[#252521] bg-[#ECE5DA] hover:bg-[#2D333D] rounded-md transition-all border border-[#51483D]/25 cursor-pointer inline-flex items-center gap-1.5 active:scale-[0.98]"
                          >
                            <Camera className="w-3 h-3 text-[#A77B50]" />
                            <span>Punch Kiosk</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Face Attendance Kiosk Modal */}
      <FacePunchModal
        isOpen={isPunchModalOpen}
        onClose={() => setIsPunchModalOpen(false)}
        onPunchSuccess={handlePunchSuccess}
        onRequestManualReview={() => setIsManualModalOpen(true)}
        onRequestReenrollment={(wId) => {
          if (wId) setEnrollWorkerId(wId);
          setIsEnrollModalOpen(true);
        }}
      />

      {/* Face Enrollment Modal */}
      <FaceEnrollmentModal
        isOpen={isEnrollModalOpen}
        onClose={() => {
          setIsEnrollModalOpen(false);
          setEnrollWorkerId(undefined);
        }}
        onEnrollSuccess={handleEnrollSuccess}
        initialWorkerId={enrollWorkerId}
      />

      {/* Biometric Audit Certificate Modal */}
      <BiometricAuditModal
        isOpen={!!selectedAuditPunch}
        onClose={() => setSelectedAuditPunch(null)}
        punch={selectedAuditPunch}
      />

      {/* Verify Single Record Modal */}
      <ConfirmDialog
        isOpen={!!selectedRecordToVerify}
        onClose={() => setSelectedRecordToVerify(null)}
        onConfirm={handleConfirmVerify}
        title={t('attendance_dialog_single_title')}
        description={t('attendance_dialog_single_desc')}
        confirmLabel={t('action_verify')}
      />

      {/* Batch Verify Modal */}
      <ConfirmDialog
        isOpen={batchVerifyOpen}
        onClose={() => setBatchVerifyOpen(false)}
        onConfirm={handleConfirmBatchVerify}
        title={t('attendance_dialog_batch_title')}
        description={t('attendance_dialog_batch_desc', { count: rawPendingCount })}
        confirmLabel={t('action_batch_signoff')}
      />

      {/* Flag Discrepancy Modal */}
      <Modal
        isOpen={!!flagRecordId}
        onClose={() => setFlagRecordId(null)}
        title={t('attendance_modal_flag_title')}
        subtitle={t('attendance_modal_flag_subtitle')}
        footer={
          <>
            <button
              type="button"
              onClick={() => setFlagRecordId(null)}
              className="px-3 py-2 min-h-[44px] text-xs text-[#96938B] hover:text-[#252521] cursor-pointer"
            >
              {t('action_cancel')}
            </button>
            <button
              type="submit"
              form="flag-reason-form"
              className="px-4 py-2 min-h-[44px] text-xs font-semibold text-white bg-[#EF4444] rounded-lg hover:bg-[#DC2626] transition-all cursor-pointer active:scale-[0.98]"
            >
              {t('attendance_modal_flag_btn')}
            </button>
          </>
        }
      >
        <form id="flag-reason-form" onSubmit={handleFlagSubmit} className="space-y-3 text-xs">
          <label className="block font-bold text-[#252521]">{t('attendance_modal_flag_label')}</label>
          <textarea
            required
            rows={3}
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            placeholder={t('attendance_modal_flag_ph')}
            className="w-full p-2.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg text-xs text-[#252521] focus:outline-hidden focus:border-[#A77B50]"
          />
        </form>
      </Modal>

      {/* Manual Attendance Review Modal */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title={t('biometric_manual_modal_title')}
        subtitle={t('biometric_manual_modal_subtitle')}
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsManualModalOpen(false)}
              className="px-3 py-2 min-h-[44px] text-xs text-[#96938B] hover:text-[#252521] cursor-pointer"
            >
              {t('action_cancel')}
            </button>
            <button
              type="submit"
              form="manual-attendance-form"
              disabled={isSubmittingManual}
              className="px-4 py-2 min-h-[44px] text-xs font-bold text-slate-950 bg-[#A77B50] rounded-lg hover:bg-[#936B42] disabled:opacity-50 transition-all cursor-pointer active:scale-[0.98]"
            >
              {isSubmittingManual ? 'Submitting...' : t('action_submit')}
            </button>
          </>
        }
      >
        <form id="manual-attendance-form" onSubmit={handleManualRequestSubmit} className="space-y-4 text-xs">
          {manualSuccessMsg && (
            <div className="p-3 bg-[#10B981]/15 border border-[#10B981]/40 rounded-xl text-[#10B981] font-semibold text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{manualSuccessMsg}</span>
            </div>
          )}

          {/* Worker Selector */}
          <div>
            <label className="block font-semibold text-[#96938B] mb-1">
              {t('field_select_worker')}
            </label>
            <select
              value={manualWorkerId}
              onChange={(e) => setManualWorkerId(e.target.value)}
              disabled={role === 'worker'}
              className="w-full p-2.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg text-xs text-[#252521] focus:outline-hidden focus:border-[#A77B50]"
            >
              {workers.map((w) => (
                <option key={w.workerId} value={w.workerId}>
                  {w.fullName} ({w.workerId}) — {w.trade}
                </option>
              ))}
            </select>
          </div>

          {/* Project Site Selector */}
          <div>
            <label className="block font-semibold text-[#96938B] mb-1">
              Site / Project
            </label>
            <select
              value={manualSiteId}
              onChange={(e) => setManualSiteId(e.target.value)}
              className="w-full p-2.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg text-xs text-[#252521] focus:outline-hidden focus:border-[#A77B50]"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Punch Type Selector */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#96938B] mb-1">
                {t('field_punch_type')}
              </label>
              <select
                value={manualPunchType}
                onChange={(e) => setManualPunchType(e.target.value as 'CHECK_IN' | 'CHECK_OUT')}
                className="w-full p-2.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg text-xs text-[#252521] focus:outline-hidden focus:border-[#A77B50]"
              >
                <option value="CHECK_IN">{t('action_punch_check_in')}</option>
                <option value="CHECK_OUT">{t('action_punch_check_out')}</option>
              </select>
            </div>

            {/* Standard Reason Options */}
            <div>
              <label className="block font-semibold text-[#96938B] mb-1">
                Exception Reason
              </label>
              <select
                value={manualReason}
                onChange={(e) => setManualReason(e.target.value)}
                className="w-full p-2.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg text-xs text-[#252521] focus:outline-hidden focus:border-[#A77B50]"
              >
                <option value="Camera hardware unavailable or permission denied">
                  {t('biometric_manual_reason_camera')}
                </option>
                <option value="Poor site lighting or severe glare">
                  {t('biometric_manual_reason_lighting')}
                </option>
                <option value="Facial injury, protective bandage, or medical mask">
                  {t('biometric_manual_reason_injury')}
                </option>
                <option value="Face match confidence threshold failure">
                  {t('biometric_manual_reason_mismatch')}
                </option>
              </select>
            </div>
          </div>

          {/* Granular Notes */}
          <div>
            <label className="block font-semibold text-[#96938B] mb-1">
              Supervisor Notes / Verification Evidence
            </label>
            <textarea
              rows={2}
              value={manualNotes}
              onChange={(e) => setManualNotes(e.target.value)}
              placeholder="e.g. Worker physically present at Pier 24 cap formwork; camera blocked by sun visor."
              className="w-full p-2.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg text-xs text-[#252521] focus:outline-hidden focus:border-[#A77B50]"
            />
          </div>

          <p className="text-[11px] text-[#96938B] leading-relaxed">
            * Submissions create a <strong>flagged</strong> attendance session requiring explicit supervisor sign-off before wage disbursement.
          </p>
        </form>
      </Modal>

      {/* Offline Queue Modal */}
      {isOfflineQueueModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsOfflineQueueModalOpen(false)}
          title="Offline Attendance Device Queue"
          subtitle={`${pendingOfflineCount} punches pending synchronization with authoritative server`}
          maxWidth="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-[#96938B]">
                Punches are cryptographically timestamped and stored in local IndexedDB/localStorage.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsOfflineQueueModalOpen(false)}
                  className="px-3 py-2 min-h-[44px] text-xs text-[#96938B] hover:text-[#252521] cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSyncAllOffline}
                  disabled={isSyncingOfflineQueue || pendingOfflineCount === 0}
                  className="px-4 py-2 min-h-[44px] text-xs font-bold text-slate-950 bg-[#A77B50] hover:bg-[#936B42] rounded-lg shadow-sm disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingOfflineQueue ? 'animate-spin' : ''}`} />
                  <span>Sync All Records</span>
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-3 text-xs max-h-96 overflow-y-auto pr-1">
            {offlineQueue.length === 0 ? (
              <div className="p-8 text-center text-[#96938B]">
                <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <span>No cached offline punches. Queue is empty.</span>
              </div>
            ) : (
              offlineQueue.map((punch) => {
                const dateStr = new Date(punch.capturedAt).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'medium',
                });
                return (
                  <div
                    key={punch.id}
                    className="p-3 bg-[#F4F0E8] border border-[#51483D]/25 rounded-xl flex items-center justify-between gap-3 shadow-ivory-card"
                  >
                    <div className="flex items-center gap-3">
                      {/* Photo Thumbnail */}
                      <div className="w-12 h-12 rounded-lg bg-[#ECE5DA] border border-[#51483D]/25 overflow-hidden shrink-0">
                        {punch.capturedFrameBase64 ? (
                          <img
                            src={punch.capturedFrameBase64}
                            alt="Capture"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#96938B]">
                            <Camera className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="font-bold text-[#252521] flex items-center gap-2">
                          <span>{punch.workerName || 'Worker'}</span>
                          <span className="font-mono text-[10px] text-[#A77B50] bg-[#ECE5DA] px-1.5 py-0.5 rounded border border-[#51483D]/25">
                            {punch.workerId || 'UNASSIGNED'}
                          </span>
                          <span
                            className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                              punch.punchType === 'CHECK_IN'
                                ? 'bg-[#10B981]/20 text-[#10B981]'
                                : 'bg-[#A77B50]/20 text-[#A77B50]'
                            }`}
                          >
                            {punch.punchType}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#96938B] mt-0.5 flex items-center gap-2">
                          <span>{punch.siteName}</span>
                          <span>·</span>
                          <span className="tabular-nums font-mono text-[#252521]">{dateStr}</span>
                        </div>
                        {punch.lastError && (
                          <div className="text-[10px] text-[#EF4444] mt-0.5">
                            Last error: {punch.lastError}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          punch.status === 'syncing'
                            ? 'bg-[#A77B50]/20 text-[#A77B50]'
                            : punch.status === 'failed'
                            ? 'bg-[#EF4444]/20 text-[#EF4444]'
                            : 'bg-[#10B981]/20 text-[#10B981]'
                        }`}
                      >
                        {punch.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSyncSingleOffline(punch)}
                        title="Sync this punch"
                        className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg bg-[#ECE5DA] hover:bg-[#2D333D] border border-[#51483D]/25 text-[#252521] cursor-pointer transition-all active:scale-[0.98]"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteOfflinePunch(punch.id)}
                        title="Delete from device"
                        className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg bg-[#EF4444]/15 hover:bg-[#EF4444]/25 border border-[#EF4444]/30 text-[#EF4444] cursor-pointer transition-all active:scale-[0.98]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Modal>
      )}

      {/* 2G Button Phone Simulator Modal */}
      <ButtonPhonePunchModal
        isOpen={isButtonPhoneModalOpen}
        onClose={() => setIsButtonPhoneModalOpen(false)}
        onPunchSuccess={handlePunchSuccess}
      />
    </div>
  );
};
