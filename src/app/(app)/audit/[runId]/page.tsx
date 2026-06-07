import { notFound } from "next/navigation";
import { getAuditRun } from "@/features/audit/get-audit-run";
import { ScoreRing } from "@/components/audit/ScoreRing";
import { CategoryScoreGrid } from "@/components/audit/CategoryScoreGrid";
import { AuditProgress } from "@/components/audit/AuditProgress";
import { AuditReportExperience } from "@/components/audit/AuditReportExperience";

type PageProps = { params: Promise<{ runId: string }> };

export default async function AuditRunPage({ params }: PageProps) {
  const { runId } = await params;
  const run = await getAuditRun(runId);
  if (!run) notFound();

  const inProgress = run.status !== "completed" && run.status !== "failed";

  return (
    <div className="min-w-0 space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-tertiary)]">
            Audit run · {run.status}
          </p>
          <h1 className="tw-contain-text mt-2 font-display text-xl font-bold tracking-tight sm:text-2xl">
            {run.url}
          </h1>
          <p className="tw-mono-block mt-2 font-mono text-xs text-[var(--fg-tertiary)]">
            Run ID {run.id}
          </p>
        </div>
        <ScoreRing score={run.overallScore} className="shrink-0 self-center md:self-start" />
      </div>

      {inProgress && (
        <AuditProgress runId={runId} initialStatus={run.status} />
      )}

      {run.status === "completed" ? (
        <AuditReportExperience run={run} runId={runId} />
      ) : (
        <section>
          <h2 className="mb-4 font-display text-lg font-bold">Category scores</h2>
          <CategoryScoreGrid scores={run.scores} />
        </section>
      )}
    </div>
  );
}
