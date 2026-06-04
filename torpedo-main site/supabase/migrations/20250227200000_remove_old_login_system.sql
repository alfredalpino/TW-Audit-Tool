-- Remove old user login system: trigger, profiles, projects, signup OTPs, project-files policies.
-- Keep: auth.users, blog_posts, avatars bucket. blog_posts RLS updated to use auth.uid() only.

-- 1. Trigger and function (stop creating profiles on new signups)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Storage: drop project-files policies (reference profiles/projects)
DROP POLICY IF EXISTS "project-files select" ON storage.objects;
DROP POLICY IF EXISTS "project-files insert" ON storage.objects;
DROP POLICY IF EXISTS "project-files update" ON storage.objects;
DROP POLICY IF EXISTS "project-files delete" ON storage.objects;

-- 3. Tables: drop in FK order (preview_tokens -> milestones -> projects -> profiles)
DROP TABLE IF EXISTS public.preview_tokens;
DROP TABLE IF EXISTS public.milestones;
DROP TABLE IF EXISTS public.projects;
DROP TABLE IF EXISTS public.profiles;
DROP TABLE IF EXISTS public.signup_otps;

-- 4. blog_posts RLS: no profiles; any authenticated user manages own posts, sees published
DROP POLICY IF EXISTS blog_posts_select_published ON public.blog_posts;
CREATE POLICY blog_posts_select_published ON public.blog_posts FOR SELECT
  USING (status = 'published' OR auth.uid() = author_id);

DROP POLICY IF EXISTS blog_posts_insert_auth ON public.blog_posts;
DROP POLICY IF EXISTS blog_posts_insert_admin_team ON public.blog_posts;
CREATE POLICY blog_posts_insert_auth ON public.blog_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS blog_posts_update_auth ON public.blog_posts;
DROP POLICY IF EXISTS blog_posts_update_admin_team ON public.blog_posts;
CREATE POLICY blog_posts_update_auth ON public.blog_posts FOR UPDATE
  USING (auth.uid() = author_id);

DROP POLICY IF EXISTS blog_posts_delete_auth ON public.blog_posts;
DROP POLICY IF EXISTS blog_posts_delete_admin_team ON public.blog_posts;
CREATE POLICY blog_posts_delete_auth ON public.blog_posts FOR DELETE
  USING (auth.uid() = author_id);

-- 5. Cleanup: app_role only used by profiles
DROP TYPE IF EXISTS app_role CASCADE;
