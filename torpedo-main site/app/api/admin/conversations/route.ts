import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/api-admin';
import { createServiceClient } from '@/lib/supabase/service';

export async function GET(request: Request) {
  return withAdmin(request, async (req) => {
  const { searchParams } = new URL(req.url);
  const deleted = searchParams.get('deleted') === 'true';

  const supabase = createServiceClient();

  let convQuery = supabase
    .from('conversations')
    .select('id, lead_id, created_at, deleted_at')
    .order('created_at', { ascending: false });
  if (deleted) {
    convQuery = convQuery.not('deleted_at', 'is', null);
  } else {
    convQuery = convQuery.is('deleted_at', null);
  }
  const { data: conversations, error: convError } = await convQuery;

  if (convError) {
    console.error('admin conversations:', convError);
    return NextResponse.json(
      { error: 'Failed to load conversations' },
      { status: 500 }
    );
  }

  if (!conversations?.length) {
    return NextResponse.json({ conversations: [] });
  }

  const convIds = conversations.map((c) => c.id);
  const leadIds = [...new Set(conversations.map((c) => c.lead_id))];
  let leadQuery = supabase.from('leads').select('id, name, email, phone, status').in('id', leadIds);
  if (!deleted) {
    leadQuery = leadQuery.is('deleted_at', null);
  }
  const { data: leads } = await leadQuery;

  const leadMap = new Map((leads ?? []).map((l) => [l.id, l]));

  // Bounded query: only messages for these conversations, then take latest per conversation in JS
  const { data: messages } = await supabase
    .from('messages')
    .select('conversation_id, message, created_at, sender')
    .in('conversation_id', convIds)
    .order('created_at', { ascending: false });

  const lastMessageByConv = new Map<
    string,
    { message: string; created_at: string; sender: string }
  >();
  for (const m of messages ?? []) {
    if (!lastMessageByConv.has(m.conversation_id)) {
      lastMessageByConv.set(m.conversation_id, {
        message: m.message,
        created_at: m.created_at,
        sender: m.sender,
      });
    }
  }

  const list = conversations.map((c) => {
    const lead = leadMap.get(c.lead_id) ?? null;
    const lastMessage = lastMessageByConv.get(c.id) ?? null;
    return {
      id: c.id,
      lead_id: c.lead_id,
      created_at: c.created_at,
      lead,
      lastMessage,
      lastActivityAt: lastMessage?.created_at ?? c.created_at,
    };
  });

  list.sort(
    (a, b) =>
      new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
  );

  return NextResponse.json({ conversations: list });
  });
}
