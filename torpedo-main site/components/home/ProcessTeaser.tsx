'use client';

/**
 * Condensed process strip to route high-intent visitors to the full build system page.
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { sectionVariants, cardVariants } from '@/lib/animations';
import { ClayCard } from '@/components/ui/ClayCard';
import { useContactInfo } from '@/components/ContactInfoContext';
import { buildPathForLocale } from '@/lib/i18n/build-path';
import type { LocaleCode } from '@/lib/i18n/config';
import { useTranslations } from '@/components/i18n/LocaleProvider';

const phaseKeys = ['phase1', 'phase2', 'phase3', 'phase4', 'phase5'] as const;
const phaseNumbers = ['01', '02', '03', '04', '05'] as const;

export function ProcessTeaser() {
  const { locale } = useContactInfo();
  const { t: tHome } = useTranslations('home');

  return (
    <section
      className="border-t border-[var(--border)] bg-[var(--bg-base)] py-[var(--section-py)] md:py-[var(--section-py-lg)]"
      aria-labelledby="process-teaser-heading"
    >
      <motion.div
        className="tw-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10% 0px' }}
        variants={sectionVariants}
      >
        <h2 id="process-teaser-heading" className="sr-only">
          {tHome('processTeaser.srHeading', 'Build process overview')}
        </h2>
        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-2 [-mx-4] px-4 [scrollbar-width:none] sm:[-mx-0] sm:px-0 md:grid md:grid-cols-5 md:gap-6 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
          {phaseKeys.map((key, i) => (
            <motion.div key={key} variants={cardVariants}>
              <ClayCard
                as="article"
                className="min-w-[min(100%,260px)] shrink-0 snap-start p-5 md:min-w-0"
              >
              <p className="font-mono text-xs text-[var(--brand)]">{phaseNumbers[i]}</p>
              <h3 className="mt-2 font-display text-lg font-semibold text-[var(--fg-primary)]">
                {tHome(`processTeaser.${key}.name`, 'Audit & Deconstruction')}
              </h3>
              <p className="mt-2 inline-block rounded-full border border-[var(--border)] px-2 py-0.5 font-mono text-[10px] text-[var(--brand)]">
                {tHome(`processTeaser.${key}.duration`, 'Week 1')}
              </p>
              <p className="mt-3 font-sans text-sm font-light leading-relaxed text-[var(--fg-secondary)]">
                {tHome(
                  `processTeaser.${key}.line`,
                  'Technical audit, SEO structure, conversion gaps, competitor matrix. Benchmarks before pixels.',
                )}
              </p>
              </ClayCard>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center md:text-start">
          <Link
            href={buildPathForLocale(locale as LocaleCode, '/process')}
            className="inline-flex items-center gap-2 font-sans text-sm font-medium text-[var(--brand)] transition-colors hover:text-[var(--brand-hover)]"
          >
            {tHome('processTeaser.seeFullLink', 'See the full build system')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
