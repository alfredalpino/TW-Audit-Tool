-- In-house chat: leads, conversations, messages (lead capture + AI + agent takeover)
-- Run in Supabase Dashboard SQL or via: supabase db push

-- Leads (captured from widget before chat)
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'ai_chatting', 'agent_joined', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX idx_leads_status ON public.leads(status);

-- Conversations (one per lead)
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_conversations_lead_id ON public.conversations(lead_id);

-- Messages (user / ai / agent)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'ai', 'agent')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(conversation_id, created_at);

-- RLS: all access via service role (API); anon has no direct access
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- No policies for anon/authenticated; service_role bypasses RLS. API uses service role.

-- Realtime: enable for messages so server can broadcast if needed (client will poll API for MVP)
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
