import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { OrganizationJsonLd } from '@/components/OrganizationJsonLd';
import { LayoutClientChunks } from '@/components/LayoutClientChunks';
import { localeByCode } from '@/lib/i18n/config';
import { getHtmlLang, getRequestLocale } from '@/lib/i18n/server';
import {
  SITE_URL,
  buildLanguageAlternates,
  indiaKeywordBank,
  siteTitleUS,
} from '@/lib/seo/site';
import { GA_MEASUREMENT_ID as DEFAULT_GA_MEASUREMENT_ID } from '@/lib/constants';
import { CRITICAL_CSS } from '@/lib/critical-css';
import { THEME_INIT_SCRIPT } from '@/lib/theme-init-script';
import { marketingFontClassName } from '@/lib/fonts';
import '@/app/globals.css';

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? DEFAULT_GA_MEASUREMENT_ID;
const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const BING_SITE_VERIFICATION = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

const siteDescription =
  'Growth infrastructure partner. Revenue and operations systems, web development, and design systems. Web and apps are the foundation. Book a discovery call.';

const ogTitle = 'Torpedo Web: High Performance Digital Engineering';
const ogDescription =
  'Custom web infrastructure, performance-driven websites, and scalable digital systems for serious founders.';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#faf7f0',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteTitleUS,
    template: '%s | TORPEDO WEB',
  },
  description: siteDescription,
  keywords: [
    'growth infrastructure',
    'revenue systems',
    'operations',
    'web development',
    'AI-driven',
    'digital foundation',
    ...indiaKeywordBank,
  ],
  authors: [{ name: 'Torpedo Web', url: SITE_URL }],
  creator: 'Torpedo Web',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'TORPEDO WEB',
    title: ogTitle,
    description: ogDescription,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Torpedo Web: High Performance Digital Engineering',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: ogTitle,
    description: ogDescription,
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: buildLanguageAlternates('/', 'us'),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const htmlLang = getHtmlLang(locale);
  const htmlDir = localeByCode[locale].direction;

  return (
    <html
      lang={htmlLang}
      dir={htmlDir}
      data-theme="light"
      className={marketingFontClassName}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <style id="tw-critical-css" dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />
        <OrganizationJsonLd />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        {GOOGLE_SITE_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={GOOGLE_SITE_VERIFICATION}
          />
        )}
        {BING_SITE_VERIFICATION && (
          <meta
            name="msvalidate.01"
            content={BING_SITE_VERIFICATION}
          />
        )}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className="min-h-dvh bg-tw-base font-sans text-tw-fg antialiased"
        suppressHydrationWarning
      >
        {children}
        <LayoutClientChunks />
      </body>
    </html>
  );
}
