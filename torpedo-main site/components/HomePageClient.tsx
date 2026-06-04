'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const HOME_PATHS = new Set(['/', '/en-in']);

/**
 * Client boundary for home page: scrolls to a section via `initialSectionId` (path routes)
 * or legacy hash links on the home URL only.
 */
export function HomePageClient({
  children,
  initialSectionId,
}: {
  children: React.ReactNode;
  initialSectionId?: string;
}) {
  const pathname = usePathname();
  const [hash, setHash] = React.useState('');

  useEffect(() => {
    setHash(typeof window !== 'undefined' ? window.location.hash : '');
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const scrollToId = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      const t = setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(t);
    };

    if (initialSectionId) {
      return scrollToId(initialSectionId);
    }

    if (!pathname || !HOME_PATHS.has(pathname)) return;
    if (!hash) return;
    const id = hash.slice(1);
    if (!id) return;
    return scrollToId(id);
  }, [pathname, hash, initialSectionId]);

  return <>{children}</>;
}
