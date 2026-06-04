'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('event', 'page_view', {
      page_path: pathname,
      page_title: document.title,
    });
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>('[data-cta]');
      if (!target) return;
      const ctaName = target.getAttribute('data-cta');
      if (!ctaName) return;
      trackEvent('cta_click', {
        cta_name: ctaName,
        cta_location: target.getAttribute('data-cta-location') ?? '',
        destination: target.getAttribute('href') ?? '',
      });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
