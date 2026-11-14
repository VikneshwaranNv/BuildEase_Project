import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { Interactive3DCard } from '../components/common/Interactive3DCard';
import {
  Plus,
  Search,
  Building2,
  MapPin,
  Users,
  Calendar,
  TrendingUp,
  Layers,
  LayoutGrid,
  List,
  Sparkles,
} from 'lucide-react';
import { localizeSiteFull, localizeLocation } from '../i18n/localize';

// Authentic Architectural Building Images for Projects
const PROJECT_IMAGES: Record<string, string> = {
  'proj-1': 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80', // Metro Elevated Corridor
  'proj-2': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', // Horizon Commercial Hub
  'proj-3': 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80', // Green Valley Residential
  'proj-4': 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80', // Riverfront Expressway
};

export const ProjectsPage: React.FC = () => {
  const { role, t, projects, addProject } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [modalOpen, setModalOpen] = useState(false);

  // New Project Form State
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [manager, setManager] = useState('Rajesh Sharma');
  const [supervisor, setSupervisor] = useState('Aniket Patil');
  const [startDate, setStartDate] = useState('2026-11-01');
  const [targetDate, setTargetDate] = useState('2027-06-30');
  const [budgetAllocated, setBudgetAllocated] = useState(25000000);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) return;

    addProject({
      name,
      location,
      manager,
      supervisor,
      status: 'scheduled',
      workforceCount: 0,
      progressPercent: 0,
      startDate,
      targetDate,
      budgetAllocated: Number(budgetAllocated),
    });

    setName('');
    setLocation('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-7 pb-16 font-sans">
      <PageHeader
        tag={t('projects_tag')}
        title={t('projects_title')}
        subtitle={t('projects_subtitle')}
        primaryAction={
          role === 'contractor' || role === 'project_manager'
            ? {
                label: t('action_new_project'),
                icon: <Plus className="w-4 h-4 text-[#F4F0E8]" />,
                onClick: () => setModalOpen(true),
              }
            : undefined
        }
      />

      {/* Filter, Search & 3D View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 bg-[#F4F0E8] p-4 sm:p-5 border border-[#51483D]/20 rounded-3xl shadow-ivory-card">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#96938B]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('projects_search_placeholder')}
            className="w-full pl-11 pr-4 py-2.5 min-h-[44px] text-xs font-bold text-[#252521] placeholder:text-[#96938B] bg-[#ECE5DA] border border-[#51483D]/25 rounded-2xl focus:outline-hidden focus:border-[#A77B50]"
          />
        </div>

        <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-[#51483D]/20 pt-2 sm:pt-0 sm:pl-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#51483D]">{t('projects_filter_status')}</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-h-[44px] text-xs font-bold text-[#252521] bg-[#ECE5DA] border border-[#51483D]/25 rounded-2xl px-3.5 py-2 focus:outline-hidden focus:border-[#A77B50] cursor-pointer"
            >
              <option value="all">{t('projects_status_all')}</option>
              <option value="active">{t('status_active')}</option>
              <option value="scheduled">{t('status_scheduled')}</option>
              <option value="on_hold">{t('status_on_hold')}</option>
              <option value="completed">{t('status_completed')}</option>
            </select>
          </div>

          <div className="flex items-center bg-[#ECE5DA] border border-[#51483D]/25 rounded-2xl p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl cursor-pointer transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-[#A77B50] to-[#8E653C] text-[#F4F0E8] shadow-sm'
                  : 'text-[#96938B] hover:text-[#252521]'
              }`}
              title="3D Tilt Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl cursor-pointer transition-all ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-[#A77B50] to-[#8E653C] text-[#F4F0E8] shadow-sm'
                  : 'text-[#96938B] hover:text-[#252521]'
              }`}
              title="Table List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View Mode: 3D Tilt Cards Grid with Specular Glare */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((p) => {
            const bgImage = PROJECT_IMAGES[p.id] || PROJECT_IMAGES['proj-1'];
            return (
              <Interactive3DCard
                key={p.id}
                depth={22}
                className="bg-[#F4F0E8] border border-[#51483D]/25 rounded-3xl overflow-hidden shadow-ivory-card flex flex-col justify-between"
              >
                {/* Architectural Building Image Header */}
                <div className="relative h-48 w-full overflow-hidden bg-[#252521]">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-108"
                    style={{ backgroundImage: `url('${bgImage}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#252521] via-[#252521]/50 to-transparent" />

                  {/* Top Badges Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="font-mono text-xs font-black uppercase px-3 py-1 rounded-full bg-[#252521]/80 backdrop-blur-xs text-[#A77B50] border border-[#A77B50]/50 shadow-sm">
                      {p.code}
                    </span>
                    <StatusBadge status={p.status} size="sm" />
                  </div>

                  {/* Bottom Image Title */}
                  <div className="absolute bottom-3.5 left-4 right-4">
                    <h3 className="text-lg font-black text-[#F4F0E8] drop-shadow-md truncate">
                      {localizeSiteFull(p.id, t)}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#D8CCB9] mt-0.5 font-bold">
                      <MapPin className="w-3.5 h-3.5 text-[#A77B50] shrink-0" />
                      <span>{localizeLocation(p.id, p.location, t)}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body in Soft Ivory */}
                <div className="p-6 space-y-4">
                  {/* Progress Meter with Antique Bronze Fill */}
                  <div>
                    <div className="flex justify-between text-xs font-black mb-1.5">
                      <span className="text-[#51483D] uppercase tracking-wider text-[11px]">Milestone Scope Completion</span>
                      <span className="text-[#252521] tabular-nums font-black text-sm">{p.progressPercent}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#D8CCB9] rounded-full overflow-hidden border border-[#51483D]/15">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${p.progressPercent}%` }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-[#A77B50] to-[#8E653C] rounded-full shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Metrics Footer Details */}
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#51483D]/15 text-xs">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#96938B] block">Site Workforce</span>
                      <div className="font-black text-[#252521] text-sm mt-0.5 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#A77B50]" />
                        <span>{p.workforceCount > 0 ? `${p.workforceCount} Laborers` : 'None deployed'}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#96938B] block">Target Handover</span>
                      <div className="font-black text-[#252521] text-sm mt-0.5 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#51483D]" />
                        <span>{p.targetDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#51483D] font-semibold pt-1 flex justify-between items-center border-t border-[#51483D]/10">
                    <span>Supervisor: <strong className="text-[#252521]">{p.supervisor}</strong></span>
                    <span>Manager: <strong className="text-[#252521]">{p.manager}</strong></span>
                  </div>
                </div>
              </Interactive3DCard>
            );
          })}
        </div>
      ) : (
        /* View Mode: Soft Ivory Data Table */
        <div className="bg-[#F4F0E8] border border-[#51483D]/20 rounded-3xl overflow-hidden shadow-ivory-card">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#252521] text-[#F4F0E8] border-b border-[#51483D]/30 font-black text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">{t('table_project')}</th>
                  <th className="px-4 py-4">{t('table_site_supervision')}</th>
                  <th className="px-4 py-4">{t('table_workforce')}</th>
                  <th className="px-4 py-4">{t('table_progress')}</th>
                  <th className="px-4 py-4">{t('table_target_completion')}</th>
                  <th className="px-5 py-4">{t('table_status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#51483D]/15 bg-[#F4F0E8]">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-xs font-semibold text-[#51483D]">
                      {t('empty_records_title')}
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-[#ECE5DA] transition-colors">
                      <td className="px-5 py-4.5">
                        <div className="font-black text-sm text-[#252521]">{localizeSiteFull(p.id, t)}</div>
                        <div className="text-xs text-[#51483D] mt-0.5 font-semibold">
                          <span className="font-mono text-[#A77B50] font-bold">{p.code}</span> · {localizeLocation(p.id, p.location, t)}
                        </div>
                      </td>
                      <td className="px-4 py-4.5">
                        <div className="text-[#252521] font-black text-xs">{p.manager}</div>
                        <div className="text-xs text-[#51483D] mt-0.5">{t('projects_supervisor_label', { name: p.supervisor })}</div>
                      </td>
                      <td className="px-4 py-4.5 font-black text-sm text-[#252521] tabular-nums">
                        {p.workforceCount > 0 ? t('projects_workers_count', { count: p.workforceCount }) : t('projects_none_deployed')}
                      </td>
                      <td className="px-4 py-4.5">
                        <div className="w-36">
                          <div className="text-xs font-black text-[#252521] tabular-nums mb-1">
                            {p.progressPercent}%
                          </div>
                          <div className="w-full h-2 bg-[#D8CCB9] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#A77B50] to-[#8E653C] rounded-full"
                              style={{ width: `${p.progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4.5 text-[#51483D] tabular-nums font-bold text-xs">{p.targetDate}</td>
                      <td className="px-5 py-4.5">
                        <StatusBadge status={p.status} size="sm" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t('projects_modal_title')}
        subtitle={t('projects_modal_subtitle')}
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 min-h-[44px] text-xs font-bold text-[#51483D] hover:text-[#252521] cursor-pointer"
            >
              {t('action_cancel')}
            </button>
            <button
              type="submit"
              form="new-project-form"
              className="px-5 py-2.5 min-h-[44px] text-xs font-black text-[#F4F0E8] bg-gradient-to-r from-[#A77B50] to-[#8E653C] hover:opacity-95 rounded-2xl shadow-md cursor-pointer transition-all active:scale-95"
            >
              {t('action_create_project_site')}
            </button>
          </div>
        }
      >
        <form id="new-project-form" onSubmit={handleCreateProject} className="space-y-4 text-xs">
          <div>
            <label className="block font-black text-[#252521] mb-1.5">{t('projects_form_name')}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('projects_form_name_ph')}
              className="w-full px-4 py-2.5 bg-[#ECE5DA] border border-[#51483D]/30 rounded-2xl text-sm font-bold text-[#252521] focus:outline-hidden focus:border-[#A77B50]"
            />
          </div>

          <div>
            <label className="block font-black text-[#252521] mb-1.5">{t('projects_form_location')}</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t('projects_form_location_ph')}
              className="w-full px-4 py-2.5 bg-[#ECE5DA] border border-[#51483D]/30 rounded-2xl text-sm font-bold text-[#252521] focus:outline-hidden focus:border-[#A77B50]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block font-black text-[#252521] mb-1.5">{t('projects_form_manager')}</label>
              <input
                type="text"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#ECE5DA] border border-[#51483D]/30 rounded-2xl text-xs font-bold text-[#252521] focus:outline-hidden focus:border-[#A77B50]"
              />
            </div>
            <div>
              <label className="block font-black text-[#252521] mb-1.5">{t('projects_form_supervisor')}</label>
              <input
                type="text"
                value={supervisor}
                onChange={(e) => setSupervisor(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#ECE5DA] border border-[#51483D]/30 rounded-2xl text-xs font-bold text-[#252521] focus:outline-hidden focus:border-[#A77B50]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block font-black text-[#252521] mb-1.5">{t('projects_form_start_date')}</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#ECE5DA] border border-[#51483D]/30 rounded-2xl text-xs font-bold text-[#252521] focus:outline-hidden focus:border-[#A77B50]"
              />
            </div>
            <div>
              <label className="block font-black text-[#252521] mb-1.5">{t('projects_form_target_date')}</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#ECE5DA] border border-[#51483D]/30 rounded-2xl text-xs font-bold text-[#252521] focus:outline-hidden focus:border-[#A77B50]"
              />
            </div>
          </div>

          <div>
            <label className="block font-black text-[#252521] mb-1.5">{t('projects_form_budget')}</label>
            <input
              type="number"
              value={budgetAllocated}
              onChange={(e) => setBudgetAllocated(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-[#ECE5DA] border border-[#51483D]/30 rounded-2xl text-sm font-bold text-[#252521] focus:outline-hidden focus:border-[#A77B50] tabular-nums"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
