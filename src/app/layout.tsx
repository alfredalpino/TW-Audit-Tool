import type { Metadata } from "next";
import Script from "next/script";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { appFontClassName } from "@/lib/fonts";
import { THEME_INIT_SCRIPT } from "@/lib/theme-init-script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Torpedo Website Intelligence Auditor",
  description:
    "Find what is costing your website traffic, leads, and revenue. SEO, speed, accessibility, CRO, security, and more.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className={appFontClassName}>
      <head>
        <meta name="theme-color" content="#faf7f0" />
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        {children}
        <MarketingFooter />
      </body>
    </html>
  );
}
