'use client';

import { useWorkflowStore } from '@/store/workflowStore';
import { STEP_NAMES } from '@/types';
import ConfirmationCard from '@/components/common/ConfirmationCard';
import StepListen from '@/components/steps/StepListen';
import StepEmpathize from '@/components/steps/StepEmpathize';
import StepAnalyze from '@/components/steps/StepAnalyze';
import StepTransform from '@/components/steps/StepTransform';
import StepTest from '@/components/steps/StepTest';
import StepGenerate from '@/components/steps/StepGenerate';
import { AlertCircle, Sparkles, Globe, Check, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface StepProps {
  data?: Record<string, unknown>;
  isLoading: boolean;
}

const STEP_COMPONENTS: Record<number, React.ComponentType<StepProps>> = {
  1: StepListen,
  2: StepEmpathize,
  3: StepAnalyze,
  4: StepTransform,
  5: StepTest,
  6: StepGenerate,
};

const STEP_BG_IMAGES: Record<number, string> = {
  1: '/image/步骤1-聆听.png',
  2: '/image/步骤2-代入.png',
  3: '/image/步骤3-分析.png',
  4: '/image/步骤4-转化.png',
  5: '/image/步骤5-测试.png',
  6: '/image/步骤6-生成.png',
};

export default function WorkflowPanel() {
  const { project, currentStep, stepData, isLoading, error, clearError, confirmStep, streamingText, isReloading, isScraping, scrapeStatus } = useWorkflowStore();

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center mb-4">
          <span className="text-2xl">📋</span>
        </div>
        <h2 className="text-lg font-heading font-semibold mb-2">创建或选择一个项目</h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-md">
          从左侧创建新项目或选择已有项目，开始设计语言转化工作流。
        </p>
      </div>
    );
  }

  const StepComponent = STEP_COMPONENTS[currentStep];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Error banner */}
      {error && (
        <div className="mx-4 mt-4 p-3 rounded-lg bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/30 flex items-start gap-2 animate-slide-up">
          <AlertCircle size={16} className="text-[var(--accent-red)] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-[var(--accent-red)]">{error}</p>
          </div>
          <button onClick={clearError} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Progress bar */}
      <div className="px-6 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-heading font-semibold">
            步骤 {currentStep}/6 — {STEP_NAMES[currentStep - 1]}
          </h2>
          <span className="text-xs text-[var(--text-muted)]">
            {Math.round((currentStep / 6) * 100)}%
          </span>
        </div>
        <div className="h-1.5 bg-[var(--bg-hover)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-blue)] rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 px-6 py-4 relative overflow-y-auto">
        {/* Step background image */}
        {STEP_BG_IMAGES[currentStep] && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
              style={{ backgroundImage: `url(${STEP_BG_IMAGES[currentStep]})` }}
            />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent 60%, var(--bg-primary) 100%)' }} />
          </>
        )}
        <div className="relative z-10">
          {StepComponent && stepData[currentStep] ? (
            <StepComponent data={stepData[currentStep]} isLoading={isLoading} />
          ) : isLoading ? (
            <StepLoading step={currentStep} streamingText={streamingText} isReloading={isReloading} isScraping={isScraping} scrapeStatus={scrapeStatus} />
          ) : null}
        </div>
      </div>

      {/* Confirmation card */}
      {stepData[currentStep] && !isLoading && (
        <div className="px-6 pb-6">
          <ConfirmationCard
            step={currentStep}
            onConfirm={() => confirmStep(currentStep)}
          />
        </div>
      )}
    </div>
  );
}

/** 步骤加载中组件 */
function StepLoading({ step, streamingText, isReloading, isScraping, scrapeStatus }: {
  step: number;
  streamingText?: string;
  isReloading?: boolean;
  isScraping?: boolean;
  scrapeStatus?: {
    status: string;
    keywords?: string[];
    total?: number;
    platforms?: {
      wechat: { status: string; count: number; results: Array<{ title: string; content: string }> };
      xiaohongshu: { status: string; count: number; results: Array<{ title: string; content: string }> };
      douyin: { status: string; count: number; results: Array<{ title: string; content: string }> };
    };
  };
}) {
  const [seconds, setSeconds] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll streaming text
  useEffect(() => {
    if (textRef.current) {
      textRef.current.scrollTop = textRef.current.scrollHeight;
    }
  }, [streamingText]);

  const circumference = 2 * Math.PI * 24;
  const progress = (seconds % 60) / 60;
  const dashOffset = circumference * (1 - progress);
  const stepName = STEP_NAMES[step - 1] || `步骤 ${step}`;
  const hasText = streamingText && streamingText.length > 10;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header with timer */}
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <div className="relative w-12 h-12 shrink-0">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="var(--bg-hover)" strokeWidth="2.5" />
            <circle
              cx="24" cy="24" r="20" fill="none" stroke="var(--accent-green)" strokeWidth="2.5"
              strokeLinecap="round" strokeDasharray={circumference * 20 / 24}
              strokeDashoffset={dashOffset * 20 / 24}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles size={14} className="text-[var(--accent-green)] animate-pulse" />
          </div>
        </div>
        <div>
          <p className="text-sm font-heading font-semibold">正在执行{stepName}...</p>
          <p className="text-xs text-[var(--text-muted)]">AI 正在分析中，已等待 {seconds}s</p>
        </div>
      </div>

      {/* Scrape progress for steps 3 and 5 */}
      {(step === 3 || step === 5) && isScraping && scrapeStatus?.platforms && (
        <div className="glass-card p-4 mb-4 shrink-0 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <Globe size={14} className="text-[var(--accent-blue)] animate-pulse" />
            <p className="text-sm font-medium text-[var(--text-primary)]">正在收集市场数据...</p>
          </div>
          {scrapeStatus.keywords && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {scrapeStatus.keywords.map((kw, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]">
                  {kw}
                </span>
              ))}
            </div>
          )}
          <div className="space-y-2">
            <ScrapePlatformCard
              label="微信公众号"
              color="#16a34a"
              platform={scrapeStatus.platforms.wechat}
            />
            <ScrapePlatformCard
              label="小红书"
              color="#ef4444"
              platform={scrapeStatus.platforms.xiaohongshu}
            />
            <ScrapePlatformCard
              label="抖音"
              color="#a78bfa"
              platform={scrapeStatus.platforms.douyin}
            />
          </div>
        </div>
      )}

      {/* Streaming text preview */}
      {hasText && !isReloading && (
        <div className="flex-1 min-h-0">
          <div
            ref={textRef}
            className="glass-card p-4 h-full overflow-y-auto"
          >
            <p className="text-[10px] text-[var(--text-muted)] mb-2 uppercase tracking-wider">实时生成中</p>
            <pre className="text-xs text-[var(--text-secondary)] whitespace-pre-wrap font-mono leading-relaxed break-all">
              {streamingText}
            </pre>
          </div>
        </div>
      )}

      {/* Post-stream reload indicator (RAG injection / data integration) */}
      {isReloading && (
        <ReloadingCard step={step} />
      )}
    </div>
  );
}

/** RAG / 数据整合中卡片 */
function ReloadingCard({ step }: { step: number }) {
  const hasRAG = [2, 3, 4, 6].includes(step);
  const hasScrape = [3, 5].includes(step);

  const messages: string[] = [];
  if (hasRAG) messages.push('正在注入 RAG 知识库检索结果');
  if (hasScrape) messages.push('正在整合市场爬取数据');
  if (messages.length === 0) messages.push('正在加载完整结果');

  return (
    <div className="glass-card p-5 mt-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/20 flex items-center justify-center">
          <Loader2 size={14} className="animate-spin text-[var(--accent-blue)]" />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">数据整合中</p>
          <p className="text-[10px] text-[var(--text-muted)]">AI 生成已完成，正在处理附加数据</p>
        </div>
      </div>
      <div className="space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse shrink-0" />
            <span className="text-xs text-[var(--text-secondary)]">{msg}...</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Single platform scrape progress card */
function ScrapePlatformCard({ label, color, platform }: {
  label: string;
  color: string;
  platform: { status: string; count: number; results: Array<{ title: string; content: string }> };
}) {
  const isActive = platform.status === 'scraping';
  const isDone = platform.status === 'done';

  return (
    <div
      className="rounded-lg border p-2.5 transition-all"
      style={{
        borderColor: isActive || isDone ? color : 'var(--border)',
        backgroundColor: isActive || isDone ? `${color}08` : 'transparent',
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{
              backgroundColor: isActive || isDone ? color : 'var(--text-muted)',
              animation: isActive ? 'pulse 1.5s infinite' : 'none',
            }}
          />
          <span className="text-[11px] font-medium" style={{ color: isActive || isDone ? color : 'var(--text-muted)' }}>
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {isActive && <Loader2 size={10} className="animate-spin" style={{ color }} />}
          {isDone && <Check size={10} style={{ color }} />}
          <span className="text-[10px] text-[var(--text-muted)]">
            {isDone ? `${platform.count}条` : isActive ? '正在爬取...' : '等待中'}
          </span>
        </div>
      </div>
      {platform.results.length > 0 && (
        <div className="space-y-0.5 mt-1">
          {platform.results.map((r, i) => (
            <div key={i} className="text-[10px] text-[var(--text-secondary)] truncate pl-3.5">
              {r.title || r.content || '...'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
