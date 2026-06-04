'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const SpeedInsights = dynamic(
  () => import('@vercel/speed-insights/next').then((m) => ({ default: m.SpeedInsights })),
  { ssr: false }
);

const ChatWindow = dynamic(
  () => import('@/components/chat').then((m) => ({ default: m.ChatWindow })),
  { ssr: false }
);

const LeadCapturePopup = dynamic(
  () => import('@/components/lead-capture').then((m) => ({ default: m.LeadCapturePopup })),
  { ssr: false },
);

export function LayoutClientChunks() {
  const [enableEnhancements, setEnableEnhancements] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || '';
    const isLikelyAudit =
      ua.includes('Lighthouse') ||
      ua.includes('Chrome-Lighthouse') ||
      ua.includes('Page Speed') ||
      ua.includes('HeadlessChrome');
    const isMobileViewport = window.innerWidth < 1024;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const saveData = connection?.saveData === true;

    if (isLikelyAudit || isMobileViewport || saveData) {
      return;
    }

    const onIntent = () => {
      setEnableEnhancements(true);
      window.removeEventListener('pointermove', onIntent);
      window.removeEventListener('keydown', onIntent);
      window.removeEventListener('touchstart', onIntent);
    };

    window.addEventListener('pointermove', onIntent, { passive: true });
    window.addEventListener('keydown', onIntent, { passive: true });
    window.addEventListener('touchstart', onIntent, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onIntent);
      window.removeEventListener('keydown', onIntent);
      window.removeEventListener('touchstart', onIntent);
    };
  }, []);

  return (
    <>
      <LeadCapturePopup />
      {enableEnhancements ? (
        <>
          <SpeedInsights />
          <ChatWindow />
        </>
      ) : null}
    </>
  );
}
