'use client';

import { useContactInfo } from '@/components/ContactInfoContext';
import { useTranslations } from '@/components/i18n/LocaleProvider';
import { buildPathForLocale } from '@/lib/i18n/build-path';
import type { LocaleCode } from '@/lib/i18n/config';
import { BOOKING_SHORT_URL } from '@/lib/constants';
import Button from '@/components/ui/Button';

export function HomeHeroCopy({ basePath: _basePath = '' }: { basePath?: string }) {
  const { locale } = useContactInfo();
  const { t: tHome } = useTranslations('home');
  const { t: tCta } = useTranslations('cta');

  return (
    <>
      <h1
        id="home-hero-heading"
        className="tw-hero-h1 max-w-full font-display font-extrabold tracking-[-0.02em] text-[var(--fg-primary)]"
      >
        {tHome('heroTitlePrefix', 'Your business is')}{' '}
        <span className="whitespace-nowrap text-[var(--brand)] max-[380px]:whitespace-normal">
          {tHome('heroTitleHighlight', 'invisible')}
        </span>
        <br />
        {tHome('heroTitleMiddle', 'without a website that')}
        <br />
        {tHome('heroTitleEnd', 'performs.')}
      </h1>
      <p className="tw-hero-sub tw-prose-flow mx-auto mt-8 max-w-[540px] font-sans font-light text-[var(--fg-secondary)]">
        {tHome(
          'heroSubtitle',
          'Most businesses lose 60–80% of their qualified leads to competitors with better digital infrastructure. Not better products. Better websites.',
        )}
      </p>
      <div className="mt-10 flex w-full max-w-md flex-col items-stretch gap-4 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
        <Button
          href={BOOKING_SHORT_URL}
          variant="brand"
          size="md"
          withArrow
          className="w-full sm:w-auto"
          data-cta="hero_book_strategy"
          data-cta-location="hero_primary"
        >
          {tCta('heroPrimary', 'Book a Strategy Call')}
        </Button>
        <Button
          href={buildPathForLocale(locale as LocaleCode, '/process')}
          variant="secondary"
          size="md"
          withArrow
          className="w-full sm:w-auto"
        >
          {tCta('heroSecondary', 'See how we build')}
        </Button>
      </div>
    </>
  );
}
