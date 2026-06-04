-- Add portal/login and dashboard tables when you started with bookings only.
-- Safe to run: uses IF NOT EXISTS / DO blocks so existing objects are skipped.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- App role enum (skip if already exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM ('admin', 'team', 'client');
  END IF;
END$$;

-- Profiles: 1:1 with auth.users, for login and role
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects: for dashboard and client projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  staging_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'delivered', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);

-- Preview tokens: for sharing site previews with clients
CREATE TABLE IF NOT EXISTS public.preview_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  max_views INT NOT NULL DEFAULT 0,
  current_views INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, token_hash)
);

CREATE INDEX IF NOT EXISTS idx_preview_tokens_project_id ON public.preview_tokens(project_id);
CREATE INDEX IF NOT EXISTS idx_preview_tokens_expires_at ON public.preview_tokens(expires_at) WHERE is_active = true;

-- Milestones: per project
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'done')),
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON public.milestones(project_id);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preview_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- Policies (drop first so we can re-run)
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_select_own ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS projects_select_client ON public.projects;
DROP POLICY IF EXISTS projects_insert_admin_team ON public.projects;
DROP POLICY IF EXISTS projects_update_admin_team ON public.projects;
CREATE POLICY projects_select_client ON public.projects FOR SELECT
  USING (client_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team')));
CREATE POLICY projects_insert_admin_team ON public.projects FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team')));
CREATE POLICY projects_update_admin_team ON public.projects FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team')));

DROP POLICY IF EXISTS preview_tokens_select ON public.preview_tokens;
DROP POLICY IF EXISTS preview_tokens_insert_admin_team ON public.preview_tokens;
DROP POLICY IF EXISTS preview_tokens_update_admin_team ON public.preview_tokens;
CREATE POLICY preview_tokens_select ON public.preview_tokens FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.projects pr WHERE pr.id = preview_tokens.project_id AND pr.client_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team'))
  );
CREATE POLICY preview_tokens_insert_admin_team ON public.preview_tokens FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team')));
CREATE POLICY preview_tokens_update_admin_team ON public.preview_tokens FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team')));

DROP POLICY IF EXISTS milestones_select ON public.milestones;
DROP POLICY IF EXISTS milestones_insert_admin_team ON public.milestones;
DROP POLICY IF EXISTS milestones_update_admin_team ON public.milestones;
CREATE POLICY milestones_select ON public.milestones FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.projects pr WHERE pr.id = milestones.project_id AND pr.client_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team'))
  );
CREATE POLICY milestones_insert_admin_team ON public.milestones FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team')));
CREATE POLICY milestones_update_admin_team ON public.milestones FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team')));

-- Trigger: create profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role) VALUES (NEW.id, 'client')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
