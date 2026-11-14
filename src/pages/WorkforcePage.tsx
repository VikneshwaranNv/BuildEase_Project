import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { Plus, Search, ShieldCheck } from 'lucide-react';
import { WorkerTrade } from '../types';
import { localizeSite, localizeSiteFull } from '../i18n/localize';

export const WorkforcePage: React.FC = () => {
  const { role, t, workers, projects, addWorker } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [tradeFilter, setTradeFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // New Worker Form state
  const [fullName, setFullName] = useState('');
  const [trade, setTrade] = useState<WorkerTrade>('mason');
  const [assignedSiteId, setAssignedSiteId] = useState(projects[0]?.id || '');
  const [dailyWageRate, setDailyWageRate] = useState(750);
  const [phone, setPhone] = useState('+91 ');
  const [safetyCertified, setSafetyCertified] = useState(true);

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.workerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.assignedSiteName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrade = tradeFilter === 'all' || w.trade === tradeFilter;
    return matchesSearch && matchesTrade;
  });

  const handleRegisterWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const selectedSite = projects.find((p) => p.id === assignedSiteId) || projects[0];

    addWorker({
      fullName,
      trade,
      assignedSiteId: selectedSite.id,
      assignedSiteName: selectedSite.name,
      dailyWageRate: Number(dailyWageRate),
      phone,
      safetyCertified,
      verificationStatus: 'verified',
      joinedDate: new Date().toISOString().split('T')[0],
    });

    setFullName('');
    setPhone('+91 ');
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <PageHeader
        tag={t('workforce_tag')}
        title={t('workforce_title')}
        subtitle={t('workforce_subtitle')}
        primaryAction={
          role === 'contractor' || role === 'site_supervisor'
            ? {
                label: t('action_add_worker'),
                icon: <Plus className="w-4 h-4 text-white" />,
                onClick: () => setModalOpen(true),
              }
            : undefined
        }
      />

      {/* Search & Trade Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 border border-[#E2E8F0] rounded-2xl shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#96938B]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('workforce_search_placeholder')}
            className="w-full pl-10 pr-3 py-2 min-h-[40px] text-xs text-[#0F172A] placeholder:text-[#96938B] bg-[#F8FAFC] border border-[#E2E8F0] rounded-full focus:outline-none focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-[#F1F5F9] pt-2 sm:pt-0 sm:pl-3">
          <span className="text-xs font-bold text-[#64748B]">{t('workforce_filter_trade')}</span>
          <select
            value={tradeFilter}
            onChange={(e) => setTradeFilter(e.target.value)}
            className="min-h-[38px] text-xs font-bold text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-full px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="all">{t('workforce_trade_all')}</option>
            <option value="mason">{t('trade_mason')}</option>
            <option value="steel_fixer">{t('trade_steel_fixer')}</option>
            <option value="carpenter">{t('trade_carpenter')}</option>
            <option value="electrician">{t('trade_electrician')}</option>
            <option value="plumber">{t('trade_plumber')}</option>
            <option value="welder">{t('trade_welder')}</option>
            <option value="equipment_operator">{t('trade_equipment_operator')}</option>
            <option value="general_helper">{t('trade_general_helper')}</option>
          </select>
        </div>
      </div>

      {/* Workforce Table */}
      <div className="bg-[#F4F0E8] border border-[#51483D]/25 rounded-2xl overflow-hidden shadow-ivory-card">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#252521] text-[#D8CCB9] border-b border-[#51483D] font-black text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">{t('table_worker_name')}</th>
                <th className="px-4 py-3.5">{t('table_trade')}</th>
                <th className="px-4 py-3.5">{t('table_assigned_site')}</th>
                <th className="px-4 py-3.5">{t('table_wage_rate')}</th>
                <th className="px-4 py-3.5">{t('table_safety_compliance')}</th>
                <th className="px-5 py-3.5">{t('table_verification_state')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#51483D]/15 bg-[#F4F0E8]">
              {filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-xs font-semibold text-[#96938B]">
                    {t('empty_records_title')}
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((w) => (
                  <tr key={w.id} className="hover:bg-[#ECE5DA] transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-black text-sm text-[#252521]">{w.fullName}</div>
                      <div className="text-xs text-[#51483D] mt-0.5">
                        <span className="font-mono text-[#A77B50] font-black">{w.workerId}</span> · {w.phone}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-bold text-[#51483D]">{t(`trade_${w.trade}`)}</span>
                    </td>
                    <td className="px-4 py-4 text-[#252521] font-bold">{localizeSite(w.assignedSiteName, t)}</td>
                    <td className="px-4 py-4 font-black text-[#252521] tabular-nums">
                      {t('workforce_per_day', { rate: w.dailyWageRate.toLocaleString('en-IN') })}
                    </td>
                    <td className="px-4 py-4">
                      {w.safetyCertified ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#15803D]">
                          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                          <span>{t('workforce_certified')}</span>
                        </span>
                      ) : (
                        <span className="text-xs font-black text-[#A77B50]">{t('workforce_induction_pending')}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={w.verificationStatus} size="sm" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Worker Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t('workforce_modal_title')}
        subtitle={t('workforce_modal_subtitle')}
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 min-h-[40px] text-xs font-bold text-[#51483D] hover:text-[#252521] cursor-pointer"
            >
              {t('action_cancel')}
            </button>
            <button
              type="submit"
              form="register-worker-form"
              className="px-5 py-2.5 min-h-[40px] text-xs font-bold text-white bg-[#A77B50] hover:bg-[#8F6740] rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
            >
              {t('action_add_worker')}
            </button>
          </div>
        }
      >
        <form id="register-worker-form" onSubmit={handleRegisterWorker} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#252521] mb-1.5">{t('workforce_form_name')}</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t('workforce_form_name_ph')}
              className="w-full px-3.5 py-2.5 bg-[#F4F0E8] border border-[#51483D]/30 rounded-xl text-sm font-bold text-[#252521] focus:outline-hidden focus:border-[#A77B50]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#252521] mb-1.5">{t('workforce_form_trade')}</label>
              <select
                value={trade}
                onChange={(e) => setTrade(e.target.value as WorkerTrade)}
                className="w-full px-3.5 py-2.5 bg-[#F4F0E8] border border-[#51483D]/30 rounded-xl text-xs font-bold text-[#252521] focus:outline-hidden focus:border-[#A77B50]"
              >
                <option value="mason">{t('trade_mason')}</option>
                <option value="steel_fixer">{t('trade_steel_fixer')}</option>
                <option value="carpenter">{t('trade_carpenter')}</option>
                <option value="electrician">{t('trade_electrician')}</option>
                <option value="plumber">{t('trade_plumber')}</option>
                <option value="welder">{t('trade_welder')}</option>
                <option value="equipment_operator">{t('trade_equipment_operator')}</option>
                <option value="general_helper">{t('trade_general_helper')}</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#252521] mb-1.5">{t('workforce_form_wage')}</label>
              <input
                type="number"
                value={dailyWageRate}
                onChange={(e) => setDailyWageRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#F4F0E8] border border-[#51483D]/30 rounded-xl text-xs font-bold text-[#252521] focus:outline-hidden focus:border-[#A77B50] tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#252521] mb-1.5">{t('workforce_form_site')}</label>
            <select
              value={assignedSiteId}
              onChange={(e) => setAssignedSiteId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F4F0E8] border border-[#51483D]/30 rounded-xl text-xs font-bold text-[#252521] focus:outline-hidden focus:border-[#A77B50]"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {localizeSiteFull(p.id, t)} ({p.code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#252521] mb-1.5">{t('workforce_form_phone')}</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F4F0E8] border border-[#51483D]/30 rounded-xl text-xs font-bold text-[#252521] focus:outline-hidden focus:border-[#A77B50]"
              />
            </div>
            <div className="flex items-center pt-5">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={safetyCertified}
                  onChange={(e) => setSafetyCertified(e.target.checked)}
                  className="rounded text-[#A77B50] focus:ring-0"
                />
                <span className="text-[#252521] font-bold">{t('workforce_form_safety')}</span>
              </label>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
