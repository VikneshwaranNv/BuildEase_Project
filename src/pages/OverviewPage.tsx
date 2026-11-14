import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { SummaryMetricStrip, MetricItem } from '../components/common/SummaryMetricStrip';
import { StatusBadge } from '../components/common/StatusBadge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Interactive3DCard } from '../components/common/Interactive3DCard';
import { SiteVisualizer3D } from '../components/common/SiteVisualizer3D';
import {
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Building2,
  HardHat,
  Sun,
  Activity,
  AlertTriangle,
  Radio,
  Clock,
  Layers,
  Wrench,
  Camera,
  Compass,
  PhoneCall,
  Check,
  Flame,
  Zap,
} from 'lucide-react';
import {
  localizeUnit,
  localizeSite,
  localizeSiteFull,
  localizeLocation,
  localizeTaskTitle,
  localizeAlertMessage,
  localizeSeverity,
} from '../i18n/localize';

export const OverviewPage: React.FC = () => {
  const {
    role,
    t,
    projects,
    attendanceRecords,
    tasks,
    alerts,
    setActiveNav,
    verifyAttendanceRecord,
    verifyAllPendingAttendance,
  } = useApp();

  const [verifyAllDialogOpen, setVerifyAllDialogOpen] = useState(false);
  const [selectedRecordToVerify, setSelectedRecordToVerify] = useState<string | null>(null);
  const [activeTrendingId, setActiveTrendingId] = useState<string>('geo');
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // Compute key metrics based on role
  const pendingAttendance = attendanceRecords.filter((r) => r.verificationStatus === 'raw_checkin');
  const activeProjects = projects.filter((p) => p.status === 'active');
  const totalWorkersDeployed = projects.reduce((sum, p) => sum + (p.status === 'active' ? p.workforceCount : 0), 0);

  // Role: Contractor metrics
  const contractorMetrics: MetricItem[] = [
    {
      id: 'active_sites',
      label: t('metric_active_sites'),
      value: activeProjects.length,
      subtext: t('overview_sub_active_sites', { count: projects.length }),
    },
    {
      id: 'workforce_deployed',
      label: t('metric_workforce_deployed'),
      value: totalWorkersDeployed,
      subtext: t('overview_sub_deployed_zones'),
    },
    {
      id: 'pending_verification',
      label: t('metric_pending_verification'),
      value: pendingAttendance.length,
      badge:
        pendingAttendance.length > 0
          ? { text: t('overview_badge_action_req'), type: 'warning' }
          : { text: t('overview_badge_up_to_date'), type: 'success' },
      subtext: t('overview_sub_awaiting_muster'),
    },
    {
      id: 'active_tasks',
      label: t('metric_tasks_in_progress'),
      value: tasks.filter((tsk) => tsk.status !== 'completed').length,
      badge: { text: t('overview_badge_on_track'), type: 'neutral' },
      subtext: t('overview_sub_trade_scopes'),
    },
  ];

  // Role: Site Supervisor metrics
  const supervisorMetrics: MetricItem[] = [
    {
      id: 'sup_pending_att',
      label: t('metric_pending_verification'),
      value: pendingAttendance.length,
      badge: pendingAttendance.length > 0 ? { text: t('overview_badge_signoff_req'), type: 'warning' } : undefined,
      subtext: t('overview_sub_morning_badges'),
    },
    {
      id: 'sup_active_tasks',
      label: t('metric_tasks_in_progress'),
      value: tasks.filter((tsk) => tsk.status === 'in_progress').length,
      subtext: t('overview_sub_trade_scopes'),
    },
    {
      id: 'sup_workforce_today',
      label: t('metric_workforce_deployed'),
      value: 142,
      subtext: t('overview_sub_pier_deployment'),
    },
    {
      id: 'sup_safety_compliance',
      label: t('metric_safety_permits'),
      value: '100%',
      badge: { text: t('overview_badge_compliant'), type: 'success' },
      subtext: t('overview_sub_permits_verified'),
    },
  ];

  // Role: Project Manager metrics
  const pmMetrics: MetricItem[] = [
    {
      id: 'pm_sites',
      label: t('metric_active_sites'),
      value: 2,
      subtext: t('overview_sub_assigned_direct'),
    },
    {
      id: 'pm_progress',
      label: t('metric_project_progress'),
      value: '68%',
      subtext: t('overview_sub_metro_on_schedule'),
    },
    {
      id: 'pm_tasks',
      label: t('metric_tasks_in_progress'),
      value: tasks.filter((tsk) => tsk.status !== 'completed').length,
      subtext: t('overview_sub_active_milestones'),
    },
    {
      id: 'pm_compliance',
      label: t('metric_safety_permits'),
      value: '100%',
      badge: { text: t('overview_badge_compliant'), type: 'success' },
      subtext: t('overview_sub_permits_verified'),
    },
  ];

  // Role: Worker metrics
  const workerMetrics: MetricItem[] = [
    {
      id: 'w_days',
      label: t('metric_my_days_worked'),
      value: 12,
      subtext: t('overview_sub_days_worked'),
    },
    {
      id: 'w_hours',
      label: t('metric_my_verified_hours'),
      value: `96.5 ${localizeUnit('hrs', t)}`,
      subtext: t('overview_sub_overtime_included'),
    },
    {
      id: 'w_rate',
      label: t('table_wage_rate'),
      value: '₹850',
      subtext: t('overview_sub_daily_base'),
    },
    {
      id: 'w_status',
      label: t('metric_biometric_badge'),
      value: t('badge_verified'),
      badge: { text: t('overview_badge_enrolled'), type: 'success' },
      subtext: t('overview_sub_face_id_active'),
    },
  ];

  const currentMetrics =
    role === 'contractor'
      ? contractorMetrics
      : role === 'site_supervisor'
      ? supervisorMetrics
      : role === 'project_manager'
      ? pmMetrics
      : workerMetrics;

  const TRENDING_OPERATIONS = [
    {
      id: 'struct',
      title: 'Structural Pier Engineering',
      desc: 'Precision load tests & rebar cage binding for Pier 28–30 viaduct.',
      status: 'Active',
      allocatedCrew: '48 Masons',
      badge: '🔥 Critical Path',
      icon: Layers,
    },
    {
      id: 'geo',
      title: 'Geotechnical Soil Core Survey',
      desc: 'Foundation strata density verification and moisture core analysis.',
      status: 'Active',
      allocatedCrew: '18 Surveyors',
      badge: '⚡ Live Telemetry',
      icon: Compass,
    },
    {
      id: 'concrete',
      title: 'M40 Concrete Pouring & Thermal Curing',
      desc: 'Pier cap concrete placement with real-time temperature sensor probes.',
      status: 'In Progress',
      allocatedCrew: '36 Workers',
      badge: '⏱️ Scheduled 04:00 PM',
      icon: Wrench,
    },
    {
      id: 'drone',
      title: '3D Drone Boundary Photogrammetry',
      desc: 'High-precision spatial point cloud scan matching geofence coordinates.',
      status: 'Ready',
      allocatedCrew: '2 Drone Pilots',
      badge: '✨ LiDAR Ready',
      icon: Camera,
    },
  ];

  const handleTriggerAction = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionSuccessToast(`Operational Order Dispatched: ${title}`);
    setTimeout(() => setActionSuccessToast(null), 3500);
  };

  return (
    <div className="space-y-7 pb-16 font-sans">
      {/* 1. Page Header */}
      <PageHeader
        title={t('nav_overview')}
        subtitle={t('overview_title')}
        tag={`BuildEase Spatial Engine // ${t(`role_${role}`)}`}
        primaryAction={
          role === 'contractor' || role === 'site_supervisor'
            ? {
                label: t('overview_cta_verify'),
                icon: <CheckCircle2 className="w-4 h-4 text-[#F4F0E8]" />,
                disabled: pendingAttendance.length === 0,
                onClick: () => setVerifyAllDialogOpen(true),
              }
            : role === 'worker'
            ? {
                label: t('overview_cta_wage_slip'),
                icon: <ArrowRight className="w-4 h-4 text-[#F4F0E8]" />,
                onClick: () => setActiveNav('payroll'),
              }
            : {
                label: t('overview_cta_tasks'),
                icon: <ChevronRight className="w-4 h-4 text-[#F4F0E8]" />,
                onClick: () => setActiveNav('tasks'),
              }
        }
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {actionSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 px-5 py-3 rounded-2xl bg-[#252521] border border-[#A77B50] text-[#F4F0E8] font-bold text-xs shadow-2xl flex items-center gap-2.5"
          >
            <Check className="w-4 h-4 text-[#A77B50]" />
            <span>{actionSuccessToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Deep Charcoal Master Command Center Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#252521] text-[#F4F0E8] border border-[#51483D]/40 shadow-charcoal-card p-6 sm:p-9">
        {/* Subtle Architectural Texture Overlay */}
        <div className="absolute inset-0 bg-blueprint-grid opacity-10 pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-5">
            {/* Antique Bronze 3D Graphic Shield */}
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#B88A5B] to-[#8E653C] rounded-2xl flex items-center justify-center shadow-[0_8px_25px_-2px_rgba(167,123,80,0.5)] border border-[#F4F0E8]/30"
            >
              <HardHat className="w-9 h-9 text-[#F4F0E8]" />
            </motion.div>

            {/* Headline and Telemetry Badges */}
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#A77B50]/20 text-[#A77B50] border border-[#A77B50]/40 tracking-wider flex items-center gap-1.5">
                  <Radio className="w-3 h-3 animate-pulse" />
                  Live Gate Terminal
                </span>
                <span className="text-[11px] font-semibold text-[#96938B] flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-[#A77B50]" />
                  32°C High Heat Index Alert
                </span>
                <span className="text-[11px] font-semibold text-[#15803D] bg-[#15803D]/15 px-2 py-0.5 rounded-full border border-[#15803D]/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  GPS Geofence: 4 Sites Active
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#F4F0E8]">
                Metro Elevated Flyover & Commercial Operations Hub
              </h2>

              <p className="text-xs sm:text-[13px] text-[#96938B] leading-relaxed font-semibold">
                Biometric edge scanner active at Pier 28. Shift muster roll verification running in real time across{' '}
                <strong className="text-[#F4F0E8]">264 active laborers</strong>, 100% geofenced presence, and automated wage ledger reconciliation.
              </p>
            </div>
          </div>

          {/* Quick Action Triggers */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 self-stretch sm:self-auto">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => setActiveNav('attendance')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#A77B50] to-[#8E653C] text-[#F4F0E8] font-black text-xs tracking-wider uppercase shadow-[0_6px_20px_-2px_rgba(167,123,80,0.45)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>Biometric Face Punch</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => setActiveNav('projects')}
              className="px-6 py-2.5 rounded-2xl bg-[#51483D]/60 hover:bg-[#51483D] text-[#F4F0E8] border border-[#51483D] font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-[#A77B50]" />
              <span>View All 4 Projects</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* 3. Interactive 3D Job-Site Hologram Visualizer */}
      <SiteVisualizer3D />

      {/* 4. KPI Metric Strip in Soft Ivory */}
      <SummaryMetricStrip metrics={currentMetrics} />

      {/* 5. 3D Trending Site Operations Cards */}
      <div className="bg-[#F4F0E8] rounded-3xl p-6 sm:p-8 border border-[#51483D]/20 shadow-ivory-card space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-[#51483D]/15">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-black text-[#252521] tracking-tight">
                High-Precision Trade Operations
              </h2>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#A77B50]/20 text-[#A77B50] border border-[#A77B50]/40">
                Interactive 3D Cards
              </span>
            </div>
            <p className="text-xs font-semibold text-[#51483D] mt-0.5">
              Move cursor over any operational unit for 3D specular depth & one-click crew allocation
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveNav('tasks')}
            className="text-xs font-black text-[#A77B50] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Tasks</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* The 3D Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {TRENDING_OPERATIONS.map((op) => {
            const Icon = op.icon;
            return (
              <Interactive3DCard
                key={op.id}
                depth={18}
                onClick={() => setActiveNav('tasks')}
                className="bg-[#ECE5DA] hover:bg-[#E4DBCF] border border-[#51483D]/25 rounded-2xl p-5 cursor-pointer shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#252521] text-[#A77B50] flex items-center justify-center shrink-0 shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-sm text-[#252521]">
                          {op.title}
                        </h3>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#51483D] text-[#F4F0E8]">
                          {op.status}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-[#51483D] line-clamp-2">
                        {op.desc}
                      </p>

                      <div className="pt-2 flex items-center gap-3 text-[11px] font-bold text-[#96938B]">
                        <span>Crew: <strong className="text-[#252521]">{op.allocatedCrew}</strong></span>
                        <span>·</span>
                        <span className="text-[#A77B50]">{op.badge}</span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleTriggerAction(op.title, e)}
                    className="p-2 rounded-xl bg-[#252521] text-[#A77B50] hover:bg-[#A77B50] hover:text-[#F4F0E8] transition-colors shadow-sm shrink-0"
                    title="Dispatch Crew Order"
                  >
                    <Zap className="w-4 h-4" />
                  </motion.button>
                </div>
              </Interactive3DCard>
            );
          })}
        </div>
      </div>

      {/* 6. Operational Sections depending on Role */}
      {role === 'worker' ? (
        /* WORKER FOCUSED HUB */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-[#F4F0E8] border border-[#51483D]/20 rounded-3xl p-6 shadow-ivory-card space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#51483D]/15">
              <h2 className="text-sm font-black text-[#252521]">{t('overview_shift_status_title')}</h2>
              <StatusBadge status="supervisor_verified" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#51483D]/10">
                <span className="text-[#51483D] font-semibold">{t('overview_assigned_site')}</span>
                <span className="font-black text-[#252521]">{localizeSiteFull('proj-1', t)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#51483D]/10">
                <span className="text-[#51483D] font-semibold">{t('overview_checkin_time')}</span>
                <span className="font-black text-[#252521] tabular-nums">07:54 AM</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#51483D]/10">
                <span className="text-[#51483D] font-semibold">{t('overview_checkout_time')}</span>
                <span className="font-black text-[#252521] tabular-nums">05:06 PM</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#51483D] font-semibold">{t('overview_supervisor_signoff')}</span>
                <span className="font-black text-[#15803D]">{t('overview_verified_label')}</span>
              </div>
            </div>

            <div className="p-4 bg-[#ECE5DA] border border-[#51483D]/20 rounded-2xl text-xs text-[#51483D] font-semibold flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                {t('overview_shift_credited_note')}
              </span>
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#F4F0E8] border border-[#51483D]/20 rounded-3xl p-6 shadow-ivory-card space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#51483D]/15">
              <h2 className="text-sm font-black text-[#252521]">{t('overview_work_scope_today')}</h2>
              <button
                type="button"
                onClick={() => setActiveNav('tasks')}
                className="text-xs font-black text-[#A77B50] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{t('action_view_all_tasks')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {tasks.slice(0, 3).map((tsk) => (
                <div
                  key={tsk.id}
                  className="p-4 border border-[#51483D]/20 rounded-2xl bg-[#ECE5DA] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-xs font-black text-[#252521]">{localizeTaskTitle(tsk.id, tsk.title, t)}</div>
                    <div className="text-xs text-[#51483D] mt-1 font-semibold">
                      {t('tasks_target')}: <span className="font-black text-[#252521] tabular-nums">{tsk.targetQuantity} {localizeUnit(tsk.unit, t)}</span> · {t('tasks_completed')}:{' '}
                      <span className="font-black text-[#15803D] tabular-nums">{tsk.completedQuantity} {localizeUnit(tsk.unit, t)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={tsk.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* CONTRACTOR / SUPERVISOR / PM OPERATIONAL OVERVIEW */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Awaiting Muster Verification Table */}
            <div className="bg-[#F4F0E8] border border-[#51483D]/20 rounded-3xl overflow-hidden shadow-ivory-card">
              <div className="px-6 py-4.5 border-b border-[#51483D]/20 flex items-center justify-between bg-[#252521] text-[#F4F0E8]">
                <div>
                  <h2 className="text-sm font-black text-[#F4F0E8]">
                    {role === 'site_supervisor' ? t('overview_queue_title_supervisor') : t('overview_queue_title')}
                  </h2>
                  <p className="text-xs font-semibold text-[#96938B] mt-0.5">
                    {pendingAttendance.length > 0
                      ? t('overview_queue_subtitle_pending', { count: pendingAttendance.length })
                      : t('overview_queue_subtitle_clear')}
                  </p>
                </div>

                {pendingAttendance.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setVerifyAllDialogOpen(true)}
                    className="min-h-[38px] px-4 py-1.5 rounded-xl text-xs font-black text-[#F4F0E8] bg-gradient-to-r from-[#A77B50] to-[#8E653C] hover:opacity-95 shadow-sm cursor-pointer transition-all active:scale-95"
                  >
                    {t('action_verify_all', { count: pendingAttendance.length })}
                  </button>
                )}
              </div>

              {pendingAttendance.length === 0 ? (
                <div className="p-10 text-center text-xs text-[#51483D] bg-[#F4F0E8]">
                  <CheckCircle2 className="w-8 h-8 text-[#15803D] mx-auto mb-2.5" />
                  <p className="font-black text-sm text-[#252521]">{t('overview_muster_complete_title')}</p>
                  <p className="mt-1 text-xs text-[#96938B] font-semibold">{t('overview_muster_complete_desc')}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#ECE5DA] text-[#51483D] border-b border-[#51483D]/20 font-black text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-3.5">{t('table_worker_name')}</th>
                        <th className="px-4 py-3.5">{t('table_trade')}</th>
                        <th className="px-4 py-3.5">{t('table_shift_hours')}</th>
                        <th className="px-4 py-3.5">{t('table_verification_state')}</th>
                        <th className="px-5 py-3.5 text-right">{t('table_actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#51483D]/15 bg-[#F4F0E8]">
                      {pendingAttendance.map((rec) => (
                        <tr key={rec.id} className="hover:bg-[#ECE5DA] transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-black text-sm text-[#252521]">{rec.workerName}</div>
                            <div className="text-xs text-[#51483D] mt-0.5 font-semibold">
                              <span className="font-mono text-[#A77B50] font-bold">{rec.workerId}</span> · {localizeSite(rec.siteName, t)}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-[#51483D] font-bold">{t(`trade_${rec.trade}`)}</td>
                          <td className="px-4 py-4 text-[#252521] tabular-nums">
                            <span className="font-black text-sm text-[#252521]">{rec.hoursWorked} {localizeUnit('hrs', t)}</span>
                            <span className="text-xs text-[#96938B] block mt-0.5">{t('table_in')}: {rec.checkInTime}</span>
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge status={rec.verificationStatus} size="sm" />
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedRecordToVerify(rec.id)}
                              className="min-h-[38px] px-4 py-1.5 text-xs font-black text-[#F4F0E8] bg-[#252521] hover:bg-[#A77B50] rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm"
                            >
                              {t('action_verify')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Active Projects Table in Soft Ivory */}
            <div className="bg-[#F4F0E8] border border-[#51483D]/20 rounded-3xl overflow-hidden shadow-ivory-card">
              <div className="px-6 py-4.5 border-b border-[#51483D]/20 flex items-center justify-between bg-[#252521] text-[#F4F0E8]">
                <div>
                  <h2 className="text-sm font-black text-[#F4F0E8]">{t('nav_projects')}</h2>
                  <p className="text-xs font-semibold text-[#96938B] mt-0.5">{t('overview_projects_subtitle')}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveNav('projects')}
                  className="min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-black text-[#A77B50] hover:text-[#F4F0E8] flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>{t('action_view_all_sites')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#ECE5DA] text-[#51483D] border-b border-[#51483D]/20 font-black text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">{t('table_project')}</th>
                      <th className="px-4 py-3.5">{t('table_workforce')}</th>
                      <th className="px-4 py-3.5">{t('table_progress')}</th>
                      <th className="px-4 py-3.5">{t('table_status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#51483D]/15 bg-[#F4F0E8]">
                    {projects.map((proj) => (
                      <tr key={proj.id} className="hover:bg-[#ECE5DA] transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-black text-sm text-[#252521]">{localizeSiteFull(proj.id, t)}</div>
                          <div className="text-xs text-[#51483D] mt-0.5 font-semibold">
                            <span className="font-mono text-[#A77B50] font-bold">{proj.code}</span> · {localizeLocation(proj.id, proj.location, t)}
                          </div>
                        </td>
                        <td className="px-4 py-4 font-black text-sm text-[#252521] tabular-nums">
                          {t('projects_workers_count', { count: proj.workforceCount })}
                        </td>
                        <td className="px-4 py-4">
                          <div className="w-36">
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span className="text-[#252521] tabular-nums font-black">
                                {proj.progressPercent}%
                              </span>
                              <span className="text-[#96938B]">{t('projects_target_date', { date: proj.targetDate })}</span>
                            </div>
                            <div className="w-full h-2 bg-[#D8CCB9] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#A77B50] to-[#8E653C] rounded-full"
                                style={{ width: `${proj.progressPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={proj.status} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Side Column: Site Issues & Weather Alerts */}
          <div className="space-y-6">
            <div className="bg-[#F4F0E8] border border-[#51483D]/20 rounded-3xl p-6 shadow-ivory-card space-y-4">
              <div className="flex items-center justify-between pb-3.5 border-b border-[#51483D]/15">
                <h2 className="text-sm font-black text-[#252521] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#A77B50]" />
                  <span>{t('overview_alerts_title')}</span>
                </h2>
                <span className="text-xs text-[#F4F0E8] font-black px-2.5 py-0.5 bg-[#252521] rounded-full">
                  {t('overview_alerts_active_count', { count: alerts.length })}
                </span>
              </div>

              {alerts.length === 0 ? (
                <p className="text-xs text-[#51483D] font-semibold py-2">{t('overview_no_alerts')}</p>
              ) : (
                <div className="space-y-3">
                  {alerts.map((al) => (
                    <div
                      key={al.id}
                      className="p-4 border border-[#51483D]/20 rounded-2xl bg-[#ECE5DA] space-y-2 hover:border-[#A77B50]/60 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#252521] truncate">
                          {localizeSite(al.siteName, t)}
                        </span>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            al.severity === 'high'
                              ? 'bg-[#B91C1C]/15 text-[#B91C1C] border border-[#B91C1C]/30'
                              : 'bg-[#A77B50]/15 text-[#A77B50] border border-[#A77B50]/40'
                          }`}
                        >
                          {localizeSeverity(al.severity, t)}
                        </span>
                      </div>
                      <p className="text-xs text-[#51483D] font-semibold leading-relaxed">{localizeAlertMessage(al.id, al.message, t)}</p>
                      <div className="text-[10px] text-[#96938B] font-bold tabular-nums">{al.timestamp}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Single Attendance Verification Dialog */}
      <ConfirmDialog
        isOpen={!!selectedRecordToVerify}
        onClose={() => setSelectedRecordToVerify(null)}
        onConfirm={() => {
          if (selectedRecordToVerify) {
            verifyAttendanceRecord(selectedRecordToVerify);
          }
        }}
        title={t('overview_dialog_verify_record_title')}
        description={t('overview_dialog_verify_record_desc')}
        confirmLabel={t('action_verify')}
      />

      {/* Confirm Batch Attendance Verification Dialog */}
      <ConfirmDialog
        isOpen={verifyAllDialogOpen}
        onClose={() => setVerifyAllDialogOpen(false)}
        onConfirm={verifyAllPendingAttendance}
        title={t('overview_dialog_verify_all_title')}
        description={t('overview_dialog_verify_all_desc', { count: pendingAttendance.length })}
        confirmLabel={t('action_verify_all', { count: pendingAttendance.length })}
      />
    </div>
  );
};
