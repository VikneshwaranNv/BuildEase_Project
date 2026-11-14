import React from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  CheckCircle,
  Clock,
  Layers,
  Cpu,
  Fingerprint,
  AlertCircle,
  FileCheck2,
  MapPin,
} from 'lucide-react';
import { AttendancePunch } from '../../types/biometrics';

interface BiometricAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  punch: AttendancePunch | null;
}

export const BiometricAuditModal: React.FC<BiometricAuditModalProps> = ({
  isOpen,
  onClose,
  punch,
}) => {
  const { t } = useApp();

  if (!punch) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('biometric_audit_modal_title')}
      subtitle={t('biometric_audit_modal_subtitle')}
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-[11px] text-[#96938B] flex items-center gap-1.5 font-mono">
            <span>ID: {punch.id}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 text-xs font-bold text-slate-950 bg-[#A77B50] hover:bg-[#936B42] rounded-lg transition-all cursor-pointer active:scale-[0.98]"
          >
            {t('action_close')}
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Certificate Header Banner */}
        <div className="p-3.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#252521] flex items-center gap-2">
                <span>{punch.workerName}</span>
                <span className="font-mono text-[#A77B50] text-xs">({punch.workerId})</span>
              </div>
              <div className="text-[11px] text-[#96938B] mt-0.5">
                {punch.siteName} · <span className="font-bold text-[#10B981]">{punch.punchType}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{t('biometric_verified_badge')}</span>
            </span>
          </div>
        </div>

        {/* Biometrics 2x2 Scores Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Facial Vector Matching Card */}
          <div className="p-3.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-[#252521]">
                <Fingerprint className="w-4 h-4 text-[#A77B50]" />
                <span>{t('biometric_audit_face_match')}</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#10B981]">
                {(punch.faceMatch.matchConfidence * 100).toFixed(1)}%
              </span>
            </div>

            <div className="w-full bg-[#ECE5DA] h-2 rounded-full overflow-hidden border border-[#51483D]/25">
              <div
                className="bg-[#10B981] h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, punch.faceMatch.matchConfidence * 100)}%` }}
              />
            </div>

            <div className="text-[11px] text-[#96938B] flex justify-between">
              <span>{t('biometric_threshold')}: {punch.faceMatch.threshold.toFixed(3)}</span>
              <span>{t('biometric_distance_metric')}: {punch.faceMatch.distanceMetric}</span>
            </div>
          </div>

          {/* Presentation Attack Detection (PAD) Card */}
          <div className="p-3.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-[#252521]">
                <Cpu className="w-4 h-4 text-[#10B981]" />
                <span>{t('biometric_audit_pad_liveness')}</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#10B981]">
                {(punch.liveness.livenessScore * 100).toFixed(1)}%
              </span>
            </div>

            <div className="w-full bg-[#ECE5DA] h-2 rounded-full overflow-hidden border border-[#51483D]/25">
              <div
                className="bg-[#10B981] h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, punch.liveness.livenessScore * 100)}%` }}
              />
            </div>

            <div className="text-[11px] text-[#96938B] flex justify-between">
              <span>PAD: Level 1 Baseline (Limited)</span>
              <span>Replay: Clean</span>
            </div>
          </div>
        </div>

        {/* Timestamps & Authority */}
        <div className="p-3.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-xl space-y-2">
          <div className="font-bold text-[#252521] flex items-center gap-2 text-xs">
            <Clock className="w-3.5 h-3.5 text-[#A77B50]" />
            <span>{t('biometric_audit_time_authority_title')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 bg-[#ECE5DA] rounded-lg border border-[#51483D]/25">
              <div className="text-[#96938B] mb-0.5">{t('biometric_server_utc')}</div>
              <div className="font-mono text-[#252521] font-semibold">{punch.serverUtcTimestamp}</div>
            </div>

            <div className="p-2.5 bg-[#ECE5DA] rounded-lg border border-[#51483D]/25">
              <div className="text-[#96938B] mb-0.5">{t('biometric_site_local_time')}</div>
              <div className="font-mono text-[#252521] font-semibold">{punch.siteLocalDisplayTime}</div>
            </div>
          </div>
        </div>

        {/* GPS Geofence Perimeter Audit Card */}
        {punch.geoFence && (
          <div className="p-3.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-xl space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="font-bold text-[#252521] flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#A77B50]" />
                <span>{t('biometric_geofence_audit_title')}</span>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  punch.geoFence.status === 'verified_on_site'
                    ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40'
                    : punch.geoFence.status === 'outside_geofence'
                    ? 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40'
                    : 'bg-[#ECE5DA] text-[#96938B] border-[#51483D]/25'
                }`}
              >
                {punch.geoFence.status === 'verified_on_site' ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                <span>
                  {punch.geoFence.status === 'verified_on_site'
                    ? t('biometric_geofence_verified')
                    : punch.geoFence.status === 'outside_geofence'
                    ? t('biometric_geofence_breach')
                    : t('biometric_geofence_unavailable')}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2.5 bg-[#ECE5DA] rounded-lg border border-[#51483D]/25">
                <div className="text-[#96938B] mb-0.5">{t('biometric_geofence_distance')}</div>
                <div className="font-mono text-[#252521] font-bold">
                  {punch.geoFence.distanceMeters >= 0 ? `${punch.geoFence.distanceMeters} meters` : 'N/A'}
                </div>
              </div>

              <div className="p-2.5 bg-[#ECE5DA] rounded-lg border border-[#51483D]/25">
                <div className="text-[#96938B] mb-0.5">{t('biometric_geofence_perimeter')}</div>
                <div className="font-mono text-[#10B981] font-bold">
                  {punch.geoFence.allowedRadiusMeters} meters
                </div>
              </div>

              <div className="p-2.5 bg-[#ECE5DA] rounded-lg border border-[#51483D]/25">
                <div className="text-[#96938B] mb-0.5">Site Coordinates</div>
                <div className="font-mono text-[#96938B] text-[10px] font-semibold">
                  {punch.geoFence.siteCoordinates.latitude.toFixed(4)}° N, {punch.geoFence.siteCoordinates.longitude.toFixed(4)}° E
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#96938B] bg-[#ECE5DA] p-2.5 rounded-lg border border-[#51483D]/25 leading-relaxed">
              <strong className="text-[#252521]">Perimeter Telemetry: </strong>
              {punch.geoFence.details}
            </div>
          </div>
        )}

        {/* Verification Specifications & Anti-Spoof Audit Details */}
        <div className="p-3.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-xl space-y-2 text-[11px]">
          <div className="font-bold text-[#252521] flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-[#A77B50]" />
            <span>{t('biometric_audit_specifications_title')}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[#96938B]">
            <div>
              <span className="text-[#96938B] block">{t('biometric_model_version')}</span>
              <span className="font-semibold text-[#252521]">{punch.modelVersion}</span>
            </div>
            <div>
              <span className="text-[#96938B] block">{t('biometric_resolution')}</span>
              <span className="font-semibold text-[#252521]">{punch.auditMetadata.captureResolution}</span>
            </div>
            <div>
              <span className="text-[#96938B] block">{t('biometric_lighting')}</span>
              <span className="font-semibold text-[#10B981] uppercase">{punch.auditMetadata.lightingCondition}</span>
            </div>
            <div>
              <span className="text-[#96938B] block">{t('biometric_terminal_hash')}</span>
              <span className="font-mono text-[#A77B50]">{punch.auditMetadata.ipHash}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#51483D]/25 text-[#96938B] leading-relaxed">
            <strong className="text-[#252521]">{t('biometric_audit_pad_eval_label')}: </strong>
            {punch.liveness.details}
          </div>
        </div>

        {/* Supervisor Chain of Custody Notice */}
        <div className="p-3.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-xl flex items-start gap-2.5 text-[11px] text-[#96938B]">
          <FileCheck2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#252521]">{t('biometric_chain_custody_title')}: </strong>
            {t('biometric_chain_custody_desc')}
          </div>
        </div>
      </div>
    </Modal>
  );
};
