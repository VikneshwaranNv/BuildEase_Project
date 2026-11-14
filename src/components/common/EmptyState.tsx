import React from 'react';
import { Inbox } from 'lucide-react';
import { motion } from 'motion/react';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="py-14 px-6 text-center flex flex-col items-center justify-center border-2 border-dashed border-[#51483D]/30 rounded-3xl bg-[#F4F0E8] shadow-ivory-card">
      <div className="w-12 h-12 rounded-2xl bg-[#ECE5DA] border border-[#51483D]/30 text-[#A77B50] flex items-center justify-center mb-3.5 shadow-sm">
        {icon || <Inbox className="w-6 h-6 text-[#A77B50]" />}
      </div>
      <h3 className="text-base font-black text-[#252521] tracking-tight">{title}</h3>
      <p className="text-xs font-semibold text-[#51483D] max-w-sm mt-1.5 mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <motion.button
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={onAction}
          className="min-h-[42px] px-5 py-2 text-xs font-black text-[#F4F0E8] bg-gradient-to-r from-[#A77B50] to-[#8E653C] rounded-2xl transition-all cursor-pointer shadow-md shadow-[#A77B50]/30"
        >
          {actionLabel}
        </motion.button>
      )}
    </div>
  );
};
