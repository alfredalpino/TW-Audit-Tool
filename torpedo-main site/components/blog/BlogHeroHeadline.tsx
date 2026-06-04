'use client';

import { useTextScramble } from '@/hooks/useTextScramble';

export function BlogHeroHeadline({ title }: { title: string }) {
  const scrambled = useTextScramble(title, 800, true);
  return (
    <h1 className="tw-heading-section mb-6 font-display font-bold tracking-tight text-[var(--fg-primary)]">
      {scrambled}
    </h1>
  );
}
