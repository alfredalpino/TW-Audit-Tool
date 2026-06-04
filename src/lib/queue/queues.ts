/** BullMQ disallows `:` in queue names — use kebab-case. */
export const QUEUE_NAMES = {
  AUDIT_RUN: "audit-run",
  SCREENSHOT_CAPTURE: "screenshot-capture",
  REPORT_GENERATE: "report-generate",
  EMAIL_SEND: "email-send",
} as const;

export type AuditRunJobPayload = {
  runId: string;
};

export type ScreenshotJobPayload = {
  runId: string;
};

export type ReportJobPayload = {
  runId: string;
};

export type EmailJobPayload = {
  runId: string;
  leadId?: string;
};
