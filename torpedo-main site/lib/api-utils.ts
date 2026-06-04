import { NextResponse } from 'next/server';

const DEFAULT_MESSAGE = 'Invalid request body.';

/**
 * Parse JSON body from a Request. Returns [parsed, null] or [null, 400 Response].
 * Use in API routes to standardize body parsing and 400 responses.
 */
export async function parseJsonBody<T = unknown>(
  request: Request,
  errorMessage = DEFAULT_MESSAGE
): Promise<[T, null] | [null, NextResponse]> {
  try {
    const body = (await request.json()) as T;
    return [body, null];
  } catch {
    return [null, NextResponse.json({ error: errorMessage }, { status: 400 })];
  }
}
