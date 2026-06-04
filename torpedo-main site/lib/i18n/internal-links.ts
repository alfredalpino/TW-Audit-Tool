import {
  type LocaleCode,
  buildPathForLocale,
  getLocaleFromPathname,
  localeByCode,
} from '@/lib/i18n/config';
import {
  type GlobalMarketId,
  globalMarkets,
  publishedServiceMarkets,
  serviceLabel,
  getMarketPath,
  getServiceMarketPath,
} from '@/lib/seo/global-markets';

export type InternalLink = {
  href: string;
  label: string;
  description?: string;
};

export type TopicCluster = {
  id: string;
  locale: LocaleCode;
  title: string;
  markets: InternalLink[];
  services: InternalLink[];
};

function prefixFor(locale: LocaleCode): string {
  return localeByCode[locale].prefix;
}

function link(path: string, locale: LocaleCode, label: string, description?: string): InternalLink {
  return {
    href: buildPathForLocale(locale, path),
    label,
    description,
  };
}

const MARKET_LABELS: Partial<Record<GlobalMarketId, Partial<Record<LocaleCode, string>>>> = {
  france: { 'fr-FR': 'France', 'en-US': 'France' },
  germany: { 'en-US': 'Germany' },
  mexico: { 'es-MX': 'México', 'en-US': 'Mexico' },
  switzerland: { 'de-CH': 'Schweiz', 'fr-CH': 'Suisse', 'en-US': 'Switzerland' },
  turkey: { 'tr-TR': 'Türkiye', 'en-US': 'Türkiye' },
  uae: { 'ar-AE': 'الإمارات', 'en-US': 'UAE' },
  'saudi-arabia': { 'en-US': 'Saudi Arabia' },
  russia: { 'ru-RU': 'Россия', 'en-US': 'Russia' },
};

function marketLabel(marketId: GlobalMarketId, locale: LocaleCode): string {
  const market = globalMarkets.find((m) => m.id === marketId);
  return MARKET_LABELS[marketId]?.[locale] ?? MARKET_LABELS[marketId]?.[market?.primaryLocale ?? 'en-US'] ?? marketId;
}

/** Semantic clusters per locale for footer and programmatic cross-links */
export function getTopicClusterForLocale(locale: LocaleCode): TopicCluster {
  const marketsForLocale = globalMarkets.filter(
    (m) => m.primaryLocale === locale || m.contentLocales.includes(locale),
  );

  const marketLinks = marketsForLocale.map((m) =>
    link(getMarketPath(m.id), locale, marketLabel(m.id, locale), m.region),
  );

  const serviceLinks = publishedServiceMarkets
    .filter((combo) => {
      const market = globalMarkets.find((m) => m.id === combo.marketId);
      return market && (market.primaryLocale === locale || market.contentLocales.includes(locale));
    })
    .map((combo) =>
      link(
        getServiceMarketPath(combo.slug),
        locale,
        `${serviceLabel(combo.service, locale)} · ${marketLabel(combo.marketId, locale)}`,
      ),
    );

  const titles: Partial<Record<LocaleCode, string>> = {
    'fr-FR': 'Marchés & services',
    'es-MX': 'Mercados y servicios',
    'de-CH': 'Märkte & Leistungen',
    'fr-CH': 'Marchés & services',
    'tr-TR': 'Pazarlar ve hizmetler',
    'ru-RU': 'Рынки и услуги',
    'ar-AE': 'الأسواق والخدمات',
    'en-US': 'Global markets',
    'en-IN': 'Global markets',
  };

  return {
    id: `cluster-${locale}`,
    locale,
    title: titles[locale] ?? titles['en-US']!,
    markets: marketLinks,
    services: serviceLinks,
  };
}

export function getRelatedMarkets(
  currentMarketId: GlobalMarketId,
  locale: LocaleCode,
  limit = 4,
): InternalLink[] {
  return globalMarkets
    .filter((m) => m.id !== currentMarketId)
    .slice(0, limit)
    .map((m) => link(getMarketPath(m.id), locale, marketLabel(m.id, locale)));
}

export function getRelatedServicesForMarket(
  marketId: GlobalMarketId,
  locale: LocaleCode,
): InternalLink[] {
  return publishedServiceMarkets
    .filter((c) => c.marketId === marketId)
    .map((c) =>
      link(
        getServiceMarketPath(c.slug),
        locale,
        serviceLabel(c.service, locale),
      ),
    );
}

export function getRelatedMarketsForService(
  service: 'web-development' | 'seo' | 'ai-automation',
  locale: LocaleCode,
  excludeMarketId?: GlobalMarketId,
): InternalLink[] {
  return publishedServiceMarkets
    .filter((c) => c.service === service && c.marketId !== excludeMarketId)
    .map((c) =>
      link(
        getMarketPath(c.marketId),
        locale,
        marketLabel(c.marketId, locale),
      ),
    );
}

export function getCrossLinksForPath(pathname: string): {
  cluster: TopicCluster;
  relatedMarkets: InternalLink[];
  relatedServices: InternalLink[];
} {
  const locale = getLocaleFromPathname(pathname);
  const cluster = getTopicClusterForLocale(locale);

  const marketMatch = /\/markets\/([^/]+)/.exec(pathname);
  const serviceMatch = /\/global-services\/([^/]+)/.exec(pathname);

  if (marketMatch?.[1]) {
    const marketId = marketMatch[1] as GlobalMarketId;
    return {
      cluster,
      relatedMarkets: getRelatedMarkets(marketId, locale),
      relatedServices: getRelatedServicesForMarket(marketId, locale),
    };
  }

  if (serviceMatch?.[1]) {
    const combo = publishedServiceMarkets.find((c) => c.slug === serviceMatch[1]);
    if (combo) {
      return {
        cluster,
        relatedMarkets: [
          link(getMarketPath(combo.marketId), locale, marketLabel(combo.marketId, locale)),
          ...getRelatedMarkets(combo.marketId, locale, 3),
        ],
        relatedServices: getRelatedServicesForMarket(combo.marketId, locale).filter(
          (l) => !l.href.includes(serviceMatch[1]!),
        ),
      };
    }
  }

  return { cluster, relatedMarkets: cluster.markets.slice(0, 4), relatedServices: cluster.services.slice(0, 4) };
}

export function shouldShowGlobalMarketsCluster(locale: LocaleCode): boolean {
  const prefix = prefixFor(locale);
  return prefix !== '/en-in';
}
