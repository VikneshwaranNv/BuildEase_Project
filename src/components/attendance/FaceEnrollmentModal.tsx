import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import {
  Camera,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  FileCheck2,
  UserCheck,
} from 'lucide-react';
import { BiometricsService } from '../../services/biometricsService';
import { WorkerFaceEnrollment } from '../../types/biometrics';

interface FaceEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnrollSuccess: (enrollment: WorkerFaceEnrollment) => void;
  initialWorkerId?: string;
}

export const FaceEnrollmentModal: React.FC<FaceEnrollmentModalProps> = ({
  isOpen,
  onClose,
  onEnrollSuccess,
  initialWorkerId,
}) => {
  const { t, workers, projects, role } = useApp();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(initialWorkerId || workers[0]?.workerId || '');
  const [selectedSiteId, setSelectedSiteId] = useState<string>(projects[0]?.id || 'proj-1');
  const [consentSigned, setConsentSigned] = useState<boolean>(true);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<WorkerFaceEnrollment | null>(null);

  useEffect(() => {
    if (initialWorkerId) {
      setSelectedWorkerId(initialWorkerId);
    }
  }, [initialWorkerId, isOpen]);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access API not supported in this browser environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((e) => console.warn('Video play error:', e));
      }
      setCameraActive(true);
    } catch (err: any) {
      setCameraActive(false);
      setCameraError(t('biometric_camera_device_unavailable'));
    }
  }, [t]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      startCamera();
      setSuccessResult(null);
      setErrorMessage(null);
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, startCamera, stopCamera]);

  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', 0.90);
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!consentSigned) {
      setErrorMessage(t('biometric_consent_required_error'));
      return;
    }

    const worker = workers.find((w) => w.workerId === selectedWorkerId);
    if (!worker) {
      setErrorMessage(t('biometric_worker_not_found'));
      return;
    }

    setIsSubmitting(true);
    try {
      const frameBase64 = captureFrame();
      if (!frameBase64) {
        throw new Error(t('biometric_error_frame_capture'));
      }

      const res = await BiometricsService.enrollWorkerFace(
        {
          workerId: worker.workerId,
          workerName: worker.fullName,
          trade: worker.trade,
          siteId: selectedSiteId,
          capturedFrameBase64: frameBase64,
          consentSigned: true,
          supervisorName: role === 'contractor' ? 'Contractor Admin' : 'Aniket Patil (Site Supervisor)',
        },
        {
          role: role === 'contractor' ? 'contractor' : 'site_supervisor',
          siteId: selectedSiteId,
          userId: role === 'contractor' ? 'ADMIN-01' : 'SUP-PATIL-01',
          userName: role === 'contractor' ? 'Contractor Admin' : 'Aniket Patil',
        }
      );

      if (!res.success || !res.enrollment) {
        throw new Error(res.error || t('biometric_enrollment_failed'));
      }

      setSuccessResult(res.enrollment);
      onEnrollSuccess(res.enrollment);
    } catch (err: any) {
      setErrorMessage(err.message || t('biometric_error_generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('biometric_enroll_title')}
      subtitle={t('biometric_enroll_subtitle')}
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-[11px] text-[#96938B] flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-[#10B981]" />
            <span>{t('biometric_consent_audit_logged')}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-3.5 py-2 text-xs text-[#96938B] hover:text-[#252521] rounded-lg hover:bg-[#ECE5DA] transition-colors cursor-pointer"
            >
              {t('action_cancel')}
            </button>
            {!successResult && (
              <button
                type="submit"
                form="enrollment-form"
                disabled={isSubmitting || !cameraActive || !consentSigned}
                className="min-h-[44px] px-5 py-2 text-xs font-bold text-slate-950 bg-[#A77B50] hover:bg-[#936B42] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{t('biometric_registering_template')}</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{t('biometric_btn_register_face')}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      }
    >
      <form id="enrollment-form" onSubmit={handleEnrollSubmit} className="space-y-4">
        {/* Worker & Site Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#96938B] mb-1">
              {t('field_select_worker')}
            </label>
            <select
              value={selectedWorkerId}
              onChange={(e) => setSelectedWorkerId(e.target.value)}
              className="w-full p-2.5 min-h-[44px] bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg text-xs text-[#252521] font-medium focus:outline-hidden focus:border-[#A77B50]"
            >
              {workers.map((w) => (
                <option key={w.workerId} value={w.workerId}>
                  {w.workerId} - {w.fullName} ({t(`trade_${w.trade}`)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#96938B] mb-1">
              {t('field_project_site')}
            </label>
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="w-full p-2.5 min-h-[44px] bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg text-xs text-[#252521] font-medium focus:outline-hidden focus:border-[#A77B50]"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Camera capture viewfinder */}
        <div className="relative bg-[#090E17] rounded-xl overflow-hidden border border-[#51483D]/25 min-h-[260px] flex items-center justify-center">
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className={`w-full h-[260px] object-cover ${cameraActive ? 'block' : 'hidden'}`}
          />
          <canvas ref={canvasRef} className="hidden" />

          {!cameraActive && (
            <div className="p-6 text-center space-y-2">
              <Camera className="w-10 h-10 text-[#77869D] mx-auto animate-pulse" />
              <div className="text-xs text-[#77869D]">
                {cameraError || t('biometric_camera_initializing')}
              </div>
            </div>
          )}

          {cameraActive && !successResult && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-44 h-56 border-2 border-dashed border-[#66B98A]/80 rounded-[50%] flex items-center justify-center">
                <div className="text-[10px] text-[#66B98A] bg-[#111B2D]/80 px-2 py-0.5 rounded-sm uppercase tracking-wider font-mono">
                  {t('biometric_align_face_guide')}
                </div>
              </div>
            </div>
          )}

          {/* Success card overlay */}
          {successResult && (
            <div className="absolute inset-0 bg-[#111B2D]/95 backdrop-blur-md p-6 flex flex-col justify-center items-center text-center space-y-3 z-20">
              <div className="w-12 h-12 rounded-full bg-[#66B98A]/20 border border-[#66B98A] flex items-center justify-center text-[#66B98A]">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-[#252521]">{t('biometric_enrolled_success_title')}</div>
                <div className="text-xs text-[#66B98A] font-semibold">
                  {successResult.workerName} ({successResult.workerId})
                </div>
              </div>
              <div className="text-[11px] text-[#77869D] max-w-sm">
                {t('biometric_enrolled_success_desc')}
              </div>
              <div className="text-[10px] text-[#A1AEC2] font-mono bg-[#151F32] px-3 py-1.5 rounded-lg border border-[#51483D]/25">
                Model: {successResult.modelVersion} · UTC: {successResult.enrolledAt}
              </div>
            </div>
          )}
        </div>

        {/* Worker Consent Checkbox (Strict Legal Requirement) */}
        <div className="p-3 bg-[#151F32] border border-[#51483D]/25 rounded-xl flex items-start gap-3">
          <input
            type="checkbox"
            id="worker-consent-cb"
            checked={consentSigned}
            onChange={(e) => setConsentSigned(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded-sm border-[#51483D]/25 text-[#5279D8] focus:ring-[#5279D8]"
          />
          <label htmlFor="worker-consent-cb" className="text-xs text-[#A1AEC2] leading-relaxed cursor-pointer">
            <strong className="text-[#252521] block font-bold">{t('biometric_consent_label_title')}</strong>
            {t('biometric_consent_label_body')}
          </label>
        </div>

        {/* Error notice */}
        {errorMessage && (
          <div className="p-3.5 bg-[#E17676]/15 border border-[#E17676]/40 rounded-xl flex items-start gap-2.5 text-xs text-[#E17676]">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              {errorMessage.includes('DUPLICATE_FACE_ENROLLMENT') ? (
                <>
                  <strong className="block font-bold text-[#252521] mb-1">
                    {t('biometric_error_duplicate_title')}
                  </strong>
                  <span className="leading-relaxed">
                    {errorMessage.replace(/^DUPLICATE_FACE_ENROLLMENT:\s*/, '')}
                  </span>
                </>
              ) : (
                errorMessage
              )}
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
