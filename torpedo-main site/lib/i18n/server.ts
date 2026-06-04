import { headers } from 'next/headers';
import {
  DEFAULT_LOCALE,
  getLocaleFromPathname,
  localeByCode,
  type LocaleCode,
} from '@/lib/i18n/config';
import { TORPEDO_LOCALE_HEADER } from '@/lib/i18n/middleware';
import { loadMessages, type Messages } from '@/lib/i18n/load-messages';

export async function getRequestLocale(): Promise<LocaleCode> {
  const headerStore = await headers();
  const fromHeader = headerStore.get(TORPEDO_LOCALE_HEADER);
  if (fromHeader && fromHeader in localeByCode) {
    return fromHeader as LocaleCode;
  }
  return DEFAULT_LOCALE;
}

export async function getServerMessages(locale?: LocaleCode): Promise<Messages> {
  const resolved = locale ?? (await getRequestLocale());
  return loadMessages(resolved);
}

export function getHtmlLang(locale: LocaleCode): string {
  return locale;
}

export function getOpenGraphLocale(locale: LocaleCode): string {
  return locale.replace('-', '_');
}

export function localeFromPathnameOrDefault(pathname: string): LocaleCode {
  return getLocaleFromPathname(pathname);
}
