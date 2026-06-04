import { DM_Sans, JetBrains_Mono, Syne } from "next/font/google";

export const fontSyne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap",
});

export const fontDmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const fontJetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const appFontClassName = [
  fontSyne.variable,
  fontDmSans.variable,
  fontJetbrains.variable,
].join(" ");
