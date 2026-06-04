import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/api-admin';
import { createServiceClient } from '@/lib/supabase/service';
import { isValidConversationId } from '@/lib/chat-typing-store';

/** DELETE: soft delete conversation */
export async function DELETE(
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
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('admin conversation delete:', error);
    const hint =
      error.code === '42703' || error.message?.includes('deleted_at')
        ? ' Ensure the soft-delete migration has been applied (supabase/migrations/20250306100000_soft_delete_leads_conversations.sql).'
        : '';
    return NextResponse.json(
      {
        error: 'Failed to delete conversation',
        ...(hint && { hint }),
      },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
  });
}
