import { NextResponse } from 'next/server';
import { parseJsonBody } from '@/lib/api-utils';
import { createServiceClient } from '@/lib/supabase/service';
import {
  setTyping,
  clearTyping,
  isTyping,
  isValidConversationId,
} from '@/lib/chat-typing-store';
import { requireConversationAccess } from '@/lib/chat-api-auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { CHAT_TYPING_RATE_LIMIT } from '@/lib/constants';

/** POST: visitor typing (from widget). Body: { conversationId, active? } */
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { ok } = await checkRateLimit('chat_typing', ip, CHAT_TYPING_RATE_LIMIT);
  if (!ok) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      { status: 429 }
    );
  }

  const [body, parseError] = await parseJsonBody<{
    conversationId?: unknown;
    active?: boolean;
  }>(request);
  if (parseError) return parseError;

  const conversationId =
    typeof body.conversationId === 'string' ? body.conversationId.trim() : '';
  const active = body.active !== false;

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
    .select('id')
    .eq('id', conversationId)
    .single();

  if (!conv) {
    return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
  }

  if (active) {
    setTyping(conversationId, 'user');
  } else {
    clearTyping(conversationId, 'user');
  }
  return NextResponse.json({ ok: true });
}

/** GET: widget polls for agentTyping. Query: conversationId */
export async function GET(request: Request) {
  const ip = getClientIp(request);
  const { ok } = await checkRateLimit('chat_typing', ip, CHAT_TYPING_RATE_LIMIT);
  if (!ok) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversationId')?.trim() ?? '';

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
    .select('id')
    .eq('id', conversationId)
    .single();

  if (!conv) {
    return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
  }

  const agentTyping = isTyping(conversationId, 'agent');
  return NextResponse.json({ agentTyping });
}
