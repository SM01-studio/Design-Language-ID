'use client';

import { ArrowRight, Sparkles } from 'lucide-react';

interface LandingCTAProps {
  onGetStarted: () => void;
}

export default function LandingCTA({ onGetStarted }: LandingCTAProps) {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="glass-card p-12 lg:p-16 glow-green relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-green)]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--accent-blue)]/5 rounded-full blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20 mb-6">
              <Sparkles size={14} className="text-[var(--accent-green)]" />
              <span className="text-xs text-[var(--accent-green)]">现在就开始</span>
            </div>

            <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
              准备好转化你的设计需求了吗？
            </h2>
            <p className="text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
              上传你的样板房需求文档，AI 将在几分钟内生成完整的结构化设计任务书。
            </p>

            <button
              onClick={onGetStarted}
              className="group inline-flex items-center gap-2 px-8 py-4 text-base font-medium rounded-xl bg-[var(--accent-green)] text-white hover:bg-[var(--accent-green-hover)] glow-green transition-all cursor-pointer"
            >
              开始使用
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
