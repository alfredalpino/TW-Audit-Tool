"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AuditRunError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[audit run page]", error);
  }, [error]);

  return (
    <div className="tw-panel mx-auto max-w-lg p-6 text-center md:p-8">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-tertiary)]">
        Audit results
      </p>
      <h1 className="mt-3 font-display text-xl font-bold tracking-tight">
        Could not load this audit
      </h1>
      <p className="mt-2 text-sm text-[var(--fg-secondary)]">
        The audit may still be processing, or a temporary server issue occurred.
        Try again in a moment.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => reset()}
          className="tw-btn tw-btn-primary px-5 py-2.5 text-sm font-semibold"
        >
          Try again
        </button>
        <Link
          href="/"
          className="tw-btn tw-btn-secondary px-5 py-2.5 text-sm font-semibold"
        >
          Start new audit
        </Link>
      </div>
    </div>
  );
}
