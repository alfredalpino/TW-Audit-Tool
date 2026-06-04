'use client';

import Link from 'next/link';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.js';
import type { ServiceSeoData } from '@/lib/seo/services';
import { ClayCard } from '@/components/ui/ClayCard';
import { cn } from '@/lib/cn';

type Props = {
  service: ServiceSeoData;
  href: string;
  index: number;
  ctaLabel: string;
  /** Optional i18n overrides keyed by field */
  copy?: {
    name?: string;
    headline?: string;
    intro?: string;
    badge?: string;
    features?: string[];
    cta?: string;
  };
};

const CARD_NUMS = ['01', '02', '03', '04'] as const;

export function ServiceGridCard({ service, href, index, ctaLabel, copy }: Props) {
  const name = copy?.name ?? service.name;
  const headline = copy?.headline ?? service.headline;
  const intro = copy?.intro ?? service.intro;
  const badge = copy?.badge ?? service.badge;
  const features = copy?.features ?? service.features;
  const cta = copy?.cta ?? ctaLabel;
  const cardNum = CARD_NUMS[index] ?? String(index + 1).padStart(2, '0');

  return (
    <Link
      href={href}
      className={cn(
        'group block h-full rounded-[var(--clay-radius-md)] outline-none',
        'focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]',
      )}
      aria-label={`${name}: ${headline}`}
    >
      <ClayCard
        as="article"
        hover
        className="relative flex h-full min-h-[320px] flex-col overflow-hidden p-7 md:min-h-[360px] md:p-9"
      >
        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: 'var(--gradient-card)' }}
          aria-hidden
        />
        <span
          className="pointer-events-none absolute -right-2 -top-6 font-display text-[length:6.5rem] font-extrabold leading-none text-[var(--fg-primary)] opacity-[0.04] transition-opacity duration-500 group-hover:opacity-[0.07] md:text-[length:7.5rem]"
          aria-hidden
        >
          {cardNum}
        </span>

        <div className="relative z-[1] flex flex-1 flex-col">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--brand)]">{headline}</p>
            {badge ? (
              <span className="shrink-0 rounded-full border border-[var(--brand)]/25 bg-[var(--brand)]/10 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-wide text-[var(--brand)]">
                {badge}
              </span>
            ) : null}
          </div>

          <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-[var(--fg-primary)] md:text-[1.65rem]">
            {name}
          </h3>

          <p className="mt-4 flex-1 text-sm leading-[1.7] text-[var(--fg-secondary)] md:text-[0.95rem]">{intro}</p>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${name} capabilities`}>
            {features.map((feature) => (
              <li
                key={feature}
                className="rounded-[var(--clay-radius-sm)] border border-[var(--border)] bg-[var(--bg-base)]/60 px-2.5 py-1 font-mono text-[0.68rem] leading-snug text-[var(--fg-secondary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors group-hover:border-[var(--border-hover)] md:text-[0.7rem]"
              >
                {feature}
              </li>
            ))}
          </ul>

          <span className="mt-7 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand)] transition-transform duration-300 group-hover:translate-x-0.5">
            {cta}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
          </span>
        </div>
      </ClayCard>
    </Link>
  );
}
