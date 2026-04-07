'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkflowStore } from '@/store/workflowStore';
import { uploadApi } from '@/services/api';
import {
  Upload, FileText, Loader2, Sparkles, FolderOpen,
  Headphones, Heart, BarChart3, ArrowRightLeft, FlaskConical, FileOutput,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const WORKFLOW_PREVIEW: Array<{ icon: LucideIcon; label: string; color: string }> = [
  { icon: Headphones, label: '聆听', color: 'var(--accent-green)' },
  { icon: Heart, label: '代入', color: 'var(--accent-blue)' },
  { icon: BarChart3, label: '分析', color: 'var(--accent-amber)' },
  { icon: ArrowRightLeft, label: '转化', color: 'var(--accent-purple)' },
  { icon: FlaskConical, label: '测试', color: 'var(--accent-amber)' },
  { icon: FileOutput, label: '生成', color: 'var(--accent-green)' },
];

export default function NewProjectView() {
  const router = useRouter();
  const { createProject, executeStep } = useWorkflowStore();
  const [projectName, setProjectName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileText, setFileText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (f: File) => {
    setFile(f);
    setIsUploading(true);
    try {
      const result = await uploadApi.upload(f);
      setFileText(result.text);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const handleStart = async () => {
    if (!fileText.trim()) return;
    setIsCreating(true);
    try {
      const name = projectName.trim() || `项目 ${new Date().toLocaleDateString('zh-CN')}`;
      const projectId = await createProject(name);
      await executeStep(1, { text: fileText });
      window.history.replaceState({}, '', `/workspace/${projectId}`);
      router.push(`/workspace/${projectId}`);
    } catch (err) {
      console.error('Failed to create project:', err);
      setIsCreating(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full p-6 lg:p-12 animate-fade-in">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/bg-cover.png)' }}
      />
      <div className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }} />
      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20 mb-4">
            <Sparkles size={24} className="text-[var(--accent-green)]" />
          </div>
          <h2 className="font-heading text-2xl font-bold mb-2 text-white">创建新项目</h2>
          <p className="text-sm text-white/80">
            上传需求文档，AI 将自动引导你完成 6 步设计语言转化
          </p>
        </div>

        {/* Workflow preview strip */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {WORKFLOW_PREVIEW.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `color-mix(in srgb, ${step.color} 15%, transparent)` }}
                  >
                    <Icon size={14} style={{ color: step.color }} />
                  </div>
                  <span className="text-[10px] text-white/70">{step.label}</span>
                </div>
                {i < WORKFLOW_PREVIEW.length - 1 && (
                  <div className="w-4 h-px bg-[var(--border)] mt-[-12px]" />
                )}
              </div>
            );
          })}
        </div>

        {/* Project name */}
        <div className="glass-card p-6 mb-4">
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
            <FolderOpen size={14} className="inline mr-1.5 -mt-0.5" />
            项目名称（可选）
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="例如：XX 样板房 A 户型"
            className="w-full px-4 py-3 text-sm bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent-green)] transition-colors"
          />
        </div>

        {/* File upload area */}
        <div
          className={`glass-card p-8 text-center transition-all ${
            dragActive ? 'border-[var(--accent-green)] glow-green' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label className="flex flex-col items-center gap-3 cursor-pointer group">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
              dragActive
                ? 'bg-[var(--accent-green)]/20 border border-[var(--accent-green)]/40'
                : 'bg-[var(--bg-hover)] border border-[var(--border)] group-hover:border-[var(--accent-green)]/30'
            }`}>
              <Upload size={24} className="text-[var(--accent-green)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-primary)] font-medium">
                {file ? file.name : '点击上传或拖拽文件到此处'}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                支持 PDF、DOCX、XLSX 格式
              </p>
            </div>
            <input
              type="file"
              accept=".pdf,.docx,.doc,.xlsx"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>

          {isUploading && (
            <div className="flex items-center gap-2 mt-4 justify-center">
              <Loader2 size={14} className="animate-spin text-[var(--accent-green)]" />
              <span className="text-xs text-[var(--text-secondary)]">正在解析文档...</span>
            </div>
          )}
        </div>

        {/* File preview + start button */}
        {fileText && (
          <div className="glass-card p-6 mt-4 animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <FileText size={14} />
                文档已解析（{fileText.length} 字符）
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-green)]/10 text-[var(--accent-green)]">
                就绪
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] max-h-32 overflow-y-auto mb-4">
              <pre className="text-[10px] text-[var(--text-secondary)] whitespace-pre-wrap font-mono">
                {fileText.slice(0, 1500)}
                {fileText.length > 1500 && '...'}
              </pre>
            </div>
            <button
              onClick={handleStart}
              disabled={isCreating}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-xl bg-[var(--accent-green)] text-white hover:bg-[var(--accent-green-hover)] disabled:opacity-50 transition-all glow-green cursor-pointer"
            >
              {isCreating ? (
                <CreatingTimer />
              ) : (
                <>
                  <Sparkles size={16} />
                  创建项目并开始 AI 分析
                </>
              )}
            </button>
          </div>
        )}

        {/* Existing projects link */}
        <p className="text-center text-xs text-white/60 mt-6">
          已有项目？从左侧面板的项目列表中选择
        </p>
      </div>
    </div>
  );
}

/** 圆圈计时动画组件 */
function CreatingTimer() {
  const [seconds, setSeconds] = useState(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const circumference = 2 * Math.PI * 18;
  const progress = (seconds % 60) / 60;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="flex items-center justify-center gap-3 py-1">
      <div className="relative w-10 h-10">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
          <circle
            cx="20" cy="20" r="18"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2.5"
          />
          <circle
            cx="20" cy="20" r="18"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white">
          {seconds}s
        </span>
      </div>
      <span className="text-sm text-white">正在创建项目并启动 AI 分析...</span>
    </div>
  );
}
