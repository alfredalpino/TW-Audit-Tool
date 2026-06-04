import { NextResponse } from 'next/server';
import { parseJsonBody } from '@/lib/api-utils';
import { createServiceClient } from '@/lib/supabase/service';
import { isValidConversationId } from '@/lib/chat-typing-store';
import { requireConversationAccess } from '@/lib/chat-api-auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { CHAT_REQUEST_AGENT_RATE_LIMIT } from '@/lib/constants';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { ok } = await checkRateLimit('chat_request_agent', ip, CHAT_REQUEST_AGENT_RATE_LIMIT);
  if (!ok) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      { status: 429 }
    );
  }

  const [body, parseError] = await parseJsonBody<{ conversationId?: unknown }>(request);
  if (parseError) return parseError;

  const conversationId =
    typeof body.conversationId === 'string' ? body.conversationId.trim() : '';

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
    .select('id, lead_id')
    .eq('id', conversationId)
    .single();

  if (!conv) {
    return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
  }

  const { error: updateError } = await supabase
    .from('leads')
    .update({ status: 'agent_joined' })
    .eq('id', conv.lead_id);

  if (updateError) {
    console.error('request-agent update lead:', updateError);
    return NextResponse.json(
      { error: 'Failed to request live agent.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
