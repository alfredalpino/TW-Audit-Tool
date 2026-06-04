'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks whether the user has scrolled past `threshold` px (default 60 — navbar spec).
 */
export function useScrollPosition(threshold = 60): boolean {
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setPassed(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return passed;
}
