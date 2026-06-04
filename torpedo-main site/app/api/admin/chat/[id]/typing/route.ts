import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/api-admin';
import { createServiceClient } from '@/lib/supabase/service';
import {
  setTyping,
  clearTyping,
  isValidConversationId,
} from '@/lib/chat-typing-store';

/** POST: agent typing. Body: { typing: true | false } */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAdmin(request, async (req) => {
  const { id: conversationId } = await params;
  if (!conversationId) {
    return NextResponse.json(
      { error: 'Conversation ID required' },
      { status: 400 }
    );
  }

  if (!isValidConversationId(conversationId)) {
    return NextResponse.json(
      { error: 'Invalid conversation ID format.' },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const typing = (body as { typing?: boolean }).typing === true;

  const supabase = createServiceClient();
  const { data: conv } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', conversationId)
    .single();

  if (!conv) {
    return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
  }

  if (typing) {
    setTyping(conversationId, 'agent');
  } else {
    clearTyping(conversationId, 'agent');
  }

  return NextResponse.json({ ok: true });
  });
}
