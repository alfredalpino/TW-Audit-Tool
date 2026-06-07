"use client";

import { useMemo, useState } from "react";
import type { FindingCategory, FindingDto, FindingSeverity } from "@/types/audit";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CATEGORIES: FindingCategory[] = [
  "seo",
  "speed",
  "ux",
  "cro",
  "technical",
  "accessibility",
  "security",
  "compliance",
  "ai_readiness",
  "mobile",
  "content",
  "screenshot",
];

const SEVERITIES: FindingSeverity[] = [
  "critical",
  "high",
  "medium",
  "low",
  "info",
];

export function InteractiveFindings({
  findings,
  unlocked = true,
  activeCategory,
}: {
  findings: FindingDto[];
  unlocked?: boolean;
  activeCategory?: FindingCategory | null;
}) {
  const [category, setCategory] = useState<FindingCategory | "all">(
    activeCategory ?? "all"
  );
  const [severity, setSeverity] = useState<FindingSeverity | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return [...findings]
      .filter((f) => category === "all" || f.category === category)
      .filter((f) => severity === "all" || f.severity === severity)
      .sort((a, b) => b.priorityScore - a.priorityScore);
  }, [findings, category, severity]);

  if (!findings.length) {
    return (
      <p className="font-mono text-xs text-[var(--fg-tertiary)]">
        No findings recorded.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={category === "all"}
          onClick={() => setCategory("all")}
          label="All categories"
        />
        {CATEGORIES.filter((c) => findings.some((f) => f.category === c)).map(
          (c) => (
            <FilterChip
              key={c}
              active={category === c}
              onClick={() => setCategory(c)}
              label={c.replace("_", " ")}
            />
          )
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={severity === "all"}
          onClick={() => setSeverity("all")}
          label="All severities"
        />
        {SEVERITIES.filter((s) => findings.some((f) => f.severity === s)).map(
          (s) => (
            <FilterChip
              key={s}
              active={severity === s}
              onClick={() => setSeverity(s)}
              label={s}
            />
          )
        )}
      </div>

      <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-tertiary)]">
        Showing {filtered.length} of {findings.length} findings
      </p>

      <ul className="space-y-2">
        {filtered.map((f) => {
          const isOpen = expanded === f.id;
          return (
            <li
              key={f.id}
              className="tw-panel min-w-0 overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : f.id)}
                className="flex w-full items-start gap-3 p-4 text-left hover:bg-[var(--bg-muted)]/40"
              >
                <span className="tw-metric shrink-0 font-mono text-sm text-[var(--brand)]">
                  {f.priorityScore}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge severity={f.severity}>{f.severity}</Badge>
                    <span className="font-mono text-[10px] uppercase text-[var(--fg-tertiary)]">
                      {f.category}
                    </span>
                  </div>
                  <p className="tw-contain-text mt-1 font-medium text-[var(--fg-primary)]">
                    {f.title}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 font-mono text-xs text-[var(--fg-tertiary)] transition-transform",
                    isOpen && "rotate-180"
                  )}
                  aria-hidden
                >
                  ▼
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-[var(--border)] px-4 pb-4 pt-3">
                  <p className="text-sm leading-relaxed text-[var(--fg-secondary)]">
                    {f.description}
                  </p>
                  <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-muted)] p-3">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-tertiary)]">
                      Business impact
                    </p>
                    <p className="mt-1 text-sm text-[var(--fg-primary)]">
                      {f.businessImpact}
                    </p>
                  </div>
                  {unlocked && f.recommendation && (
                    <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--brand)]/20 bg-[var(--brand)]/5 p-3">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--brand)]">
                        Recommended fix
                      </p>
                      <p className="mt-1 text-sm text-[var(--fg-primary)]">
                        {f.recommendation}
                      </p>
                    </div>
                  )}
                  {unlocked && f.evidence && (
                    <details className="mt-3">
                      <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-wider text-[var(--fg-tertiary)]">
                        Technical evidence
                      </summary>
                      <pre className="mt-2 max-h-48 overflow-auto rounded-[var(--radius-md)] bg-[var(--bg-void)] p-3 font-mono text-[10px] text-[var(--fg-secondary)]">
                        {JSON.stringify(f.evidence, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
        active
          ? "border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)]"
          : "border-[var(--border)] text-[var(--fg-tertiary)] hover:text-[var(--fg-primary)]"
      )}
    >
      {label}
    </button>
  );
}
