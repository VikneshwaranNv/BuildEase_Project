import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClass =
    maxWidth === 'sm'
      ? 'max-w-md'
      : maxWidth === 'lg'
      ? 'max-w-2xl'
      : maxWidth === 'xl'
      ? 'max-w-3xl'
      : 'max-w-lg';

  const { t } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252521]/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 14 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full ${widthClass} bg-[#F4F0E8] rounded-3xl shadow-popover border border-[#51483D]/30 overflow-hidden flex flex-col max-h-[90vh]`}
        role="dialog"
        aria-modal="true"
      >
        {/* Deep Charcoal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#51483D]/40 bg-[#252521]">
          <div>
            <h3 className="text-base font-black text-[#F4F0E8] tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs font-semibold text-[#96938B] mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#96938B] hover:text-[#F4F0E8] hover:bg-[#51483D]/50 rounded-xl transition-colors cursor-pointer"
            aria-label={t('close_button')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Soft Ivory Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-[#252521] bg-[#F4F0E8]">{children}</div>

        {/* Supporting Surface Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-[#51483D]/20 bg-[#ECE5DA] flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </motion.div>
    </div>
  );
};
