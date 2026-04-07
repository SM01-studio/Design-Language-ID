'use client';

import { Brain, GitBranch, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const FEATURES: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
}> = [
  {
    icon: Brain,
    title: 'AI 深度理解',
    description: '不仅提取关键词，更理解需求背后的设计意图和空间逻辑。同理心模拟确保方案贴近真实客户。',
    accent: 'var(--accent-green)',
  },
  {
    icon: GitBranch,
    title: '全流程可追溯',
    description: '每步决策都有 AI 解释，支持任意步骤回溯修改。AI 助手全程在线，随时对话调整方向。',
    accent: 'var(--accent-blue)',
  },
  {
    icon: Target,
    title: '交付即落地',
    description: '输出标准化的设计任务书，包含硬装、软装、智能化全维度参数。附带风险预警和设计语言手册。',
    accent: 'var(--accent-amber)',
  },
];

export default function LandingFeatures() {
  return (
    <section className="py-24 lg:py-32 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
            为什么选择 Design Language Translation - ID Showflat
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            从模糊到精准，从需求到交付。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="text-center group">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `color-mix(in srgb, ${feature.accent} 15%, transparent)` }}
                >
                  <Icon size={24} style={{ color: feature.accent }} />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-3">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm mx-auto">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
