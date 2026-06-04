import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/api-admin';
import { createServiceClient } from '@/lib/supabase/service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAdmin(request, async (req) => {
  const { id: conversationId } = await params;
  if (!conversationId) {
    return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
  const message = typeof (body as { message?: unknown }).message === 'string'
    ? (body as { message: string }).message.trim()
    : '';
  if (!message) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: conv } = await supabase
    .from('conversations')
    .select('id, lead_id')
    .eq('id', conversationId)
    .single();

  if (!conv) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  const { error: insertError } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender: 'agent',
    message,
  });

  if (insertError) {
    console.error('admin reply insert:', insertError);
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }

  await supabase.from('leads').update({ status: 'agent_joined' }).eq('id', conv.lead_id);

  return NextResponse.json({ ok: true });
  });
}
