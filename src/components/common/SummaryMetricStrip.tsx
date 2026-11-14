import React from 'react';
import { motion } from 'motion/react';

export interface MetricItem {
  id: string;
  label: string;
  value: string | number;
  subtext?: string;
  badge?: {
    text: string;
    type?: 'neutral' | 'success' | 'warning' | 'alert';
  };
}

export interface SummaryMetricStripProps {
  metrics: MetricItem[];
}

export const SummaryMetricStrip: React.FC<SummaryMetricStripProps> = ({ metrics }) => {
  return (
    <div className="bg-[#F4F0E8] border border-[#51483D]/20 rounded-3xl overflow-hidden shadow-ivory-card">
      <div
        className={`grid divide-y md:divide-y-0 md:divide-x divide-[#51483D]/15 ${
          metrics.length === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : metrics.length === 3
            ? 'grid-cols-1 sm:grid-cols-3'
            : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-4'
        }`}
      >
        {metrics.map((m) => (
          <motion.div
            key={m.id}
            whileHover={{ y: -2, backgroundColor: '#ECE5DA' }}
            transition={{ duration: 0.2 }}
            className="p-5 sm:p-6 flex flex-col justify-between bg-[#F4F0E8] transition-colors"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#51483D]">
                {m.label}
              </span>
              {m.badge && (
                <span
                  className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                    m.badge.type === 'warning'
                      ? 'bg-[#A77B50]/20 text-[#A77B50] border border-[#A77B50]/40'
                      : m.badge.type === 'alert'
                      ? 'bg-[#B91C1C]/15 text-[#B91C1C] border border-[#B91C1C]/30'
                      : m.badge.type === 'success'
                      ? 'bg-[#15803D]/15 text-[#15803D] border border-[#15803D]/30'
                      : 'bg-[#51483D]/10 text-[#51483D] border border-[#51483D]/20'
                  }`}
                >
                  {m.badge.text}
                </span>
              )}
            </div>

            <div>
              <div className="text-2xl sm:text-[30px] font-black text-[#252521] tabular-nums tracking-tight leading-tight">
                {m.value}
              </div>
              {m.subtext && (
                <div className="text-xs font-semibold text-[#96938B] mt-1.5 leading-normal">
                  {m.subtext}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
