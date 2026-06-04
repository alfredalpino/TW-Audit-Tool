import { DM_Sans, JetBrains_Mono, Syne } from 'next/font/google';

/** Display face — adjustFontFallback prevents desktop CLS when Syne loads. */
export const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
  adjustFontFallback: true,
  preload: true,
});

export const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
  adjustFontFallback: true,
  preload: true,
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  adjustFontFallback: true,
  preload: true,
});

export const marketingFontClassName = `${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`;
