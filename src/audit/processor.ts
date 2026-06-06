import { eq } from "drizzle-orm";
import type { Db } from "@/lib/db";
import {
  auditRuns,
  auditScores,
  findings,
  reports,
} from "@/lib/db/schema";
import type { AuditRunSummary } from "@/lib/db/schema";
import {
  createBrowserSession,
  closeBrowserSession,
} from "@/audit/context/browser";
import { runAuditEngines } from "@/audit/orchestrator";
import {
  createFetchSession,
  runFetchAuditEngines,
} from "@/audit/fetch-orchestrator";
import {
  captureDesktopScreenshot,
  persistScreenshotRecord,
} from "@/audit/screenshot";
import type { AuditStage } from "@/audit/types";
import { SCORE_CATEGORIES } from "@/audit/constants";
import { computeFindingPriority } from "@/audit/scoring";
import { computeOverallScore } from "@/lib/scoring/weights";
import {
  buildExecutiveSummary,
  buildImpactSummary,
  normalizeFindingBusinessImpact,
} from "@/lib/scoring/impact-summary";
import type { FindingCategory } from "@/types/audit";
import type { AuditFindingInput, EngineResult } from "@/audit/types";
import { processMockAuditRun } from "@/lib/audit/mock-processor";

function useMockEngines(): boolean {
  return process.env.AUDIT_USE_MOCK === "true";
}

/** Fetch + cheerio heuristics — no Playwright/Lighthouse (Vercel serverless safe). */
function useFetchEngines(): boolean {
  if (process.env.AUDIT_USE_FETCH === "true") return true;
  if (process.env.VERCEL === "1") return true;
  return false;
}

async function updateRunProgress(
  db: Db,
  runId: string,
  stage: AuditStage,
  enginesCompleted: string[],
  partial?: Partial<AuditRunSummary>
): Promise<void> {
  const [existing] = await db
    .select({ summary: auditRuns.summary })
    .from(auditRuns)
    .where(eq(auditRuns.id, runId))
    .limit(1);

  const prev = (existing?.summary ?? {}) as AuditRunSummary;
  await db
    .update(auditRuns)
    .set({
      status: stage === "failed" ? "failed" : "running",
      summary: {
        ...prev,
        ...partial,
        stage,
        enginesCompleted,
        mock: false,
      },
    })
    .where(eq(auditRuns.id, runId));
}

async function persistAuditResults(
  db: Db,
  runId: string,
  url: string,
  results: EngineResult[],
  allFindings: AuditFindingInput[],
  enginesCompleted: string[],
  runtime: "browser" | "fetch"
): Promise<void> {
  const categoryScores: Partial<Record<FindingCategory, number>> = {};
  for (const r of results) {
    categoryScores[r.category] = r.score;
  }
  for (const cat of SCORE_CATEGORIES) {
    if (categoryScores[cat] === undefined) {
      categoryScores[cat] = 100;
    }
  }

  const overall = computeOverallScore(categoryScores);
  const impact = buildImpactSummary(categoryScores, allFindings);
  const executiveSummary = buildExecutiveSummary(overall, allFindings, url);

  await db.delete(findings).where(eq(findings.auditRunId, runId));
  await db.delete(auditScores).where(eq(auditScores.auditRunId, runId));

  if (allFindings.length) {
    await db.insert(findings).values(
      allFindings.map((f) => ({
        auditRunId: runId,
        category: f.category,
        severity: f.severity,
        title: f.title,
        description: f.description,
        recommendation: f.recommendation ?? null,
        businessImpact: normalizeFindingBusinessImpact(f.businessImpact),
        evidence: f.evidence ?? {},
        priorityScore: computeFindingPriority(f.severity, f.category),
      }))
    );
  }

  await db.insert(auditScores).values(
    SCORE_CATEGORIES.map((category) => ({
      auditRunId: runId,
      category,
      score: categoryScores[category] ?? 100,
      breakdown: {
        source: runtime === "fetch" ? "fetch-heuristics" : "phase2-engines",
        engine: results.find((r) => r.category === category)?.breakdown,
      },
    }))
  );

  const summary: AuditRunSummary = {
    mock: false,
    stage: "complete",
    enginesCompleted,
    executiveSummary,
    impact,
    runtime,
  };

  await db
    .update(auditRuns)
    .set({
      status: "completed",
      overallScore: overall,
      summary,
      completedAt: new Date(),
    })
    .where(eq(auditRuns.id, runId));

  await db.insert(reports).values({
    auditRunId: runId,
    status: "pending",
  });
}

async function processFetchAuditRun(db: Db, runId: string): Promise<void> {
  const run = await db.query.auditRuns.findFirst({
    where: eq(auditRuns.id, runId),
    with: { audit: true },
  });

  if (!run?.audit) {
    throw new Error(`Audit run ${runId} not found`);
  }

  const url = run.audit.url;
  const enginesCompleted: string[] = [];

  await db
    .update(auditRuns)
    .set({ status: "running", startedAt: new Date() })
    .where(eq(auditRuns.id, runId));

  try {
    await updateRunProgress(db, runId, "crawling", []);

    const session = await createFetchSession(
      url,
      run.audit.normalizedUrl,
      runId,
      run.config ?? {}
    );

    await updateRunProgress(db, runId, "analyzing", []);

    const { results, allFindings } = await runFetchAuditEngines(
      session,
      async (engineId) => {
        enginesCompleted.push(engineId);
        await updateRunProgress(db, runId, "analyzing", [...enginesCompleted]);
      }
    );

    await updateRunProgress(db, runId, "scoring", enginesCompleted);
    await persistAuditResults(
      db,
      runId,
      url,
      results,
      allFindings,
      enginesCompleted,
      "fetch"
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Audit failed";
    await db
      .update(auditRuns)
      .set({
        status: "failed",
        errorMessage: message,
        summary: {
          stage: "failed",
          enginesCompleted,
          mock: false,
          runtime: "fetch",
        },
        completedAt: new Date(),
      })
      .where(eq(auditRuns.id, runId));
    throw e;
  }
}

async function processBrowserAuditRun(db: Db, runId: string): Promise<void> {
  const run = await db.query.auditRuns.findFirst({
    where: eq(auditRuns.id, runId),
    with: { audit: true },
  });

  if (!run?.audit) {
    throw new Error(`Audit run ${runId} not found`);
  }

  const url = run.audit.url;
  const enginesCompleted: string[] = [];

  await db
    .update(auditRuns)
    .set({ status: "running", startedAt: new Date() })
    .where(eq(auditRuns.id, runId));

  let session: Awaited<ReturnType<typeof createBrowserSession>> | null = null;

  try {
    await updateRunProgress(db, runId, "crawling", []);

    session = await createBrowserSession(
      url,
      run.audit.normalizedUrl,
      runId,
      run.config ?? {}
    );

    try {
      const storageKey = await captureDesktopScreenshot(runId, session.page);
      await persistScreenshotRecord(db, runId, storageKey);
    } catch (e) {
      console.warn("[audit] screenshot capture failed", e);
    }

    await updateRunProgress(db, runId, "analyzing", []);

    const { results, allFindings } = await runAuditEngines(
      session.ctx,
      async (engineId) => {
        enginesCompleted.push(engineId);
        await updateRunProgress(db, runId, "analyzing", [...enginesCompleted]);
      }
    );

    await updateRunProgress(db, runId, "scoring", enginesCompleted);
    await persistAuditResults(
      db,
      runId,
      url,
      results,
      allFindings,
      enginesCompleted,
      "browser"
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Audit failed";
    await db
      .update(auditRuns)
      .set({
        status: "failed",
        errorMessage: message,
        summary: {
          stage: "failed",
          enginesCompleted,
          mock: false,
          runtime: "browser",
        },
        completedAt: new Date(),
      })
      .where(eq(auditRuns.id, runId));
    throw e;
  } finally {
    if (session) await closeBrowserSession(session);
  }
}

/** Production audit pipeline — browser (worker) or fetch heuristics (Vercel). */
export async function processAuditRun(db: Db, runId: string): Promise<void> {
  if (useMockEngines()) {
    await processMockAuditRun(db, runId);
    return;
  }

  if (useFetchEngines()) {
    await processFetchAuditRun(db, runId);
    return;
  }

  await processBrowserAuditRun(db, runId);
}
