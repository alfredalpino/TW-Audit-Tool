import { DEFAULT_LOCALE, type LocaleCode } from '@/lib/i18n/config';
import { isUiOverlayLocale } from '@/lib/i18n/detection';
import { loadMessages } from '@/lib/i18n/load-messages';

export type LegalDocumentKind = 'privacy' | 'terms' | 'dmca';

export type LegalDocumentContent = {
  title: string;
  metaDescription: string;
  lastUpdated: string;
  intro: string;
  authoritativeNotice: string;
  scopeHeading: string;
  scopeBody: string;
  collectHeading: string;
  collectBody: string;
  rightsHeading: string;
  rightsBody: string;
  contactHeading: string;
  contactBody: string;
};

function readDocument(messages: Record<string, unknown>, kind: LegalDocumentKind): LegalDocumentContent | null {
  const bucket = messages[kind];
  if (!bucket || typeof bucket !== 'object') return null;

  const doc = bucket as Record<string, string>;
  const required: (keyof LegalDocumentContent)[] = [
    'title',
    'metaDescription',
    'lastUpdated',
    'intro',
    'authoritativeNotice',
    'scopeHeading',
    'scopeBody',
    'collectHeading',
    'collectBody',
    'rightsHeading',
    'rightsBody',
    'contactHeading',
    'contactBody',
  ];

  for (const key of required) {
    if (typeof doc[key] !== 'string' || !doc[key].trim()) return null;
  }

  return doc as LegalDocumentContent;
}

export async function getLegalDocument(
  locale: LocaleCode,
  kind: LegalDocumentKind,
): Promise<LegalDocumentContent | null> {
  if (!isUiOverlayLocale(locale)) return null;

  const messages = await loadMessages(locale, ['legal']);
  const fromLocale = readDocument(messages.legal as Record<string, unknown>, kind);
  if (fromLocale) return fromLocale;

  if (locale === DEFAULT_LOCALE) return null;

  const fallback = await loadMessages(DEFAULT_LOCALE, ['legal']);
  return readDocument(fallback.legal as Record<string, unknown>, kind);
}

export function shouldUseLocalizedLegal(locale: LocaleCode): boolean {
  return isUiOverlayLocale(locale);
}
