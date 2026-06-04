/** Deterministic layout so SSR/client markup match (no Math.random in render). */
function buildStars(count: number) {
  const out: { top: number; left: number; size: number; delay: number; duration: number; warm: boolean }[] = [];
  for (let i = 0; i < count; i++) {
    const top = ((i * 47 + i * i * 3) % 991) / 10;
    const left = ((i * 73 + i * i * 2) % 983) / 10;
    out.push({
      top: Math.min(99, top),
      left: Math.min(99, left),
      size: 1 + (i % 3),
      delay: ((i * 13) % 40) / 10,
      duration: 2.2 + ((i * 7) % 15) / 10,
      warm: i % 5 === 0 || i % 11 === 0,
    });
  }
  return out;
}

const STARS = buildStars(64);

/**
 * Lightweight starfield (CSS only). Absolutely fills a relatively positioned ancestor
 * (typically the full home column) so it scrolls with the page and stays off the footer.
 * Reduced motion: see globals `.tw-star` inside `@media (prefers-reduced-motion: reduce)`.
 */
export function ShimmerStars() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 min-h-full overflow-hidden" aria-hidden>
      {STARS.map((s, i) => (
        <span
          key={i}
          className={`tw-star tw-star--${s.warm ? 'warm' : 'cool'}`}
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
