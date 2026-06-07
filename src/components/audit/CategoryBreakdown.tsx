"use client";

import { useState } from "react";
import type { CategoryScoreDto, FindingCategory, FindingDto } from "@/types/audit";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  seo: "SEO",
  speed: "Speed",
  ux: "UX",
  cro: "CRO",
  technical: "Technical",
  accessibility: "Accessibility",
  security: "Security",
  compliance: "Compliance",
  ai_readiness: "AI readiness",
  mobile: "Mobile",
  content: "Content",
  screenshot: "Screenshots",
};

export function CategoryBreakdown({
  scores,
  findings,
}: {
  scores: CategoryScoreDto[];
  findings: FindingDto[];
}) {
  const [selected, setSelected] = useState<FindingCategory | null>(
    scores[0]?.category ?? null
  );

  if (!scores.length) {
    return (
      <p className="font-mono text-xs text-[var(--fg-tertiary)]">
        Scores pending…
      </p>
    );
  }

  const active = scores.find((s) => s.category === selected) ?? scores[0];
  const related = findings.filter((f) => f.category === active.category);

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {scores.map((s) => (
          <button
            key={s.category}
            type="button"
            onClick={() => setSelected(s.category)}
            className={cn(
              "tw-panel flex min-w-0 flex-col gap-1 p-3 text-left transition-all hover:ring-1 hover:ring-[var(--brand)]/30",
              selected === s.category && "ring-2 ring-[var(--brand)]"
            )}
          >
            <span className="tw-contain-text font-mono text-[10px] uppercase leading-snug tracking-wider text-[var(--fg-tertiary)]">
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
            <span className="font-mono text-[9px] text-[var(--fg-tertiary)]">
              {findings.filter((f) => f.category === s.category).length} issues
            </span>
          </button>
        ))}
      </div>

      <div className="tw-panel min-w-0 p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--brand)]">
          {LABELS[active.category] ?? active.category}
        </p>
        <p className="mt-2 font-display text-3xl font-bold text-[var(--fg-primary)]">
          {active.score}
          <span className="text-lg font-normal text-[var(--fg-tertiary)]">
            /100
          </span>
        </p>

        {active.breakdown && Object.keys(active.breakdown).length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-tertiary)]">
              Signals
            </p>
            <dl className="space-y-2">
              {Object.entries(active.breakdown).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-start justify-between gap-3 border-b border-[var(--border)] pb-2 text-sm last:border-0"
                >
                  <dt className="font-mono text-[10px] uppercase text-[var(--fg-tertiary)]">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </dt>
                  <dd className="text-right text-[var(--fg-primary)]">
                    {formatBreakdownValue(value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-tertiary)]">
              Top issues in this category
            </p>
            <ul className="mt-2 space-y-2">
              {related.slice(0, 4).map((f) => (
                <li
                  key={f.id}
                  className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2 text-sm"
                >
                  <span className="font-medium text-[var(--fg-primary)]">
                    {f.title}
                  </span>
                  <span className="ml-2 font-mono text-[10px] text-[var(--brand)]">
                    {f.priorityScore}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function formatBreakdownValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.join(", ");
  return JSON.stringify(value);
}
