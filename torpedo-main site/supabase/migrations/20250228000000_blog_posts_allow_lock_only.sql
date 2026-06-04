-- Allow blog-admin to work with lock code only (no login): drop author_id FK so service role can insert with placeholder UUID.

ALTER TABLE public.blog_posts
  DROP CONSTRAINT IF EXISTS blog_posts_author_id_fkey;
