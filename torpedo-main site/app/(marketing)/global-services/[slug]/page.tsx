import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GlobalProgrammaticPage } from '@/components/seo/GlobalProgrammaticPage';
import { buildPathForLocale } from '@/lib/i18n/config';
import {
  getRelatedMarkets,
  getRelatedServicesForMarket,
} from '@/lib/i18n/internal-links';
import { getRequestLocale, getOpenGraphLocale } from '@/lib/i18n/server';
import { getServiceMarketPageContent } from '@/lib/seo/global-market-content';
import {
  globalMarketsById,
  getServiceMarketPath,
  publishedServiceMarkets,
  publishedServiceMarketsBySlug,
  serviceLabel,
} from '@/lib/seo/global-markets';
import {
  buildLocalizedBreadcrumb,
  buildLocalizedFAQ,
  buildLocalizedOrganization,
  buildLocalizedServiceSchema,
} from '@/lib/seo/schema';
import { buildLanguageAlternates, toAbsoluteUrl } from '@/lib/seo/site';

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return publishedServiceMarkets.map((combo) => ({ slug: combo.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const combo = publishedServiceMarketsBySlug.get(slug);
  if (!combo) return {};

  const market = globalMarketsById.get(combo.marketId);
  if (!market) return {};

  const locale = await getRequestLocale();
  const content = getServiceMarketPageContent(combo.marketId, combo.service, locale);
  const path = buildPathForLocale(locale, getServiceMarketPath(combo.slug));

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: path,
      locale: getOpenGraphLocale(locale),
    },
    alternates: buildLanguageAlternates(getServiceMarketPath(combo.slug), market.primaryLocale),
  };
}

export default async function GlobalServiceMarketPage({ params }: Props) {
  const { slug } = await params;
  const combo = publishedServiceMarketsBySlug.get(slug);
  if (!combo) notFound();

  const market = globalMarketsById.get(combo.marketId);
  if (!market) notFound();

  const locale = await getRequestLocale();
  const content = getServiceMarketPageContent(combo.marketId, combo.service, locale);
  const pagePath = buildPathForLocale(locale, getServiceMarketPath(combo.slug));
  const pageUrl = toAbsoluteUrl(pagePath);
  const homeHref = buildPathForLocale(locale, '/');
  const servicesHref = buildPathForLocale(locale, '/services');
  const marketHref = buildPathForLocale(locale, `/markets/${market.id}`);
  const svcLabel = serviceLabel(combo.service, locale);

  const schemaGraph = [
    buildLocalizedOrganization(locale),
    buildLocalizedBreadcrumb(
      [
        { name: 'Home', url: toAbsoluteUrl(homeHref) },
        { name: market.name, url: toAbsoluteUrl(marketHref) },
        { name: svcLabel, url: pageUrl },
      ],
      locale,
    ),
    buildLocalizedServiceSchema({
      name: content.h1,
      description: content.metaDescription,
      url: pageUrl,
      areaServed: [market.name, market.region],
      locale,
    }),
    buildLocalizedFAQ(content.faqs, locale),
  ];

  const relatedServices = getRelatedServicesForMarket(combo.marketId, locale).filter(
    (link) => !link.href.endsWith(slug),
  );

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <GlobalProgrammaticPage
        content={content}
        homeHref={homeHref}
        servicesHref={servicesHref}
        relatedMarkets={getRelatedMarkets(combo.marketId, locale, 3)}
        relatedServices={relatedServices}
        breadcrumbs={[
          { label: market.name, href: marketHref },
          { label: svcLabel },
        ]}
      />
    </>
  );
}
