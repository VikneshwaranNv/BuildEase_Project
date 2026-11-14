import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { Download, Printer, CheckCircle2 } from 'lucide-react';
import { localizeUnit, localizeSiteFull } from '../i18n/localize';

export const ReportsPage: React.FC = () => {
  const { t, projects, attendanceRecords } = useApp();

  const [selectedReport, setSelectedReport] = useState<'dsr' | 'attendance' | 'productivity'>('dsr');
  const [selectedSiteId, setSelectedSiteId] = useState(projects[0]?.id || 'all');
  const [dateRange, setDateRange] = useState('2026-10-13');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExportCSV = () => {
    const reportName = t(`reports_type_${selectedReport}`);
    setExportNotice(t('reports_export_toast', { report: reportName, date: dateRange }));
    setTimeout(() => {
      setExportNotice(null);
    }, 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedSite = projects.find((p) => p.id === selectedSiteId);
  const siteScopeLabel = selectedSite ? localizeSiteFull(selectedSite.id, t) : t('reports_config_scope_all');

  return (
    <div className="space-y-6">
      <PageHeader
        tag={t('reports_tag')}
        title={t('reports_title')}
        subtitle={t('reports_subtitle')}
        primaryAction={{
          label: t('action_export_csv'),
          icon: <Download className="w-4 h-4" />,
          onClick: handleExportCSV,
        }}
        secondaryAction={{
          label: t('action_print'),
          icon: <Printer className="w-4 h-4" />,
          onClick: handlePrint,
        }}
      />

      {/* Export Confirmation Feedback */}
      {exportNotice && (
        <div className="bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-semibold">{exportNotice}</span>
        </div>
      )}

      {/* Report Configuration Bar */}
      <div className="bg-[#F4F0E8] p-4 border border-[#51483D]/25 rounded-xl shadow-ivory-card grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
        <div>
          <label className="block font-bold text-[#252521] mb-1">{t('reports_config_type')}</label>
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value as any)}
            className="w-full min-h-[44px] bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-[#A77B50] font-medium text-[#252521]"
          >
            <option value="dsr">{t('reports_type_dsr')}</option>
            <option value="attendance">{t('reports_type_attendance')}</option>
            <option value="productivity">{t('reports_type_productivity')}</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-[#252521] mb-1">{t('reports_config_scope')}</label>
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="w-full min-h-[44px] bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-[#A77B50] font-medium text-[#252521]"
          >
            <option value="all">{t('reports_config_scope_all')}</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {localizeSiteFull(p.id, t)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-[#252521] mb-1">{t('reports_config_date')}</label>
          <input
            type="date"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full min-h-[44px] bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-[#A77B50] tabular-nums font-medium text-[#252521]"
          />
        </div>
      </div>

      {/* Generated Report Preview Sheet */}
      <div className="bg-[#F4F0E8] border border-[#51483D]/25 rounded-xl p-6 shadow-ivory-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#51483D]/25 gap-2">
          <div>
            <div className="text-[10px] font-bold text-[#96938B] uppercase tracking-wider">
              {t('reports_official_record')}
            </div>
            <h2 className="text-lg font-bold text-[#252521] mt-0.5">
              {selectedReport === 'dsr'
                ? t('reports_type_dsr')
                : selectedReport === 'attendance'
                ? t('reports_type_attendance')
                : t('reports_type_productivity')}
            </h2>
            <div className="text-xs text-[#96938B] mt-0.5">
              {t('reports_scope_label', { site: siteScopeLabel, date: dateRange })}
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-[#96938B]">{t('table_status')}: </span>
            <span className="font-bold text-[#10B981]">{t('reports_supervisor_certified')}</span>
          </div>
        </div>

        {/* Dynamic preview content */}
        {selectedReport === 'dsr' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg">
              <div>
                <span className="text-[11px] font-bold text-[#96938B] uppercase tracking-wider block">{t('reports_dsr_muster_present')}</span>
                <div className="font-bold text-base text-[#252521] tabular-nums mt-0.5">{t('projects_workers_count', { count: 142 })}</div>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#96938B] uppercase tracking-wider block">{t('reports_dsr_shifts_executed')}</span>
                <div className="font-bold text-base text-[#252521] tabular-nums mt-0.5">{t('reports_dsr_day_shift_val')}</div>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#96938B] uppercase tracking-wider block">{t('reports_dsr_concrete_poured')}</span>
                <div className="font-bold text-base text-[#252521] tabular-nums mt-0.5">38 {localizeUnit('m³', t)} ({t('reports_pier_28')})</div>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#96938B] uppercase tracking-wider block">{t('reports_dsr_safety_incidents')}</span>
                <div className="font-bold text-base text-[#10B981] tabular-nums mt-0.5">0</div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-[#252521]">{t('reports_dsr_work_executed_title')}</h3>
              <ul className="list-disc list-inside space-y-1 text-[#96938B] pl-1 leading-relaxed">
                <li>{t('reports_dsr_item_1')}</li>
                <li>{t('reports_dsr_item_2')}</li>
                <li>{t('reports_dsr_item_3')}</li>
                <li>{t('reports_dsr_item_4')}</li>
              </ul>
            </div>
          </div>
        )}

        {selectedReport === 'attendance' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#252521] text-[#F4F0E8] border-b border-[#51483D]/25 font-semibold text-xs">
                <tr>
                  <th className="px-3 py-2.5">{t('table_worker_name')}</th>
                  <th className="px-3 py-2.5">{t('table_trade')}</th>
                  <th className="px-3 py-2.5">{t('table_in')}</th>
                  <th className="px-3 py-2.5">{t('table_out')}</th>
                  <th className="px-3 py-2.5">{t('table_shift_hours')}</th>
                  <th className="px-3 py-2.5">{t('table_shifts_ot')}</th>
                  <th className="px-3 py-2.5">{t('table_status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#51483D]/15 bg-[#F4F0E8]">
                {attendanceRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-[#ECE5DA] transition-colors">
                    <td className="px-3 py-2.5 font-bold text-[#252521]">{r.workerName}</td>
                    <td className="px-3 py-2.5 font-medium text-[#96938B]">{t(`trade_${r.trade}`)}</td>
                    <td className="px-3 py-2.5 tabular-nums text-[#252521]">{r.checkInTime}</td>
                    <td className="px-3 py-2.5 tabular-nums text-[#252521]">{r.checkOutTime || t('attendance_shift_active')}</td>
                    <td className="px-3 py-2.5 tabular-nums font-bold text-[#252521]">{r.hoursWorked} {localizeUnit('hrs', t)}</td>
                    <td className="px-3 py-2.5 tabular-nums text-[#10B981] font-bold">+{r.overtimeHours} {localizeUnit('hrs', t)}</td>
                    <td className="px-3 py-2.5 capitalize text-[#96938B]">{t(`status_${r.verificationStatus}`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'productivity' && (
          <div className="p-6 bg-[#ECE5DA] border border-[#51483D]/25 rounded-xl text-center text-xs text-[#96938B]">
            {t('reports_compiled_notice', { report: t(`reports_type_${selectedReport}`) })}
          </div>
        )}
      </div>
    </div>
  );
};
