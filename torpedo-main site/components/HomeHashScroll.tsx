'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const HOME_PATHS = new Set(['/', '/en-in']);

/** Scrolls to a hash target on the home URLs only (deferred client chunk). */
export function HomeHashScroll({ initialSectionId }: { initialSectionId?: string }) {
  const pathname = usePathname();
  const [hash, setHash] = useState('');

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

  return null;
}
