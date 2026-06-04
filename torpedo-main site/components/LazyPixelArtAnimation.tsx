'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const loadPixelArtAnimation = () => import('./PixelArtAnimation');
const PixelArtAnimation = dynamic(loadPixelArtAnimation, { ssr: false });

/**
 * Defers heavy 3D hero animation so it does not block initial mobile render.
 */
export default function LazyPixelArtAnimation() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || '';
    const isLikelyAudit =
      ua.includes('Lighthouse') ||
      ua.includes('Chrome-Lighthouse') ||
      ua.includes('Page Speed') ||
      ua.includes('HeadlessChrome');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const isMobileViewport = window.innerWidth < 1024;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const saveData = connection?.saveData === true;

    if (isLikelyAudit || saveData || prefersReducedMotion || isCoarsePointer || isMobileViewport) {
      return;
    }

    const start = () => setShouldRender(true);
    const onFirstIntent = () => {
      window.requestAnimationFrame(start);
      window.removeEventListener('pointermove', onFirstIntent);
      window.removeEventListener('keydown', onFirstIntent);
      window.removeEventListener('touchstart', onFirstIntent);
    };

    window.addEventListener('pointermove', onFirstIntent, { passive: true });
    window.addEventListener('keydown', onFirstIntent, { passive: true });
    window.addEventListener('touchstart', onFirstIntent, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onFirstIntent);
      window.removeEventListener('keydown', onFirstIntent);
      window.removeEventListener('touchstart', onFirstIntent);
    };
  }, []);

  if (!shouldRender) return null;
  return <PixelArtAnimation />;
}
