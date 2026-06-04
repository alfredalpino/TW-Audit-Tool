'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { sectionVariants } from '@/lib/animations';
import { ClayCard } from '@/components/ui/ClayCard';
import { useLocale, useTranslations } from '@/components/i18n/LocaleProvider';
import { formatMarketCurrency, getMarketEconomics } from '@/lib/i18n/market-economics';

export function ParadoxBlock() {
  const { locale } = useLocale();
  const { t: tHome } = useTranslations('home');
  const economics = getMarketEconomics(locale);
  const sectionRef = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLParagraphElement>(null);
  const [hasRun, setHasRun] = useState(false);

  const { target } = economics;
  const isCompactCurrency = economics.currency === 'INR' || economics.currency === 'TRY' || economics.currency === 'RUB';

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting || hasRun) return;
        setHasRun(true);
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasRun]);

  useEffect(() => {
    if (!hasRun || !counterRef.current) return;
    const node = counterRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const proxy = { v: 0 };
    if (reduce) {
      node.textContent = formatMarketCurrency(target, economics);
      return;
    }
    let cancelled = false;
    void import('gsap').then(({ default: gsap }) => {
      if (cancelled) return;
      gsap.to(proxy, {
        v: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => {
          node.textContent = formatMarketCurrency(proxy.v, economics);
        },
      });
    });
    return () => {
      cancelled = true;
    };
  }, [hasRun, economics, target]);

  return (
    <section
      ref={sectionRef}
      className="border-t border-[var(--border)] bg-[var(--bg-surface)] py-[var(--section-py)] md:py-[var(--section-py-lg)]"
      aria-labelledby="paradox-heading"
    >
      <motion.div
        className="tw-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-12% 0px' }}
        variants={sectionVariants}
      >
        <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          <div>
            <h2
              id="paradox-heading"
              className="tw-heading-section tw-prose-flow font-display font-bold tracking-tight text-[var(--fg-primary)]"
            >
              <span className="font-display text-[length:2.5rem] leading-none text-[var(--brand)] md:text-[length:3rem]">&ldquo;</span>
              {tHome('paradox.quoteOpen', 'My business is doing fine')}
              <br />
              <span className="text-[var(--brand)]">{tHome('paradox.quoteHighlight', 'without')}</span>{' '}
              {tHome('paradox.quoteClose', 'a proper website.')}
              <span className="text-[var(--brand)]">&rdquo;</span>
            </h2>
          </div>
          <div className="tw-prose-flow font-sans text-base font-normal leading-[1.6] text-[var(--fg-secondary)]">
            <p className="mb-6 text-[var(--fg-primary)]">
              {tHome('paradox.bodyIntro', 'Every thriving offline business has a ceiling.')}
            </p>
            <p className="mb-6">
              {tHome(
                'paradox.bodyP1',
                'Word of mouth scales until it does not. Referrals dry up. A competitor opens with a $40/month website and begins capturing every search you never knew existed.',
              )}
            </p>
            <p className="mb-6">
              {tHome(
                'paradox.bodyP2',
                'The Michelin-starred restaurant that has no reservations page loses bookings to the decent bistro with OpenTable integration. The contractor who does not rank locally loses to a newer firm with a $3,000 website and 12 Google reviews.',
              )}
            </p>
            <p className="mb-6">{tHome('paradox.bodyP3', 'Visibility compounds. Invisibility does too.')}</p>
            <p>
              {tHome(
                'paradox.bodyP4',
                'The question is never "Do I need a website?" The question is: "How much have I already lost by waiting?"',
              )}
            </p>
          </div>
        </div>

        <ClayCard className="mx-auto mt-16 w-full max-w-2xl bg-[var(--bg-void)] px-3 py-8 text-center sm:px-8 md:mt-24">
          <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <p
              ref={counterRef}
              className={`mx-auto w-max whitespace-nowrap font-display font-extrabold leading-none tabular-nums tracking-tight text-[var(--brand)] ${
                isCompactCurrency
                  ? 'text-[length:clamp(0.9375rem,9vw,3.5rem)] sm:text-[length:clamp(1.35rem,4.6vw,3.5rem)]'
                  : 'text-[length:clamp(1.25rem,5.5vw,3.5rem)]'
              }`}
            >
              {formatMarketCurrency(0, economics)}
            </p>
          </div>
          <p className="mt-4 font-sans text-sm font-light leading-relaxed text-[var(--fg-secondary)]">{economics.caption}</p>
          <p className="mt-4 flex justify-center">
            <a
              href={economics.study.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-[0.12em] text-[var(--brand)] underline decoration-[var(--brand)]/40 underline-offset-4 transition-colors hover:text-[var(--brand-hover)] hover:decoration-[var(--brand)] sm:text-base"
              title={economics.study.title}
            >
              {economics.readStudy}
              <ArrowUpRight className="h-4 w-4 shrink-0 sm:h-[1.125rem] sm:w-[1.125rem]" aria-hidden />
            </a>
          </p>
        </ClayCard>
      </motion.div>
    </section>
  );
}
