'use client';

import type { ReactNode } from 'react';
import { services } from '@/lib/seo/services';
import { ServiceGridCard } from '@/components/services/ServiceGridCard';
import { ServicesEyebrowScramble } from '@/components/services/ServicesEyebrowScramble';
import { useContactInfo } from '@/components/ContactInfoContext';
import { useTranslations } from '@/components/i18n/LocaleProvider';
import { ClayCard } from '@/components/ui/ClayCard';

export type ServicesIndexFaq = { question: string; answer: string };

type Props = {
  faqs: ServicesIndexFaq[];
  /** India hub: city + local SEO blocks */
  children?: ReactNode;
};

function cardCopyFromTranslations(
  tServices: (key: string, fallback?: string) => string,
  slug: string,
  service: (typeof services)[number],
) {
  const features = service.features.map((_, i) =>
    tServices(`cards.${slug}.feature${i + 1}`, service.features[i] ?? ''),
  );

  return {
    name: tServices(`cards.${slug}.name`, service.name),
    headline: tServices(`cards.${slug}.headline`, service.headline),
    intro: tServices(`cards.${slug}.intro`, service.intro),
    badge: service.badge ? tServices(`cards.${slug}.badge`, service.badge) : undefined,
    features,
    cta: tServices(`cards.${slug}.cta`, 'Explore service'),
  };
}

export function ServicesIndexView({ faqs, children }: Props) {
  const { basePath } = useContactInfo();
  const { t: tServices } = useTranslations('services');

  return (
    <>
      <section className="border-b border-[var(--border)] bg-[var(--bg-void)] py-14 md:py-20">
        <div className="tw-section min-w-0 max-w-full">
          <ServicesEyebrowScramble text={tServices('index.eyebrow', '[ Torpedo Web service stack ]')} />
          <h1 className="tw-heading-section tw-prose-flow mt-4 max-w-full min-w-0 break-words font-display font-extrabold tracking-tight text-balance text-[var(--fg-primary)] [overflow-wrap:anywhere]">
            {tServices('index.title', 'Digital engineering and growth execution')}
          </h1>
          <p className="tw-prose-flow mt-6 max-w-3xl text-base leading-[1.6] text-[var(--fg-secondary)] md:text-lg">
            {tServices(
              'index.description',
              'Four integrated service lines — web, marketing, custom software, and AI automation — engineered as one growth stack for measurable, scalable demand.',
            )}
          </p>
        </div>
      </section>

      <section className="border-b border-[var(--border)] py-14 md:py-20" aria-labelledby="services-grid-heading">
        <div className="tw-section">
          <h2
            id="services-grid-heading"
            className="tw-heading-section font-display text-xl font-bold text-[var(--fg-primary)] md:text-2xl"
          >
            {tServices('index.servicesHeading', 'Core services')}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--fg-secondary)] md:text-base">
            {tServices(
              'index.servicesSubheading',
              'Each line is a full delivery stack — strategy, build, and iteration — not a menu of disconnected tasks.',
            )}
          </p>

          <div className="mt-10 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-8">
            {services.map((service, index) => (
              <ServiceGridCard
                key={service.slug}
                service={service}
                index={index}
                href={`${basePath}/services/${service.slug}`}
                ctaLabel={tServices('index.cardCta', 'Explore service')}
                copy={cardCopyFromTranslations(tServices, service.slug, service)}
              />
            ))}
          </div>
        </div>
      </section>

      {children}

      <section className="py-14 md:py-20">
        <div className="tw-section">
          <ClayCard className="p-6 md:p-10">
            <h2 className="tw-heading-section font-display text-xl font-bold text-[var(--fg-primary)] md:text-2xl">
              {tServices('index.faqHeading', 'Frequently asked questions')}
            </h2>
            <div className="mt-8 space-y-8">
              {faqs.map((faq) => (
                <div key={faq.question} className="border-b border-[var(--border)] pb-8 last:border-b-0 last:pb-0">
                  <h3 className="font-sans text-base font-semibold text-[var(--fg-primary)]">{faq.question}</h3>
                  <p className="tw-prose-flow mt-2 text-sm leading-[1.6] text-[var(--fg-secondary)] md:text-base">{faq.answer}</p>
                </div>
              ))}
            </div>
          </ClayCard>
        </div>
      </section>
    </>
  );
}
