-- Extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- App role enum
CREATE TYPE app_role AS ENUM ('admin', 'team', 'client');

-- Profiles: 1:1 with auth.users, holds app role
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects: client_id = Supabase user (client)
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  staging_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'delivered', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_client_id ON public.projects(client_id);
CREATE INDEX idx_projects_slug ON public.projects(slug);

-- Preview tokens: only hash stored
CREATE TABLE public.preview_tokens (
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

CREATE INDEX idx_preview_tokens_project_id ON public.preview_tokens(project_id);
CREATE INDEX idx_preview_tokens_expires_at ON public.preview_tokens(expires_at) WHERE is_active = true;

-- Bookings: anonymous or optional created_by (no budget; pricing after analysis)
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT NOT NULL,
  timeline TEXT,
  business_info TEXT,
  description TEXT,
  scheduled_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_created_at ON public.bookings(created_at);

-- Milestones
CREATE TABLE public.milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'done')),
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_milestones_project_id ON public.milestones(project_id);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preview_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update own row
CREATE POLICY profiles_select_own ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Projects: client sees own; admin/team see all
CREATE POLICY projects_select_client ON public.projects FOR SELECT
  USING (
    client_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team'))
  );
CREATE POLICY projects_insert_admin_team ON public.projects FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team')));
CREATE POLICY projects_update_admin_team ON public.projects FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team')));

-- Preview tokens: clients see tokens for their projects; admin/team see all
CREATE POLICY preview_tokens_select ON public.preview_tokens FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.projects pr WHERE pr.id = preview_tokens.project_id AND pr.client_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team'))
  );
CREATE POLICY preview_tokens_insert_admin_team ON public.preview_tokens FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team')));
CREATE POLICY preview_tokens_update_admin_team ON public.preview_tokens FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team')));

-- Bookings: anyone can insert; only admin/team can read
CREATE POLICY bookings_insert_anon ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY bookings_select_admin_team ON public.bookings FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team')));

-- Milestones: same as projects
CREATE POLICY milestones_select ON public.milestones FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.projects pr WHERE pr.id = milestones.project_id AND pr.client_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team'))
  );
CREATE POLICY milestones_insert_admin_team ON public.milestones FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team')));
CREATE POLICY milestones_update_admin_team ON public.milestones FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team')));

-- Trigger: create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role) VALUES (NEW.id, 'client');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
