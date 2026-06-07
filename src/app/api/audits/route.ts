import { NextResponse } from "next/server";
import { createAuditSchema } from "@/lib/validations/audit";
import { createAuditRun } from "@/features/audit/create-audit-run";
import { getDb } from "@/lib/db";
import {
  checkApiKeyAuditRateLimit,
  checkDomainAuditRateLimit,
  checkPublicAuditRateLimit,
  getClientIp,
  rateLimitHeaders,
} from "@/lib/rate-limit";
import { validateAuditApiKey } from "@/lib/auth/api-key";
import { normalizeAuditUrl } from "@/lib/url";
import { createLogger } from "@/lib/logger";
export const maxDuration = 60;

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const log = createLogger({ requestId, component: "api.audits" });

  const apiKeyHeader = request.headers.get("x-api-key");
  const apiKeyAuth = validateAuditApiKey(apiKeyHeader);

  if (apiKeyHeader?.trim() && !apiKeyAuth.valid) {
    log.warn("api key rejected", {
      reason: apiKeyAuth.reason ?? "invalid",
    });
    const message =
      apiKeyAuth.reason === "not_configured"
        ? "API key authentication is not configured"
        : "Invalid API key";
    return NextResponse.json({ error: message }, { status: 401 });
  }

  const ip = getClientIp(request);
  const rate = apiKeyAuth.valid
    ? await checkApiKeyAuditRateLimit(apiKeyAuth.keyId)
    : await checkPublicAuditRateLimit(ip);

  if (!rate.allowed) {
    log.warn("rate limit exceeded", {
      ip,
      apiKey: apiKeyAuth.valid ? apiKeyAuth.keyId : undefined,
    });
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      {
        status: 429,
        headers: rateLimitHeaders(rate),
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

  if (!apiKeyAuth.valid) {
    const domainKey = normalizeAuditUrl(parsed.data.url);
    const domainRate = await checkDomainAuditRateLimit(domainKey);
    if (!domainRate.allowed) {
      log.warn("domain rate limit exceeded", { normalized: domainKey, ip });
      return NextResponse.json(
        { error: "This domain was audited recently. Please try again later." },
        { status: 429, headers: rateLimitHeaders(domainRate) }
      );
    }
  }

  let result;
  try {
    result = await createAuditRun(parsed.data, {
      trigger: apiKeyAuth.valid ? "api" : "public",
      skipCache: true,
    });
  } catch (error) {
    log.error("audit creation threw", {
      ip,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "Could not start audit. Please try again." },
      { status: 503 }
    );
  }

  if (!result.ok) {
    log.warn("audit creation failed", { error: result.error, ip });
    const status = result.code === "database" ? 503 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  const runLog = log.child({ runId: result.runId });
  runLog.info("audit run accepted", {
    auditId: result.auditId,
    status: result.status,
    cached: result.cached ?? false,
    auth: apiKeyAuth.valid ? "api_key" : "public",
  });

  return NextResponse.json(
    {
      auditId: result.auditId,
      runId: result.runId,
      status: result.status,
      pollUrl: result.pollUrl,
      ...(result.cached ? { cached: true } : {}),
    },
    { status: 201, headers: rateLimitHeaders(rate) }
  );
}
