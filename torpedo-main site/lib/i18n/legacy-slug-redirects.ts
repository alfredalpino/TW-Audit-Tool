import {
  ENGLISH_SLUG_BY_PAGE_KEY,
  MARKETING_PAGE_KEYS,
  OVERLAY_LOCALE_PREFIX,
  slugForOverlayLocale,
  type MarketingPageKey,
  type OverlayLocaleCode,
} from './localized-slugs-data';

export type LocaleSlugRedirect = {
  source: string;
  destination: string;
  permanent: true;
};

/** 301 redirects from legacy English slugs under each overlay locale prefix. */
export function getLegacyEnglishSlugRedirects(): LocaleSlugRedirect[] {
  const redirects: LocaleSlugRedirect[] = [];

  for (const locale of Object.keys(OVERLAY_LOCALE_PREFIX) as OverlayLocaleCode[]) {
    const prefix = OVERLAY_LOCALE_PREFIX[locale];

    for (const pageKey of MARKETING_PAGE_KEYS) {
      const english = ENGLISH_SLUG_BY_PAGE_KEY[pageKey];
      const localized = slugForOverlayLocale(pageKey, locale);
      if (english === localized) continue;

      redirects.push({
        source: `${prefix}/${english}`,
        destination: `${prefix}/${localized}`,
        permanent: true,
      });
      redirects.push({
        source: `${prefix}/${english}/:path*`,
        destination: `${prefix}/${localized}/:path*`,
        permanent: true,
      });
    }
  }

  return redirects;
}
