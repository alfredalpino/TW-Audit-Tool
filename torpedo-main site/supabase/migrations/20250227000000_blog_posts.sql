-- Blog posts for /blog-admin WYSIWYG editor.
-- RLS: only admin/team can insert/update/delete; public select for published only.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(slug)
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_blog_posts_updated_at ON public.blog_posts(updated_at DESC);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Only admin/team can do anything; clients cannot see draft or manage posts
DROP POLICY IF EXISTS blog_posts_select_published ON public.blog_posts;
CREATE POLICY blog_posts_select_published ON public.blog_posts FOR SELECT
  USING (
    status = 'published'
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team'))
  );

DROP POLICY IF EXISTS blog_posts_insert_admin_team ON public.blog_posts;
CREATE POLICY blog_posts_insert_admin_team ON public.blog_posts FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team'))
  );

DROP POLICY IF EXISTS blog_posts_update_admin_team ON public.blog_posts;
CREATE POLICY blog_posts_update_admin_team ON public.blog_posts FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team')));

DROP POLICY IF EXISTS blog_posts_delete_admin_team ON public.blog_posts;
CREATE POLICY blog_posts_delete_admin_team ON public.blog_posts FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team')));

-- Keep updated_at in sync
CREATE OR REPLACE FUNCTION public.set_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_blog_posts_updated_at();
