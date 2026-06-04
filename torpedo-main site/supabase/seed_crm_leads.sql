-- Seed sample leads + conversations so CRM /crm/leads shows data.
-- Run in Supabase Dashboard → SQL Editor, or: supabase db execute -f supabase/seed_crm_leads.sql
-- Leads are normally created by the chat widget (POST /api/chat/create-lead).

INSERT INTO public.leads (id, name, email, phone, status, created_at)
VALUES
  ('a0000001-0000-4000-8000-000000000001'::uuid, 'Jane Smith', 'jane@example.com', '+1 555 0100', 'new', NOW() - INTERVAL '2 days'),
  ('a0000002-0000-4000-8000-000000000002'::uuid, 'Acme Corp', 'contact@acme.com', NULL, 'ai_chatting', NOW() - INTERVAL '1 day'),
  ('a0000003-0000-4000-8000-000000000003'::uuid, 'Bob Wilson', 'bob@startup.io', '+1 555 0200', 'agent_joined', NOW() - INTERVAL '6 hours')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.conversations (id, lead_id, created_at)
VALUES
  ('b0000001-0000-4000-8000-000000000001'::uuid, 'a0000001-0000-4000-8000-000000000001'::uuid, NOW() - INTERVAL '2 days'),
  ('b0000002-0000-4000-8000-000000000002'::uuid, 'a0000002-0000-4000-8000-000000000002'::uuid, NOW() - INTERVAL '1 day'),
  ('b0000003-0000-4000-8000-000000000003'::uuid, 'a0000003-0000-4000-8000-000000000003'::uuid, NOW() - INTERVAL '6 hours')
ON CONFLICT (lead_id) DO NOTHING;
