import type { CategoryScoreDto } from "@/types/audit";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  seo: "SEO",
  speed: "Speed",
  ux: "UX",
  cro: "CRO",
  technical: "Technical",
  accessibility: "A11y",
  security: "Security",
  ai_readiness: "AI Ready",
  mobile: "Mobile",
};

export function CategoryScoreGrid({ scores }: { scores: CategoryScoreDto[] }) {
  if (!scores.length) {
    return (
      <p className="font-mono text-xs text-[var(--fg-tertiary)]">Scores pending…</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {scores.map((s) => (
        <div
          key={s.category}
          className="tw-panel flex flex-col gap-1 p-3"
        >
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-tertiary)]">
            {LABELS[s.category] ?? s.category}
          </span>
          <span
            className={cn(
              "tw-metric text-2xl font-medium",
              s.score >= 80
                ? "text-[var(--accent-blue)]"
                : s.score >= 60
                  ? "text-[var(--brand)]"
                  : "text-red-400"
            )}
          >
            {s.score}
          </span>
        </div>
      ))}
    </div>
  );
}
