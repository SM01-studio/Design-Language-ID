'use client';

import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

interface LandingHeroProps {
  onGetStarted: () => void;
}

export default function LandingHero({ onGetStarted }: LandingHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/hero-bg.jpg"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1E1C1A]/95 via-[#1E1C1A]/80 to-[#1E1C1A]/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1E1C1A] via-transparent to-transparent lg:hidden" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Headline + CTA */}
          <div className="animate-fade-in">
            {/* Logo badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20 mb-8">
              <Sparkles size={14} className="text-[var(--accent-green)]" />
              <span className="text-xs text-[var(--accent-green)] font-medium">AI 设计语言转化引擎</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
              将模糊需求
              <br />
              <span className="bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-blue)] bg-clip-text text-transparent">
                转化为精准设计语言
              </span>
            </h1>

            <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl mb-10">
              AI 驱动的 6 步交互式工作流，让样板房设计需求从口头描述变成可落地的设计任务书。
              上传需求文档，AI 自动完成聆听、代入、分析、转化、测试、生成全流程。
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onGetStarted}
                className="btn-primary group flex items-center justify-center gap-2 px-8 py-4 text-base font-medium rounded-xl bg-[var(--accent-green)] text-white hover:bg-[var(--accent-green-hover)] cursor-pointer"
              >
                开始使用
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#workflow"
                className="btn-secondary flex items-center justify-center gap-2 px-8 py-4 text-base font-medium rounded-xl border border-[var(--border)] text-[var(--text-secondary)]"
              >
                了解工作流程
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 mt-10 text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" />
                无需安装
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" />
                数据加密
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" />
                AI 全程辅助
              </span>
            </div>
          </div>

          {/* Right: Mini workflow preview */}
          <div className="animate-fade-in-delay hidden lg:block">
            <div className="hero-preview-card glass-card p-6">
              {/* Mockup of the workflow sidebar */}
              <div className="space-y-3">
                {['聆听 — 上传需求文档', '代入 — 同理心模拟', '分析 — 参数化分析',
                  '转化 — 设计语言生成', '测试 — AI 客户模拟', '生成 — 最终交付物'].map((step, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                      i === 0
                        ? 'bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/30'
                        : 'bg-[var(--bg-hover)]/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono ${
                      i === 0 ? 'bg-[var(--accent-green)] text-white' :
                      'bg-[var(--bg-hover)] text-[var(--text-secondary)]'
                    }`}>
                      {i + 1}
                    </div>
                    <span className={`text-sm ${i === 0 ? 'text-[var(--accent-green)] font-medium' : 'text-[var(--text-secondary)]'}`}>
                      {step}
                    </span>
                    {i === 0 && <ArrowRight size={14} className="ml-auto text-[var(--accent-green)]" />}
                  </div>
                ))}
              </div>
              {/* Decorative chat panel mockup */}
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent-blue)] flex items-center justify-center">
                    <Sparkles size={10} className="text-white" />
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">AI 助手</span>
                </div>
                <div className="p-3 rounded-lg bg-[var(--bg-hover)] text-xs text-[var(--text-secondary)]">
                  已识别 12 项显性需求，正在构建用户画像...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
