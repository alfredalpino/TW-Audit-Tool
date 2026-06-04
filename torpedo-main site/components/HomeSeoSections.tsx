'use client';

import Link from 'next/link';
import { useState } from 'react';
import Section from '@/components/ui/Section';
import { useContactInfo } from '@/components/ContactInfoContext';
import { buildPathForLocale } from '@/lib/i18n/build-path';
import type { LocaleCode } from '@/lib/i18n/config';
import { homePageFaqs } from '@/lib/seo/faqs';

const FAQ_PREVIEW_COUNT = 3;

export function HomeSeoSections() {
  const { locale } = useContactInfo();
  const localeCode = locale as LocaleCode;
  const path = (segment: string) => buildPathForLocale(localeCode, segment);
  /** When false, only the first `FAQ_PREVIEW_COUNT` items are listed (all closed). "See more" reveals the full list. */
  const [showAllFaqs, setShowAllFaqs] = useState(false);

  const visibleFaqs = showAllFaqs ? homePageFaqs : homePageFaqs.slice(0, FAQ_PREVIEW_COUNT);

  const hasMoreFaqs = homePageFaqs.length > FAQ_PREVIEW_COUNT;

  return (
    <Section className="bg-[var(--bg-surface)] tw-texture-surface border-t border-[var(--border)]">
      <div className="mx-auto min-w-0 max-w-5xl space-y-12">
        <section aria-labelledby="home-seo-outcomes" className="min-w-0 space-y-5">
          <h2 id="home-seo-outcomes" className="text-2xl font-bold text-torpedo-dark sm:text-3xl md:text-5xl">
            Web Development and Growth Infrastructure for Measurable Outcomes
          </h2>
          <p className="text-base md:text-lg text-torpedo-gray leading-relaxed">
            Torpedo Web Agency helps founders build a dependable growth engine through web development, conversion
            architecture, and automation systems. Instead of treating websites, ads, content, and operations as separate
            projects, we connect them into one operating system that supports demand generation and sales execution.
          </p>
          <p className="text-base md:text-lg text-torpedo-gray leading-relaxed">
            The goal is practical: fewer missed leads, better response speed, higher conversion quality, and cleaner
            reporting for decision-making. When your core infrastructure is stable, you can scale traffic and campaigns
            without adding chaos to delivery or customer support.
          </p>
        </section>

        <section aria-labelledby="home-seo-systems" className="space-y-5">
          <h2 id="home-seo-systems" className="text-xl font-bold text-torpedo-dark sm:text-2xl md:text-4xl">
            Growth Systems That Combine Web, SEO, and Operations
          </h2>
          <p className="text-base md:text-lg text-torpedo-gray leading-relaxed">
            We start by clarifying where your current funnel leaks revenue. For some businesses, it is unclear positioning
            and weak landing pages. For others, it is poor follow-up, disconnected tools, or noisy reporting that hides
            what is working. Our scope covers both front-end performance and back-end execution systems.
          </p>
          <p className="text-base md:text-lg text-torpedo-gray leading-relaxed">
            That means every engagement can include technical SEO foundations, offer and messaging alignment, internal
            workflow automation, and analytics instrumentation. Your website stops being a brochure and becomes a system
            that supports growth decisions every week.
          </p>
          <p className="text-base md:text-lg text-torpedo-gray leading-relaxed">
            Explore our{' '}
            <Link href={path('/what-we-do')} className="font-semibold text-torpedo-orange hover:text-torpedo-orangeDark">
              web development and growth services
            </Link>{' '}
            and the{' '}
            <Link href={path('/systems')} className="font-semibold text-torpedo-orange hover:text-torpedo-orangeDark">
              systems we build for founders
            </Link>{' '}
            to see how these parts work together.
          </p>
        </section>

        <section aria-labelledby="home-seo-process" className="space-y-5">
          <h2 id="home-seo-process" className="text-xl font-bold text-torpedo-dark sm:text-2xl md:text-4xl">
            How We Execute: Strategy, Build, and Weekly Optimization
          </h2>
          <p className="text-base md:text-lg text-torpedo-gray leading-relaxed">
            We run a structured process designed for founder clarity. First, we map goals, constraints, and conversion
            points. Next, we prioritize implementation so the highest-impact fixes are shipped early. Finally, we move to
            a weekly optimization rhythm where performance, lead quality, and operational efficiency are reviewed and
            improved continuously.
          </p>
          <p className="text-base md:text-lg text-torpedo-gray leading-relaxed">
            See the full{' '}
            <Link href={path('/process')} className="font-semibold text-torpedo-orange hover:text-torpedo-orangeDark">
              delivery process
            </Link>{' '}
            and read actionable insights on our{' '}
            <Link href={path('/blog')} className="font-semibold text-torpedo-orange hover:text-torpedo-orangeDark">
              growth and SEO blog
            </Link>{' '}
            if you want implementation detail before booking a call.
          </p>
        </section>

        <section aria-labelledby="home-seo-faq" className="space-y-5">
          <h2 id="home-seo-faq" className="text-xl font-bold text-torpedo-dark sm:text-2xl md:text-4xl">
            Frequently Asked Questions
          </h2>

          {/* When "See more" is active, cap height so the page does not stretch — list scrolls inside */}
          <div
            className={[
              'tw-clay-panel min-h-0 p-3 md:p-4',
              showAllFaqs
                ? 'max-h-[min(26rem,70vh)] md:max-h-[min(32rem,65vh)] overflow-y-auto overscroll-y-contain [scrollbar-gutter:stable]'
                : 'overflow-visible',
            ].join(' ')}
            role="region"
            aria-label="FAQ list"
          >
            <div className="relative z-[1] space-y-2 md:space-y-3 pr-1">
              {visibleFaqs.map((faq, index) => {
                const answerId = `home-faq-answer-${index}-${faq.question.slice(0, 12)}`;
                return (
                  <details
                    key={faq.question}
                    className="group tw-clay-card open:border-[var(--brand)]/30 open:shadow-clay-surface"
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-3 rounded-xl px-4 py-3.5 text-left outline-none ring-[var(--brand)]/40 transition hover:bg-[var(--bg-muted)]/40 focus-visible:ring-2 md:px-5 md:py-4 [&::-webkit-details-marker]:hidden">
                      <span className="text-base font-semibold text-torpedo-dark md:text-lg">{faq.question}</span>
                      <span
                        className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-lg font-bold leading-none text-torpedo-dark group-open:border-[var(--brand)] group-open:text-[var(--brand)]"
                        aria-hidden
                      >
                        <span className="group-open:hidden">+</span>
                        <span className="hidden group-open:inline">−</span>
                      </span>
                    </summary>
                    <div
                      id={answerId}
                      className="border-t border-[var(--border)] px-4 pb-4 pt-2 md:px-5 md:pb-5"
                    >
                      <p className="text-base leading-relaxed text-torpedo-gray md:text-lg">{faq.answer}</p>
                    </div>
                  </details>
                );
              })}
            </div>
          </div>

          {hasMoreFaqs && (
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={() => setShowAllFaqs((prev) => !prev)}
                className="rounded-sm text-base font-semibold text-torpedo-orange transition hover:text-torpedo-orangeDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-torpedo-orange/40 focus-visible:ring-offset-2"
                aria-expanded={showAllFaqs}
              >
                {showAllFaqs ? 'See less' : 'See more'}
              </button>
            </div>
          )}

          <div className="tw-clay-panel rounded-lg px-4 py-4 md:px-5">
            <p className="relative z-[1] text-sm md:text-base text-torpedo-gray leading-relaxed">
              Need a specific answer about your business model or market? Book a strategy call and we will map your exact
              growth constraints with a practical execution plan.
            </p>
            <p className="relative z-[1] mt-2">
              <Link
                href="https://book.torpedoweb.org"
                className="font-semibold text-torpedo-orange transition hover:text-torpedo-orangeDark"
              >
                Talk to Torpedo Web Agency
              </Link>
            </p>
          </div>
        </section>
      </div>
    </Section>
  );
}

