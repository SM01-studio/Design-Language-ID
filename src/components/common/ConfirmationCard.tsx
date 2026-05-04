'use client';

import { useWorkflowStore } from '@/store/workflowStore';
import { STEP_NAMES } from '@/types';
import { Check, ChevronRight, Plus, FileText, FileDown, Package, BookOpen } from 'lucide-react';
import { exportApi, API_BASE_URL, getToken } from '@/services/api';
import { useState } from 'react';

interface ConfirmationCardProps {
  step: number;
  onConfirm: () => void;
}

export default function ConfirmationCard({ step, onConfirm }: ConfirmationCardProps) {
  const { project } = useWorkflowStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'docx' | 'pdf') => {
    if (!project || isExporting) return;
    setIsExporting(true);
    try {
      await exportApi.exportStep(project.id, format, step);
    } catch (err: any) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportFullPackage = async () => {
    if (!project || isExporting) return;
    setIsExporting(true);
    try {
      await exportApi.exportPackage(project.id, 'docx');
    } catch (err: any) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportMerged = async (format: 'docx' | 'pdf') => {
    if (!project || isExporting) return;
    setIsExporting(true);
    try {
      const token = getToken();
      const res = await fetch(
        `${API_BASE_URL}/projects/${project.id}/export-merged?format=${format}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const disposition = res.headers.get('Content-Disposition');
      const match = disposition?.match(/filename\*?=(?:UTF-8''|"?)([^";]+)/i);
      const filename = match ? decodeURIComponent(match[1].replace(/"/g, '')) : `完整报告.${format}`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Merged export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="glass-card p-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[var(--accent-green)] flex items-center justify-center">
            <Check size={12} className="text-white" />
          </div>
          <span className="text-sm font-medium">
            {STEP_NAMES[step - 1]} 已完成
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors cursor-pointer disabled:opacity-50"
            title="导出 PDF"
          >
            <FileText size={12} />
            PDF
          </button>
          <button
            onClick={() => handleExport('docx')}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors cursor-pointer disabled:opacity-50"
            title="导出 Word"
          >
            <FileDown size={12} />
            DOCX
          </button>
          {step === 6 && (
            <>
              <button
                onClick={handleExportFullPackage}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[var(--accent-amber)] text-white hover:opacity-90 transition-colors cursor-pointer disabled:opacity-50"
                title="导出完整交付包（ZIP，含各步骤独立文件）"
              >
                <Package size={12} />
                交付包ZIP
              </button>
              <button
                onClick={() => handleExportMerged('docx')}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[var(--accent-green)] text-white hover:bg-[var(--accent-green-hover)] transition-colors cursor-pointer disabled:opacity-50"
                title="导出完整报告（单文件，含封面+目录+全部章节）"
              >
                <BookOpen size={12} />
                完整报告DOCX
              </button>
              <button
                onClick={() => handleExportMerged('pdf')}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[var(--accent-green)] text-white hover:bg-[var(--accent-green-hover)] transition-colors cursor-pointer disabled:opacity-50"
                title="导出完整报告PDF（单文件，含封面+目录+全部章节）"
              >
                <BookOpen size={12} />
                完整报告PDF
              </button>
            </>
          )}
          {step < 6 ? (
          <button
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs rounded-lg bg-[var(--accent-green)] text-white hover:bg-[var(--accent-green-hover)] transition-colors cursor-pointer"
          >
            下一步
            <ChevronRight size={12} />
          </button>
          ) : (
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs rounded-lg bg-[var(--accent-amber)] text-white hover:bg-[var(--accent-amber-hover)] transition-colors cursor-pointer"
          >
            创建新项目
            <Plus size={12} />
          </button>
          )}
        </div>
      </div>
    </div>
  );
}
