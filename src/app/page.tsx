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

  // Background auth check: redirect if not logged in (non-blocking)
  useEffect(() => {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
      localStorage.setItem('auth_token', 'dev-token');
      return;
    }

    // Save token from URL if present
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('auth_token');
    if (urlToken) {
      localStorage.setItem('auth_token', urlToken);
      window.history.replaceState({}, '', window.location.pathname);
    }

    // No token at all → redirect immediately
    const storedToken = localStorage.getItem('auth_token');
    if (!storedToken) {
      window.location.href = MAIN_PORTAL;
      return;
    }

    // Has token → verify in background
    verifyAuth().then((valid) => {
      if (!valid) {
        localStorage.removeItem('auth_token');
        window.location.href = MAIN_PORTAL;
      }
    });
  }, []);

  const handleGetStarted = async () => {
    setIsNavigating(true);

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
      localStorage.setItem('auth_token', 'dev-token');
      router.push('/workspace/new?onboarding=true');
      return;
    }

    const valid = await verifyAuth();
    if (valid) {
      router.push('/workspace/new?onboarding=true');
    } else {
      localStorage.removeItem('auth_token');
      window.location.href = MAIN_PORTAL;
    }
  };

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
