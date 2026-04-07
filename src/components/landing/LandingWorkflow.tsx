'use client';

import { Headphones, Heart, BarChart3, ArrowRightLeft, FlaskConical, FileOutput } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const WORKFLOW_STEPS: Array<{
  icon: LucideIcon;
  number: number;
  name: string;
  nameEn: string;
  description: string;
  color: string;
}> = [
  {
    icon: Headphones,
    number: 1,
    name: '聆听',
    nameEn: 'Listen',
    description: '上传样板房需求文档，AI 自动解析并提取结构化需求、用户画像和场景映射。',
    color: 'var(--accent-green)',
  },
  {
    icon: Heart,
    number: 2,
    name: '代入',
    nameEn: 'Empathize',
    description: 'AI 以客户视角进行同理心模拟，构建同理心地图并预判潜在冲突。',
    color: 'var(--accent-blue)',
  },
  {
    icon: BarChart3,
    number: 3,
    name: '分析',
    nameEn: 'Analyze',
    description: '对需求进行参数化分析，构建设计参数矩阵和六大原则价值分析。',
    color: 'var(--accent-amber)',
  },
  {
    icon: ArrowRightLeft,
    number: 4,
    name: '转化',
    nameEn: 'Transform',
    description: '将分析结果转化为设计语言，生成设计任务书初稿并消解冲突。',
    color: 'var(--accent-purple)',
  },
  {
    icon: FlaskConical,
    number: 5,
    name: '测试',
    nameEn: 'Test',
    description: 'AI 模拟 100 组客户进行销售测试，验证设计方案的市场接受度。',
    color: 'var(--accent-amber)',
  },
  {
    icon: FileOutput,
    number: 6,
    name: '生成',
    nameEn: 'Generate',
    description: '汇总所有步骤结果，生成最终设计任务书、风险预警和设计语言手册。',
    color: 'var(--accent-green)',
  },
];

export default function LandingWorkflow() {
  return (
    <section id="workflow" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
            六步工作流程
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            从需求文档到设计任务书，AI 全程引导。每一步都可审查、修改、与 AI 对话。
          </p>
        </div>

        {/* Step cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORKFLOW_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="glass-card p-6 hover:border-[var(--border-light)] transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `color-mix(in srgb, ${step.color} 15%, transparent)` }}
                  >
                    <Icon size={20} style={{ color: step.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        STEP {step.number}
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-sm">
                      {step.name}
                      <span className="ml-1.5 text-[var(--text-muted)] font-normal text-xs">
                        {step.nameEn}
                      </span>
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
