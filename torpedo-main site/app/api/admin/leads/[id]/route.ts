import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/api-admin';
import { createServiceClient } from '@/lib/supabase/service';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isValidLeadId(id: string): boolean {
  return typeof id === 'string' && UUID_REGEX.test(id.trim());
}

/** PATCH: update lead (name, email, phone, status) */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAdmin(request, async (_req) => {
  const { id } = await params;
  if (!id || !isValidLeadId(id)) {
    return NextResponse.json({ error: 'Invalid lead ID' }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const updates: { name?: string; email?: string; phone?: string | null; status?: string } = {};
  if (typeof (body as { name?: unknown }).name === 'string') {
    updates.name = (body as { name: string }).name.trim().slice(0, 200);
  }
  if (typeof (body as { email?: unknown }).email === 'string') {
    updates.email = (body as { email: string }).email.trim().toLowerCase().slice(0, 255);
  }
  if ((body as { phone?: unknown }).phone !== undefined) {
    const p = (body as { phone?: string }).phone;
    updates.phone = typeof p === 'string' && p.trim() ? p.trim().slice(0, 50) : null;
  }
  if (typeof (body as { status?: unknown }).status === 'string') {
    const s = (body as { status: string }).status;
    if (['new', 'ai_chatting', 'agent_joined', 'closed'].includes(s)) {
      updates.status = s;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select('id, name, email, phone, status, created_at')
    .single();

  if (error) {
    console.error('admin lead update:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }
  return NextResponse.json(data);
  });
}

/** DELETE: soft delete lead */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAdmin(_request, async () => {
  const { id } = await params;
  if (!id || !isValidLeadId(id)) {
    return NextResponse.json({ error: 'Invalid lead ID' }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from('leads')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('admin lead delete:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
  });
}
