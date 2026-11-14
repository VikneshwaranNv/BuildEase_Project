import React from 'react';
import {
  X,
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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavItemKey } from '../../types';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALL_NAV_ITEMS: {
  key: NavItemKey;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}[] = [
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

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { role, activeNav, setActiveNav, t, attendanceRecords } = useApp();

  if (!isOpen) return null;

  const accessibleNavItems = ALL_NAV_ITEMS.filter((item) => item.roles.includes(role));
  const pendingAttendanceCount = attendanceRecords.filter((r) => r.verificationStatus === 'raw_checkin').length;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-76 max-w-[85vw] bg-[#252521] h-full flex flex-col z-10 border-r border-[#51483D]/60 shadow-2xl">
        <div className="h-20 px-5 border-b border-[#51483D]/40 flex items-center justify-between bg-[#252521]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#51483D] border border-[#A77B50]/50 flex items-center justify-center text-[#A77B50]">
              <Construction className="w-5 h-5 text-[#A77B50]" />
            </div>
            <div>
              <span className="text-base font-black text-[#F4F0E8] block">BuildEase</span>
              <span className="text-[10px] text-[#A77B50] font-bold">Spatial 3D Engine</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#96938B] hover:text-[#F4F0E8] rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 px-3 py-5 overflow-y-auto space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-[#96938B]">
            {t('operations_section')}
          </div>
          {accessibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setActiveNav(item.key);
                  onClose();
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 min-h-[44px] text-xs font-bold rounded-2xl text-left cursor-pointer transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#A77B50] to-[#8E653C] text-[#F4F0E8] shadow-md'
                    : 'text-[#96938B] hover:bg-[#51483D]/40 hover:text-[#F4F0E8]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? 'text-[#F4F0E8]' : 'text-[#96938B]'}`}
                />
                <span className="truncate">{t(item.labelKey)}</span>
                {item.key === 'attendance' && pendingAttendanceCount > 0 && (
                  <span className="ml-auto text-[10px] font-bold px-2 py-0.5 text-[#F4F0E8] bg-[#A77B50] rounded-full">
                    {pendingAttendanceCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#51483D]/40 bg-[#252521]">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#51483D]/40 border border-[#51483D]/60">
            <HardHat className="w-4 h-4 text-[#A77B50]" />
            <div className="text-xs font-bold text-[#F4F0E8] truncate">{t(`role_${role}`)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
