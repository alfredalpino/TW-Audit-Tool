import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BOOKING_URL } from "@/lib/constants";

export function ReportActions({
  runId,
  unlocked,
  completed,
}: {
  runId: string;
  unlocked: boolean;
  completed: boolean;
}) {
  if (!completed) return null;

  if (!unlocked) {
    return (
      <p className="text-sm text-[var(--fg-tertiary)]">
        PDF export unlocks with your email below.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button href={`/api/audits/${runId}/report`} variant="brand">
        Download PDF report
      </Button>
      <p className="text-xs text-[var(--fg-tertiary)]">
        A copy is emailed when Resend is configured.{" "}
        <Link
          href={BOOKING_URL}
          className="text-[var(--accent-blue)] underline-offset-2 hover:underline"
        >
          Book a strategy call
        </Link>
      </p>
    </div>
  );
}
