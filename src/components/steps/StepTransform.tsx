'use client';

import { Loader2 } from 'lucide-react';
import { when } from '@/lib/render';
import KbReferencesCard from '@/components/common/KbReferencesCard';

interface StepProps {
  data?: Record<string, unknown>;
  isLoading: boolean;
}

export default function StepTransform({ data, isLoading }: StepProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full animate-pulse-slow">
        <Loader2 size={24} className="animate-spin text-[var(--accent-amber)]" />
        <p className="text-sm text-[var(--text-secondary)] mt-4">正在转化为设计语言...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-sm text-[var(--text-muted)]">请先完成步骤3（分析）</p>
      </div>
    );
  }

  const brief = data.design_brief_draft as Record<string, unknown> | undefined;
  const conflicts = data.conflict_resolutions as Array<Record<string, unknown>> | undefined;
  const principleDecomp = data.principle_decomposition as Record<string, Array<Record<string, string>>> | undefined;
  const detailStandards = data.detail_standards as Array<Record<string, string>> | undefined;

  const overview = brief?.project_overview as string | undefined;
  const spaces = brief?.spaces as Array<Record<string, unknown>> | undefined;

  return (
    <div className="space-y-4 animate-slide-up">
      <h3 className="text-sm font-semibold text-[var(--accent-green)]">✓ 设计语言转化完成</h3>

      {/* Design Brief Draft */}
      {brief && (
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            设计任务书（初稿）
          </h4>

          {overview && (
            <div className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] mb-4">
              <p className="text-xs text-[var(--text-primary)] leading-relaxed">{overview}</p>
            </div>
          )}

          {spaces && (
            <div className="space-y-4">
              {spaces.map((space, i) => {
                const hardFinish = space.hard_finish as Record<string, string> | undefined;
                const softFurnish = space.soft_furnish as Record<string, string> | undefined;
                const smartSystems = space.smart_systems as Record<string, string> | undefined;
                return (
                  <div key={String(space.name || i)} className="rounded-lg border border-[var(--border)] overflow-hidden">
                    {/* Space header */}
                    <div className="px-3 py-2 bg-[var(--accent-blue)]/10 border-b border-[var(--border)]">
                      <h5 className="text-sm font-heading font-semibold text-[var(--accent-blue)]">
                        {String(space.name || `空间 ${i + 1}`)}
                      </h5>
                    </div>

                    <div className="p-3 space-y-3">
                      {hardFinish && Object.keys(hardFinish).length > 0 && (
                        <div>
                          <p className="text-[10px] font-semibold text-[var(--accent-amber)] uppercase tracking-wider mb-1.5">硬装</p>
                          <div className="space-y-1">
                            {Object.entries(hardFinish).map(([key, val]) => (
                              <div key={key} className="flex gap-2 text-xs">
                                <span className="shrink-0 text-[var(--text-muted)] w-10 text-right">{key}</span>
                                <span className="text-[var(--text-border)]">|</span>
                                <span className="text-[var(--text-primary)]">{val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {softFurnish && Object.keys(softFurnish).length > 0 && (
                        <div>
                          <p className="text-[10px] font-semibold text-[var(--accent-green)] uppercase tracking-wider mb-1.5">软装</p>
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(softFurnish).map(([key, val]) => (
                              <span key={key} className="text-xs px-2 py-1 rounded-md bg-[var(--bg-hover)] border border-[var(--border)]">
                                <span className="text-[var(--text-muted)]">{key}:</span>{' '}
                                <span className="text-[var(--text-primary)]">{val}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {smartSystems && Object.keys(smartSystems).length > 0 && (
                        <div>
                          <p className="text-[10px] font-semibold text-[var(--accent-blue)] uppercase tracking-wider mb-1.5">智能系统</p>
                          <div className="space-y-1">
                            {Object.entries(smartSystems).map(([key, val]) => (
                              <div key={key} className="flex gap-2 text-xs">
                                <span className="shrink-0 text-[var(--text-muted)] w-10 text-right">{key}</span>
                                <span className="text-[var(--text-border)]">|</span>
                                <span className="text-[var(--text-primary)]">{val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Conflict Resolutions */}
      {conflicts && conflicts.length > 0 && (
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            冲突消解
          </h4>
          <div className="space-y-2">
            {conflicts.map((c, i) => {
              const schemeA = c.scheme_a as Record<string, unknown> | undefined;
              const schemeB = c.scheme_b as Record<string, unknown> | undefined;
              const recommended = String(c.recommended || '');
              return (
                <div key={i} className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-[var(--text-primary)]">{String(c.conflict_id || `冲突 ${i + 1}`)}</span>
                  </div>
                  {schemeA && (
                    <p className="text-xs text-[var(--text-secondary)]">
                      方案A{recommended === 'a' ? ' (推荐)' : ''}: {String(schemeA.description || '')}
                    </p>
                  )}
                  {schemeB && (
                    <p className="text-xs text-[var(--text-secondary)]">
                      方案B{recommended === 'b' ? ' (推荐)' : ''}: {String(schemeB.description || '')}
                    </p>
                  )}
                  {when(c.rationale, (v) => (
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      理由: {String(v)}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Design Language Principles Applied */}
      {principleDecomp && Object.keys(principleDecomp).length > 0 && (
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            设计原则拆解
          </h4>
          <div className="space-y-3">
            {Object.entries(principleDecomp).map(([principle, clauses]) => (
              <div key={principle}>
                <p className="text-xs font-medium text-[var(--accent-green)] mb-1">{principle}</p>
                <div className="space-y-1">
                  {clauses.map((clause, i) => (
                    <div key={i} className="text-xs p-2 rounded-lg border border-[var(--border)]">
                      <p className="text-[var(--text-primary)]">{clause.clause}</p>
                      <p className="text-[var(--text-muted)] mt-0.5">
                        {clause.space && <span>[{clause.space}] </span>}
                        {clause.implementation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Standards */}
      {detailStandards && detailStandards.length > 0 && (
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            细节标准化
          </h4>
          <div className="space-y-2">
            {detailStandards.map((s, i) => (
              <div key={i} className="rounded-lg border border-[var(--border)] overflow-hidden">
                <div className="px-3 py-2 bg-[var(--bg-primary)] flex items-center gap-2">
                  {s.space && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent-amber)]/20 text-[var(--accent-amber)] font-mono shrink-0">
                      {s.space}
                    </span>
                  )}
                  <span className="text-xs font-medium text-[var(--text-primary)]">{s.item}</span>
                  {s.standard_reference && (
                    <span className="ml-auto text-[10px] text-[var(--text-muted)] font-mono">{s.standard_reference}</span>
                  )}
                </div>
                <div className="px-3 py-2 border-t border-[var(--border)] grid grid-cols-3 gap-x-3 gap-y-1 text-xs">
                  <div>
                    <span className="text-[var(--text-muted)]">规格 </span>
                    <span className="text-[var(--text-primary)]">{s.specification}</span>
                  </div>
                  {s.tolerance && (
                    <div>
                      <span className="text-[var(--text-muted)]">容差 </span>
                      <span className="text-[var(--text-primary)] font-mono">{s.tolerance}</span>
                    </div>
                  )}
                  {s.material_grade && (
                    <div>
                      <span className="text-[var(--text-muted)]">材质 </span>
                      <span className="text-[var(--text-primary)]">{s.material_grade}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RAG Knowledge Base References */}
      <KbReferencesCard references={data._kb_references} />
    </div>
  );
}
