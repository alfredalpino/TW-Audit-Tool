'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { sectionVariants } from '@/lib/animations';
import { ClayCard } from '@/components/ui/ClayCard';
import { useLocale, useTranslations } from '@/components/i18n/LocaleProvider';
import { useTextScramble } from '@/hooks/useTextScramble';
import { getTestimonialsForLocale } from '@/lib/i18n/testimonials';

function scrollTrackToIndex(root: HTMLDivElement, index: number, behavior: ScrollBehavior) {
  const el = root.querySelector<HTMLElement>(`[data-review-index="${index}"]`);
  if (!el) return;

  const rootRect = root.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const centerPad = (rootRect.width - elRect.width) / 2;
  const nextLeft = root.scrollLeft + (elRect.left - rootRect.left) - centerPad;
  const maxScroll = Math.max(0, root.scrollWidth - root.clientWidth);
  root.scrollTo({
    left: Math.max(0, Math.min(nextLeft, maxScroll)),
    behavior,
  });
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={dir === 'left' ? '' : 'rotate-180'}
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function SocialProof() {
  const { locale } = useLocale();
  const { t: tHome } = useTranslations('home');
  const items = getTestimonialsForLocale(locale);
  const eyebrow = tHome('socialProof.eyebrow', '[ CLIENT OUTCOMES ]');
  const outcomesScramble = useTextScramble(eyebrow, 900, true, 3000);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const ioFlushRef = useRef<number | null>(null);

  const scrollToIndex = useCallback((i: number, behavior: ScrollBehavior = 'smooth') => {
    const root = scrollRef.current;
    if (!root) return;
    scrollTrackToIndex(root, i, behavior);
    setActive(i);
  }, []);

  useEffect(() => {
    setActive(0);
    const root = scrollRef.current;
    if (!root) return;
    requestAnimationFrame(() => scrollTrackToIndex(root, 0, 'instant'));
  }, [locale]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    let io: IntersectionObserver | null = null;

    const flush = (idx: number) => {
      if (ioFlushRef.current != null) cancelAnimationFrame(ioFlushRef.current);
      ioFlushRef.current = requestAnimationFrame(() => {
        ioFlushRef.current = null;
        setActive(idx);
      });
    };

    const connect = () => {
      io?.disconnect();
      io = null;
      const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-review-index]'));
      if (!slides.length) return;

      io = new IntersectionObserver(
        (entries) => {
          const best = entries
            .filter((e) => e.isIntersecting && e.intersectionRatio >= 0.35)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          const idx = best?.target?.getAttribute('data-review-index');
          if (idx != null) flush(Number(idx));
        },
        { root, rootMargin: '-5% 0px -5% 0px', threshold: [0.35, 0.55] },
      );
      slides.forEach((s) => io?.observe(s));
    };

    connect();
    window.addEventListener('resize', connect);
    return () => {
      window.removeEventListener('resize', connect);
      io?.disconnect();
      if (ioFlushRef.current != null) cancelAnimationFrame(ioFlushRef.current);
    };
  }, [locale]);

  const goPrev = useCallback(() => {
    scrollToIndex(Math.max(0, active - 1));
  }, [active, scrollToIndex]);

  const goNext = useCallback(() => {
    scrollToIndex(Math.min(items.length - 1, active + 1));
  }, [active, items.length, scrollToIndex]);

  return (
    <section
      id="client-outcomes"
      className="border-t border-[var(--border)] bg-[var(--bg-void)] py-[var(--section-py)] md:py-[var(--section-py-lg)]"
      aria-labelledby="social-proof-heading"
    >
      <motion.div
        className="tw-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10% 0px' }}
        variants={sectionVariants}
      >
        <p className="tw-prose-flow mb-4 max-w-full font-display text-[clamp(0.756rem,2vw,0.98rem)] font-bold uppercase leading-snug tracking-[0.2em] text-[var(--brand)] sm:text-[clamp(0.81rem,1.6vw,1.02rem)]">
          {outcomesScramble}
        </p>
        <h2
          id="social-proof-heading"
          className="tw-heading-section tw-prose-flow max-w-3xl font-display font-bold text-[var(--fg-primary)]"
        >
          {tHome('socialProof.heading', 'Executed for founders, operators, and serious brands.')}
        </h2>

        <div
          className="relative mt-10 md:mt-12"
          aria-roledescription="carousel"
          aria-label={tHome('socialProof.carouselLabel', 'Client outcome stories')}
        >
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory flex-nowrap gap-4 overflow-x-auto overscroll-x-contain pb-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 md:gap-6 md:pb-3 [&::-webkit-scrollbar]:hidden"
          >
            {items.map((t, i) => (
              <ClayCard
                as="article"
                key={`${t.company}-${t.author}-${i}`}
                data-review-index={i}
                className="w-[min(100%,calc(100vw-2.5rem))] max-w-md shrink-0 snap-center p-5 sm:w-[min(100%,22rem)] sm:p-6 md:min-w-[24rem] md:max-w-lg md:p-8 lg:min-w-[26rem]"
              >
                <span className="font-display text-[length:clamp(2.75rem,10vw,4rem)] leading-none text-[var(--brand)] md:text-[length:4rem]" aria-hidden>
                  &ldquo;
                </span>
                <p className="mt-2 font-sans text-sm font-normal leading-[1.75] text-[var(--fg-secondary)] md:text-base md:leading-[1.8]">
                  {t.quote}
                </p>
                <div className="mt-5 border-t border-[var(--border)] pt-5 md:mt-6 md:pt-6">
                  <p className="font-sans text-sm font-medium leading-snug text-[var(--fg-primary)]">
                    {t.author}
                    <span className="text-[var(--fg-tertiary)]"> · </span>
                    {t.role}
                    <span className="text-[var(--fg-tertiary)]"> · </span>
                    {t.company}
                  </p>
                  <p className="mt-3 max-w-full break-words rounded-full bg-[var(--brand)]/15 px-3 py-1.5 font-mono text-[10px] leading-snug text-[var(--brand)] sm:text-[11px]">
                    {t.metric}
                  </p>
                </div>
              </ClayCard>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-center gap-1 sm:gap-2">
            <button
              type="button"
              className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full text-[var(--fg-tertiary)] opacity-50 transition-opacity hover:opacity-100 disabled:pointer-events-none disabled:opacity-20"
              aria-label={tHome('socialProof.prevReview', 'Previous review')}
              disabled={active <= 0}
              onClick={goPrev}
            >
              <Chevron dir="left" />
            </button>

            <div
              className="mx-1 flex max-w-[min(100%,20rem)] flex-wrap items-center justify-center gap-x-1 gap-y-1.5 sm:mx-2 sm:max-w-none"
              role="tablist"
              aria-label={tHome('socialProof.chooseReview', 'Choose a review')}
            >
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`${tHome('socialProof.showReview', 'Show review')} ${i + 1} of ${items.length}`}
                  className="flex min-h-[44px] min-w-[28px] items-center justify-center px-1 py-2 touch-manipulation"
                  onClick={() => scrollToIndex(i)}
                >
                  <span
                    className={`block h-[3px] rounded-full transition-[width,background-color,opacity] duration-300 ease-out ${
                      i === active
                        ? 'w-7 bg-[var(--brand)] opacity-100'
                        : 'w-3.5 bg-[var(--fg-tertiary)]/30 opacity-70 hover:bg-[var(--fg-tertiary)]/50'
                    }`}
                    aria-hidden
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full text-[var(--fg-tertiary)] opacity-50 transition-opacity hover:opacity-100 disabled:pointer-events-none disabled:opacity-20"
              aria-label={tHome('socialProof.nextReview', 'Next review')}
              disabled={active >= items.length - 1}
              onClick={goNext}
            >
              <Chevron dir="right" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
