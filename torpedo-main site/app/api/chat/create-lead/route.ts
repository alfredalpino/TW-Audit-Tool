import { NextResponse } from 'next/server';
import { parseJsonBody } from '@/lib/api-utils';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { CHAT_CREATE_LEAD_RATE_LIMIT } from '@/lib/constants';
import { signConversationToken, isConversationTokenConfigured } from '@/lib/chat-conversation-token';
import { createServiceClient } from '@/lib/supabase/service';
import { sendTelegramMessage } from '@/lib/telegram';
import { SITE_URL } from '@/lib/seo/site';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MAX_LEN = 200;
const PHONE_MAX_LEN = 50;

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { ok } = await checkRateLimit('chat_create_lead', ip, CHAT_CREATE_LEAD_RATE_LIMIT);
  if (!ok) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      { status: 429 }
    );
  }

  const [body, parseError] = await parseJsonBody<{ name?: unknown; email?: unknown; phone?: unknown }>(request);
  if (parseError) return parseError;

  const name = typeof body?.name === 'string'
    ? body.name.trim().slice(0, NAME_MAX_LEN)
    : '';
  const email = typeof body?.email === 'string'
    ? body.email.trim().toLowerCase()
    : '';
  const phone = typeof body?.phone === 'string'
    ? body.phone.trim().slice(0, PHONE_MAX_LEN) || null
    : null;

  if (!name) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({ name, email, phone, status: 'new' })
      .select('id')
      .single();

    if (leadError || !lead) {
      console.error('create-lead insert lead:', leadError);
      return NextResponse.json(
        { error: 'Failed to create lead. Try again later.' },
        { status: 500 }
      );
    }

    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({ lead_id: lead.id })
      .select('id')
      .single();

    if (convError || !conversation) {
      console.error('create-lead insert conversation:', convError);
      return NextResponse.json(
        { error: 'Failed to start conversation. Try again later.' },
        { status: 500 }
      );
    }

    const welcomeMessage = `Hi ${name}, I'm Tor AI,the assistant for Torpedo Web. How can I help you today?`;
    const { error: welcomeError } = await supabase.from('messages').insert({
      conversation_id: conversation.id,
      sender: 'ai',
      message: welcomeMessage,
    });
    if (welcomeError) {
      console.error('create-lead insert welcome message:', welcomeError);
    }

    if (!isConversationTokenConfigured()) {
      console.error('create-lead: CHAT_CONVERSATION_SECRET is not set');
      return NextResponse.json(
        { error: 'Chat is not configured.' },
        { status: 503 }
      );
    }

    const conversationToken = signConversationToken(conversation.id);
    if (!conversationToken) {
      return NextResponse.json(
        { error: 'Chat is not configured.' },
        { status: 503 }
      );
    }

    const chatUrl = `${SITE_URL}/crm/chat/${conversation.id}`;
    const phoneLine = phone ? `\n📞 Phone: ${phone}` : '';
    await sendTelegramMessage(
      `🆕 New prospect joined chat\n\n👤 Name: ${name}\n📧 Email: ${email}${phoneLine}\n\nOpen chat: ${chatUrl}`
    );

    return NextResponse.json(
      {
        leadId: lead.id,
        conversationId: conversation.id,
        conversationToken,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('create-lead unexpected:', err);
    return NextResponse.json(
      { error: 'Could not start chat. Please try again in a moment.' },
      { status: 500 }
    );
  }
}
