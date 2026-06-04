import Link from 'next/link';
import type { ProgrammaticPageContent } from '@/lib/seo/global-market-content';
import type { GlobalMarket } from '@/lib/seo/global-markets';
import type { InternalLink } from '@/lib/i18n/internal-links';
import { ProgrammaticInternalLinks } from '@/components/seo/ProgrammaticInternalLinks';
import Button from '@/components/ui/Button';
import { GOOGLE_CALENDAR_APPOINTMENT_URL } from '@/lib/constants';

type Props = {
  content: ProgrammaticPageContent;
  market?: GlobalMarket;
  homeHref: string;
  servicesHref: string;
  relatedMarkets: InternalLink[];
  relatedServices: InternalLink[];
  breadcrumbs?: Array<{ label: string; href?: string }>;
};

export function GlobalProgrammaticPage({
  content,
  market,
  homeHref,
  servicesHref,
  relatedMarkets,
  relatedServices,
  breadcrumbs = [],
}: Props) {
  return (
    <main id="main-content" className="flex min-h-screen w-full flex-col pt-20">
      <div className="container mx-auto w-full max-w-6xl px-6 pb-24 pt-12 md:px-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-torpedo-gray">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={homeHref} className="hover:text-torpedo-dark">
                Home
              </Link>
            </li>
            {breadcrumbs.map((crumb) => (
              <li key={crumb.label} className="flex items-center gap-2">
                <span aria-hidden>/</span>
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-torpedo-dark">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-torpedo-dark">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-torpedo-orange">{content.eyebrow}</p>
        <h1 className="mb-5 text-3xl font-bold tracking-tight text-torpedo-dark md:text-5xl">{content.h1}</h1>
        <p className="mb-10 max-w-4xl text-base leading-relaxed text-torpedo-gray md:text-lg">{content.intro}</p>

        {market ? (
          <div className="mb-10 grid gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6 md:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-torpedo-gray">Region</p>
              <p className="mt-1 text-sm font-medium text-torpedo-dark">{market.region}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-torpedo-gray">Currency</p>
              <p className="mt-1 text-sm font-medium text-torpedo-dark">{market.currency}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-torpedo-gray">Timezone</p>
              <p className="mt-1 text-sm font-medium text-torpedo-dark">{market.timezone}</p>
            </div>
          </div>
        ) : null}

        {content.sections.map((section) => (
          <section key={section.heading} className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-torpedo-dark md:text-2xl">{section.heading}</h2>
            <div className="max-w-4xl space-y-4 text-base leading-relaxed text-torpedo-gray">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}

        {market ? (
          <>
            <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-xl font-semibold text-torpedo-dark">Why teams choose Torpedo here</h2>
              <ul className="space-y-2 text-sm text-torpedo-gray">
                {market.valueProps.map((prop) => (
                  <li key={prop}>- {prop}</li>
                ))}
              </ul>
            </section>
            <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-xl font-semibold text-torpedo-dark">Compliance & trust</h2>
              <ul className="space-y-2 text-sm text-torpedo-gray">
                {market.complianceNotes.map((note) => (
                  <li key={note}>- {note}</li>
                ))}
              </ul>
            </section>
          </>
        ) : null}

        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-torpedo-dark">FAQ</h2>
          <dl className="space-y-6">
            {content.faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-semibold text-torpedo-dark">{faq.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-torpedo-gray">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mb-10 flex flex-wrap gap-4">
          <Button href={GOOGLE_CALENDAR_APPOINTMENT_URL} variant="brand">
            Book a discovery call
          </Button>
          <Button href={servicesHref} variant="light-secondary">
            View all capabilities
          </Button>
        </div>

        <ProgrammaticInternalLinks
          markets={relatedMarkets}
          services={relatedServices}
        />
      </div>
    </main>
  );
}
