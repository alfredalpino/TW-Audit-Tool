/**
 * Side-effect-only module imported immediately before lucide-react in Services.tsx.
 * If this runs, the Services chunk started evaluating; failure after this points at lucide/Turbopack.
 */
// #region agent log
fetch('http://127.0.0.1:7765/ingest/41b9f742-28ad-4e08-b312-f6048c6456c8', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '8c3cea' },
  body: JSON.stringify({
    sessionId: '8c3cea',
    runId: 'pre-lucide',
    hypothesisId: 'H4',
    location: 'components/debug/lucide-debug-prelude.ts',
    message: 'Services chunk: before lucide-react import',
    data: {
      stage: 'pre-lucide',
      runtime: typeof window === 'undefined' ? 'node-or-ssr' : 'browser',
    },
    timestamp: Date.now(),
  }),
}).catch(() => {});
// #endregion
