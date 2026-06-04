'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { RegionSelector } from '@/components/i18n/RegionSelector';
import {
  formatLanguageLabel,
  getLocaleFromPathname,
  readLocaleCookie,
} from '@/lib/i18n/config';

type LocaleFooterTriggerProps = {
  className?: string;
};

export function LocaleFooterTrigger({ className = '' }: LocaleFooterTriggerProps) {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  const label = useMemo(() => {
    const locale = readLocaleCookie() ?? getLocaleFromPathname(pathname);
    return formatLanguageLabel(locale);
  }, [pathname, open]);

  if (!mounted) {
    return (
      <span className={`font-mono text-xs text-[var(--fg-tertiary)] ${className}`} aria-hidden>
        Language
      </span>
    );
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className={`group inline-flex items-center gap-1.5 font-mono text-xs text-[var(--fg-tertiary)] transition-colors hover:text-[var(--fg-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-void)] ${className}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="region-selector-title"
      >
        <Globe className="h-3.5 w-3.5 shrink-0 opacity-70 transition-opacity group-hover:opacity-100" aria-hidden />
        <span>{label}</span>
      </button>

      <RegionSelector open={open} onClose={() => setOpen(false)} returnFocusRef={triggerRef} />
    </>
  );
}

export default LocaleFooterTrigger;
