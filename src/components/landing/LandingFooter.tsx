'use client';

import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="border-t border-[var(--border)] py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-[var(--accent-green)] to-[var(--accent-blue)] flex items-center justify-center">
            <span className="text-[10px] text-white font-bold">DL</span>
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            Design Language Translation AI - ID Showflat
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs text-[var(--text-muted)]">
          <Link
            href="https://siliang.cfd"
            className="hover:text-[var(--text-secondary)] transition-colors"
          >
            返回主门户
          </Link>
          <span>&copy; 2026 CLD-PDDM AI LAB. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
