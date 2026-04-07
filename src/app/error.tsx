'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E1C1A]">
      <div className="glass-card p-8 max-w-md text-center">
        <div className="text-4xl mb-4">&#x26A0;</div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">出了点问题</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          {error.message || '页面加载时发生错误，请重试。'}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 text-sm rounded-lg bg-[var(--accent-amber)] text-white hover:opacity-90 transition-colors cursor-pointer"
        >
          重试
        </button>
      </div>
    </div>
  );
}
