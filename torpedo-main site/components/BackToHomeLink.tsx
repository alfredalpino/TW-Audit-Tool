'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { useContactInfo } from '@/components/ContactInfoContext';
import { buildPathForLocale } from '@/lib/i18n/build-path';
import type { LocaleCode } from '@/lib/i18n/config';

/** Internal link with locale prefix and localized marketing slugs. */
export function BasePathLink({ href, ...props }: Omit<ComponentProps<typeof Link>, 'href'> & { href: string }) {
  const { locale } = useContactInfo();
  return <Link href={buildPathForLocale(locale as LocaleCode, href)} {...props} />;
}

const linkClassName =
  'relative z-10 inline-flex items-center gap-2 text-base font-medium text-torpedo-gray hover:text-torpedo-orange transition-colors mb-6 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-torpedo-orange focus-visible:ring-offset-2 rounded';

const linkClassNameSm =
  'inline-flex items-center gap-2 text-sm text-torpedo-gray hover:text-torpedo-orange transition-colors mb-4';

const linkClassNameSmDark =
  'inline-flex items-center gap-2 text-sm text-[var(--fg-secondary)] hover:text-[var(--brand)] transition-colors mb-4';

export function BackToHomeLink() {
  const { basePath } = useContactInfo();
  return (
    <Link href={basePath || '/'} className={linkClassName}>
      ← Back to home
    </Link>
  );
}

export function BackToHomeLinkSm({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const { basePath } = useContactInfo();
  const cls = variant === 'dark' ? linkClassNameSmDark : linkClassNameSm;
  return (
    <Link href={basePath || '/'} className={cls}>
      ← Back to home
    </Link>
  );
}

export function BackToBlogLink() {
  const { locale } = useContactInfo();
  return (
    <Link href={buildPathForLocale(locale as LocaleCode, '/blog')} className={linkClassNameSmDark}>
      ← Back to blog
    </Link>
  );
}
