import { createServiceClient } from '@/lib/supabase/service';

export type ConversationRow = {
  id: string;
  lead_id: string;
  created_at: string;
  lead: { id: string; name: string; email: string; phone: string | null; status: string } | null;
  lastMessage: { message: string; created_at: string; sender: string } | null;
  lastActivityAt: string;
};

function isMissingColumnError(err: { message?: string; code?: string } | null): boolean {
  if (!err) return false;
  const msg = String(err.message ?? '');
  const code = String((err as { code?: string }).code ?? '');
  return code === '42703' || msg.includes('deleted_at') || msg.includes('column');
}

export async function loadConversations(): Promise<{
  conversations: ConversationRow[];
  error?: boolean;
}> {
  try {
    const supabase = createServiceClient();

    let convQuery = supabase
      .from('conversations')
      .select('id, lead_id, created_at')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    let { data: conversations, error: convError } = await convQuery;
    if (convError && isMissingColumnError(convError)) {
      const fallback = await supabase
        .from('conversations')
        .select('id, lead_id, created_at')
        .order('created_at', { ascending: false });
      conversations = fallback.data;
      convError = fallback.error;
    }
    if (convError) {
      console.error('admin conversations:', convError.message ?? convError);
      return { conversations: [], error: true };
    }

    if (!conversations?.length) {
      return { conversations: [] };
    }

    const leadIds = [...new Set(conversations.map((c) => c.lead_id))];
    let leadRes = await supabase
      .from('leads')
      .select('id, name, email, phone, status')
      .in('id', leadIds)
      .is('deleted_at', null);
    let leads = leadRes.data;
    if (leadRes.error && isMissingColumnError(leadRes.error)) {
      const fallback = await supabase.from('leads').select('id, name, email, phone, status').in('id', leadIds);
      leads = fallback.data;
    }

    const leadMap = new Map((leads ?? []).map((l) => [l.id, l]));

    const { data: messages } = await supabase
      .from('messages')
      .select('conversation_id, message, created_at, sender')
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

    const list: ConversationRow[] = conversations.map((c) => {
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

    return { conversations: list };
  } catch {
    return { conversations: [], error: true };
  }
}
