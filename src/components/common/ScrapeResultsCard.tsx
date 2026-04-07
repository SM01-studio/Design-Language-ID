'use client';

interface ScrapeResult {
  title?: string;
  summary?: string;
  url?: string;
  content?: string;
  keyword?: string;
  author?: string;
  scraped_at?: string;
  engagement?: string;
}

interface ScrapeResults {
  wechat?: ScrapeResult[];
  xiaohongshu?: ScrapeResult[];
  douyin?: ScrapeResult[];
}

interface PlatformConfig {
  key: keyof ScrapeResults;
  label: string;
  borderColor: string;
  bgColor: string;
  badgeColor: string;
}

const PLATFORMS: PlatformConfig[] = [
  {
    key: 'wechat',
    label: '微信公众号',
    borderColor: 'border-[#16a34a]',
    bgColor: 'bg-[#16a34a]/5',
    badgeColor: 'bg-[#16a34a]/20 text-[#16a34a]',
  },
  {
    key: 'xiaohongshu',
    label: '小红书',
    borderColor: 'border-[#ef4444]',
    bgColor: 'bg-[#ef4444]/5',
    badgeColor: 'bg-[#ef4444]/20 text-[#ef4444]',
  },
  {
    key: 'douyin',
    label: '抖音',
    borderColor: 'border-[#a78bfa]',
    bgColor: 'bg-[#a78bfa]/5',
    badgeColor: 'bg-[#a78bfa]/20 text-[#a78bfa]',
  },
];

export default function ScrapeResultsCard({ results }: { results: ScrapeResults }) {
  const totalCount = PLATFORMS.reduce(
    (sum, p) => sum + (results[p.key]?.length || 0),
    0,
  );

  if (totalCount === 0) return null;

  return (
    <div className="glass-card p-4 animate-slide-up">
      <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
        市场数据采集（共 {totalCount} 条）
      </h4>
      <div className="grid grid-cols-3 gap-3">
        {PLATFORMS.map((platform) => {
          const items = results[platform.key];
          if (!items || items.length === 0) return null;
          return (
            <div
              key={platform.key}
              className={`rounded-lg border ${platform.borderColor} ${platform.bgColor} p-3`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${platform.badgeColor}`}>
                  {platform.label}
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">{items.length} 条</span>
              </div>
              <div className="space-y-2">
                {items.slice(0, 5).map((item, i) => (
                  <div key={i} className="space-y-0.5">
                    {item.keyword && (
                      <span className="text-[10px] px-1 py-0.5 rounded bg-[var(--bg-hover)] text-[var(--text-muted)]">
                        {item.keyword}
                      </span>
                    )}
                    {(item.title || item.content) && (
                      <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                        {item.title}{item.title && item.content ? '：' : ''}{item.content && item.content.length > 80 ? item.content.slice(0, 80) + '…' : item.content || ''}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                      {item.author && <span>{item.author}</span>}
                      {item.scraped_at && <span>{item.scraped_at.split('T')[0]}</span>}
                    </div>
                  </div>
                ))}
                {items.length > 5 && (
                  <p className="text-[10px] text-[var(--text-muted)]">...等 {items.length} 条</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
