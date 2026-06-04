import { NextResponse, type NextRequest } from 'next/server';
import {
  DEFAULT_LOCALE,
  buildPathForLocale,
  getLocaleFromPathname,
  localeByCode,
  stripLocalePrefix,
  type LocaleCode,
} from '@/lib/i18n/config';
import { canonicalizeMarketingPath } from '@/lib/i18n/localized-slugs';
import {
  isContentLocale,
  isUiOverlayLocale,
  localeFromGeo,
  readLocaleFromRequestCookies,
  resolvePreferredLocale,
} from '@/lib/i18n/detection';

export const TORPEDO_LOCALE_HEADER = 'x-torpedo-locale';
export const TORPEDO_LOCALE_PREFIX_HEADER = 'x-torpedo-locale-prefix';

const MARKETING_PREFIXES = [
  '/',
  '/plans',
  '/portfolio',
  '/process',
  '/blog',
  '/services',
  '/systems',
  '/what-we-do',
  '/torpedo-agency',
  '/privacy-policy',
  '/terms-of-service',
  '/dmca',
  '/markets',
  '/global-services',
];

function marketingPathBase(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  const stripped = stripLocalePrefix(pathname);
  return isUiOverlayLocale(locale) ? canonicalizeMarketingPath(stripped, locale) : stripped;
}

function isMarketingPath(pathname: string): boolean {
  const base = marketingPathBase(pathname);
  if (base === '/') return true;
  return MARKETING_PREFIXES.some(
    (prefix) => prefix !== '/' && (base === prefix || base.startsWith(`${prefix}/`)),
  );
}

function isIndiaOnlyPath(pathname: string): boolean {
  const base = marketingPathBase(pathname);
  if (base.startsWith('/local') || base.startsWith('/best')) return true;

  const match = /^\/([^/]+)$/.exec(base);
  if (!match?.[1]) return false;

  const segment = match[1];
  const shared = new Set([
    'blog',
    'services',
    'portfolio',
    'process',
    'systems',
    'plans',
    'dmca',
    'privacy-policy',
    'terms-of-service',
    'torpedo-agency',
    'what-we-do',
    'markets',
    'global-services',
  ]);
  return !shared.has(segment);
}

function shouldSkipLocaleNegotiation(pathname: string): boolean {
  return (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/crm') ||
    pathname.startsWith('/portal') ||
    pathname.startsWith('/_next')
  );
}

function attachLocaleHeaders(response: NextResponse, locale: LocaleCode): NextResponse {
  const prefix = localeByCode[locale].prefix;
  response.headers.set(TORPEDO_LOCALE_HEADER, locale);
  response.headers.set(TORPEDO_LOCALE_PREFIX_HEADER, prefix);
  return response;
}

/**
 * UI-overlay locales rewrite to the en-US page tree while preserving the public URL prefix.
 * en-IN keeps its dedicated routes.
 */
export function applyLocaleRouting(request: NextRequest, response: NextResponse): NextResponse {
  const pathname = request.nextUrl.pathname;

  if (shouldSkipLocaleNegotiation(pathname)) {
    return attachLocaleHeaders(response, DEFAULT_LOCALE);
  }

  const urlLocale = getLocaleFromPathname(pathname);

  if (isUiOverlayLocale(urlLocale)) {
    const internalPath = canonicalizeMarketingPath(stripLocalePrefix(pathname), urlLocale);
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = internalPath;
    const rewrite = NextResponse.rewrite(rewriteUrl, response);
    return attachLocaleHeaders(rewrite, urlLocale);
  }

  return attachLocaleHeaders(response, urlLocale);
}

export function maybeRedirectToPreferredLocale(
  request: NextRequest,
  options: { isBot: boolean },
): NextResponse | null {
  if (options.isBot) return null;

  const pathname = request.nextUrl.pathname;
  if (shouldSkipLocaleNegotiation(pathname) || !isMarketingPath(pathname)) return null;

  const currentLocale = getLocaleFromPathname(pathname);
  if (currentLocale !== DEFAULT_LOCALE) return null;

  const { locale: cookieLocale } = readLocaleFromRequestCookies(request.headers.get('cookie'));
  const geo = {
    country: request.geo?.country ?? request.headers.get('x-vercel-ip-country') ?? undefined,
    region: request.geo?.region ?? request.headers.get('x-vercel-ip-country-region') ?? undefined,
    city: request.geo?.city ?? undefined,
  };

  const preferred = resolvePreferredLocale({
    pathname,
    acceptLanguage: request.headers.get('accept-language'),
    cookieLocale,
    geo,
  });

  if (preferred === DEFAULT_LOCALE) return null;

  if (preferred === 'en-IN' && isIndiaOnlyPath(pathname)) {
    return null;
  }

  const targetPath = buildPathForLocale(preferred, pathname);
  if (targetPath === pathname) return null;

  if (isContentLocale(preferred) && preferred === 'en-IN') {
    return NextResponse.redirect(new URL(targetPath, request.url));
  }

  if (isUiOverlayLocale(preferred)) {
    return NextResponse.redirect(new URL(targetPath, request.url));
  }

  return null;
}

/** Legacy India geo redirect — only when no explicit cookie override and user is on en-US paths. */
export function maybeIndiaGeoRedirect(
  request: NextRequest,
  options: { isBot: boolean },
): NextResponse | null {
  if (options.isBot) return null;

  const pathname = request.nextUrl.pathname;
  if (!isMarketingPath(pathname)) return null;

  const currentLocale = getLocaleFromPathname(pathname);
  if (currentLocale !== DEFAULT_LOCALE) return null;

  const { locale: cookieLocale } = readLocaleFromRequestCookies(request.headers.get('cookie'));
  if (cookieLocale && cookieLocale !== 'en-IN') return null;

  const country = (
    request.geo?.country ??
    request.headers.get('x-vercel-ip-country') ??
    ''
  )
    .toUpperCase()
    .trim();

  if (country !== 'IN') return null;

  const targetPath = buildPathForLocale('en-IN', pathname);
  if (targetPath === pathname) return null;

  return NextResponse.redirect(new URL(targetPath, request.url));
}

export function negotiateLocaleFromGeoOnly(request: NextRequest): LocaleCode {
  const geo = {
    country: request.geo?.country ?? request.headers.get('x-vercel-ip-country') ?? undefined,
    region: request.geo?.region ?? undefined,
    city: request.geo?.city ?? undefined,
  };
  return localeFromGeo(geo);
}
