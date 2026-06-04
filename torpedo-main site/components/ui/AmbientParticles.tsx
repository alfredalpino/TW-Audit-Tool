'use client';

/**
 * Lightweight ambient particles in the hero (desktop only; disabled with reduced motion).
 * GSAP is loaded on demand so it does not block LCP.
 */

import { useEffect, useRef } from 'react';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(min-width: 768px)').matches;
}

export default function AmbientParticles() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion() || !isDesktop()) return;

    let cancelled = false;
    const particles: HTMLDivElement[] = [];
    const tweens: { kill: () => void }[] = [];

    void import('gsap').then(({ default: gsap }) => {
      if (cancelled) return;

      for (let i = 0; i < 25; i++) {
        const el = document.createElement('div');
        const size = 4 + Math.random() * 6;
        el.style.position = 'absolute';
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.borderRadius = '9999px';
        el.style.left = `${Math.random() * 100}%`;
        el.style.top = `${Math.random() * 100}%`;
        el.style.pointerEvents = 'none';
        el.style.opacity = String(0.15 + Math.random() * 0.25);
        const isDark = document.documentElement.dataset.theme === 'dark';
        el.style.background =
          Math.random() > 0.45
            ? 'rgba(255, 78, 0, 0.2)'
            : isDark
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(28, 25, 22, 0.08)';
        root.appendChild(el);
        particles.push(el);

        const tw = gsap.to(el, {
          y: `-=${20 + Math.random() * 40}`,
          x: `+=${10 + Math.random() * 20}`,
          opacity: 0.05,
          duration: 3 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 2,
        });
        tweens.push(tw);
      }
    });

    return () => {
      cancelled = true;
      tweens.forEach((t) => t.kill());
      particles.forEach((p) => p.remove());
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden min-[768px]:block"
      aria-hidden
    />
  );
}
