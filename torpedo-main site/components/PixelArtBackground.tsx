'use client';

import React, { useEffect, useState } from 'react';

/**
 * Site-wide greyscale pixel-art background. Fixed full-viewport canvas with
 * a dotted grid at low opacity. Hidden when the hero section is in view so
 * the hero globe remains the focus.
 */
export function PixelArtBackground() {
  // Start hidden to avoid flash on home; observer or no-hero will show when appropriate.
  const [hideOverHero, setHideOverHero] = useState(true);
  const [disableBackground, setDisableBackground] = useState(true);

  // Hero visibility: hide this layer when #hero is in view
  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) {
      setHideOverHero(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setHideOverHero(entry.isIntersecting),
      { threshold: 0.1, rootMargin: '0px' }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Keep this layer disabled on mobile/tablet and users who prefer reduced motion.
  // This replaces the previous WebGL implementation with a zero-JS paint-only layer.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const isMobileViewport = window.innerWidth < 1024;
    setDisableBackground(prefersReducedMotion || isCoarsePointer || isMobileViewport);
  }, []);

  if (disableBackground) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-300 ${hideOverHero ? 'opacity-0' : 'opacity-100'}`}
    >
      <div
        className="h-full w-full"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(10,10,11,0.11) 1px, transparent 1px), radial-gradient(circle at 75% 20%, rgba(255,85,0,0.06) 0%, transparent 35%)',
          backgroundSize: '24px 24px, 100% 100%',
        }}
      />
    </div>
  );
}
