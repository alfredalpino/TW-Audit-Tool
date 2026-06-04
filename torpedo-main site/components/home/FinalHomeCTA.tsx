'use client';

/**
 * Final conversion zone: one primary action with trust de-riskers inline.
 */

import { motion } from 'framer-motion';
import { BOOKING_SHORT_URL } from '@/lib/constants';
import { sectionVariants } from '@/lib/animations';
import { useTextScramble } from '@/hooks/useTextScramble';
import { useTranslations } from '@/components/i18n/LocaleProvider';
import Button from '@/components/ui/Button';

export function FinalHomeCTA() {
  const { t: tCta } = useTranslations('cta');
  const eyebrow = tCta('finalEyebrow', '[ READY TO BUILD ]');
  const readyScramble = useTextScramble(eyebrow, 900, true, 3000);

  return (
    <section
      className="border-t border-[var(--border)] bg-[var(--bg-void)] py-[var(--section-py-lg)]"
      aria-labelledby="final-cta-heading"
    >
      <motion.div
        className="tw-section text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10% 0px' }}
        variants={sectionVariants}
      >
        <p className="tw-prose-flow mx-auto mb-4 max-w-full font-display text-[clamp(0.791rem,2vw,1.05rem)] font-bold uppercase leading-snug tracking-[0.2em] text-[var(--brand)] sm:text-[clamp(0.85rem,1.65vw,1.08rem)]">
          {readyScramble}
        </p>
        <h2
          id="final-cta-heading"
          className="tw-heading-section tw-prose-flow mx-auto max-w-3xl font-display font-extrabold tracking-tight text-[var(--fg-primary)]"
        >
          {tCta('finalTitleLine1', 'Start with a')}
          <br />
          {tCta('finalTitleLine2', 'Web Development')}
          <br />
          {tCta('finalTitleLine3', 'Strategy Call.')}
        </h2>
        <p className="mx-auto mt-6 max-w-xl font-sans text-base font-light leading-relaxed text-[var(--fg-secondary)]">
          {tCta(
            'finalBody',
            'Not a pitch. A diagnostic conversation about your current gaps, goals, and what a system built for your business would look like.',
          )}
        </p>
        <div className="mt-10 flex justify-center">
          <Button
            href={BOOKING_SHORT_URL}
            variant="brand"
            size="lg"
            withArrow
            className="w-full sm:w-auto"
            data-cta="final_book_strategy"
            data-cta-location="home_final_cta"
          >
            {tCta('finalButton', 'Book a Strategy Call')}
          </Button>
        </div>
        <div className="mt-8 flex flex-col flex-wrap items-center justify-center gap-3 font-mono text-xs text-[var(--fg-tertiary)] sm:flex-row sm:gap-8">
          <span>✓ {tCta('trustNoCommitment', 'No commitment required')}</span>
          <span>✓ {tCta('trustSession', '45-minute structured session')}</span>
          <span>✓ {tCta('trustBrief', 'Get a system brief after')}</span>
        </div>
      </motion.div>
    </section>
  );
}
