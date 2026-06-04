import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/api-admin';
import { createServiceClient } from '@/lib/supabase/service';

function isMissingColumnError(err: { message?: string; code?: string } | null): boolean {
  if (!err) return false;
  const msg = String(err.message ?? '');
  const code = String((err as { code?: string }).code ?? '');
  return code === '42703' || msg.includes('deleted_at') || msg.includes('column');
}

export async function GET(request: Request) {
  return withAdmin(request, async (req) => {
  const { searchParams } = new URL(req.url);
  const deleted = searchParams.get('deleted') === 'true';

  const supabase = createServiceClient();

  const selectCols = 'id, name, email, phone, status, created_at, deleted_at';
  let query = supabase.from('leads').select(selectCols).order('created_at', { ascending: false });
  if (deleted) {
    query = query.not('deleted_at', 'is', null);
  } else {
    query = query.is('deleted_at', null);
  }
  let { data: leads, error } = await query;

  if (error && isMissingColumnError(error)) {
    const fallbackCols = 'id, name, email, phone, status, created_at';
    const fallback = await supabase.from('leads').select(fallbackCols).order('created_at', { ascending: false });
    leads = (fallback.data ?? []).map((l) => ({ ...l, deleted_at: null })) as typeof leads;
    error = fallback.error;
  }

  if (error) {
    console.error('admin leads:', error.message ?? error);
    return NextResponse.json({ error: 'Failed to load leads' }, { status: 500 });
  }

  const convMap = new Map<string, string>();
  if (leads?.length) {
    let convRes = await supabase
      .from('conversations')
      .select('id, lead_id')
      .is('deleted_at', null)
      .in('lead_id', leads.map((l) => l.id));
    if (convRes.error && isMissingColumnError(convRes.error)) {
      convRes = await supabase
        .from('conversations')
        .select('id, lead_id')
        .in('lead_id', leads.map((l) => l.id));
    }
    convRes.data?.forEach((c) => convMap.set(c.lead_id, c.id));
  }

  const list = (leads ?? []).map((l) => ({
    ...l,
    conversationId: convMap.get(l.id) ?? null,
  }));

  return NextResponse.json({ leads: list });
  });
}
