'use client';

import Check from 'lucide-react/dist/esm/icons/check.js';
import Button from '@/components/ui/Button';
import { ClayCard } from '@/components/ui/ClayCard';
import { cn } from '@/lib/cn';

export type PricingCardProps = {
  name: string;
  slug: string;
  priceRange: string;
  tag?: string;
  features: string[];
  featured?: boolean;
  ctaLabel: string;
  ctaHref: string;
};

export function PricingCard({
  name,
  slug,
  priceRange,
  tag,
  features,
  featured = false,
  ctaLabel,
  ctaHref,
}: PricingCardProps) {
  return (
    <ClayCard
      as="article"
      light
      hover
      className={cn(
        'group relative flex flex-col p-8 transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:transform-none',
        featured &&
          'z-[1] border-torpedo-orange/40 ring-2 ring-torpedo-orange/25 md:scale-[1.03] md:-my-2 md:py-10',
      )}
      aria-labelledby={`plan-${slug}`}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-clay-brand px-4 py-1 text-xs font-bold uppercase tracking-wider text-[var(--brand-fg)] shadow-clay-brand">
          Recommended
        </div>
      )}
      <div className="mb-6">
        {tag && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-torpedo-gray">{tag}</p>
        )}
        <h2 id={`plan-${slug}`} className="text-xl font-bold tracking-tight text-torpedo-dark md:text-2xl">
          {name}
        </h2>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-torpedo-dark md:text-[1.65rem]">
          {priceRange}
        </p>
      </div>
      <ul className="mb-8 flex flex-1 flex-col gap-3 text-[0.9375rem] leading-relaxed text-torpedo-dark/85" role="list">
        {features.map((f) => (
          <li key={f} className="flex gap-3">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-torpedo-orange" aria-hidden />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Button
        href={ctaHref}
        variant={featured ? 'light-brand' : 'light-secondary'}
        fullWidth
        className="mt-auto"
      >
        {ctaLabel}
      </Button>
    </ClayCard>
  );
}
