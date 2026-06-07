"use client";

import { useState } from "react";
import type { AuditRunResponse } from "@/types/audit";
import { ExecutiveSummary } from "@/components/audit/ExecutiveSummary";
import { ImpactSummary } from "@/components/audit/ImpactSummary";
import { PriorityMatrix } from "@/components/audit/PriorityMatrix";
import { ReportActions } from "@/components/audit/ReportActions";
import { LeadCaptureForm } from "@/components/audit/LeadCaptureForm";
import { ScreenshotGallery } from "@/components/audit/ScreenshotGallery";
import { AuditMetaStrip } from "@/components/audit/AuditMetaStrip";
import { CategoryBreakdown } from "@/components/audit/CategoryBreakdown";
import { InteractiveFindings } from "@/components/audit/InteractiveFindings";
import { AuditMethodologyPanel } from "@/components/audit/AuditMethodology";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "previews", label: "Site previews" },
  { id: "categories", label: "Categories" },
  { id: "findings", label: "Findings" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AuditReportExperience({
  run,
  runId,
}: {
  run: AuditRunResponse;
  runId: string;
}) {
  const [tab, setTab] = useState<TabId>("overview");

  return (
    <div className="space-y-6">
      <AuditMetaStrip run={run} />

      <nav
        className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-3"
        aria-label="Report sections"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-[var(--radius-md)] px-4 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors",
              tab === t.id
                ? "bg-[var(--brand)] text-white"
                : "text-[var(--fg-tertiary)] hover:bg-[var(--bg-muted)] hover:text-[var(--fg-primary)]"
            )}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <div className="space-y-8">
          {run.methodology && <AuditMethodologyPanel methodology={run.methodology} />}
          <ExecutiveSummary
            summary={run.executiveSummary}
            overallScore={run.overallScore}
          />
          <ImpactSummary impact={run.impact} />
          <PriorityMatrix findings={run.findings} />
          <section className="tw-panel min-w-0 p-5 md:p-6">
            <h2 className="font-display text-lg font-bold">Export & delivery</h2>
            <p className="tw-contain-text mt-1 text-sm text-[var(--fg-secondary)]">
              Business impact in exports uses ranges only — never fake precision.
            </p>
            <div className="mt-4">
              <ReportActions
                runId={runId}
                unlocked={run.unlocked}
                completed={run.status === "completed"}
              />
            </div>
          </section>
          {!run.unlocked && (
            <section className="tw-panel relative min-w-0 overflow-hidden border border-[var(--brand)]/40 bg-[var(--brand)]/10 p-5 shadow-[inset_0_1px_0_rgba(255,78,0,0.12),0_10px_28px_rgba(255,78,0,0.1)] md:p-6">
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-[var(--brand)]"
                aria-hidden
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--brand)]">
                [ Unlock full report ]
              </p>
              <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-[var(--fg-primary)]">
                Unlock full recommendations
              </h2>
              <p className="tw-contain-text mt-2 max-w-2xl text-sm leading-relaxed text-[var(--fg-secondary)]">
                Top-priority issues are visible in Findings. Enter your email for
                detailed fix steps and business impact on all findings.
              </p>
              <div className="mt-5 max-w-md rounded-[var(--radius-md)] border border-[var(--brand)]/25 bg-[var(--bg-surface)]/80 p-4">
                <LeadCaptureForm runId={runId} />
              </div>
            </section>
          )}
        </div>
      )}

      {tab === "previews" && (
        <ScreenshotGallery screenshots={run.screenshots ?? []} url={run.url} />
      )}

      {tab === "categories" && (
        <section>
          <h2 className="mb-4 font-display text-lg font-bold">
            Category breakdown
          </h2>
          <p className="mb-4 text-sm text-[var(--fg-tertiary)]">
            Click a category to inspect its score, signals, and related issues.
          </p>
          <CategoryBreakdown scores={run.scores} findings={run.findings} />
        </section>
      )}

      {tab === "findings" && (
        <section>
          <h2 className="mb-2 font-display text-lg font-bold">
            Interactive findings
          </h2>
          <p className="mb-4 text-sm text-[var(--fg-tertiary)]">
            Filter by category or severity. Expand any row for impact, fixes, and
            technical evidence.
          </p>
          <InteractiveFindings
            findings={run.findings}
            unlocked={run.unlocked}
          />
        </section>
      )}
    </div>
  );
}
