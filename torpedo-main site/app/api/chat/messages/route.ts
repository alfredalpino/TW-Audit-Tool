import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { isValidConversationId } from '@/lib/chat-typing-store';
import { requireConversationAccess } from '@/lib/chat-api-auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { CHAT_MESSAGES_RATE_LIMIT } from '@/lib/constants';

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const { ok } = await checkRateLimit('chat_messages', ip, CHAT_MESSAGES_RATE_LIMIT);
  if (!ok) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversationId')?.trim();
  if (!conversationId) {
    return NextResponse.json(
      { error: 'conversationId is required.' },
      { status: 400 }
    );
  }
  if (!isValidConversationId(conversationId)) {
    return NextResponse.json(
      { error: 'Invalid conversationId format.' },
      { status: 400 }
    );
  }

  const authError = await requireConversationAccess(request, conversationId);
  if (authError) return authError;

  const supabase = createServiceClient();
  const { data: conv } = await supabase
    .from('conversations')
    .select('lead_id')
    .eq('id', conversationId)
    .single();

  const { data: messages, error } = await supabase
    .from('messages')
    .select('id, sender, message, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('chat messages fetch:', error);
    return NextResponse.json(
      { error: 'Failed to load messages.' },
      { status: 500 }
    );
  }

  let agentJoined = false;
  if (conv?.lead_id) {
    const { data: lead } = await supabase
      .from('leads')
      .select('status')
      .eq('id', conv.lead_id)
      .single();
    agentJoined = lead?.status === 'agent_joined';
  }

  return NextResponse.json(
    { messages: messages ?? [], agentJoined },
    {
      headers: {
        'Cache-Control': 'private, max-age=5',
      },
    }
  );
}
