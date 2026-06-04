'use client';

import { useTextScramble } from '@/hooks/useTextScramble';

type Props = {
  text: string;
  className?: string;
};

/**
 * Small mono eyebrow (e.g. `[ SYSTEMS ]`) with matrix scramble + repeat, matching home section cadence.
 */
export function MonoBracketEyebrowScramble({ text, className = '' }: Props) {
  const out = useTextScramble(text, 900, true, 3000);

  return (
    <p className={`font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--brand)] ${className}`}>
      {out}
    </p>
  );
}
