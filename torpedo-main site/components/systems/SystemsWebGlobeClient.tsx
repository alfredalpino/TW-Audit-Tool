'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const WebGlobe = dynamic(() => import('@/components/canvas/WebGlobe'), { ssr: false });

export function SystemsWebGlobeClient() {
  return (
    <Suspense fallback={<div className="absolute inset-0 z-0 bg-[var(--bg-void)]" aria-hidden />}>
      <WebGlobe />
    </Suspense>
  );
}
