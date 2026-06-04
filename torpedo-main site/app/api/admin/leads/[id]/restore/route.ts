import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/api-admin';
import { createServiceClient } from '@/lib/supabase/service';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isValidLeadId(id: string): boolean {
  return typeof id === 'string' && UUID_REGEX.test(id.trim());
}

/** POST: restore soft-deleted lead */
export async function POST(
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
    .update({ deleted_at: null })
    .eq('id', id);

  if (error) {
    console.error('admin lead restore:', error);
    return NextResponse.json({ error: 'Failed to restore lead' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
  });
}
