import { NextResponse } from "next/server";
import { createAuditSchema } from "@/lib/validations/audit";
import { createAuditRun } from "@/features/audit/create-audit-run";
import { checkAuditRateLimit, getClientIp } from "@/lib/rate-limit";
import { normalizeAuditUrl } from "@/lib/url";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = await checkAuditRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(rate.resetAt),
        },
      }
    );
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createAuditSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const domainKey = normalizeAuditUrl(parsed.data.url);
  const domainRate = await checkAuditRateLimit(`domain:${domainKey}`, 5);
  if (!domainRate.allowed) {
    return NextResponse.json(
      { error: "This domain was audited recently. Please try again later." },
      { status: 429 }
    );
  }

  const result = await createAuditRun(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(
    {
      auditId: result.auditId,
      runId: result.runId,
      status: result.status,
      pollUrl: result.pollUrl,
    },
    { status: 201 }
  );
}
