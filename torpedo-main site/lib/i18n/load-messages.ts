import type { LocaleCode } from '@/lib/i18n/config';

export type MessageNamespace =
  | 'common'
  | 'nav'
  | 'footer'
  | 'seo'
  | 'cta'
  | 'home'
  | 'process'
  | 'services'
  | 'systems'
  | 'whatWeDo'
  | 'legal';

export type MessageLeaf = Record<string, string>;
export type Messages = {
  [namespace: string]: MessageLeaf | string | undefined;
};

const messageCache = new Map<string, Messages>();

async function importLocaleFile(locale: LocaleCode, namespace: MessageNamespace): Promise<Messages> {
  switch (locale) {
    case 'en-US':
      return (await import(`./messages/en-US/${namespace}.json`)).default as Messages;
    case 'en-IN':
      return (await import(`./messages/en-IN/${namespace}.json`)).default as Messages;
    case 'es-MX':
      return (await import(`./messages/es-MX/${namespace}.json`)).default as Messages;
    case 'fr-FR':
    case 'fr-MA':
    case 'fr-CH':
      return (await import(`./messages/fr/${namespace}.json`)).default as Messages;
    case 'de-CH':
      return (await import(`./messages/de/${namespace}.json`)).default as Messages;
    case 'fi-FI':
      return (await import(`./messages/fi/${namespace}.json`)).default as Messages;
    case 'sv-SE':
      return (await import(`./messages/sv/${namespace}.json`)).default as Messages;
    case 'it-IT':
      return (await import(`./messages/it/${namespace}.json`)).default as Messages;
    case 'tr-TR':
      return (await import(`./messages/tr/${namespace}.json`)).default as Messages;
    case 'ru-RU':
      return (await import(`./messages/ru/${namespace}.json`)).default as Messages;
    case 'ar-AE':
      return (await import(`./messages/ar/${namespace}.json`)).default as Messages;
    case 'ja-JP':
      return (await import(`./messages/ja/${namespace}.json`)).default as Messages;
    case 'zh-CN':
      return (await import(`./messages/zh-CN/${namespace}.json`)).default as Messages;
    case 'zh-HK':
      return (await import(`./messages/zh-HK/${namespace}.json`)).default as Messages;
    case 'ko-KR':
      return (await import(`./messages/ko/${namespace}.json`)).default as Messages;
    default:
      return (await import(`./messages/en-US/${namespace}.json`)).default as Messages;
  }
}

function cacheKey(locale: LocaleCode, namespace: MessageNamespace): string {
  return `${locale}:${namespace}`;
}

export async function loadMessages(
  locale: LocaleCode,
  namespaces: MessageNamespace[] = [
    'common',
    'nav',
    'footer',
    'cta',
    'home',
    'process',
    'services',
    'systems',
    'whatWeDo',
  ],
): Promise<Messages> {
  const merged: Messages = {};

  for (const ns of namespaces) {
    const key = cacheKey(locale, ns);
    let chunk = messageCache.get(key);
    if (!chunk) {
      try {
        chunk = await importLocaleFile(locale, ns);
      } catch {
        chunk = await importLocaleFile('en-US', ns);
      }
      messageCache.set(key, chunk);
    }
    merged[ns] = chunk as MessageLeaf;
  }

  return merged;
}

function getNestedValue(messages: Messages, key: string): string | undefined {
  const parts = key.split('.');
  let current: unknown = messages;

  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === 'string' ? current : undefined;
}

export function createTranslator(messages: Messages) {
  return function t(key: string, fallback?: string): string {
    const parts = key.split('.');
    if (parts.length > 1) {
      const [namespace, ...rest] = parts;
      const bucket = messages[namespace];
      if (bucket && typeof bucket === 'object') {
        const nested = getNestedValue(bucket as Messages, rest.join('.'));
        if (nested) return nested;
      }
    }

    const direct = getNestedValue(messages, key);
    if (direct) return direct;

    return fallback ?? key;
  };
}
