import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

export type AdminContext = { userId: string; role: string };

/**
 * Wraps an admin API handler: runs requireAdmin() once and returns 401 if not authenticated.
 * Passes (request, admin) to the handler so route logic only runs when authenticated.
 */
export async function withAdmin(
  request: Request,
  handler: (request: Request, admin: AdminContext) => Promise<Response>
): Promise<Response> {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return handler(request, admin);
}
