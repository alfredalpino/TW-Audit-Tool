'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { DEFAULT_LOCALE, localeByCode, type LocaleCode } from '@/lib/i18n/config';
import { createTranslator, loadMessages, type Messages } from '@/lib/i18n/load-messages';
import { resolveClientLocale } from '@/lib/i18n/resolve-client-locale';
import { trackLocaleView } from '@/lib/i18n/analytics';

type LocaleContextValue = {
  locale: LocaleCode;
  direction: 'ltr' | 'rtl';
  basePath: string;
  messages: Messages;
  t: (key: string, fallback?: string) => string;
  ready: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

type LocaleProviderProps = {
  children: React.ReactNode;
  initialLocale: LocaleCode;
  initialMessages: Messages;
};

export function LocaleProvider({ children, initialLocale, initialMessages }: LocaleProviderProps) {
  const pathname = usePathname() ?? '/';
  const [messages, setMessages] = useState<Messages>(initialMessages);
  const [ready, setReady] = useState(Object.keys(initialMessages).length > 0);

  const locale = useMemo(() => resolveClientLocale(pathname), [pathname]);

  const basePath = localeByCode[locale].prefix;
  const direction = localeByCode[locale].direction;

  useEffect(() => {
    if (locale === initialLocale) {
      setMessages(initialMessages);
      setReady(true);
      return;
    }

    let cancelled = false;
    setReady(false);

    loadMessages(locale).then((loaded) => {
      if (cancelled) return;
      setMessages(loaded);
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [locale, initialLocale, initialMessages]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale, direction]);

  useEffect(() => {
    trackLocaleView(locale, pathname);
  }, [locale, pathname]);

  const t = useMemo(() => createTranslator(messages), [messages]);

  const value = useMemo(
    () => ({
      locale,
      direction,
      basePath,
      messages,
      t,
      ready,
    }),
    [locale, direction, basePath, messages, t, ready],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    const locale = DEFAULT_LOCALE;
    return {
      locale,
      direction: localeByCode[locale].direction,
      basePath: '',
      messages: {},
      t: (key, fallback) => fallback ?? key,
      ready: false,
    };
  }
  return ctx;
}

export function useTranslations(
  namespace?: 'common' | 'nav' | 'footer' | 'cta' | 'home' | 'process' | 'services' | 'systems' | 'whatWeDo',
) {
  const { t, ready } = useLocale();
  return {
    t: (key: string, fallback?: string) => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      return t(fullKey, fallback);
    },
    ready,
  };
}
