'use client';

import { useEffect, useState } from 'react';
import { verifyAuth } from '@/services/api';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // Local dev: skip auth entirely
    if (isLocal) {
      localStorage.setItem('auth_token', 'dev-token');
      setIsAuth(true);
      setIsChecking(false);
      return;
    }

    // Production: check for token in URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('auth_token');
    if (token) {
      localStorage.setItem('auth_token', token);
      window.history.replaceState({}, '', window.location.pathname);
    }

    verifyAuth().then((valid) => {
      if (valid) {
        setIsAuth(true);
      } else {
        window.location.href = 'https://siliang.cfd/index.html?from=design-id';
        return;
      }
      setIsChecking(false);
    });
  }, []);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-2 border-[var(--accent-green)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-secondary)] text-sm">验证身份中...</p>
        </div>
      </div>
    );
  }

  if (!isAuth) return null;

  return <>{children}</>;
}
