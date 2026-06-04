'use client';

import { useEffect } from 'react';

/**
 * Runs early from root layout to capture cache / SW state independent of page chunk failures.
 */
export function LucideDebugProbe() {
  useEffect(() => {
    const run = async () => {
      let firstStaticScript: string | null = null;
      const scripts = Array.from(document.querySelectorAll('script[src]')) as HTMLScriptElement[];
      for (const s of scripts) {
        if (s.src && s.src.includes('/_next/static')) {
          firstStaticScript = s.src;
          break;
        }
      }

      let cacheControl: string | null = null;
      if (firstStaticScript) {
        try {
          const r = await fetch(firstStaticScript, { method: 'HEAD', cache: 'no-store' });
          cacheControl = r.headers.get('cache-control');
        } catch {
          cacheControl = 'fetch_failed';
        }
      }

      let swCount = -1;
      if ('serviceWorker' in navigator) {
        try {
          const regs = await navigator.serviceWorker.getRegistrations();
          swCount = regs.length;
        } catch {
          swCount = -2;
        }
      }

      // #region agent log
      fetch('http://127.0.0.1:7765/ingest/41b9f742-28ad-4e08-b312-f6048c6456c8', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '8c3cea' },
        body: JSON.stringify({
          sessionId: '8c3cea',
          runId: 'client-probe',
          hypothesisId: 'H2',
          location: 'components/debug/LucideDebugProbe.tsx',
          message: 'client cache + SW probe',
          data: {
            origin: typeof window !== 'undefined' ? window.location.origin : null,
            firstStaticScript,
            cacheControl,
            swCount,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
    };

    void run();
  }, []);

  return null;
}
