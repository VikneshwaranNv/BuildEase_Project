import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Modal } from '../components/common/Modal';
import {
  CheckCircle,
  Info,
  ShieldCheck,
  Download,
  Printer,
  FileSpreadsheet,
  Award,
  Calendar,
  Building,
  UserCheck,
} from 'lucide-react';
import { localizeUnit, localizeSite, localizePeriod } from '../i18n/localize';
import { PayrollRecord } from '../types';

export const PayrollPage: React.FC = () => {
  const { role, t, payrollRecords, attendanceRecords, approvePayrollBatch } = useApp();

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [selectedSlipForPrint, setSelectedSlipForPrint] = useState<PayrollRecord | null>(null);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);

  // If worker, show only their slip
  const isWorker = role === 'worker';
  const displayRecords = isWorker
    ? payrollRecords.filter((p) => p.workerId === 'W-0418')
    : payrollRecords;

  const unapprovedCount = payrollRecords.filter((p) => p.status === 'calculated').length;
  const calculatedTotal = payrollRecords
    .filter((p) => p.status === 'calculated')
    .reduce((sum, p) => sum + p.netPayable, 0);

  const approvedTotal = payrollRecords
    .filter((p) => p.status === 'supervisor_approved')
    .reduce((sum, p) => sum + p.netPayable, 0);

  const disbursedTotal = payrollRecords
    .filter((p) => p.status === 'disbursed')
    .reduce((sum, p) => sum + p.netPayable, 0);

  // Count unverified and flagged attendance sessions excluded from payroll
  const unverifiedShiftsCount = attendanceRecords.filter(
    (r) => r.verificationStatus === 'raw_checkin' || r.verificationStatus === 'flagged'
  ).length;

  const handleConfirmApprove = () => {
    if (role === 'worker') return;
    approvePayrollBatch();
    setApproveDialogOpen(false);
  };

  // Export certified payroll ledger to CSV
  const handleExportCsv = () => {
    const headers = [
      'Worker ID',
      'Worker Name',
      'Trade',
      'Project Site',
      'Period',
      'Days Present',
      'Overtime Hours',
      'Daily Rate (INR)',
      'Gross Pay (INR)',
      'Deductions (INR)',
      'Net Payable (INR)',
      'Payroll Status',
      'Audit Certification',
    ];

    const rows = displayRecords.map((r) => [
      `"${r.workerId}"`,
      `"${r.workerName.replace(/"/g, '""')}"`,
      `"${t(`trade_${r.trade}`)}"`,
      `"${r.siteName.replace(/"/g, '""')}"`,
      `"${r.period}"`,
      r.daysPresent,
      r.overtimeHours,
      r.dailyRate,
      r.grossPay,
      r.deductions,
      r.netPayable,
      `"${r.status}"`,
      '"Supervisor Certified Attendance"',
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];

    link.setAttribute('href', url);
    link.setAttribute('download', `BuildEase_Payroll_Bank_Disbursement_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessToast(true);
    setTimeout(() => setDownloadSuccessToast(false), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        tag={t('payroll_tag')}
        title={isWorker ? t('payroll_worker_title') : t('payroll_title')}
        subtitle={isWorker ? t('payroll_worker_subtitle') : t('payroll_subtitle')}
        primaryAction={
          !isWorker && (role === 'contractor' || role === 'site_supervisor') && unapprovedCount > 0
            ? {
                label: t('action_approve_batch', { count: unapprovedCount }),
                icon: <CheckCircle className="w-4 h-4" />,
                onClick: () => setApproveDialogOpen(true),
              }
            : undefined
        }
      />

      {/* Toast Notification on CSV Export */}
      {downloadSuccessToast && (
        <div className="p-3.5 bg-[#10B981]/15 border border-[#10B981]/40 rounded-xl text-xs font-semibold text-[#10B981] flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-4 h-4 shrink-0" />
            <span>Bank Disbursement CSV exported successfully ({displayRecords.length} records ready for bank transfer).</span>
          </div>
          <span className="text-[10px] text-[#96938B] font-mono px-2 py-0.5 bg-[#F4F0E8] rounded border border-[#51483D]/25">CSV Ready</span>
        </div>
      )}

      {/* Strict Distinction Banner */}
      <div className="bg-[#F4F0E8] border border-[#51483D]/25 rounded-xl p-4 flex items-start gap-3 text-xs text-[#96938B] shadow-ivory-card">
        <Info className="w-4 h-4 text-[#A77B50] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#252521] font-bold">{t('payroll_notice_title')} </strong>
          {t('payroll_notice_body')}
        </div>
      </div>

      {/* Unverified Shifts Warning Banner */}
      {unverifiedShiftsCount > 0 && (
        <div className="bg-[#A77B50]/10 border border-[#A77B50]/30 rounded-xl p-4 flex items-start gap-3 text-xs text-[#A77B50] shadow-ivory-card">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#A77B50]" />
          <div className="leading-relaxed">
            <strong className="font-bold text-[#252521]">
              {t('payroll_unverified_shifts_warning', { count: unverifiedShiftsCount })}
            </strong>
            <p className="text-[11px] text-[#96938B] mt-0.5">
              Only shifts marked as <span className="text-[#10B981] font-semibold">Supervisor Verified</span> are eligible for wages under BuildEase muster audit rules.
            </p>
          </div>
        </div>
      )}

      {/* Action Toolbar (Export Bank CSV & Print Quick Links) */}
      {!isWorker && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#F4F0E8] border border-[#51483D]/25 rounded-xl shadow-ivory-card">
          <div className="flex items-center gap-2 text-xs text-[#96938B]">
            <Award className="w-4 h-4 text-[#A77B50]" />
            <span className="font-semibold text-[#252521]">Supervisor-audited muster roll</span>
            <span>·</span>
            <span>{displayRecords.length} active records</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="min-h-[44px] px-4 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-[0.98]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export bank CSV file</span>
            </button>
            {displayRecords.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedSlipForPrint(displayRecords[0])}
                className="min-h-[44px] px-3.5 py-2 rounded-lg bg-[#ECE5DA] hover:bg-[#2D333D] border border-[#51483D]/25 text-[#96938B] hover:text-[#252521] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print sample slip</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Aggregate Payroll Metric Summary (for Contractor) */}
      {!isWorker && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#F4F0E8] border border-[#51483D]/25 rounded-xl p-5 shadow-ivory-card">
            <span className="text-xs font-medium text-[#96938B] block">
              {t('payroll_metric_calc_title')}
            </span>
            <div className="text-2xl font-bold text-[#A77B50] tabular-nums mt-1.5">
              ₹{calculatedTotal.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-[#96938B] mt-1 font-medium">{t('payroll_metric_calc_sub', { count: unapprovedCount })}</div>
          </div>

          <div className="bg-[#F4F0E8] border border-[#51483D]/25 rounded-xl p-5 shadow-ivory-card">
            <span className="text-xs font-medium text-[#96938B] block">
              {t('payroll_metric_appr_title')}
            </span>
            <div className="text-2xl font-bold text-[#252521] tabular-nums mt-1.5">
              ₹{approvedTotal.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-[#96938B] mt-1 font-medium">{t('payroll_metric_appr_sub')}</div>
          </div>

          <div className="bg-[#F4F0E8] border border-[#51483D]/25 rounded-xl p-5 shadow-ivory-card">
            <span className="text-xs font-medium text-[#96938B] block">
              {t('payroll_metric_disb_title')}
            </span>
            <div className="text-2xl font-bold text-[#10B981] tabular-nums mt-1.5">
              ₹{disbursedTotal.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-[#96938B] mt-1 font-medium">{t('payroll_metric_disb_sub')}</div>
          </div>
        </div>
      )}

      {/* Worker Slip Detailed View */}
      {isWorker && displayRecords.length > 0 && (
        <div className="bg-[#F4F0E8] border border-[#51483D]/25 rounded-xl p-6 shadow-ivory-card max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#51483D]/25">
            <div>
              <span className="text-[11px] font-bold text-[#96938B] uppercase tracking-wider block">{t('payroll_slip_official')}</span>
              <h2 className="text-lg font-bold text-[#252521] mt-0.5">{displayRecords[0].workerName}</h2>
              <span className="text-xs font-mono text-[#A77B50] font-semibold">ID: {displayRecords[0].workerId}</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={displayRecords[0].status} />
              <button
                type="button"
                onClick={() => setSelectedSlipForPrint(displayRecords[0])}
                className="min-h-[44px] px-3.5 py-2 rounded-lg bg-[#ECE5DA] hover:bg-[#2D333D] border border-[#51483D]/25 text-[#252521] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
                title="Print Payslip"
              >
                <Printer className="w-4 h-4 text-[#A77B50]" />
                <span className="hidden sm:inline">Print Slip</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg">
              <span className="text-[#96938B] font-medium">{t('payroll_slip_period')}</span>
              <div className="font-bold text-[#252521] mt-0.5">{localizePeriod(displayRecords[0].period, t)}</div>
            </div>
            <div className="p-3.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg">
              <span className="text-[#96938B] font-medium">{t('payroll_slip_rate')}</span>
              <div className="font-bold text-[#252521] tabular-nums mt-0.5">
                ₹{displayRecords[0].dailyRate} / {localizeUnit('day', t)}
              </div>
            </div>
            <div className="p-3.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg">
              <span className="text-[#96938B] font-medium">{t('payroll_slip_days')}</span>
              <div className="font-bold text-[#252521] tabular-nums mt-0.5">
                {t('payroll_slip_full_shifts', { count: displayRecords[0].daysPresent })}
              </div>
            </div>
            <div className="p-3.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg">
              <span className="text-[#96938B] font-medium">{t('payroll_slip_ot_approved')}</span>
              <div className="font-bold text-[#10B981] tabular-nums mt-0.5">
                {t('payroll_slip_ot_hours', { count: displayRecords[0].overtimeHours })}
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t border-[#51483D]/25 pt-4 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-[#96938B] font-medium">{t('payroll_slip_gross')}</span>
              <span className="font-bold text-[#252521] tabular-nums">
                ₹{displayRecords[0].grossPay.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between py-1 text-[#EF4444]">
              <span className="font-medium">{t('payroll_slip_advance')}</span>
              <span className="font-bold tabular-nums">
                - ₹{displayRecords[0].deductions.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between py-2.5 border-t border-[#51483D]/25 text-sm">
              <span className="font-bold text-[#252521]">{t('payroll_slip_net')}</span>
              <span className="font-bold text-[#252521] tabular-nums text-lg">
                ₹{displayRecords[0].netPayable.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-[#A77B50]/10 border border-[#A77B50]/30 rounded-lg text-xs text-[#A77B50] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#A77B50] shrink-0 mt-0.5" />
            <span>{t('payroll_slip_notice')}</span>
          </div>
        </div>
      )}

      {/* Contractor / Admin Full Payroll Ledger */}
      {!isWorker && (
        <div className="bg-[#F4F0E8] border border-[#51483D]/25 rounded-xl overflow-hidden shadow-ivory-card">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#252521] text-[#F4F0E8] border-b border-[#51483D]/25 font-semibold text-xs">
                <tr>
                  <th className="px-4 py-3">{t('table_worker_name')}</th>
                  <th className="px-3 py-3">{t('table_project')}</th>
                  <th className="px-3 py-3">{t('table_shifts_ot')}</th>
                  <th className="px-3 py-3">{t('table_wage_rate')}</th>
                  <th className="px-3 py-3">{t('table_gross_pay')}</th>
                  <th className="px-3 py-3">{t('table_deductions')}</th>
                  <th className="px-3 py-3">{t('table_net_payable')}</th>
                  <th className="px-4 py-3">{t('table_status')}</th>
                  <th className="px-3 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#51483D]/15 bg-[#F4F0E8]">
                {displayRecords.map((pay) => (
                  <tr key={pay.id} className="hover:bg-[#ECE5DA] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-[#252521]">{pay.workerName}</div>
                      <div className="text-[11px] text-[#96938B] mt-0.5">
                        <span className="font-mono text-[#A77B50] font-semibold">{pay.workerId}</span> · {t(`trade_${pay.trade}`)}
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-[#96938B] font-medium">{localizeSite(pay.siteName, t)}</td>
                    <td className="px-3 py-3.5 tabular-nums text-[#252521]">
                      <span className="font-bold text-[#252521]">{pay.daysPresent} {localizeUnit('days', t)}</span>
                      {pay.overtimeHours > 0 && (
                        <span className="text-[11px] text-[#10B981] block font-bold mt-0.5">+{pay.overtimeHours} {localizeUnit('hrs', t)} {localizeUnit('ot', t)}</span>
                      )}
                    </td>
                    <td className="px-3 py-3.5 font-bold text-[#252521] tabular-nums">
                      ₹{pay.dailyRate}
                    </td>
                    <td className="px-3 py-3.5 font-bold text-[#252521] tabular-nums">
                      ₹{pay.grossPay.toLocaleString('en-IN')}
                    </td>
                    <td className="px-3 py-3.5 text-[#EF4444] tabular-nums font-bold">
                      {pay.deductions > 0 ? `₹${pay.deductions}` : '₹0'}
                    </td>
                    <td className="px-3 py-3.5 font-bold text-[#252521] tabular-nums">
                      ₹{pay.netPayable.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={pay.status} size="sm" />
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedSlipForPrint(pay)}
                        className="min-h-[36px] px-3 py-1.5 rounded-md bg-[#ECE5DA] hover:bg-[#2D333D] border border-[#51483D]/25 text-[#252521] hover:border-[#A77B50]/50 font-semibold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
                        title="View / Print Official Payslip"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#A77B50]" />
                        <span>Slip</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Official Printable Payslip Voucher Modal */}
      {selectedSlipForPrint && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedSlipForPrint(null)}
          title="Official Wage Disbursement Voucher"
          subtitle={`Voucher Reference: BE-PAY-${selectedSlipForPrint.id.toUpperCase()}`}
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] text-[#96938B]">BuildEase Verified Muster Record</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSlipForPrint(null)}
                  className="min-h-[44px] px-3 py-2 rounded-lg border border-[#51483D]/25 text-xs font-semibold text-[#96938B] hover:text-[#252521] hover:bg-[#ECE5DA] cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="min-h-[44px] px-4 py-2 rounded-lg bg-[#A77B50] hover:bg-[#936B42] text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all active:scale-[0.98]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-4 p-1 text-xs">
            {/* Header Voucher Card */}
            <div className="p-4 rounded-xl bg-[#ECE5DA] border border-[#51483D]/25 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-[#A77B50] uppercase tracking-wider">
                  BUILDEASE WORKFORCE MANAGEMENT
                </div>
                <div className="text-base font-bold text-[#252521] mt-0.5">
                  Certified Wage Disbursement Voucher
                </div>
                <div className="text-[11px] text-[#96938B] mt-0.5 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Settlement Period: {selectedSlipForPrint.period}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] font-bold text-[10px]">
                  <ShieldCheck className="w-3 h-3" />
                  <span>SUPERVISOR AUDITED</span>
                </div>
                <div className="text-[10px] text-[#96938B] mt-1 font-mono">
                  Site: {selectedSlipForPrint.siteName}
                </div>
              </div>
            </div>

            {/* Worker Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg">
                <span className="text-[10px] text-[#96938B] font-bold uppercase block">Worker Name</span>
                <span className="font-bold text-[#252521] mt-0.5 block">{selectedSlipForPrint.workerName}</span>
              </div>
              <div className="p-3 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg">
                <span className="text-[10px] text-[#96938B] font-bold uppercase block">Worker ID</span>
                <span className="font-mono text-[#A77B50] font-bold mt-0.5 block">{selectedSlipForPrint.workerId}</span>
              </div>
              <div className="p-3 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg">
                <span className="text-[10px] text-[#96938B] font-bold uppercase block">Trade / Skill</span>
                <span className="font-semibold text-[#252521] mt-0.5 block">{t(`trade_${selectedSlipForPrint.trade}`)}</span>
              </div>
              <div className="p-3 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg">
                <span className="text-[10px] text-[#96938B] font-bold uppercase block">Daily Rate</span>
                <span className="font-bold text-[#252521] mt-0.5 block">₹{selectedSlipForPrint.dailyRate} / day</span>
              </div>
            </div>

            {/* Certified Breakdown Table */}
            <div className="p-4 bg-[#ECE5DA] border border-[#51483D]/25 rounded-xl space-y-2">
              <div className="text-[11px] font-bold text-[#252521] pb-2 border-b border-[#51483D]/25 flex items-center justify-between">
                <span>Certified Wage Calculation Elements</span>
                <span className="text-[10px] text-[#96938B] font-mono">BuildEase UTC Ledger</span>
              </div>
              <div className="flex justify-between py-1 text-[#96938B]">
                <span>Base Shifts ({selectedSlipForPrint.daysPresent} days verified)</span>
                <span className="font-bold text-[#252521] tabular-nums">
                  ₹{(selectedSlipForPrint.daysPresent * selectedSlipForPrint.dailyRate).toLocaleString('en-IN')}
                </span>
              </div>
              {selectedSlipForPrint.overtimeHours > 0 && (
                <div className="flex justify-between py-1 text-[#10B981]">
                  <span>Approved Overtime ({selectedSlipForPrint.overtimeHours} hrs verified)</span>
                  <span className="font-bold tabular-nums">
                    + ₹{(selectedSlipForPrint.grossPay - (selectedSlipForPrint.daysPresent * selectedSlipForPrint.dailyRate)).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1 text-[#96938B] border-t border-[#51483D]/25 pt-2">
                <span className="font-semibold text-[#252521]">Gross Total Wages</span>
                <span className="font-bold text-[#252521] tabular-nums">₹{selectedSlipForPrint.grossPay.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 text-[#EF4444]">
                <span>Advance / Statutory Deductions</span>
                <span className="font-bold tabular-nums">- ₹{selectedSlipForPrint.deductions.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-3 border-t border-[#51483D]/25 text-sm bg-[#ECE5DA] px-3.5 rounded-lg mt-2">
                <span className="font-bold text-[#252521]">NET PAYABLE AMOUNT (BANK DISBURSEMENT)</span>
                <span className="font-bold text-[#10B981] text-base tabular-nums">₹{selectedSlipForPrint.netPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Certification Stamp */}
            <div className="p-3.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-xl flex items-center gap-3">
              <UserCheck className="w-5 h-5 text-[#A77B50] shrink-0" />
              <div className="text-[11px] text-[#96938B] leading-tight">
                <strong className="text-[#252521] block font-semibold">Muster Sign-Off Authority:</strong>
                Certified by Site Civil Supervisor under BuildEase Biometric Verification protocol. Guaranteed non-disputed hours.
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Approve Payroll Dialog */}
      <ConfirmDialog
        isOpen={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        onConfirm={handleConfirmApprove}
        title={t('payroll_dialog_approve_title')}
        description={t('payroll_dialog_approve_desc', {
          count: unapprovedCount,
          amount: calculatedTotal.toLocaleString('en-IN'),
        })}
        confirmLabel={t('payroll_dialog_approve_btn')}
      />
    </div>
  );
};
