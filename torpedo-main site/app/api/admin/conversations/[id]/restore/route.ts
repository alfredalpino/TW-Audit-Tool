import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/api-admin';
import { createServiceClient } from '@/lib/supabase/service';
import { isValidConversationId } from '@/lib/chat-typing-store';

/** POST: restore soft-deleted conversation */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAdmin(_request, async () => {
  const { id } = await params;
  if (!id || !isValidConversationId(id)) {
    return NextResponse.json({ error: 'Invalid conversation ID' }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from('conversations')
    .update({ deleted_at: null })
    .eq('id', id);

  if (error) {
    console.error('admin conversation restore:', error);
    return NextResponse.json({ error: 'Failed to restore conversation' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
  });
}
