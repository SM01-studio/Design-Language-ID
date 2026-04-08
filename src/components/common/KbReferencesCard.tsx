'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Database } from 'lucide-react';

interface KbRef {
  source: string;
  category: string;
  snippet: string;
}

interface Props {
  references?: KbRef[] | unknown;
}

export default function KbReferencesCard({ references }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (!references || !Array.isArray(references) || references.length === 0) return null;

  return (
    <div className="glass-card p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          <Database size={14} className="text-[var(--accent-blue)]" />
          <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            RAG 知识库注入
          </h4>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--accent-blue)]/15 text-[var(--accent-blue)]">
            {references.length} 条
          </span>
        </div>
        {expanded
          ? <ChevronUp size={14} className="text-[var(--text-muted)]" />
          : <ChevronDown size={14} className="text-[var(--text-muted)]" />
        }
      </button>

      {expanded && (
        <div className="mt-3 space-y-2">
          {references.map((ref, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-[var(--accent-blue)] font-mono">参考{i + 1}</span>
                {ref.category && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-hover)] text-[var(--text-muted)]">
                    {ref.category}
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-primary)] font-medium mb-1 truncate">
                {ref.source}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed line-clamp-2">
                {ref.snippet}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
