'use client';

import { Loader2 } from 'lucide-react';
import { when } from '@/lib/render';
import ScrapeResultsCard from '@/components/common/ScrapeResultsCard';

interface StepProps {
  data?: Record<string, unknown>;
  isLoading: boolean;
}

export default function StepTest({ data, isLoading }: StepProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full animate-pulse-slow">
        <Loader2 size={24} className="animate-spin text-[var(--accent-amber)]" />
        <p className="text-sm text-[var(--text-secondary)] mt-4">正在模拟客户测试...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-sm text-[var(--text-muted)]">请先完成步骤4（转化）</p>
      </div>
    );
  }

  const questions = data.survey_questions as Array<Record<string, unknown>> | undefined;
  const scrapeResults = data._scrape_results as Record<string, unknown> | undefined;
  const aggregated = data.aggregated_results as Record<string, unknown> | undefined;
  const suggestions = data.optimization_suggestions as Array<Record<string, unknown>> | undefined;

  const perQuestion = aggregated?.per_question as Array<Record<string, unknown>> | undefined;

  return (
    <div className="space-y-4 animate-slide-up">
      <h3 className="text-sm font-semibold text-[var(--accent-green)]">✓ AI销售模拟测试完成</h3>

      {/* Scrape Results */}
      {scrapeResults && <ScrapeResultsCard results={scrapeResults as any} />}

      {/* Survey Questions */}
      {questions && questions.length > 0 && (
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            客户问卷（{questions.length}题）
          </h4>
          <div className="space-y-3">
            {questions.map((q, i) => {
              const options = q.options as Array<Record<string, string>> | undefined;
              return (
                <div key={String(q.id || i)} className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium">{String(q.question)}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      q.importance === 'A' ? 'bg-[var(--accent-red)]/20 text-[var(--accent-red)]' : 'bg-[var(--bg-hover)] text-[var(--text-muted)]'
                    }`}>
                      {String(q.importance)}
                    </span>
                  </div>
                  {options && (
                    <div className="flex flex-wrap gap-2">
                      {options.map((opt, j) => (
                        <span key={j} className="text-xs px-2 py-1 rounded bg-[var(--bg-hover)] text-[var(--text-secondary)]">
                          {opt.label}. {opt.text}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Aggregated Results */}
      {perQuestion && perQuestion.length > 0 && (
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            模拟结果（100组客户）
          </h4>
          <div className="space-y-3">
            {perQuestion.map((q, i) => {
              const dist = q.option_distribution as Record<string, number> | undefined;
              const negRate = q.negative_rate as number | undefined;
              const barColors = ['bg-[var(--accent-blue)]', 'bg-[var(--accent-green)]', 'bg-[var(--accent-amber)]', 'bg-[var(--accent-secondary)]', 'bg-[var(--accent-red)]'];
              return (
                <div key={String(q.question_id || i)} className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-[var(--text-primary)]">{String(q.question_id)}</span>
                    {negRate !== undefined && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        negRate > 0.3 ? 'bg-[var(--accent-red)]/20 text-[var(--accent-red)]' : 'bg-[var(--bg-hover)] text-[var(--text-muted)]'
                      }`}>
                        负面率 {(negRate * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                  {dist && Object.keys(dist).length > 0 && (
                    <div className="space-y-1">
                      {Object.entries(dist).map(([opt, pct], j) => (
                        <div key={opt} className="flex items-center gap-2 text-xs">
                          <span className="w-6 text-[var(--text-muted)] shrink-0">{opt}</span>
                          <div className="flex-1 h-3 bg-[var(--bg-hover)] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${barColors[j % barColors.length]}`} style={{ width: `${(pct * 100).toFixed(0)}%` }} />
                          </div>
                          <span className="w-10 text-right text-[var(--text-secondary)]">{(pct * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {when(aggregated?.overall_metrics, (metrics) => (
            <div className="mt-3 flex gap-4 text-xs text-[var(--text-secondary)]">
              <span>平均满意度：{String((metrics as Record<string, unknown>).average_satisfaction)}</span>
              <span>推荐率：{(((metrics as Record<string, unknown>).recommendation_rate as number) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Optimization Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-[var(--accent-secondary)] uppercase tracking-wider mb-3">
            优化建议
          </h4>
          <div className="space-y-2">
            {suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-xs p-2 rounded-lg border border-[var(--accent-amber)]/30">
                <span className="px-1.5 py-0.5 rounded bg-[var(--accent-amber)]/20 text-[var(--accent-amber)] text-[10px] font-mono shrink-0">
                  #{String(s.priority)}
                </span>
                <div>
                  <span className="text-[var(--text-primary)]">{String(s.area)}</span>
                  <p className="text-[var(--text-muted)] text-xs">{String(s.suggestion)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
