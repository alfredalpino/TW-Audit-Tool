-- Soft delete for leads and conversations (CRUD + recovery)
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_leads_deleted_at ON public.leads(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_conversations_deleted_at ON public.conversations(deleted_at) WHERE deleted_at IS NOT NULL;
