'use client';

import { ChevronDown } from 'lucide-react';
import { useTranslations } from '@/components/i18n/LocaleProvider';

export function HomeHeroScrollHint() {
  const { t: tHome } = useTranslations('home');

  return (
    <div className="pointer-events-none absolute bottom-8 left-1/2 z-[10] flex -translate-x-1/2 flex-col items-center gap-1 text-[var(--fg-tertiary)]">
      <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">
        {tHome('scrollHint', 'Scroll')}
      </span>
      <ChevronDown className="h-6 w-6 animate-hero-chevron" aria-hidden />
    </div>
  );
}
