import { NextResponse } from 'next/server';
import { parseJsonBody } from '@/lib/api-utils';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { BOOKING_SHORT_URL, CHAT_SEND_RATE_LIMIT } from '@/lib/constants';
import { requireConversationAccess } from '@/lib/chat-api-auth';
import { createServiceClient } from '@/lib/supabase/service';
import { isValidConversationId } from '@/lib/chat-typing-store';
import { TORPEDO_KNOWLEDGE, getGuardrails } from '@/lib/chat-knowledge';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const OUT_OF_SCOPE_PHRASE =
  "I can't help you with that, but ask me anything about Torpedo Web's services.";
const APPOINTMENT_SHORT_REPLY = BOOKING_SHORT_URL;

function isAppointmentIntent(message: string): boolean {
  return /\b(appointment|book|booking|schedule|call link|meeting link|discovery call)\b/i.test(message);
}

function toCrispReply(text: string): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return 'How can I help you with your project goals?';

  if (normalized === OUT_OF_SCOPE_PHRASE) return normalized;

  const sentences = normalized
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length > 0) {
    return sentences.slice(0, 3).join(' ');
  }

  const words = normalized.split(' ').filter(Boolean);
  return words.slice(0, 28).join(' ');
}

function enforceAssistantRules(rawReply: string, userMessage: string): string {
  if (isAppointmentIntent(userMessage)) return APPOINTMENT_SHORT_REPLY;
  return toCrispReply(rawReply);
}

function buildSystemPrompt(): string {
  const guardrails = getGuardrails();
  return `You are Tor AI, the client intake assistant for Torpedo Web. You may ONLY answer using the following information about Torpedo Web and its services. Do not answer about other companies, pricing, or any topic outside this scope.

STRICT OUT-OF-SCOPE RULE: Use the exact phrase "${OUT_OF_SCOPE_PHRASE}" only for truly unrelated topics (other companies' products, politics, general knowledge). When the user is asking for a website, web project, or business project that Torpedo Web can do (e.g. "I want a website for my store"), respond helpfully (e.g. "We can help with that. Tell me a bit about your requirements so I can better assist you") and point to Google Calendar booking; do not use the out-of-scope phrase for these service requests.

Knowledge:
${TORPEDO_KNOWLEDGE}

Guardrails (what to answer / what not to answer):
${guardrails}

Rules:
• Answer in a crisp manner only: 1–3 short sentences. Be specific (service names, next steps). No filler, no long paragraphs, no repetition. Prefer brevity.
• Never give pricing estimates.
• When the user shows interest in services, asks how to get started, wants to discuss a project, or asks for next steps, suggest they book a discovery call: ${BOOKING_SHORT_URL}
• If the user asks for appointment/call/meeting/booking link, provide this exact short link as a standalone clickable URL: ${BOOKING_SHORT_URL}
• For out-of-scope or escalation, use the exact phrase above; you may also suggest that booking link or clicking "Live agent".
• Escalate to human when requested or when the user asks for a live agent; suggest they click "Live agent" or book a call.
• Do not use em dashes in replies. Use commas, periods, or colons instead.`;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { ok } = await checkRateLimit('chat_send', ip, CHAT_SEND_RATE_LIMIT);
  if (!ok) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      { status: 429 }
    );
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Chat is not configured.' },
      { status: 503 }
    );
  }

  const [body, parseError] = await parseJsonBody<{ conversationId?: unknown; message?: unknown }>(request);
  if (parseError) return parseError;

  const conversationId = typeof body?.conversationId === 'string'
    ? body.conversationId.trim()
    : '';
  const message = typeof body?.message === 'string'
    ? body.message.trim()
    : '';

  if (!conversationId || !message) {
    return NextResponse.json(
      { error: 'conversationId and message are required.' },
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

  if (message.length > 4000) {
    return NextResponse.json(
      { error: 'Message too long.' },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  const { data: conv } = await supabase
    .from('conversations')
    .select('id, lead_id')
    .eq('id', conversationId)
    .single();

  if (!conv) {
    return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
  }

  const { data: lead } = await supabase
    .from('leads')
    .select('status, name')
    .eq('id', conv.lead_id)
    .single();

  const { data: userMsg, error: userMsgError } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender: 'user',
      message,
    })
    .select('id, sender, message, created_at')
    .single();

  if (userMsgError || !userMsg) {
    console.error('chat send insert user message:', userMsgError);
    return NextResponse.json(
      { error: 'Failed to save message.' },
      { status: 500 }
    );
  }

  if (lead?.status === 'agent_joined') {
    return NextResponse.json({ messages: [userMsg], agentMode: true });
  }

  const { data: existingMessages } = await supabase
    .from('messages')
    .select('sender, message')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  const openRouterMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: buildSystemPrompt() },
    ...(existingMessages ?? []).map((m) => ({
      role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: m.message,
    })),
  ];

  const OPENROUTER_TIMEOUT_MS = 28_000;

  let aiContent = '';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OPENROUTER_TIMEOUT_MS);
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: openRouterMessages,
        max_tokens: 1024,
      }),
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      console.error('OpenRouter error:', res.status, errText);
      aiContent = 'Sorry, I had a temporary issue. Please try again in a moment.';
    } else {
      const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
      aiContent =
        data.choices?.[0]?.message?.content?.trim() ||
        'Thanks for your message. How can we help you today?';
    }
  } catch (err) {
    console.error('OpenRouter fetch error:', err);
    aiContent = 'Sorry, I had a temporary issue. Please try again in a moment.';
  }

  aiContent = enforceAssistantRules(aiContent, message);

  const { data: aiMsg, error: aiMsgError } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender: 'ai',
      message: aiContent,
    })
    .select('id, sender, message, created_at')
    .single();

  if (aiMsgError || !aiMsg) {
    console.error('chat send insert ai message:', aiMsgError);
    return NextResponse.json(
      { messages: [userMsg], error: 'Response was not saved.' },
      { status: 200 }
    );
  }

  await supabase.from('leads').update({ status: 'ai_chatting' }).eq('id', conv.lead_id);

  return NextResponse.json({
    messages: [userMsg, aiMsg],
  });
}
