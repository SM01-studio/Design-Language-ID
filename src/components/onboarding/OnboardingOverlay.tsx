'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { X, ChevronRight, ChevronLeft, Sparkles, LayoutDashboard, GitBranch, Upload } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  icon?: LucideIcon;
  diagram?: React.ReactNode;
  position?: 'center' | 'top';
}

/** CSS 绘制的三栏工作区布局示意图 */
function WorkspaceDiagram() {
  return (
    <div className="mt-4 p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]">
      <div className="flex gap-1 h-28 rounded overflow-hidden">
        {/* Sidebar */}
        <div className="w-[25%] bg-[var(--bg-hover)] rounded-l flex flex-col items-center justify-center gap-1 px-1">
          <div className="w-4 h-4 rounded bg-[var(--accent-green)]/20 flex items-center justify-center">
            <LayoutDashboard size={8} className="text-[var(--accent-green)]" />
          </div>
          <span className="text-[8px] text-[var(--text-secondary)] text-center leading-tight">项目与流程</span>
          <div className="w-full space-y-0.5 mt-1 px-0.5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className={`h-1.5 rounded-full ${i === 1 ? 'bg-[var(--accent-green)]/60' : 'bg-[var(--border)]'}`} />
            ))}
          </div>
        </div>

        {/* Workflow panel */}
        <div className="w-[45%] bg-[var(--bg-card)] flex flex-col items-center justify-center gap-1 px-1">
          <div className="w-4 h-4 rounded bg-[var(--accent-blue)]/20 flex items-center justify-center">
            <GitBranch size={8} className="text-[var(--accent-blue)]" />
          </div>
          <span className="text-[8px] text-[var(--text-secondary)] text-center leading-tight">AI 分析工作区</span>
          <div className="w-full mt-1 px-0.5 space-y-0.5">
            <div className="h-2 rounded bg-[var(--border)]/60" />
            <div className="h-2 rounded bg-[var(--border)]/60 w-4/5" />
            <div className="h-2 rounded bg-[var(--border)]/60 w-3/5" />
          </div>
        </div>

        {/* Chat panel */}
        <div className="w-[30%] bg-[var(--bg-hover)] rounded-r flex flex-col items-center justify-center gap-1 px-1">
          <div className="w-4 h-4 rounded bg-[var(--accent-amber)]/20 flex items-center justify-center">
            <Sparkles size={8} className="text-[var(--accent-amber)]" />
          </div>
          <span className="text-[8px] text-[var(--text-secondary)] text-center leading-tight">AI 助手</span>
          <div className="w-full mt-1 px-0.5 space-y-0.5">
            <div className="h-3 rounded bg-[var(--border)]/60" />
            <div className="h-3 rounded bg-[var(--accent-green)]/20 ml-auto w-3/4" />
          </div>
        </div>
      </div>
      {/* Labels below */}
      <div className="flex gap-1 mt-2">
        <div className="w-[25%] text-center">
          <span className="text-[8px] text-[var(--accent-green)]">左侧面板</span>
        </div>
        <div className="w-[45%] text-center">
          <span className="text-[8px] text-[var(--accent-blue)]">中间区域</span>
        </div>
        <div className="w-[30%] text-center">
          <span className="text-[8px] text-[var(--accent-amber)]">右侧面板</span>
        </div>
      </div>
    </div>
  );
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: '欢迎来到 Design Language Translation - ID Showflat',
    description: '这是一个 AI 驱动的设计语言转化工作台。接下来让我们快速了解界面。',
    icon: Sparkles,
  },
  {
    title: '界面布局',
    description: '进入工作区后，界面分为三个区域：左侧管理项目和流程步骤，中间展示 AI 分析结果，右侧是 AI 对话助手，可以随时沟通。',
    icon: LayoutDashboard,
    diagram: <WorkspaceDiagram />,
  },
  {
    title: '六步转化流程',
    description: 'AI 将引导你完成聆听、代入、分析、转化、测试、生成六个步骤，将需求文档转化为可执行的设计语言。每一步都可以回溯和修改。',
    icon: GitBranch,
  },
  {
    title: '开始你的第一个项目',
    description: '在下方上传样板房项目的需求文档（PDF/DOCX），AI 将自动开始分析并引导你完成转化。',
    icon: Upload,
  },
];

export default function OnboardingOverlay() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('onboarding') === 'true') {
      setIsVisible(true);
    }
  }, [searchParams]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    window.history.replaceState({}, '', '/workspace/new');
  }, []);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isVisible) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const isTop = step.position === 'top';

  return (
    <div className="fixed inset-0 z-[100] animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={handleClose} />

      {/* Tooltip card — use CSS centering to avoid transform conflict with animate-slide-up */}
      <div
        className={`absolute z-10 animate-slide-up flex ${isTop ? 'left-0 right-0 top-[18%] justify-center' : 'left-0 right-0 top-0 bottom-0 items-center justify-center'}`}
      >
        <div className="glass-card p-6 w-[380px] max-w-[90vw] glow-green">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1 rounded-md hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>

          {/* Icon */}
          {step.icon && (
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-green)]/10 flex items-center justify-center mb-4">
              <step.icon size={20} className="text-[var(--accent-green)]" />
            </div>
          )}

          {/* Content */}
          <h3 className="font-heading font-semibold text-sm leading-snug mb-2">{step.title}</h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
            {step.description}
          </p>

          {/* Diagram */}
          {step.diagram}

          {/* Progress dots */}
          <div className="flex items-center gap-1.5 mb-4 mt-5">
            {ONBOARDING_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === currentStep ? 'w-6 bg-[var(--accent-green)]' :
                  i < currentStep ? 'w-1.5 bg-[var(--accent-green)]/50' :
                  'w-1.5 bg-[var(--bg-hover)]'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
              上一步
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-2 text-xs font-medium rounded-lg bg-[var(--accent-green)] text-white hover:bg-[var(--accent-green-hover)] transition-colors cursor-pointer"
            >
              {currentStep === ONBOARDING_STEPS.length - 1 ? '开始使用' : '下一步'}
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
