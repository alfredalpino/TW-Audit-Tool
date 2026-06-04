'use client';

import dynamic from 'next/dynamic';

const AmbientParticles = dynamic(() => import('@/components/ui/AmbientParticles'), {
  ssr: false,
});

/** Decorative hero layers loaded after paint (particles, gradients). */
export function HomeHeroDecor() {
  return (
    <>
      <AmbientParticles />
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[image:var(--gradient-hero)] opacity-55"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] tw-dot-grid opacity-[0.04]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-0 right-0 top-[30%] z-[2] h-px bg-[var(--fg-primary)] opacity-[0.03]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-0 right-0 top-[60%] z-[2] h-px bg-[var(--fg-primary)] opacity-[0.03]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-0 right-0 top-[85%] z-[2] h-px bg-[var(--fg-primary)] opacity-[0.03]"
        aria-hidden
      />
    </>
  );
}
