'use client';

import { useState } from 'react';
import { useWorkflowStore } from '@/store/workflowStore';
import { uploadApi } from '@/services/api';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface StepListenProps {
  data?: Record<string, unknown>;
  isLoading: boolean;
}

export default function StepListen({ data, isLoading }: StepListenProps) {
  const { executeStep } = useWorkflowStore();
  const [fileText, setFileText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    try {
      const result = await uploadApi.upload(file);
      setFileText(result.text);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleStart = () => {
    if (!fileText.trim()) return;
    executeStep(1, { text: fileText });
  };

  // Display results
  if (data) {
    const userProfile = data.user_profile as Record<string, string> | undefined;
    const explicitNeeds = data.explicit_needs as Array<Record<string, string>> | undefined;
    const implicitNeeds = data.implicit_needs as Array<Record<string, string>> | undefined;
    const emotionalNeeds = data.emotional_needs as Array<Record<string, string>> | undefined;
    const scenarios = data.scenarios as Array<Record<string, unknown>> | undefined;
    const designStyle = data.design_style as Record<string, unknown> | undefined;

    return (
      <div className="space-y-4 animate-slide-up">
        <h3 className="text-sm font-semibold text-[var(--accent-green)]">
          ✓ 需求分析完成
        </h3>

        {/* User Profile */}
        {userProfile && (
          <div className="glass-card p-4">
            <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
              用户画像
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {Object.entries(userProfile).map(([key, value]) => (
                <div key={key}>
                  <span className="text-[var(--text-muted)]">{key}: </span>
                  <span className="text-[var(--text-primary)]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explicit Needs */}
        {explicitNeeds && Array.isArray(explicitNeeds) && (
          <div className="glass-card p-4">
            <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
              显性需求
            </h4>
            <div className="space-y-2">
              {explicitNeeds.map((need, i) => (
                <div key={need.id || i} className="flex items-start gap-2 text-xs">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0 ${
                    need.priority === 'high'
                      ? 'bg-[var(--accent-red)]/20 text-[var(--accent-red)]'
                      : need.priority === 'medium'
                      ? 'bg-[var(--accent-amber)]/20 text-[var(--accent-amber)]'
                      : 'bg-[var(--bg-hover)] text-[var(--text-muted)]'
                  }`}>
                    {need.priority}
                  </span>
                  <div>
                    <span className="text-[var(--text-primary)]">{need.description}</span>
                    {need.category && (
                      <span className="ml-2 text-[var(--text-muted)]">[{need.category}]</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Implicit Needs */}
        {implicitNeeds && Array.isArray(implicitNeeds) && implicitNeeds.length > 0 && (
          <div className="glass-card p-4">
            <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
              隐性需求
            </h4>
            <div className="space-y-2">
              {implicitNeeds.map((need, i) => (
                <div key={need.id || i} className="flex items-start gap-2 text-xs">
                  <span className="text-[var(--text-muted)]">{String(need.id || `IN-${i + 1}`)}</span>
                  <div>
                    <span className="text-[var(--text-primary)]">{need.description}</span>
                    {need.category && (
                      <span className="ml-2 text-[var(--text-muted)]">[{need.category}]</span>
                    )}
                    {need.inferred_from && (
                      <span className="ml-2 text-[var(--accent-blue)]">← {String(need.inferred_from)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emotional Needs */}
        {emotionalNeeds && Array.isArray(emotionalNeeds) && emotionalNeeds.length > 0 && (
          <div className="glass-card p-4">
            <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
              情感需求
            </h4>
            <div className="space-y-2">
              {emotionalNeeds.map((need, i) => (
                <div key={need.id || i} className="flex items-start gap-2 text-xs">
                  <span className="text-[var(--text-muted)]">{String(need.id || `EM-${i + 1}`)}</span>
                  <span className="text-[var(--text-primary)]">{need.description}</span>
                  {need.category && (
                    <span className="ml-2 text-[var(--text-muted)]">[{need.category}]</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Design Style — extracted from requirements document */}
        {designStyle && (
          <div className="glass-card p-4">
            <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
              从需求文档提炼的设计风格
            </h4>
            <p className="text-[10px] text-[var(--text-muted)] mb-3">
              来源：{String(designStyle.source || 'AI基于需求推导')}
            </p>
            <div className="space-y-2">
              {designStyle.style_positioning ? (
                <div className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--text-muted)]">整体风格定位</span>
                  <p className="text-sm font-medium text-[var(--accent-amber)]">{String(designStyle.style_positioning)}</p>
                </div>
              ) : null}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {designStyle.color_tone ? (
                  <div>
                    <span className="text-[var(--text-muted)]">主色调： </span>
                    <span className="text-[var(--text-primary)]">{String(designStyle.color_tone)}</span>
                  </div>
                ) : null}
                {designStyle.material_direction ? (
                  <div>
                    <span className="text-[var(--text-muted)]">材质方向： </span>
                    <span className="text-[var(--text-primary)]">{String(designStyle.material_direction)}</span>
                  </div>
                ) : null}
              </div>
              {Array.isArray(designStyle.atmosphere_keywords) && designStyle.atmosphere_keywords.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {(designStyle.atmosphere_keywords as string[]).map((kw, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-md bg-[var(--accent-amber)]/10 border border-[var(--accent-amber)]/20 text-[var(--accent-amber)]">
                      {kw}
                    </span>
                  ))}
                </div>
              ) : null}
              {Array.isArray(designStyle.reference_styles) && designStyle.reference_styles.length > 0 ? (
                <div className="text-xs text-[var(--text-muted)]">
                  参考：{(designStyle.reference_styles as string[]).join('、')}
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Scenarios */}
        {scenarios && Array.isArray(scenarios) && (
          <div className="glass-card p-4">
            <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
              场景映射
            </h4>
            <div className="space-y-3">
              {scenarios.map((sc, i) => {
                const painPoints = sc.pain_points as string[] | undefined;
                const interventionPoints = sc.intervention_points as string[] | undefined;
                return (
                  <div key={String(sc.id || i)} className="p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--accent-blue)]/20 text-[var(--accent-blue)]">
                        {String(sc.space)}
                      </span>
                      <span className="text-xs font-medium">{String(sc.scenario_name)}</span>
                    </div>
                    {painPoints && (
                      <div className="text-xs text-[var(--text-muted)]">
                        <span className="text-[var(--accent-amber)]">痛点:</span>{' '}
                        {painPoints.join('、')}
                      </div>
                    )}
                    {interventionPoints && (
                      <div className="text-xs text-[var(--text-muted)] mt-1">
                        <span className="text-[var(--accent-green)]">干预点:</span>{' '}
                        {interventionPoints.join('、')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Upload form
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-slide-up">
      <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center mb-4">
        <Upload size={24} className="text-[var(--accent-green)]" />
      </div>
      <h3 className="text-lg font-heading font-semibold mb-2">上传需求文档</h3>
      <p className="text-sm text-[var(--text-secondary)] max-w-md mb-6">
        上传样板房项目的需求文档（PDF/DOCX），AI 将自动解析并提取结构化需求。
      </p>

      <label className="flex flex-col items-center gap-3 px-8 py-6 glass-card cursor-pointer hover:border-[var(--accent-green)]/50 transition-colors">
        <FileText size={32} className="text-[var(--text-muted)]" />
        <span className="text-sm text-[var(--text-secondary)]">
          {fileName || '点击或拖拽文件到此处'}
        </span>
        <span className="text-xs text-[var(--text-muted)]">支持 PDF, DOCX, XLSX</span>
        <input
          type="file"
          accept=".pdf,.docx,.doc,.xlsx"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      {isUploading && (
        <div className="flex items-center gap-2 mt-3">
          <Loader2 size={14} className="animate-spin text-[var(--accent-green)]" />
          <span className="text-xs text-[var(--text-secondary)]">正在解析文件...</span>
        </div>
      )}

      {fileText && (
        <div className="mt-4 w-full max-w-lg">
          <div className="text-xs text-[var(--text-muted)] mb-2 text-left">
            文档预览（{fileText.length} 字符）
          </div>
          <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] max-h-40 overflow-y-auto text-left">
            <pre className="text-[10px] text-[var(--text-secondary)] whitespace-pre-wrap font-mono">
              {fileText.slice(0, 2000)}
              {fileText.length > 2000 && '...'}
            </pre>
          </div>
          <button
            onClick={handleStart}
            disabled={isLoading}
            className="mt-3 flex items-center gap-2 px-6 py-2.5 text-sm rounded-xl bg-[var(--accent-green)] text-white hover:bg-[var(--accent-green-hover)] disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                AI 分析中...
              </>
            ) : (
              '开始需求分析'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
