import { notFound } from "next/navigation";
import { getAuditRun } from "@/features/audit/get-audit-run";
import { ScoreRing } from "@/components/audit/ScoreRing";
import { CategoryScoreGrid } from "@/components/audit/CategoryScoreGrid";
import { ImpactSummary } from "@/components/audit/ImpactSummary";
import { FindingsTable } from "@/components/audit/FindingsTable";
import { AuditProgress } from "@/components/audit/AuditProgress";
import { ExecutiveSummary } from "@/components/audit/ExecutiveSummary";
import { PriorityMatrix } from "@/components/audit/PriorityMatrix";
import { LeadCaptureForm } from "@/components/audit/LeadCaptureForm";
import { ReportActions } from "@/components/audit/ReportActions";

type PageProps = { params: Promise<{ runId: string }> };

export default async function AuditRunPage({ params }: PageProps) {
  const { runId } = await params;
  const run = await getAuditRun(runId);
  if (!run) notFound();

  const inProgress = run.status !== "completed" && run.status !== "failed";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-tertiary)]">
            Audit run · {run.status}
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight break-all">
            {run.url}
          </h1>
          <p className="mt-2 font-mono text-xs text-[var(--fg-tertiary)]">
            Run ID {run.id}
          </p>
        </div>
        <ScoreRing score={run.overallScore} />
      </div>

      {inProgress && (
        <AuditProgress runId={runId} initialStatus={run.status} />
      )}

      {run.status === "completed" && (
        <>
          <ExecutiveSummary
            summary={run.executiveSummary}
            overallScore={run.overallScore}
          />
          <section className="tw-panel p-5 md:p-6">
            <h2 className="font-display text-lg font-bold">Export & delivery</h2>
            <p className="mt-1 text-sm text-[var(--fg-secondary)]">
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
        </>
      )}

      {!run.unlocked && run.status === "completed" && (
        <section className="tw-panel p-5 md:p-6">
          <h2 className="font-display text-lg font-bold">
            Unlock full recommendations
          </h2>
          <p className="mt-1 text-sm text-[var(--fg-secondary)]">
            Top-priority issues are visible above. Enter your email for detailed
            fix steps and business impact on all findings.
          </p>
          <div className="mt-4 max-w-md">
            <LeadCaptureForm runId={runId} />
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 font-display text-lg font-bold">Category scores</h2>
        <CategoryScoreGrid scores={run.scores} />
      </section>

      {run.status === "completed" && (
        <>
          <ImpactSummary impact={run.impact} />
          <PriorityMatrix findings={run.findings} />
          <section>
            <h2 className="mb-4 font-display text-lg font-bold">
              Priority findings
            </h2>
            <FindingsTable findings={run.findings} unlocked={run.unlocked} />
          </section>
        </>
      )}
    </div>
  );
}
