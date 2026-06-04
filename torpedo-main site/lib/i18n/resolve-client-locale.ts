import {
  DEFAULT_LOCALE,
  getLocaleFromPathname,
  localeByCode,
  readLocaleCookie,
  type LocaleCode,
} from '@/lib/i18n/config';

/** URL prefix wins over cookie; cookie applies only on unprefixed (default) routes. */
export function resolveClientLocale(pathname: string): LocaleCode {
  const fromPath = getLocaleFromPathname(pathname);
  if (localeByCode[fromPath].prefix) return fromPath;
  return readLocaleCookie() ?? fromPath ?? DEFAULT_LOCALE;
}
