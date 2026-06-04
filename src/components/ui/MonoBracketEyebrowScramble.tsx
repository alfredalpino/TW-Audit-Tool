"use client";

type Props = {
  text: string;
  className?: string;
};

/** Bracketed mono eyebrow — static copy; motion handled by parent/CSS if any. */
export function MonoBracketEyebrowScramble({ text, className = "" }: Props) {
  return (
    <p
      className={`font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--brand)] ${className}`}
    >
      {text}
    </p>
  );
}
