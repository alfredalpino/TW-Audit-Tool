import type { LocaleCode } from '@/lib/i18n/config';

type GtagFn = (...args: unknown[]) => void;

function fire(eventName: string, params: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  const gtag = (window as Window & { gtag?: GtagFn }).gtag;
  if (typeof gtag !== 'function') return;
  gtag('event', eventName, params);
}

export function trackLocaleView(locale: LocaleCode, pathname: string): void {
  fire('locale_view', { locale, page_path: pathname });
}

export function trackLocaleSwitch(from: LocaleCode, to: LocaleCode, countryId: string): void {
  fire('locale_switch', {
    from_locale: from,
    to_locale: to,
    country_id: countryId,
  });
}
