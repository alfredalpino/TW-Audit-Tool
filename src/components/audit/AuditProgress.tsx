"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AuditRunResponse } from "@/types/audit";

const STAGE_STEPS: Record<string, number> = {
  queued: 0,
  crawling: 1,
  analyzing: 3,
  scoring: 5,
  complete: 6,
};

const STEPS = [
  "Queued",
  "Fetching site",
  "SEO & metadata",
  "Performance & accessibility",
  "CRO & UX",
  "Scoring & impact",
  "Complete",
];

export function AuditProgress({
  runId,
  initialStatus,
  initialErrorMessage,
}: {
  runId: string;
  initialStatus: string;
  initialErrorMessage?: string | null;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [stepIndex, setStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    initialErrorMessage ?? null
  );

  useEffect(() => {
    if (status === "completed" || status === "failed") return;

    const poll = async () => {
      const res = await fetch(`/api/audits/${runId}`);
      if (!res.ok) return;
      const data: AuditRunResponse & { errorMessage?: string } =
        await res.json();
      setStatus(data.status);
      if (data.stage && data.stage in STAGE_STEPS) {
        setStepIndex(STAGE_STEPS[data.stage] ?? 0);
      } else if (data.enginesCompleted?.length) {
        setStepIndex(
          Math.min(3 + Math.floor(data.enginesCompleted.length / 2), 5)
        );
      } else if (data.status === "running") {
        setStepIndex((i) => Math.min(i + 1, 4));
      }
      if (data.status === "completed") {
        window.location.reload();
      }
      if (data.status === "failed") {
        setErrorMessage(
          (data as { errorMessage?: string }).errorMessage ??
            "The audit could not finish. Please try again."
        );
      }
    };

    void poll();
    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [runId, status]);

  if (status === "completed") return null;

  if (status === "failed") {
    return (
      <div className="tw-panel min-w-0 border border-red-400/30 bg-red-400/5 p-5 sm:p-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-red-400">
          Audit failed
        </p>
        <p className="mt-2 text-sm text-[var(--fg-secondary)]">
          {errorMessage ?? "Something went wrong while analyzing this site."}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="tw-btn tw-btn-primary px-4 py-2 text-sm"
          >
            Try again
          </button>
          <Link href="/" className="tw-btn tw-btn-secondary px-4 py-2 text-sm">
            Start new audit
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="tw-panel min-w-0 p-5 sm:p-6">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--brand)]">
        Audit in progress
      </p>
      <p className="mt-1 text-xs text-[var(--fg-tertiary)]">
        Status: {status} — usually completes in 20–45 seconds
      </p>
      <ul className="mt-4 space-y-2">
        {STEPS.map((step, i) => (
          <li
            key={step}
            className={`flex items-center gap-3 text-sm ${
              i <= stepIndex
                ? "text-[var(--fg-primary)]"
                : "text-[var(--fg-tertiary)]"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                i <= stepIndex ? "bg-[var(--brand)]" : "bg-[var(--bg-ghost)]"
              }`}
            />
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}
