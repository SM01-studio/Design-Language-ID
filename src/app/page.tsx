'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyAuth } from '@/services/api';
import LandingHero from '@/components/landing/LandingHero';
import LandingWorkflow from '@/components/landing/LandingWorkflow';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingCTA from '@/components/landing/LandingCTA';
import LandingFooter from '@/components/landing/LandingFooter';

const MAIN_PORTAL = 'https://siliang.cfd/index.html?from=design-id';

export default function Home() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Entry auth check: fresh verify (bypasses backend cache) → redirect if invalid
  useEffect(() => {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
      setAuthChecked(true);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get('auth_token');
    if (token) {
      localStorage.setItem('auth_token', token);
      window.history.replaceState({}, '', window.location.pathname);
    }

    const storedToken = localStorage.getItem('auth_token');
    if (!storedToken) {
      window.location.href = MAIN_PORTAL;
      return;
    }

    verifyAuth(true).then((valid) => {
      if (!valid) {
        localStorage.removeItem('auth_token');
        window.location.href = MAIN_PORTAL;
      } else {
        setAuthChecked(true);
      }
    });
  }, []);

  const handleGetStarted = async () => {
    setIsNavigating(true);
    router.push('/workspace/new?onboarding=true');
  };

  // Loading screen while checking auth
  if (!authChecked) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#1E1C1A]">
        <div className="relative w-12 h-12 mb-4">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <circle cx="24" cy="24" r="20" fill="none" stroke="#D97706" strokeWidth="2.5"
              strokeLinecap="round" strokeDasharray={125.6} className="animate-[spin_1s_linear_infinite]" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-mono text-[#D97706]">
            ID
          </span>
        </div>
        <p className="text-sm text-white/60">正在验证身份...</p>
      </div>
    );
  }

  if (isNavigating) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-2 border-[var(--accent-green)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-secondary)] text-sm">正在加载工作区...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <LandingHero onGetStarted={handleGetStarted} />
      <LandingWorkflow />
      <LandingFeatures />
      <LandingCTA onGetStarted={handleGetStarted} />
      <LandingFooter />
    </div>
  );
}
