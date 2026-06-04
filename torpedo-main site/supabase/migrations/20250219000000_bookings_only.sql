-- Bookings table only (use this if you never ran the full initial_schema, e.g. project was created without migrations)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT NOT NULL,
  timeline TEXT,
  business_info TEXT,
  description TEXT,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous insert (form submission); service role bypasses RLS anyway
DROP POLICY IF EXISTS bookings_insert_anon ON public.bookings;
CREATE POLICY bookings_insert_anon ON public.bookings FOR INSERT WITH CHECK (true);

-- Optional: only admin/team can read (requires profiles table). If you don't have profiles, skip this and add later.
-- DROP POLICY IF EXISTS bookings_select_admin_team ON public.bookings;
-- CREATE POLICY bookings_select_admin_team ON public.bookings FOR SELECT
--   USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team')));
