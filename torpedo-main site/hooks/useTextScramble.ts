'use client';

import { useEffect, useState } from 'react';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Matrix-style subtle scramble: settles to `text` within `durationMs` (default 800ms).
 * Optional `repeatAfterSettleMs`: after the final text is shown, wait that many ms and run the scramble again.
 */
export function useTextScramble(
  text: string,
  durationMs = 800,
  enabled = true,
  repeatAfterSettleMs?: number,
): string {
  const [out, setOut] = useState(text);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    setCycle(0);
  }, [text]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      setOut(text);
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOut(text);
      return;
    }

    const len = text.length;
    let start: number | null = null;
    let raf = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const tick = (now: number) => {
      if (start === null) start = now;
      const t = Math.min(1, (now - start) / durationMs);
      const reveal = Math.floor(t * len);
      let s = '';
      for (let i = 0; i < len; i++) {
        const ch = text[i];
        if (ch === ' ' || ch === '\n') {
          s += ch;
          continue;
        }
        if (i < reveal) {
          s += ch;
        } else {
          s += CHARSET[(Math.random() * CHARSET.length) | 0];
        }
      }
      setOut(s);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setOut(text);
        if (repeatAfterSettleMs != null && repeatAfterSettleMs > 0) {
          timeoutId = setTimeout(() => setCycle((c) => c + 1), repeatAfterSettleMs);
        }
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [text, durationMs, enabled, repeatAfterSettleMs, cycle]);

  return out;
}
