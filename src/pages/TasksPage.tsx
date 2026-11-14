import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import {
  Edit3,
  Users,
  Plus,
  CheckCircle,
  Calendar,
  Building,
  Hammer,
  TrendingUp,
  UserCheck,
  CheckSquare,
  Square,
  AlertCircle,
  HardHat,
  Layers,
} from 'lucide-react';
import { TaskItem, WorkerTrade } from '../types';
import { localizeUnit, localizeSite, localizeTaskTitle } from '../i18n/localize';

export const TasksPage: React.FC = () => {
  const { role, t, tasks, workers, projects, updateTaskProgress, assignWorkersToTask, createTask } = useApp();

  const [tradeFilter, setTradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [selectedTaskForProgress, setSelectedTaskForProgress] = useState<TaskItem | null>(null);
  const [newCompletedQty, setNewCompletedQty] = useState<number>(0);

  const [selectedTaskForCrew, setSelectedTaskForCrew] = useState<TaskItem | null>(null);
  const [crewWorkerIds, setCrewWorkerIds] = useState<string[]>([]);

  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSiteId, setNewTaskSiteId] = useState(projects[0]?.id || 'proj-1');
  const [newTaskTrade, setNewTaskTrade] = useState<WorkerTrade>('mason');
  const [newTaskTargetQty, setNewTaskTargetQty] = useState<number>(100);
  const [newTaskUnit, setNewTaskUnit] = useState('m³');
  const [newTaskDeadline, setNewTaskDeadline] = useState('2026-10-30');
  const [newTaskSupervisor, setNewTaskSupervisor] = useState('Aniket Patil');
  const [newTaskWorkerIds, setNewTaskWorkerIds] = useState<string[]>([]);

  const isWorker = role === 'worker';

  // Filter tasks
  const filteredTasks = tasks.filter((tsk) => {
    if (tradeFilter !== 'all' && tsk.trade !== tradeFilter) return false;
    if (statusFilter !== 'all' && tsk.status !== statusFilter) return false;
    return true;
  });

  // Calculate high-level task metrics
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const totalAllocatedWorkers = tasks.reduce((sum, t) => sum + (t.assignedWorkersCount || 0), 0);

  // Handlers
  const handleOpenProgressModal = (tsk: TaskItem) => {
    setSelectedTaskForProgress(tsk);
    setNewCompletedQty(tsk.completedQuantity);
  };

  const handleSaveProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTaskForProgress) {
      updateTaskProgress(selectedTaskForProgress.id, Number(newCompletedQty));
      setSelectedTaskForProgress(null);
    }
  };

  const handleOpenCrewModal = (tsk: TaskItem) => {
    setSelectedTaskForCrew(tsk);
    setCrewWorkerIds(tsk.assignedWorkerIds || []);
  };

  const toggleWorkerInCrew = (wId: string) => {
    setCrewWorkerIds((prev) =>
      prev.includes(wId) ? prev.filter((id) => id !== wId) : [...prev, wId]
    );
  };

  const handleSaveCrewAssignment = () => {
    if (selectedTaskForCrew) {
      assignWorkersToTask(selectedTaskForCrew.id, crewWorkerIds);
      setSelectedTaskForCrew(null);
    }
  };

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const siteObj = projects.find((p) => p.id === newTaskSiteId);
    createTask({
      siteId: newTaskSiteId,
      siteName: siteObj ? siteObj.name : 'Metro Elevated Corridor',
      title: newTaskTitle,
      trade: newTaskTrade,
      targetQuantity: Number(newTaskTargetQty),
      unit: newTaskUnit,
      deadline: newTaskDeadline,
      leadSupervisor: newTaskSupervisor,
      assignedWorkerIds: newTaskWorkerIds,
      assignedWorkersCount: newTaskWorkerIds.length,
    });

    setCreateTaskModalOpen(false);
    setNewTaskTitle('');
    setNewTaskWorkerIds([]);
  };

  const toggleNewTaskWorker = (wId: string) => {
    setNewTaskWorkerIds((prev) =>
      prev.includes(wId) ? prev.filter((id) => id !== wId) : [...prev, wId]
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        tag={t('tasks_tag')}
        title={t('tasks_title')}
        subtitle={t('tasks_subtitle')}
        primaryAction={
          !isWorker
            ? {
                label: 'Create Trade Task',
                icon: <Plus className="w-4 h-4 text-[#0C0E12]" />,
                onClick: () => setCreateTaskModalOpen(true),
              }
            : undefined
        }
      />

      {/* Aggregate Metric Strip with Heavy Industrial Contrast */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 sm:p-5 bg-[#F4F0E8] border border-[#51483D]/25 rounded-xl shadow-ivory-card"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-[#51483D] block">
            Total site tasks
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#252521] tabular-nums mt-1.5">
            {totalTasks}
          </div>
          <span className="text-xs font-medium text-[#96938B] mt-1 block">Across all sites</span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 sm:p-5 bg-[#F4F0E8] border border-[#51483D]/25 rounded-xl shadow-ivory-card"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-[#51483D] block">
            In progress
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#A77B50] tabular-nums mt-1.5">
            {inProgressTasks}
          </div>
          <span className="text-xs font-medium text-[#96938B] mt-1 block">Active trade targets</span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 sm:p-5 bg-[#F4F0E8] border border-[#51483D]/25 rounded-xl shadow-ivory-card"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-[#51483D] block">
            Milestones completed
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#10B981] tabular-nums mt-1.5">
            {completedTasks}
          </div>
          <span className="text-xs font-medium text-[#96938B] mt-1 block">100% target met</span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 sm:p-5 bg-[#F4F0E8] border border-[#51483D]/25 rounded-xl shadow-ivory-card"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-[#51483D] block">
            Workforce allocated
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#252521] tabular-nums mt-1.5">
            {totalAllocatedWorkers}
          </div>
          <span className="text-xs font-medium text-[#96938B] mt-1 block">Trade crew members</span>
        </motion.div>
      </div>

      {/* Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F4F0E8] p-4 border border-[#51483D]/25 rounded-xl shadow-ivory-card">
        <div className="flex flex-wrap items-center gap-3">
          {/* Trade Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#51483D]">{t('tasks_filter_trade')}</span>
            <select
              value={tradeFilter}
              onChange={(e) => setTradeFilter(e.target.value)}
              className="min-h-[40px] text-xs font-bold text-[#252521] bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg px-3 py-1.5 focus:outline-hidden focus:border-[#A77B50] cursor-pointer"
            >
              <option value="all">{t('tasks_filter_all')}</option>
              <option value="mason">{t('trade_mason')}</option>
              <option value="steel_fixer">{t('trade_steel_fixer')}</option>
              <option value="carpenter">{t('trade_carpenter')}</option>
              <option value="electrician">{t('trade_electrician')}</option>
              <option value="equipment_operator">{t('trade_equipment_operator')}</option>
              <option value="welder">{t('trade_welder')}</option>
              <option value="general_helper">{t('trade_general_helper')}</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#51483D]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-h-[40px] text-xs font-bold text-[#252521] bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg px-3 py-1.5 focus:outline-hidden focus:border-[#A77B50] cursor-pointer"
            >
              <option value="all">All statuses</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
              <option value="review_required">Review required</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-bold text-[#51483D]">
          {t('tasks_showing_count', { count: filteredTasks.length })}
        </div>
      </div>

      {/* High-Legibility Tasks Data Grid */}
      <div className="bg-[#F4F0E8] border border-[#51483D]/25 rounded-xl overflow-hidden shadow-ivory-card">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#252521] text-[#F4F0E8] border-b border-[#51483D]/25 font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">{t('table_task')}</th>
                <th className="px-4 py-3.5">{t('table_site_supervisor')}</th>
                <th className="px-4 py-3.5">Allocated Crew</th>
                <th className="px-4 py-3.5">{t('table_target_completed')}</th>
                <th className="px-4 py-3.5">{t('table_progress')}</th>
                <th className="px-4 py-3.5">{t('table_deadline')}</th>
                <th className="px-4 py-3.5">{t('table_status')}</th>
                <th className="px-5 py-3.5 text-right">{t('table_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#51483D]/15 bg-[#F4F0E8]">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-xs font-semibold text-[#51483D]">
                    {t('empty_records_title')}
                  </td>
                </tr>
              ) : (
                filteredTasks.map((tsk) => {
                  const percent = Math.min(100, Math.round((tsk.completedQuantity / tsk.targetQuantity) * 100));
                  const assignedCount = tsk.assignedWorkerIds?.length || tsk.assignedWorkersCount || 0;

                  return (
                    <tr key={tsk.id} className="hover:bg-[#ECE5DA] transition-colors group">
                      <td className="px-5 py-4">
                        <div className="font-extrabold text-sm text-[#252521] group-hover:text-[#A77B50] transition-colors">
                          {localizeTaskTitle(tsk.id, tsk.title, t)}
                        </div>
                        <div className="text-xs font-bold text-[#A77B50] mt-1 flex items-center gap-1.5">
                          <Hammer className="w-3.5 h-3.5" />
                          <span>{t(`trade_${tsk.trade}`)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-[#252521] font-bold text-xs">{localizeSite(tsk.siteName, t)}</div>
                        <div className="text-xs text-[#51483D] mt-0.5 font-medium">{t('tasks_lead', { name: tsk.leadSupervisor })}</div>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => handleOpenCrewModal(tsk)}
                          className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ECE5DA] hover:bg-[#E2D8CA] border border-[#51483D]/25 text-[#252521] font-bold text-xs transition-all cursor-pointer active:scale-95"
                          title="Click to view & assign trade workers"
                        >
                          <Users className="w-3.5 h-3.5 text-[#A77B50]" />
                          <span>{assignedCount} Workers</span>
                        </button>
                      </td>
                      <td className="px-4 py-4 font-extrabold text-sm text-[#252521] tabular-nums">
                        {tsk.completedQuantity} / {tsk.targetQuantity} {localizeUnit(tsk.unit, t)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-32">
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-[#252521] tabular-nums">{percent}%</span>
                          </div>
                          <div className="w-full h-2 bg-[#242A36] border border-[#51483D]/25 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                              className={`h-full rounded-full ${
                                percent >= 100 ? 'bg-[#10B981]' : 'bg-[#A77B50]'
                              }`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[#51483D] tabular-nums font-bold text-xs">{tsk.deadline}</td>
                      <td className="px-4 py-4">
                        <StatusBadge status={tsk.status} size="sm" />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenProgressModal(tsk)}
                            className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold text-[#252521] bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg hover:bg-[#A77B50] hover:text-[#0C0E12] hover:border-[#A77B50] transition-all cursor-pointer active:scale-95"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Progress</span>
                          </button>
                          {!isWorker && (
                            <button
                              type="button"
                              onClick={() => handleOpenCrewModal(tsk)}
                              className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold text-[#A77B50] hover:text-[#252521] bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg hover:bg-[#E2D8CA] transition-all cursor-pointer active:scale-95"
                              title="Assign Workers to Crew"
                            >
                              <UserCheck className="w-3.5 h-3.5 text-[#A77B50]" />
                              <span className="hidden sm:inline">Crew</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. Update Progress Modal */}
      <Modal
        isOpen={!!selectedTaskForProgress}
        onClose={() => setSelectedTaskForProgress(null)}
        title={t('tasks_modal_title')}
        subtitle={selectedTaskForProgress ? localizeTaskTitle(selectedTaskForProgress.id, selectedTaskForProgress.title, t) : undefined}
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={() => setSelectedTaskForProgress(null)}
              className="px-4 py-2 min-h-[44px] text-xs font-bold text-[#51483D] hover:text-[#252521] cursor-pointer"
            >
              {t('action_cancel')}
            </button>
            <button
              type="submit"
              form="update-progress-form"
              className="px-5 py-2.5 min-h-[44px] text-xs font-extrabold text-[#0C0E12] bg-[#A77B50] hover:bg-[#936B42] rounded-lg shadow-md cursor-pointer transition-all active:scale-95"
            >
              {t('action_save_quantity')}
            </button>
          </div>
        }
      >
        {selectedTaskForProgress && (
          <form id="update-progress-form" onSubmit={handleSaveProgress} className="space-y-4 text-xs">
            <div className="p-4 bg-[#ECE5DA] border border-[#51483D]/25 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#51483D]">{t('tasks_modal_target')}</div>
                <div className="font-extrabold text-lg text-[#252521] tabular-nums mt-0.5">
                  {selectedTaskForProgress.targetQuantity} {localizeUnit(selectedTaskForProgress.unit, t)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-[#51483D] block">Trade Crew</span>
                <span className="text-xs font-extrabold text-[#A77B50]">
                  {selectedTaskForProgress.assignedWorkersCount || 0} Workers Assigned
                </span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#252521] text-xs mb-1.5">
                Completed Quantity ({localizeUnit(selectedTaskForProgress.unit, t)}):
              </label>
              <input
                type="number"
                min={0}
                max={selectedTaskForProgress.targetQuantity * 2}
                step={0.1}
                required
                value={newCompletedQty}
                onChange={(e) => setNewCompletedQty(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg text-lg font-extrabold text-[#252521] tabular-nums focus:outline-hidden focus:border-[#A77B50]"
              />

              {/* Quick Stepper Buttons */}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-[#51483D] font-bold">Quick Output:</span>
                {[5, 10, 25, 50].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() =>
                      setNewCompletedQty((prev) =>
                        Math.min(selectedTaskForProgress.targetQuantity * 1.5, Math.round((prev + inc) * 10) / 10)
                      )
                    }
                    className="min-h-[38px] px-3 py-1 rounded-md bg-[#ECE5DA] hover:bg-[#E2D8CA] border border-[#51483D]/25 text-xs font-extrabold text-[#252521] cursor-pointer transition-all active:scale-95"
                  >
                    +{inc}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Progress Preview */}
            <div className="p-4 bg-[#ECE5DA] border border-[#51483D]/25 rounded-xl space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#51483D]">Projected Completion:</span>
                <span className="text-[#252521] tabular-nums">
                  {Math.min(100, Math.round((newCompletedQty / selectedTaskForProgress.targetQuantity) * 100))}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#ECE5DA] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    newCompletedQty >= selectedTaskForProgress.targetQuantity ? 'bg-[#10B981]' : 'bg-[#A77B50]'
                  }`}
                  style={{
                    width: `${Math.min(100, (newCompletedQty / selectedTaskForProgress.targetQuantity) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* 2. Assign Trade Crew Modal */}
      {selectedTaskForCrew && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTaskForCrew(null)}
          title={`Assign Trade Crew — ${selectedTaskForCrew.title}`}
          subtitle={`Required Trade: ${t(`trade_${selectedTaskForCrew.trade}`)} | Selected Site: ${selectedTaskForCrew.siteName}`}
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-[#51483D] font-bold">
                {crewWorkerIds.length} Workers Selected for Crew
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTaskForCrew(null)}
                  className="px-4 py-2 min-h-[44px] text-xs font-bold text-[#51483D] hover:text-[#252521] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCrewAssignment}
                  className="px-5 py-2.5 min-h-[44px] text-xs font-extrabold text-[#0C0E12] bg-[#A77B50] hover:bg-[#936B42] rounded-lg shadow-md cursor-pointer transition-all active:scale-95"
                >
                  Save Crew Allocation
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-4 bg-[#ECE5DA] border border-[#51483D]/25 rounded-xl text-[#51483D] text-xs flex items-center gap-3">
              <UserCheck className="w-5 h-5 text-[#A77B50] shrink-0" />
              <span>
                Workers matching the task's required trade (<strong className="text-[#252521]">{t(`trade_${selectedTaskForCrew.trade}`)}</strong>) are highlighted below. Click to toggle assignment.
              </span>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {workers.map((w) => {
                const isSelected = crewWorkerIds.includes(w.id);
                const isTradeMatch = w.trade === selectedTaskForCrew.trade;

                return (
                  <div
                    key={w.id}
                    onClick={() => toggleWorkerInCrew(w.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between active:scale-[0.99] ${
                      isSelected
                        ? 'bg-[#ECE5DA] border-[#A77B50] text-white shadow-xs'
                        : isTradeMatch
                        ? 'bg-[#F4F0E8] border-[#51483D]/25 hover:border-[#A77B50]/60 text-[#252521]'
                        : 'bg-[#ECE5DA] border-[#51483D]/25 opacity-65 text-[#96938B]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 text-[#A77B50]">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-[#A77B50]" />
                        ) : (
                          <Square className="w-5 h-5 text-[#96938B]" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold flex items-center gap-2 text-[#252521]">
                          <span>{w.fullName}</span>
                          <span className="font-mono text-xs font-extrabold text-[#A77B50] bg-[#ECE5DA] border border-[#51483D]/25 px-2 py-0.5 rounded">
                            {w.workerId}
                          </span>
                        </div>
                        <div className="text-xs text-[#51483D] font-medium mt-1">
                          {t(`trade_${w.trade}`)} · ₹{w.dailyWageRate}/day · {w.assignedSiteName}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {isTradeMatch ? (
                        <span className="text-xs font-bold text-[#10B981] bg-[#10B981]/20 border border-[#10B981]/40 px-2.5 py-0.5 rounded-full">
                          Trade Match
                        </span>
                      ) : (
                        <span className="text-xs text-[#96938B]">Cross-trade</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Modal>
      )}

      {/* 3. Create New Task Modal */}
      {createTaskModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setCreateTaskModalOpen(false)}
          title="Create New Site Trade Task"
          subtitle="Assign concrete volumes, masonry targets, or rebar quotas to workforce"
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => setCreateTaskModalOpen(false)}
                className="px-4 py-2 min-h-[44px] text-xs font-bold text-[#51483D] hover:text-[#252521] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="create-task-form"
                className="px-5 py-2.5 min-h-[44px] text-xs font-extrabold text-[#0C0E12] bg-[#A77B50] hover:bg-[#936B42] rounded-lg shadow-md cursor-pointer transition-all active:scale-95"
              >
                Create & Assign Task
              </button>
            </div>
          }
        >
          <form id="create-task-form" onSubmit={handleCreateTaskSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#252521] mb-1.5">Task Title / Milestone Description *</label>
              <input
                type="text"
                required
                placeholder="e.g., Pier 31 Cap Beam Concreting & Curing"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg text-sm text-[#252521] focus:outline-hidden focus:border-[#A77B50]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#252521] mb-1.5">Project Site *</label>
                <select
                  value={newTaskSiteId}
                  onChange={(e) => setNewTaskSiteId(e.target.value)}
                  className="w-full p-2.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg text-[#252521] font-bold focus:outline-hidden focus:border-[#A77B50]"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#252521] mb-1.5">Trade Category *</label>
                <select
                  value={newTaskTrade}
                  onChange={(e) => setNewTaskTrade(e.target.value as WorkerTrade)}
                  className="w-full p-2.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg text-[#252521] font-bold focus:outline-hidden focus:border-[#A77B50]"
                >
                  <option value="mason">Mason (Brick & Blockwork)</option>
                  <option value="steel_fixer">Steel Fixer (Rebar Cages)</option>
                  <option value="carpenter">Carpenter (Formwork & Shuttering)</option>
                  <option value="electrician">Electrician (Conduiting & Power)</option>
                  <option value="equipment_operator">Equipment Operator (Compactors & Cranes)</option>
                  <option value="welder">Welder (Structural Jointing)</option>
                  <option value="general_helper">General Helper (Batching & Loading)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-[#252521] mb-1.5">Target Quantity *</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={newTaskTargetQty}
                  onChange={(e) => setNewTaskTargetQty(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg text-sm text-[#252521] font-bold tabular-nums focus:outline-hidden focus:border-[#A77B50]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#252521] mb-1.5">Unit *</label>
                <select
                  value={newTaskUnit}
                  onChange={(e) => setNewTaskUnit(e.target.value)}
                  className="w-full p-2.5 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg text-[#252521] font-bold focus:outline-hidden focus:border-[#A77B50]"
                >
                  <option value="m³">m³ (Cubic Meters)</option>
                  <option value="MT">MT (Metric Tons)</option>
                  <option value="sq.m">sq.m (Square Meters)</option>
                  <option value="cu.m">cu.m (Compacted Earth)</option>
                  <option value="units">units (Blocks / Pieces)</option>
                  <option value="m">m (Linear Meters)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#252521] mb-1.5">Deadline *</label>
                <input
                  type="date"
                  required
                  value={newTaskDeadline}
                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg text-sm text-[#252521] font-bold focus:outline-hidden focus:border-[#A77B50]"
                />
              </div>
            </div>

            {/* Quick Crew Pre-allocation */}
            <div className="border-t border-[#51483D]/25 pt-3">
              <label className="block font-bold text-[#252521] mb-1.5">
                Assign Crew Members ({newTaskWorkerIds.length} Selected):
              </label>
              <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 bg-[#ECE5DA] border border-[#51483D]/25 rounded-lg">
                {workers
                  .filter((w) => w.trade === newTaskTrade)
                  .map((w) => (
                    <label
                      key={w.id}
                      className="flex items-center gap-2.5 p-2 rounded hover:bg-[#ECE5DA] cursor-pointer text-[#252521]"
                    >
                      <input
                        type="checkbox"
                        checked={newTaskWorkerIds.includes(w.id)}
                        onChange={() => toggleNewTaskWorker(w.id)}
                        className="rounded border-[#51483D]/25 text-[#A77B50] accent-[#F59E0B]"
                      />
                      <span className="font-bold">{w.fullName}</span>
                      <span className="text-[#51483D] text-xs">({w.workerId})</span>
                    </label>
                  ))}
                {workers.filter((w) => w.trade === newTaskTrade).length === 0 && (
                  <div className="text-xs text-[#51483D] p-2 text-center">
                    No enrolled workers found for {t(`trade_${newTaskTrade}`)}. You can assign crew later.
                  </div>
                )}
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
