'use client';

import { useTextScramble } from '@/hooks/useTextScramble';
import { useTranslations } from '@/components/i18n/LocaleProvider';

/** Hero eyebrow — same scramble cadence as other home section labels. */
export function HomeHeroEyebrow() {
  const { t: tHome } = useTranslations('home');
  const eyebrow = tHome('heroEyebrow', '[ DIGITAL INFRASTRUCTURE PARTNER ]');
  const scrambled = useTextScramble(eyebrow, 900, true, 3000);

  return (
    <p className="tw-prose-flow mb-4 max-w-full font-display text-[clamp(0.805rem,2.3vw,0.934rem)] font-bold uppercase leading-snug tracking-[0.16em] text-[var(--brand)] sm:text-[clamp(0.863rem,1.725vw,1.006rem)] sm:tracking-[0.18em]">
      {scrambled}
    </p>
  );
}
