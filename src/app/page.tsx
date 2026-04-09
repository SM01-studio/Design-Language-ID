'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyAuth } from '@/services/api';
import LandingHero from '@/components/landing/LandingHero';
import LandingWorkflow from '@/components/landing/LandingWorkflow';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingCTA from '@/components/landing/LandingCTA';
import LandingFooter from '@/components/landing/LandingFooter';

export default function Home() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Entry auth check: redirect to main portal if not logged in
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
      window.location.href = 'https://siliang.cfd/index.html?from=design-id';
      return;
    }

    verifyAuth().then((valid) => {
      if (!valid) {
        localStorage.removeItem('auth_token');
        window.location.href = 'https://siliang.cfd/index.html?from=design-id';
      } else {
        setAuthChecked(true);
      }
    });
  }, []);

  const handleGetStarted = async () => {
    setIsNavigating(true);
    router.push('/workspace/new?onboarding=true');
  };

  // Wait for entry auth check before rendering anything
  if (!authChecked) {
    return null;
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
