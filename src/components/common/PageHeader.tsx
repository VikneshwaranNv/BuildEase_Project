import React from 'react';
import { motion } from 'motion/react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  tag?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    variant?: 'primary' | 'accent' | 'secondary';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  tag,
  primaryAction,
  secondaryAction,
  children,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#51483D]/20">
      <div>
        {tag && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#51483D] border border-[#A77B50]/40 text-xs font-black uppercase tracking-wider text-[#F4F0E8] mb-2.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#A77B50] shadow-[0_0_8px_#A77B50]" />
            {tag}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-black text-[#252521] tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs sm:text-sm font-semibold text-[#51483D] mt-1">{subtitle}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {children}

        {secondaryAction && (
          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={secondaryAction.onClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] text-xs sm:text-sm font-bold text-[#252521] bg-[#F4F0E8] border border-[#51483D]/30 rounded-2xl hover:bg-[#ECE5DA] transition-colors whitespace-nowrap cursor-pointer shadow-ivory-card"
          >
            {secondaryAction.icon}
            <span>{secondaryAction.label}</span>
          </motion.button>
        )}

        {primaryAction && (
          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled}
            className={`inline-flex items-center gap-2 px-5 py-2.5 min-h-[42px] text-xs sm:text-sm font-black rounded-2xl transition-all whitespace-nowrap cursor-pointer shadow-md ${
              primaryAction.disabled
                ? 'opacity-50 cursor-not-allowed bg-[#96938B]/40 text-[#51483D]'
                : primaryAction.variant === 'secondary'
                ? 'bg-[#F4F0E8] text-[#252521] hover:bg-[#ECE5DA] border border-[#51483D]/30 shadow-ivory-card'
                : 'bg-gradient-to-r from-[#A77B50] to-[#8E653C] text-[#F4F0E8] shadow-[0_6px_20px_-2px_rgba(167,123,80,0.4)] hover:shadow-[0_8px_25px_-2px_rgba(167,123,80,0.5)]'
            }`}
          >
            {primaryAction.icon}
            <span>{primaryAction.label}</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};
