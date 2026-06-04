"use client";

import { useEffect, useState } from "react";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const DEFAULT_STATIC_BELOW_WIDTH_PX = 768;

export type TextScrambleOptions = {
  durationMs?: number;
  /** Character scramble (desktop only). Default false — use CSS entrance instead. */
  scramble?: boolean;
  /** Re-run after settle; omit for one-shot only. */
  repeatAfterSettleMs?: number;
  /** Skip scramble at or below this width (default 768). */
  staticBelowWidthPx?: number;
};

function useForceStaticEyebrow(staticBelowWidthPx: number): boolean {
  const [forceStatic, setForceStatic] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia(`(max-width: ${staticBelowWidthPx}px)`);

    const update = () => setForceStatic(reduced.matches || narrow.matches);
    update();

    reduced.addEventListener("change", update);
    narrow.addEventListener("change", update);
    return () => {
      reduced.removeEventListener("change", update);
      narrow.removeEventListener("change", update);
    };
  }, [staticBelowWidthPx]);

  return forceStatic;
}

/**
 * Optional matrix-style scramble that settles to `text`.
 * Defaults to static text; enable `scramble: true` for a one-shot desktop-only effect.
 */
export function useTextScramble(text: string, options: TextScrambleOptions = {}): string {
  const {
    durationMs = 1200,
    scramble = false,
    repeatAfterSettleMs,
    staticBelowWidthPx = DEFAULT_STATIC_BELOW_WIDTH_PX,
  } = options;

  const forceStatic = useForceStaticEyebrow(staticBelowWidthPx);
  const [out, setOut] = useState(text);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    setCycle(0);
  }, [text]);

  useEffect(() => {
    if (typeof window === "undefined" || !scramble || forceStatic) {
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
      let s = "";
      for (let i = 0; i < len; i++) {
        const ch = text[i];
        if (ch === " " || ch === "\n") {
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
  }, [text, durationMs, scramble, repeatAfterSettleMs, forceStatic, cycle]);

  return out;
}
