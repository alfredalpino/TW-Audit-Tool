import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GlobalProgrammaticPage } from '@/components/seo/GlobalProgrammaticPage';
import { buildPathForLocale } from '@/lib/i18n/config';
import { getRelatedMarkets, getRelatedServicesForMarket } from '@/lib/i18n/internal-links';
import { getRequestLocale, getOpenGraphLocale } from '@/lib/i18n/server';
import { getMarketPageContent } from '@/lib/seo/global-market-content';
import {
  type GlobalMarketId,
  globalMarkets,
  globalMarketsById,
  getMarketPath,
} from '@/lib/seo/global-markets';
import {
  buildLocalizedBreadcrumb,
  buildLocalizedFAQ,
  buildLocalizedOrganization,
  buildLocalizedServiceSchema,
} from '@/lib/seo/schema';
import { buildLanguageAlternates, toAbsoluteUrl } from '@/lib/seo/site';

type Props = {
  params: Promise<{ market: string }>;
};

export function generateStaticParams() {
  return globalMarkets.map((market) => ({ market: market.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { market: marketSlug } = await params;
  const market = globalMarketsById.get(marketSlug as GlobalMarketId);
  if (!market) return {};

  const locale = await getRequestLocale();
  const content = getMarketPageContent(market.id, locale);
  const path = buildPathForLocale(locale, getMarketPath(market.id));

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: path,
      locale: getOpenGraphLocale(locale),
    },
    alternates: buildLanguageAlternates(getMarketPath(market.id), market.primaryLocale),
  };
}

export default async function GlobalMarketPage({ params }: Props) {
  const { market: marketSlug } = await params;
  const market = globalMarketsById.get(marketSlug as GlobalMarketId);
  if (!market) notFound();

  const locale = await getRequestLocale();
  const content = getMarketPageContent(market.id, locale);
  const pagePath = buildPathForLocale(locale, getMarketPath(market.id));
  const pageUrl = toAbsoluteUrl(pagePath);
  const homeHref = buildPathForLocale(locale, '/');
  const servicesHref = buildPathForLocale(locale, '/services');

  const schemaGraph = [
    buildLocalizedOrganization(locale),
    buildLocalizedBreadcrumb(
      [
        { name: 'Home', url: toAbsoluteUrl(homeHref) },
        { name: market.name, url: pageUrl },
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

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <GlobalProgrammaticPage
        content={content}
        market={market}
        homeHref={homeHref}
        servicesHref={servicesHref}
        relatedMarkets={getRelatedMarkets(market.id, locale)}
        relatedServices={getRelatedServicesForMarket(market.id, locale)}
        breadcrumbs={[{ label: market.name }]}
      />
    </>
  );
}
