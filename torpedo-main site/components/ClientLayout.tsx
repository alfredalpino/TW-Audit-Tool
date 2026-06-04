'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { ContactInfoProvider } from '@/components/ContactInfoContext';
import { LocaleProvider } from '@/components/i18n/LocaleProvider';
import { useTranslations } from '@/components/i18n/LocaleProvider';
import type { LocaleCode } from '@/lib/i18n/config';
import type { Messages } from '@/lib/i18n/load-messages';

const Footer = dynamic(() => import('@/components/layout/Footer'), {
  ssr: true,
  loading: () => <div className="min-h-[280px] border-t border-[var(--border)] bg-[var(--bg-void)]" aria-hidden />,
});

/**
 * Client boundary for marketing pages. To reduce JS: wrap MotionConfig
 * only on routes that need it (e.g. pathname === '/') or lazy-load it.
 */

function ScrollToTopOnRoute() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname !== '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [pathname]);
  return null;
}

function SkipToContentLink() {
  const { t } = useTranslations('common');
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:z-[60] focus:left-4 focus:top-4 focus:rounded-[var(--btn-radius)] focus:border focus:border-[var(--border)] focus:bg-[var(--bg-surface)] focus:px-4 focus:py-2 focus:text-[var(--fg-primary)] focus:shadow-lg focus:outline-none"
    >
      {t('skipToContent', 'Skip to main content')}
    </a>
  );
}

export function ClientLayout({
  children,
  initialLocale,
  initialMessages,
}: {
  children: React.ReactNode;
  initialLocale: LocaleCode;
  initialMessages: Messages;
}) {
  return (
    <LocaleProvider initialLocale={initialLocale} initialMessages={initialMessages}>
      <ContactInfoProvider>
        <div className="relative flex min-h-dvh w-full max-w-[100vw] flex-col bg-[var(--bg-base)] text-[var(--fg-primary)] selection:bg-[var(--brand)] selection:text-[var(--brand-fg)]">
          <SkipToContentLink />
          <ScrollToTopOnRoute />
          <GoogleAnalytics />
          <Navbar />
          <div className="w-full min-w-0 flex-1 pt-[var(--nav-h)]">{children}</div>
          <Footer />
        </div>
      </ContactInfoProvider>
    </LocaleProvider>
  );
}
