-- Allow any authenticated user to use blog-admin: select own + published, insert/update/delete own posts.
-- Admin/team can still update/delete any post. Keeps existing login (Supabase Auth) connected to WYSIWYG.

DROP POLICY IF EXISTS blog_posts_select_published ON public.blog_posts;
CREATE POLICY blog_posts_select_published ON public.blog_posts FOR SELECT
  USING (
    status = 'published'
    OR auth.uid() = author_id
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team'))
  );

DROP POLICY IF EXISTS blog_posts_insert_admin_team ON public.blog_posts;
CREATE POLICY blog_posts_insert_auth ON public.blog_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS blog_posts_update_admin_team ON public.blog_posts;
CREATE POLICY blog_posts_update_auth ON public.blog_posts FOR UPDATE
  USING (
    auth.uid() = author_id
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team'))
  );

DROP POLICY IF EXISTS blog_posts_delete_admin_team ON public.blog_posts;
CREATE POLICY blog_posts_delete_auth ON public.blog_posts FOR DELETE
  USING (
    auth.uid() = author_id
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team'))
  );
