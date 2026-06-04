'use client';

/**
 * Reframes deliverables as three infrastructure layers, not page counts.
 */

import { motion } from 'framer-motion';
import { sectionVariants, cardVariants } from '@/lib/animations';
import { useTextScramble } from '@/hooks/useTextScramble';
import { ClayCard } from '@/components/ui/ClayCard';
import { useTranslations } from '@/components/i18n/LocaleProvider';

const CARD_KEYS = ['webFoundation', 'automation', 'execution'] as const;
const CARD_NUMS = ['01', '02', '03'] as const;

export function WhatWeBuild() {
  const { t: tWhatWeDo } = useTranslations('whatWeDo');
  const eyebrow = tWhatWeDo('eyebrow', '[ INFRASTRUCTURE, NOT DECORATION ]');
  const infraScramble = useTextScramble(eyebrow, 900, true, 3000);

  const cards = CARD_KEYS.map((key, index) => ({
    num: CARD_NUMS[index]!,
    title: tWhatWeDo(`cards.${key}.title`, key),
    subtitle: tWhatWeDo(`cards.${key}.subtitle`, ''),
    body: tWhatWeDo(`cards.${key}.body`, ''),
    bullets: [1, 2, 3, 4].map((n) => tWhatWeDo(`cards.${key}.bullet${n}`, '')),
  }));

  return (
    <section
      id="what-we-do"
      className="border-t border-[var(--border)] bg-[var(--bg-base)] py-[var(--section-py)] md:py-[var(--section-py-lg)]"
      aria-labelledby="what-we-build-heading"
    >
      <motion.div
        className="tw-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10% 0px' }}
        variants={sectionVariants}
      >
        <p className="tw-prose-flow mb-4 max-w-full font-display text-[clamp(0.756rem,2vw,0.98rem)] font-bold uppercase leading-snug tracking-[0.2em] text-[var(--brand)] sm:text-[clamp(0.81rem,1.6vw,1.02rem)]">
          {infraScramble}
        </p>
        <h2
          id="what-we-build-heading"
          className="tw-heading-section tw-prose-flow max-w-4xl font-display font-bold tracking-tight text-[var(--fg-primary)]"
        >
          {tWhatWeDo('heading', 'We do not build websites. We build revenue systems.')}
        </h2>

        <div className="mt-14 flex flex-col gap-6">
          {cards.map((card) => (
            <motion.div
              key={card.num}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-8% 0px' }}
              variants={cardVariants}
            >
              <ClayCard
                as="article"
                hover
                className="group relative overflow-hidden p-5 sm:p-6 md:p-8 lg:p-10"
              >
                <span
                  className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: 'var(--gradient-card)' }}
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute -right-2 -top-6 font-display text-[length:5rem] font-extrabold leading-none text-[var(--fg-primary)] opacity-[0.05] transition-opacity duration-500 group-hover:opacity-[0.08] sm:-right-4 sm:-top-8 sm:text-[length:6rem] md:text-[length:8rem]"
                  aria-hidden
                >
                  {card.num}
                </span>
                <div className="relative z-[1] grid gap-8 lg:grid-cols-[1fr_280px] lg:items-start">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-[var(--brand)]">{card.subtitle}</p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-[var(--fg-primary)] md:text-3xl">{card.title}</h3>
                    <p className="mt-4 max-w-2xl font-sans text-base font-normal leading-[1.8] text-[var(--fg-secondary)]">
                      {card.body}
                    </p>
                  </div>
                  <ul className="space-y-2 font-mono text-xs leading-relaxed text-[var(--fg-secondary)]">
                    {card.bullets.map((b) => (
                      <li key={b} className="border-l-2 border-[var(--brand)] pl-3">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </ClayCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
