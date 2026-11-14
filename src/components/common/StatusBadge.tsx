import React from 'react';
import { useApp } from '../../context/AppContext';

export interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const { t } = useApp();

  const labelKey = `status_${status}`;
  let dotColor = 'bg-[#96938B]';
  let textColor = 'text-[#51483D]';
  let bgColor = 'bg-[#51483D]/15 border-[#51483D]/30';

  switch (status) {
    case 'active':
    case 'present':
    case 'in_stock':
    case 'supervisor_verified':
    case 'verified':
    case 'approved':
    case 'completed':
    case 'disbursed':
      dotColor = 'bg-[#15803D]';
      textColor = 'text-[#15803D]';
      bgColor = 'bg-[#15803D]/15 border-[#15803D]/35';
      break;

    case 'scheduled':
    case 'in_progress':
    case 'raw_checkin':
    case 'pending':
    case 'half_day':
    case 'low_stock':
    case 'calculated':
    case 'review_required':
      dotColor = 'bg-[#A77B50]';
      textColor = 'text-[#A77B50]';
      bgColor = 'bg-[#A77B50]/15 border-[#A77B50]/40';
      break;

    case 'on_hold':
    case 'absent':
    case 'flagged':
    case 'critical':
    case 'delayed':
      dotColor = 'bg-[#B91C1C]';
      textColor = 'text-[#B91C1C]';
      bgColor = 'bg-[#B91C1C]/15 border-[#B91C1C]/35';
      break;

    default:
      dotColor = 'bg-[#96938B]';
      textColor = 'text-[#51483D]';
      bgColor = 'bg-[#51483D]/15 border-[#51483D]/30';
  }

  const px = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-black rounded-full border ${bgColor} ${textColor} ${px} whitespace-nowrap select-none shadow-2xs`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      <span>{t(labelKey)}</span>
    </span>
  );
};
