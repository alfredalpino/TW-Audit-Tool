import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/api-admin';
import { createServiceClient } from '@/lib/supabase/service';
import { isValidConversationId } from '@/lib/chat-typing-store';

const BULK_CHUNK_SIZE = 50;

/** POST: soft-delete multiple conversations by id. Body: { ids: string[] } */
export async function POST(request: Request) {
  return withAdmin(request, async (req) => {
    let body: { ids?: string[] };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const raw = body.ids;
    if (!Array.isArray(raw) || raw.length === 0) {
      return NextResponse.json({ error: 'ids must be a non-empty array' }, { status: 400 });
    }

    const ids = raw
      .filter((id): id is string => typeof id === 'string')
      .map((id) => id.trim())
      .filter((id) => isValidConversationId(id));

    if (ids.length === 0) {
      return NextResponse.json({ error: 'No valid conversation IDs' }, { status: 400 });
    }

    const supabase = createServiceClient();
    const deletedAt = new Date().toISOString();

    for (let i = 0; i < ids.length; i += BULK_CHUNK_SIZE) {
      const chunk = ids.slice(i, i + BULK_CHUNK_SIZE);
      const { error } = await supabase
        .from('conversations')
        .update({ deleted_at: deletedAt })
        .in('id', chunk);

      if (error) {
        console.error('admin conversations bulk delete:', error);
        const hint =
          error.code === '42703' || error.message?.includes('deleted_at')
            ? ' Ensure the soft-delete migration has been applied (supabase/migrations/20250306100000_soft_delete_leads_conversations.sql).'
            : '';
        return NextResponse.json(
          {
            error: 'Failed to delete conversations',
            ...(process.env.NODE_ENV === 'development' && { detail: error.message }),
            ...(hint && { hint }),
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ ok: true, deleted: ids.length });
  });
}
