'use client';

import { Loader2 } from 'lucide-react';
import ScrapeResultsCard from '@/components/common/ScrapeResultsCard';

interface StepProps {
  data?: Record<string, unknown>;
  isLoading: boolean;
}

export default function StepAnalyze({ data, isLoading }: StepProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full animate-pulse-slow">
        <Loader2 size={24} className="animate-spin text-[var(--accent-amber)]" />
        <p className="text-sm text-[var(--text-secondary)] mt-4">正在参数化分析...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-sm text-[var(--text-muted)]">请先完成步骤2（代入）</p>
      </div>
    );
  }

  const parameters = data.parameters as Array<Record<string, string>> | undefined;
  const scrapeResults = data._scrape_results as Record<string, unknown> | undefined;
  const valueAnalysis = data.value_analysis as Record<string, unknown> | undefined;
  const principleScores = valueAnalysis?.principle_scores as Record<string, Record<string, unknown>> | undefined;
  const tradeOffs = valueAnalysis?.trade_offs as Array<Record<string, string>> | undefined;
  const modularDesign = data.modular_design as Record<string, Record<string, Array<Record<string, string>>>> | undefined;

  return (
    <div className="space-y-4 animate-slide-up">
      <h3 className="text-sm font-semibold text-[var(--accent-green)]">✓ 参数化分析完成</h3>

      {/* Scrape Results — always first */}
      {scrapeResults && <ScrapeResultsCard results={scrapeResults as any} />}

      {/* Parameters */}
      {parameters && Array.isArray(parameters) && (
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            设计参数矩阵
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 px-2 text-[var(--text-muted)] font-medium">空间</th>
                  <th className="text-left py-2 px-2 text-[var(--text-muted)] font-medium">参数</th>
                  <th className="text-left py-2 px-2 text-[var(--text-muted)] font-medium">值</th>
                  <th className="text-left py-2 px-2 text-[var(--text-muted)] font-medium">依据</th>
                </tr>
              </thead>
              <tbody>
                {parameters.map((p, i) => (
                  <tr key={p.id || i} className="border-b border-[var(--border)]">
                    <td className="py-2 px-2 text-[var(--text-primary)]">{p.space}</td>
                    <td className="py-2 px-2 text-[var(--text-secondary)]">{p.parameter}</td>
                    <td className="py-2 px-2 text-[var(--accent-green)] font-mono">{p.value}</td>
                    <td className="py-2 px-2 text-[var(--text-muted)] text-xs">{p.standard_reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Value Analysis — Principle Scores */}
      {principleScores && (
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            6大原则价值分析
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(principleScores).map(([name, score]) => (
              <div key={name} className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]">
                <div className="text-xs font-medium mb-2">{name}</div>
                <div className="flex items-center gap-1">
                  <div className="flex-1 h-2 bg-[var(--bg-hover)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent-green)] rounded-full transition-all"
                      style={{ width: `${Number(score.score || 0) * 10}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-[var(--accent-green)]">{String(score.score)}</span>
                </div>
                {score.strengths && Array.isArray(score.strengths) && ((score.strengths as string[]).length > 0 ? (
                  <p className="text-[10px] text-[var(--text-muted)] mt-1.5">
                    优势：{(score.strengths as string[]).join('；')}
                  </p>
                ) : null)}
                {score.weaknesses && Array.isArray(score.weaknesses) && ((score.weaknesses as string[]).length > 0 ? (
                  <p className="text-[10px] text-[var(--text-muted)]">
                    不足：{(score.weaknesses as string[]).join('；')}
                  </p>
                ) : null)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trade-offs */}
      {tradeOffs && tradeOffs.length > 0 && (
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            权衡分析
          </h4>
          <div className="space-y-2">
            {tradeOffs.map((t, i) => (
              <div key={i} className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent-amber)]/20 text-[var(--accent-amber)] font-mono shrink-0">
                    {t.principle_a}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">vs</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent-blue)]/20 text-[var(--accent-blue)] font-mono shrink-0">
                    {t.principle_b}
                  </span>
                </div>
                {t.conflict_description && (
                  <p className="text-xs text-[var(--text-secondary)] mb-1">{t.conflict_description}</p>
                )}
                {t.recommended_balance && (
                  <p className="text-xs text-[var(--text-muted)]">
                    建议平衡：{t.recommended_balance}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modular Design */}
      {modularDesign && Object.keys(modularDesign).length > 0 && (
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            模块化设计
          </h4>
          <div className="space-y-3">
            {Object.entries(modularDesign).map(([spaceName, spaceContent]) => {
              if (!spaceContent || typeof spaceContent !== 'object') return null;
              const categories = [
                { key: 'hard_finish' as const, label: '硬装', color: 'text-[var(--accent-amber)]' },
                { key: 'soft_furnish' as const, label: '软装', color: 'text-[var(--accent-green)]' },
                { key: 'smart_systems' as const, label: '智能化', color: 'text-[var(--accent-blue)]' },
              ];
              const hasItems = categories.some((c) => spaceContent[c.key]?.length > 0);
              if (!hasItems) return null;

              return (
                <div key={spaceName} className="rounded-lg border border-[var(--border)] overflow-hidden">
                  <div className="px-3 py-2 bg-[var(--accent-blue)]/10 border-b border-[var(--border)]">
                    <h5 className="text-sm font-heading font-semibold text-[var(--accent-blue)]">{spaceName}</h5>
                  </div>
                  <div className="p-3 space-y-3">
                    {categories.map(({ key, label, color }) => {
                      const items = spaceContent[key];
                      if (!items || items.length === 0) return null;
                      return (
                        <div key={key}>
                          <p className={`text-[10px] font-semibold ${color} uppercase tracking-wider mb-1.5`}>{label}</p>
                          <div className="space-y-1">
                            {items.map((item, i) => {
                              const itemVal = typeof item === 'string' ? item : item.item || '';
                              const spec = typeof item === 'object' ? item.specification : '';
                              return (
                                <div key={i} className="flex gap-2 text-xs">
                                  <span className="shrink-0 text-[var(--text-primary)] w-24">{itemVal}</span>
                                  {spec && (
                                    <>
                                      <span className="text-[var(--text-border)]">|</span>
                                      <span className="text-[var(--text-muted)]">{spec}</span>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
