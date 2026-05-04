'use client';

import { Loader2 } from 'lucide-react';
import KbReferencesCard from '@/components/common/KbReferencesCard';

interface StepProps {
  data?: Record<string, unknown>;
  isLoading: boolean;
}

export default function StepEmpathize({ data, isLoading }: StepProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full animate-pulse-slow">
        <Loader2 size={24} className="animate-spin text-[var(--accent-amber)]" />
        <p className="text-sm text-[var(--text-secondary)] mt-4">正在进行同理心模拟...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-sm text-[var(--text-muted)]">请先完成步骤1（聆听）</p>
      </div>
    );
  }

  const empathyMap = data.empathy_map as Array<Record<string, string>> | undefined;
  const conflicts = data.conflicts as Array<Record<string, string>> | undefined;
  const validations = data.validations as Array<Record<string, string>> | undefined;

  return (
    <div className="space-y-4 animate-slide-up">
      <h3 className="text-sm font-semibold text-[var(--accent-green)]">✓ 同理心模拟完成</h3>

      {/* Empathy Map */}
      {empathyMap && Array.isArray(empathyMap) && (
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            同理心地图
          </h4>
          <div className="space-y-3">
            {empathyMap.map((item, i) => (
              <div key={`${item.scenario_id}-${i}`} className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]">
                <div className="text-xs font-medium mb-2 text-[var(--accent-blue)]">
                  {item.scenario_id}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-[var(--text-muted)]">说:</span> {item.says}</div>
                  <div><span className="text-[var(--text-muted)]">想:</span> {item.thinks}</div>
                  <div><span className="text-[var(--text-muted)]">感:</span> {item.feels}</div>
                  <div><span className="text-[var(--text-muted)]">做:</span> {item.does}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conflicts */}
      {conflicts && Array.isArray(conflicts) && conflicts.length > 0 && (
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            冲突预判
          </h4>
          <div className="space-y-2">
            {conflicts.map((cf, i) => (
              <div key={cf.id || i} className="p-2 rounded-lg border border-[var(--border)] text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    cf.severity === 'critical'
                      ? 'bg-[var(--accent-red)]/20 text-[var(--accent-red)]'
                      : cf.severity === 'medium'
                      ? 'bg-[var(--accent-amber)]/20 text-[var(--accent-amber)]'
                      : 'bg-[var(--bg-hover)] text-[var(--text-muted)]'
                  }`}>
                    {cf.severity}
                  </span>
                  <span className="text-[var(--text-primary)]">{cf.type}</span>
                </div>
                <p className="text-[var(--text-secondary)]">{cf.description}</p>
                {cf.resolution_direction && (
                  <p className="text-xs text-[var(--accent-green)] mt-1">
                    解决方向: {cf.resolution_direction}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Validations */}
      {validations && Array.isArray(validations) && (
        <div className="glass-card p-4">
          <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
            规范验证
          </h4>
          <div className="space-y-1">
            {validations.map((v, i) => (
              <div key={`val-${i}`} className="flex items-center gap-2 text-xs py-1">
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  v.status === 'pass' ? 'bg-[var(--accent-green)]' : v.status === 'warning' ? 'bg-[var(--accent-amber)]' : 'bg-[var(--accent-red)]'
                }`} />
                <span className="text-[var(--text-primary)]">{v.check_item}</span>
                <span className="text-[var(--text-muted)] text-xs">{v.standard_reference}</span>
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
