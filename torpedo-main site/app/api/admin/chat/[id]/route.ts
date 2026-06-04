import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/api-admin';
import { createServiceClient } from '@/lib/supabase/service';
import { isTyping, isValidConversationId } from '@/lib/chat-typing-store';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAdmin(_request, async () => {
  const { id: conversationId } = await params;
  if (!conversationId) {
    return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 });
  }
  if (!isValidConversationId(conversationId)) {
    return NextResponse.json({ error: 'Invalid conversation ID format.' }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: conv, error: convError } = await supabase
    .from('conversations')
    .select('id, lead_id, created_at')
    .eq('id', conversationId)
    .single();

  if (convError || !conv) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  const { data: lead } = await supabase
    .from('leads')
    .select('id, name, email, phone, status')
    .eq('id', conv.lead_id)
    .single();

  const { data: messages } = await supabase
    .from('messages')
    .select('id, sender, message, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  const visitorTyping = isTyping(conversationId, 'user');

  return NextResponse.json({
    conversation: conv,
    lead: lead ?? null,
    messages: messages ?? [],
    visitorTyping,
  });
  });
}
