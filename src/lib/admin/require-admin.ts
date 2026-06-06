import { NextResponse } from "next/server";
import { getAdminSecret } from "@/lib/env";

function extractSecret(request: Request): string | undefined {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    return auth.slice(7).trim();
  }
  const header = request.headers.get("x-admin-secret");
  if (header) return header.trim();

  try {
    const key = new URL(request.url).searchParams.get("key");
    if (key) return key.trim();
  } catch {
    /* ignore invalid URL */
  }

  return undefined;
}

export function isAdminAuthorized(request: Request): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;
  const provided = extractSecret(request);
  return provided === secret;
}

export function adminUnauthorizedResponse(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function verifyAdminKey(key: string | undefined): boolean {
  const secret = getAdminSecret();
  if (!secret || !key) return false;
  return key === secret;
}
