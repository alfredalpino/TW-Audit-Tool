'use client';

/**
 * Emotional anchor: encodes the engineering thesis in one memorable statement.
 */

import { motion } from 'framer-motion';
import { BOOKING_SHORT_URL } from '@/lib/constants';
import { useContactInfo } from '@/components/ContactInfoContext';
import { buildPathForLocale } from '@/lib/i18n/build-path';
import type { LocaleCode } from '@/lib/i18n/config';
import { useTranslations } from '@/components/i18n/LocaleProvider';
import { sectionVariants } from '@/lib/animations';
import Button from '@/components/ui/Button';

export function ManifestoBanner() {
  const { locale } = useContactInfo();
  const { t: tHome } = useTranslations('home');
  const { t: tCta } = useTranslations('cta');

  return (
    <section
      className="relative overflow-hidden border-t border-[var(--border)] bg-[var(--bg-void)] py-[var(--section-py)] md:py-[var(--section-py-lg)]"
      aria-labelledby="manifesto-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--brand-glow),transparent_55%)]"
        aria-hidden
      />
      <motion.div
        className="relative z-[1] tw-section text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10% 0px' }}
        variants={sectionVariants}
      >
        <h2
          id="manifesto-heading"
          className="tw-prose-flow mx-auto max-w-4xl font-display text-[clamp(1.8rem,4.2vw,3rem)] font-bold leading-[1.15] tracking-tight text-[var(--fg-primary)]"
        >
          {tHome('manifesto.headingLine1', 'The web is not broken.')}
          <br />
          {tHome('manifesto.headingLine2', 'Most businesses just never engineered theirs.')}
        </h2>
        <div className="mt-10 flex w-full max-w-lg flex-col items-stretch justify-center gap-4 self-center sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
          <Button
            href={BOOKING_SHORT_URL}
            variant="brand"
            withArrow
            className="w-full sm:w-auto"
            data-cta="manifesto_book"
            data-cta-location="manifesto"
          >
            {tCta('heroPrimary', 'Book a Strategy Call')}
          </Button>
          <Button
            href={buildPathForLocale(locale as LocaleCode, '/systems')}
            variant="secondary"
            withArrow
            className="w-full sm:w-auto"
          >
            {tHome('manifesto.ctaSecondary', 'See systems thinking')}
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
