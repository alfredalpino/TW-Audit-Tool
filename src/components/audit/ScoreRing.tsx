import { cn } from "@/lib/utils";

export function ScoreRing({
  score,
  className,
}: {
  score: number | null;
  className?: string;
}) {
  const value = score ?? 0;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (value / 100) * circumference;
  const color =
    value >= 80
      ? "var(--accent-blue)"
      : value >= 60
        ? "var(--brand)"
        : "#ef4444";

  return (
    <div className={cn("relative flex h-36 w-36 shrink-0 items-center justify-center", className)}>
      <svg className="-rotate-90" width="144" height="144" aria-hidden>
        <circle
          cx="72"
          cy="72"
          r="54"
          fill="none"
          stroke="var(--bg-muted)"
          strokeWidth="10"
        />
        <circle
          cx="72"
          cy="72"
          r="54"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="tw-metric text-4xl font-medium text-[var(--fg-primary)]">
          {score === null ? "—" : value}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-tertiary)]">
          Overall
        </span>
      </div>
    </div>
  );
}
