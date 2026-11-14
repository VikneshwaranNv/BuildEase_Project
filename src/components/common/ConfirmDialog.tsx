import React from 'react';
import { Modal } from './Modal';
import { AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  isDestructive = false,
}) => {
  const { t } = useApp();
  const effectiveConfirmLabel = confirmLabel || t('action_confirm');
  const effectiveCancelLabel = cancelLabel || t('action_cancel');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[42px] px-4 py-2 text-xs font-bold text-[#51483D] bg-[#F4F0E8] border border-[#51483D]/30 rounded-2xl hover:bg-[#ECE5DA] hover:text-[#252521] transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            {effectiveCancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`min-h-[42px] px-5 py-2 text-xs font-black rounded-2xl transition-all cursor-pointer active:scale-95 shadow-md ${
              isDestructive
                ? 'bg-[#B91C1C] hover:bg-[#991B1B] text-[#F4F0E8]'
                : 'bg-gradient-to-r from-[#A77B50] to-[#8E653C] hover:opacity-95 text-[#F4F0E8] shadow-[0_4px_16px_rgba(167,123,80,0.35)]'
            }`}
          >
            {effectiveConfirmLabel}
          </button>
        </div>
      }
    >
      <div className="flex items-start gap-3.5 py-1">
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
            isDestructive ? 'bg-[#B91C1C]/15 text-[#B91C1C]' : 'bg-[#A77B50]/15 text-[#A77B50]'
          }`}
        >
          <AlertCircle className="w-5 h-5" />
        </div>
        <p className="text-xs sm:text-sm font-semibold text-[#51483D] leading-relaxed pt-1">{description}</p>
      </div>
    </Modal>
  );
};
