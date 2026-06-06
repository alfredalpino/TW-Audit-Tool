import { createHash, timingSafeEqual } from "crypto";
import { getAuditApiKeys } from "@/lib/env";

export type ApiKeyAuth =
  | { valid: false; reason?: "missing" | "invalid" | "not_configured" }
  | { valid: true; keyId: string };

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function hashApiKeyId(key: string): string {
  return createHash("sha256").update(key).digest("hex").slice(0, 12);
}

/** Validates optional X-API-Key against AUDIT_API_KEYS (comma-separated). */
export function validateAuditApiKey(headerValue: string | null): ApiKeyAuth {
  if (!headerValue?.trim()) {
    return { valid: false, reason: "missing" };
  }

  const configured = getAuditApiKeys();
  if (configured.length === 0) {
    return { valid: false, reason: "not_configured" };
  }

  const provided = headerValue.trim();
  const match = configured.find((key) => safeCompare(key, provided));
  if (!match) {
    return { valid: false, reason: "invalid" };
  }

  return { valid: true, keyId: hashApiKeyId(match) };
}
