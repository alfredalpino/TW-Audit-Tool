/**
 * Next.js instrumentation hook — runs on server startup (Node).
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  // #region agent log
  await fetch('http://127.0.0.1:7765/ingest/41b9f742-28ad-4e08-b312-f6048c6456c8', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '8c3cea' },
    body: JSON.stringify({
      sessionId: '8c3cea',
      runId: 'bootstrap',
      hypothesisId: 'H3',
      location: 'instrumentation.ts:register',
      message: 'server bootstrap',
      data: {
        nodeEnv: process.env.NODE_ENV,
        nextRuntime: process.env.NEXT_RUNTIME,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
}
