"use client";

import { useEffect, useState } from "react";
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
}: {
  runId: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (status === "completed" || status === "failed") return;

    const poll = async () => {
      const res = await fetch(`/api/audits/${runId}`);
      if (!res.ok) return;
      const data: AuditRunResponse = await res.json();
      setStatus(data.status);
      if (data.stage && data.stage in STAGE_STEPS) {
        setStepIndex(STAGE_STEPS[data.stage] ?? 0);
      } else if (data.enginesCompleted?.length) {
        setStepIndex(
          Math.min(3 + Math.floor(data.enginesCompleted.length / 2), 5)
        );
      }
      if (data.status === "completed") {
        window.location.reload();
      }
    };

    const interval = setInterval(poll, 1500);
    const stepTimer = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 800);

    return () => {
      clearInterval(interval);
      clearInterval(stepTimer);
    };
  }, [runId, status]);

  if (status === "completed") return null;

  return (
    <div className="tw-panel min-w-0 p-5 sm:p-6">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--brand)]">
        Audit in progress
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
