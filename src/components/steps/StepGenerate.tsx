'use client';

import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { when } from '@/lib/render';
import KbReferencesCard from '@/components/common/KbReferencesCard';

interface StepProps {
  data?: Record<string, unknown>;
  isLoading: boolean;
}

function SpaceSection({ title, items, accentColor }: {
  title: string;
  items: Array<Record<string, string>>;
  accentColor: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const displayItems = expanded ? items : items.slice(0, 3);

  return (
    <div>
      <span className="text-xs text-[var(--text-muted)] uppercase font-semibold">{title}</span>
      <div className="space-y-1 mt-1">
        {displayItems.map((item, idx) => (
          <div key={idx} className="text-xs text-[var(--text-secondary)] pl-2 border-l-2 border-[var(--border)]">
            <span className="text-[var(--text-primary)]">{item.item}</span>
            <span className="text-[var(--text-muted)]"> — {item.specification}</span>
            {item.material && <span className="text-[var(--text-muted)]"> | {item.material}</span>}
            {item.size && <span className="text-[var(--text-muted)]"> | {item.size}</span>}
            {item.color_style && <span className="text-[var(--text-muted)]"> | {item.color_style}</span>}
            {item.standard && (
              <div className="text-[10px] text-[var(--text-muted)] pl-2 mt-0.5">规范: {item.standard}</div>
            )}
            {item.risk_level && item.risk_level !== 'low' && (
              <span className={`ml-1 px-1 py-0.5 rounded text-[10px] ${
                item.risk_level === 'high' ? 'bg-[var(--accent-red)]/20 text-[var(--accent-red)]' : 'bg-[var(--accent-amber)]/20 text-[var(--accent-amber)]'
              }`}>
                {item.risk_level}
              </span>
            )}
          </div>
        ))}
      </div>
      {items.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] text-[var(--accent-blue)] mt-1 flex items-center gap-0.5 hover:underline"
        >
          {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
          {expanded ? '收起' : `展开全部 (${items.length})`}
        </button>
      )}
    </div>
  );
}

function SmartSystemList({ systems }: { systems: Array<Record<string, unknown>> }) {
  const [expanded, setExpanded] = useState(false);
  const displayItems = expanded ? systems : systems.slice(0, 2);

  return (
    <div>
      <span className="text-xs text-[var(--text-muted)] uppercase font-semibold">智能化</span>
      <div className="space-y-1 mt-1">
        {displayItems.map((sys, idx) => (
          <div key={idx} className="text-xs text-[var(--text-secondary)] pl-2 border-l-2 border-[var(--accent-blue)]/30">
            <span className="text-[var(--text-primary)]">{String(sys.system || sys.name || '')}</span>
            {when(sys.functions, (v) => (
              <div className="text-[10px] text-[var(--text-muted)]">{String((v as string[]).join('、'))}</div>
            ))}
            {when(sys.control, (v) => (
              <span className="text-[10px] text-[var(--accent-blue)] ml-1">[{String(v)}]</span>
            ))}
          </div>
        ))}
      </div>
      {systems.length > 2 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] text-[var(--accent-blue)] mt-1 flex items-center gap-0.5 hover:underline"
        >
          {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
          {expanded ? '收起' : `展开全部 (${systems.length})`}
        </button>
      )}
    </div>
  );
}

export default function StepGenerate({ data, isLoading }: StepProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full animate-pulse-slow">
        <Loader2 size={24} className="animate-spin text-[var(--accent-green)]" />
        <p className="text-sm text-[var(--text-secondary)] mt-4">正在生成最终交付物...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-sm text-[var(--text-muted)]">请先完成步骤5（测试）</p>
      </div>
    );
  }

  const brief = data.final_design_brief as Record<string, unknown> | undefined;
  const risks = data.risk_warnings as Record<string, unknown> | undefined;
  const manual = data.design_language_manual as Record<string, unknown> | undefined;

  const spaces = brief?.spaces as Array<Record<string, unknown>> | undefined;
  const finalStyle = brief?.design_style as string | undefined;
  const difficulties = risks?.construction_difficulties as Array<Record<string, string>> | undefined;
  const alternatives = risks?.alternatives as Array<Record<string, string>> | undefined;
  const manualSpaces = manual?.spaces as Array<Record<string, unknown>> | undefined;

  return (
    <div className="space-y-4 animate-slide-up">
      <h3 className="text-sm font-semibold text-[var(--accent-green)]">✓ 最终交付物生成完成</h3>

      {/* Final Brief */}
      {(finalStyle || spaces) && (
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            样板房设计任务书（终稿）
          </h4>
          {finalStyle ? (
            <div className="p-3 rounded-lg bg-[var(--accent-amber)]/10 border border-[var(--accent-amber)]/30 mb-3">
              <span className="text-[10px] text-[var(--text-muted)]">样板房设计风格</span>
              <p className="text-sm font-heading font-semibold text-[var(--accent-amber)]">{finalStyle}</p>
            </div>
          ) : null}
          <div className="space-y-3">
            {spaces?.map((space, i) => {
              const hardFinish = space.hard_finish as Array<Record<string, string>> | undefined;
              const softFurnish = space.soft_furnish as Array<Record<string, string>> | undefined;
              const smartSystems = space.smart_systems as Array<Record<string, unknown>> | undefined;

              return (
                <div key={String(space.name || i)} className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]">
                  <h5 className="text-sm font-heading font-semibold text-[var(--accent-blue)] mb-2">
                    {i + 1}. {String(space.name)}
                  </h5>
                  <div className="space-y-2">
                    {hardFinish && hardFinish.length > 0 && (
                      <SpaceSection title="硬装" items={hardFinish} accentColor="amber" />
                    )}
                    {softFurnish && softFurnish.length > 0 && (
                      <SpaceSection title="软装" items={softFurnish} accentColor="green" />
                    )}
                    {smartSystems && smartSystems.length > 0 && (
                      <SmartSystemList systems={smartSystems} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Risk Warnings */}
      {difficulties && difficulties.length > 0 && (
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            风险预警 — 施工难点
          </h4>
          <div className="space-y-1">
            {difficulties.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-xs p-2 rounded-lg border border-[var(--border)]">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0 ${
                  r.severity === 'high' ? 'bg-[var(--accent-red)]/20 text-[var(--accent-red)]' : 'bg-[var(--accent-amber)]/20 text-[var(--accent-amber)]'
                }`}>
                  {r.severity}
                </span>
                <div>
                  <span className="text-[var(--text-primary)]">{r.space} — {r.item}</span>
                  <p className="text-[var(--text-muted)] text-xs">{r.difficulty}</p>
                  {r.mitigation && <p className="text-[var(--text-secondary)] text-xs mt-0.5">缓解: {r.mitigation}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alternatives */}
      {alternatives && alternatives.length > 0 && (
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            风险预警 — 替代方案
          </h4>
          <div className="space-y-1">
            {alternatives.map((a, i) => (
              <div key={i} className="text-xs p-2 rounded-lg border border-[var(--border)]">
                <div className="text-[var(--text-primary)]">{a.scenario}</div>
                <div className="text-[var(--text-muted)] mt-0.5">原方案: {a.original_plan}</div>
                <div className="text-[var(--text-secondary)]">替代: {a.alternative_plan}</div>
                {a.performance_impact && (
                  <div className="text-[var(--text-muted)] text-[10px] mt-0.5">影响: {a.performance_impact}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Design Language Manual */}
      {manualSpaces && manualSpaces.length > 0 ? (
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            设计语言解读手册
          </h4>
          <div className="space-y-3">
            {manualSpaces.map((space, i) => {
              const interpretations = space.interpretations as Array<Record<string, string>> | undefined;
              return (
                <div key={i} className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]">
                  <h5 className="text-sm font-heading font-semibold text-[var(--accent-blue)] mb-2">
                    {String(space.name)}
                  </h5>
                  <div className="space-y-2">
                    {interpretations?.map((interp, j) => (
                      <div key={j} className="text-xs text-[var(--text-secondary)] pl-2 border-l-2 border-[var(--accent-amber)]/30">
                        <p className="text-[var(--text-primary)] leading-relaxed">{interp.design_decision}</p>
                        {interp.life_scenario && (
                          <p className="text-[var(--text-muted)] mt-0.5">场景: {interp.life_scenario}</p>
                        )}
                        {interp.emotional_value && (
                          <p className="text-[var(--text-muted)]">价值: {interp.emotional_value}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {when(manual?.design_philosophy, (v) => (
            <div className="mt-3 p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]">
              <h5 className="text-xs font-semibold text-[var(--text-secondary)] mb-1">设计理念</h5>
              <p className="text-xs text-[var(--text-primary)] leading-relaxed">{String(v)}</p>
            </div>
          ))}
        </div>
      ) : manual?.narrative ? (
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            设计语言解读手册
          </h4>
          <div className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]">
            <p className="text-xs text-[var(--text-primary)] leading-relaxed">
              {String(manual.narrative)}
            </p>
          </div>
        </div>
      ) : null}

      {/* RAG Knowledge Base References */}
      <KbReferencesCard references={data._kb_references} />
    </div>
  );
}
