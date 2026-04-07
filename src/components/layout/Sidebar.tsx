'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkflowStore } from '@/store/workflowStore';
import { projectApi } from '@/services/api';
import { STEP_NAMES, STEP_ICONS } from '@/types';
import {
  Headphones, Heart, BarChart3, ArrowRightLeft, FlaskConical, FileOutput,
  Plus, ChevronRight, Check, Clock, Menu, X, LogOut, Trash2,
} from 'lucide-react';
import Link from 'next/link';

const ICON_MAP = [Headphones, Heart, BarChart3, ArrowRightLeft, FlaskConical, FileOutput];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const router = useRouter();
  const { project, currentStep, stepData, loadProject, createProject } = useWorkflowStore();
  const [projects, setProjects] = useState<Array<{ id: string; name: string; status: string; current_step: number }>>([]);
  const [showProjects, setShowProjects] = useState(false);

  // Load projects on mount
  useEffect(() => {
    projectApi.list().then(setProjects).catch(() => {});
  }, []);

  const handleCreateProject = async () => {
    const name = `项目 ${projects.length + 1}`;
    const id = await createProject(name);
    router.push(`/workspace/${id}`);
  };

  const handleDeleteProject = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (!confirm('确定要删除这个项目吗？')) return;
    try {
      await projectApi.delete(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      if (project?.id === projectId) {
        router.push('/workspace/new');
      }
    } catch {}
  };

  const handleSelectProject = (projectId: string) => {
    loadProject(projectId);
    router.push(`/workspace/${projectId}`);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-[280px] bg-[var(--bg-card)] border-r border-[var(--border)] z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--accent-green)] to-[var(--accent-blue)] flex items-center justify-center">
              <FileOutput size={16} className="text-white" />
            </div>
            <span className="font-heading font-semibold text-sm">Design Language Translation - ID Showflat</span>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 rounded-md hover:bg-[var(--bg-hover)] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Projects */}
        <div className="p-4 border-b border-[var(--border)]">
          <button
            onClick={() => setShowProjects(!showProjects)}
            className="flex items-center justify-between w-full text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <span>项目列表</span>
            <ChevronRight size={14} className={`transition-transform ${showProjects ? 'rotate-90' : ''}`} />
          </button>

          {showProjects && (
            <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
              {projects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectProject(p.id)}
                  className={`group flex items-center px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                    project?.id === p.id
                      ? 'bg-[var(--accent-green)]/10 text-[var(--accent-green)]'
                      : 'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{p.name}</div>
                    <div className="text-xs opacity-60">步骤 {p.current_step}/6</div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteProject(e, p.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[var(--accent-red)]/20 hover:text-[var(--accent-red)] transition-all cursor-pointer shrink-0"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <button
                onClick={handleCreateProject}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--accent-green)] hover:bg-[var(--accent-green)]/10 rounded-lg transition-colors cursor-pointer"
              >
                <Plus size={14} />
                新建项目
              </button>
              {projects.length > 0 && (
                <button
                  onClick={() => {
                    if (!confirm(`确定要清空全部 ${projects.length} 个项目吗？此操作不可恢复。`)) return;
                    projectApi.clearAll().then(() => {
                      setProjects([]);
                      if (project) router.push('/workspace/new');
                    });
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--accent-red)] hover:bg-[var(--accent-red)]/10 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                  清空全部项目
                </button>
              )}
            </div>
          )}
        </div>

        {/* Step Timeline */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">
            工作流程
          </h3>
          <div className="space-y-1">
            {STEP_NAMES.map((name, i) => {
              const stepNum = i + 1;
              const isCompleted = stepData[stepNum] && currentStep >= stepNum;
              const isActive = currentStep === stepNum;
              const isLocked = !project || currentStep < stepNum;
              const Icon = ICON_MAP[i];

              return (
                <button
                  key={stepNum}
                  onClick={() => {
                    if (isCompleted && !isActive) {
                      useWorkflowStore.getState().gotoStep(stepNum);
                    }
                  }}
                  disabled={isLocked}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[var(--accent-amber)]/10 border border-[var(--accent-amber)]/30'
                      : isCompleted
                      ? 'hover:bg-[var(--bg-hover)]'
                      : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isCompleted
                        ? 'bg-[var(--accent-green)] text-white'
                        : isActive
                        ? 'bg-[var(--accent-amber)] text-white animate-pulse-slow'
                        : 'bg-[var(--bg-hover)] text-[var(--text-muted)]'
                    }`}
                  >
                    {isCompleted ? <Check size={14} /> : <Icon size={14} />}
                  </div>
                  <div className="text-left min-w-0">
                    <div
                      className={`text-sm font-medium truncate ${
                        isActive ? 'text-[var(--accent-amber)]' : ''
                      }`}
                    >
                      {name}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {isCompleted ? '已完成' : isActive ? '进行中' : '待开始'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border)]">
          <Link
            href="https://siliang.cfd"
            className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            <LogOut size={14} />
            返回主门户
          </Link>
        </div>
      </aside>
    </>
  );
}
