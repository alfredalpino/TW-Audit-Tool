'use client';

import { useTextScramble } from '@/hooks/useTextScramble';

type Props = {
  text: string;
  /** +10% size on top of the default services eyebrow scale */
  variant?: 'default' | 'prominent';
};

const sizeDefault =
  'text-[clamp(0.756rem,2vw,0.98rem)] sm:text-[clamp(0.81rem,1.6vw,1.02rem)]';
const sizeProminent =
  'text-[clamp(0.832rem,2.2vw,1.078rem)] sm:text-[clamp(0.891rem,1.76vw,1.122rem)]';

/**
 * Services index hero eyebrow: same scramble + repeat cadence as home section labels.
 */
export function ServicesEyebrowScramble({ text, variant = 'default' }: Props) {
  const scrambled = useTextScramble(text, 900, true, 3000);
  const sizeClass = variant === 'prominent' ? sizeProminent : sizeDefault;

  return (
    <p
      className={`tw-prose-flow max-w-full font-display ${sizeClass} font-bold leading-snug tracking-[0.2em] text-[var(--brand)]`}
    >
      {scrambled}
    </p>
  );
}
