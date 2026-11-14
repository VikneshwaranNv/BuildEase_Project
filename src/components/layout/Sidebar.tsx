import React from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Building2,
  Users,
  Clock,
  CheckSquare,
  Receipt,
  FileText,
  BarChart3,
  HardHat,
  Construction,
  ShieldCheck,
  Radio,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavItemKey } from '../../types';

interface NavEntry {
  key: NavItemKey;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  badge?: string;
}

const ALL_NAV_ITEMS: NavEntry[] = [
  {
    key: 'overview',
    labelKey: 'nav_overview',
    icon: LayoutDashboard,
    roles: ['contractor', 'project_manager', 'site_supervisor', 'worker'],
  },
  {
    key: 'projects',
    labelKey: 'nav_projects',
    icon: Building2,
    roles: ['contractor', 'project_manager'],
  },
  {
    key: 'workforce',
    labelKey: 'nav_workforce',
    icon: Users,
    roles: ['contractor', 'site_supervisor'],
  },
  {
    key: 'attendance',
    labelKey: 'nav_attendance',
    icon: Clock,
    roles: ['contractor', 'project_manager', 'site_supervisor', 'worker'],
  },
  {
    key: 'tasks',
    labelKey: 'nav_tasks',
    icon: CheckSquare,
    roles: ['contractor', 'project_manager', 'site_supervisor', 'worker'],
  },
  {
    key: 'payroll',
    labelKey: 'nav_payroll',
    icon: Receipt,
    roles: ['contractor', 'worker'],
  },
  {
    key: 'documents',
    labelKey: 'nav_documents',
    icon: FileText,
    roles: ['contractor', 'project_manager'],
  },
  {
    key: 'reports',
    labelKey: 'nav_reports',
    icon: BarChart3,
    roles: ['contractor', 'project_manager'],
  },
];

export const Sidebar: React.FC = () => {
  const { role, activeNav, setActiveNav, t, attendanceRecords } = useApp();

  const pendingAttendanceCount = attendanceRecords.filter((r) => r.verificationStatus === 'raw_checkin').length;
  const accessibleNavItems = ALL_NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <aside className="hidden lg:flex w-[270px] bg-[#252521] flex-col shrink-0 h-screen sticky top-0 select-none z-20 border-r border-[#51483D]/40 shadow-[4px_0_25px_rgba(37,37,33,0.35)]">
      {/* Brand Header */}
      <div className="h-20 px-6 border-b border-[#51483D]/40 flex items-center justify-between bg-[#252521]">
        <div className="flex items-center gap-3.5">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.08 }}
            transition={{ type: 'spring', damping: 12 }}
            className="w-10 h-10 rounded-2xl bg-[#51483D] border border-[#A77B50]/50 flex items-center justify-center text-[#A77B50] shadow-md shadow-[#A77B50]/15"
          >
            <Construction className="w-5 h-5 text-[#A77B50]" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-[#F4F0E8] leading-none">
                BuildEase
              </span>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#A77B50]/20 text-[#A77B50] border border-[#A77B50]/40 tracking-wider">
                PRO 3D
              </span>
            </div>
            <span className="text-[11px] font-medium text-[#96938B] mt-1 block">
              {t('brand_operations')}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3.5 py-5 overflow-y-auto space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-widest text-[#96938B]">
          {t('operations_section')}
        </div>

        {accessibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.key;

          let queueBadge: React.ReactNode = null;
          if (item.key === 'attendance' && (role === 'contractor' || role === 'site_supervisor') && pendingAttendanceCount > 0) {
            queueBadge = (
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 text-[#F4F0E8] bg-[#A77B50] rounded-full tabular-nums shadow-sm">
                {pendingAttendanceCount}
              </span>
            );
          } else if (item.badge) {
            queueBadge = (
              <span
                className={`ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-[#F4F0E8]/20 text-[#F4F0E8]' : 'bg-[#51483D] text-[#A77B50]'
                }`}
              >
                {item.badge}
              </span>
            );
          }

          return (
            <motion.button
              key={item.key}
              type="button"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveNav(item.key)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 min-h-[44px] text-xs font-bold rounded-2xl transition-all duration-200 text-left group relative cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#A77B50] to-[#8E653C] text-[#F4F0E8] shadow-[0_4px_20px_rgba(167,123,80,0.35)] translate-x-1'
                  : 'text-[#96938B] hover:text-[#F4F0E8] hover:bg-[#51483D]/40'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#F4F0E8]' : 'text-[#96938B] group-hover:text-[#A77B50]'
                }`}
              />
              <span className="truncate">{t(item.labelKey)}</span>
              {queueBadge}
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#F4F0E8] opacity-75" />
              )}
            </motion.button>
          );
        })}

        {/* Supporting Workspace Header */}
        <div className="pt-5 px-3 pb-2 text-[10px] font-black uppercase tracking-widest text-[#96938B]">
          Spatial Intelligence
        </div>

        <button
          type="button"
          onClick={() => setActiveNav('overview')}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 text-xs font-semibold rounded-2xl text-[#96938B] hover:text-[#F4F0E8] hover:bg-[#51483D]/40 transition-colors cursor-pointer"
        >
          <Radio className="w-4 h-4 text-[#A77B50]" />
          <span>LiDAR 3D Scanner</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveNav('documents')}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 text-xs font-semibold rounded-2xl text-[#96938B] hover:text-[#F4F0E8] hover:bg-[#51483D]/40 transition-colors cursor-pointer"
        >
          <FileText className="w-4 h-4 text-[#96938B]" />
          <span>Field Engineering Docs</span>
        </button>
      </div>

      {/* Role Context & Live Gate Telemetry Footer */}
      <div className="p-4 border-t border-[#51483D]/40 bg-[#252521]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-[#51483D]/40 border border-[#51483D]/70 shadow-inner">
          <div className="w-8 h-8 rounded-xl bg-[#A77B50] text-[#F4F0E8] flex items-center justify-center shrink-0 shadow-sm">
            <HardHat className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[9px] text-[#96938B] uppercase font-bold tracking-wider">
              {t('active_session')}
            </div>
            <div className="text-xs font-extrabold text-[#F4F0E8] truncate">
              {t(`role_${role}`)}
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse" title="Site Gate Online" />
        </div>
      </div>
    </aside>
  );
};
