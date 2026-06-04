'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { FaqItem } from '@/lib/seo/faqs';
import { sectionVariants } from '@/lib/animations';
import { useTranslations } from '@/components/i18n/LocaleProvider';

export function HomeFAQ({ items }: { items: FaqItem[] }) {
  const { t: tHome } = useTranslations('home');
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="border-t border-[var(--border)] bg-[var(--bg-surface)] py-[var(--section-py)] md:py-[var(--section-py-lg)]"
      aria-labelledby="faq-heading"
    >
      <motion.div
        className="tw-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10% 0px' }}
        variants={sectionVariants}
      >
        <div className="mx-auto w-full max-w-3xl">
          <h2 id="faq-heading" className="tw-heading-section tw-prose-flow font-display font-bold text-[var(--fg-primary)]">
            {tHome('faq.heading', 'Frequently asked questions')}
          </h2>
          <ul className="mt-10 divide-y divide-[var(--border)] border-t border-b border-[var(--border)]">
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.question}>
                  <button
                    type="button"
                    className="flex min-h-[44px] w-full items-start justify-between gap-4 py-4 text-left sm:py-5"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                  >
                    <span className="font-sans text-base font-medium text-[var(--fg-primary)]">{item.question}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                      className="mt-0.5 shrink-0 text-[var(--brand)]"
                      aria-hidden
                    >
                      <Plus className="h-5 w-5" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-trigger-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 font-sans text-base font-normal leading-[1.6] text-[var(--fg-secondary)]">
                          {item.answer}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
