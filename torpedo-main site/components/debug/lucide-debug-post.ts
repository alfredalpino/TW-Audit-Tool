/**
 * Loaded only after direct lucide icon modules in Services.tsx — proves client/server finished lucide graph.
 */
// #region agent log
fetch('http://127.0.0.1:7765/ingest/41b9f742-28ad-4e08-b312-f6048c6456c8', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '8c3cea' },
  body: JSON.stringify({
    sessionId: '8c3cea',
    runId: 'post-lucide',
    hypothesisId: 'VERIFY',
    location: 'components/debug/lucide-debug-post.ts',
    message: 'Services chunk: after lucide direct imports',
    data: {
      stage: 'post-lucide',
      fix: 'direct-imports-no-optimizePackageImports',
      runtime: typeof window === 'undefined' ? 'node-or-ssr' : 'browser',
    },
    timestamp: Date.now(),
  }),
}).catch(() => {});
// #endregion
