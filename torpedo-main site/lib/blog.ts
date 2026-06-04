import fs from 'fs';
import path from 'path';
import { unstable_cache } from 'next/cache';
import matter from 'gray-matter';

const BLOGS_DIR = path.join(process.cwd(), 'public', 'blogs');

const BLOG_REVALIDATE_SEC = 60;

/** Only allow URL-safe slug (alphanumeric and hyphen) to prevent path traversal. */
function sanitizeSlug(slug: string): string {
  return slug.replace(/[^a-zA-Z0-9-]/g, '');
}

export type BlogPostPublic = {
  slug: string;
  title: string;
  date: string | null;
  excerpt: string | null;
};

export type BlogPostFull = BlogPostPublic & {
  content: string;
};

function parseFrontmatter(data: Record<string, unknown>, slug: string): Pick<BlogPostPublic, 'title' | 'date' | 'excerpt'> {
  const title = typeof data.title === 'string' ? data.title : slug;
  const date =
    typeof data.date === 'string'
      ? data.date
      : data.date instanceof Date
        ? data.date.toISOString().slice(0, 10)
        : null;
  const excerpt = typeof data.excerpt === 'string' ? data.excerpt : null;
  return { title, date, excerpt };
}

function getBlogPostsUncached(): BlogPostPublic[] {
  if (!fs.existsSync(BLOGS_DIR)) return [];
  const names = fs.readdirSync(BLOGS_DIR);
  const posts: BlogPostPublic[] = [];
  for (const name of names) {
    if (!name.endsWith('.md')) continue;
    const slug = sanitizeSlug(name.slice(0, -3));
    if (!slug || slug === 'blog-1') continue;
    const filePath = path.join(BLOGS_DIR, name);
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(raw);
      const { title, date, excerpt } = parseFrontmatter(data as Record<string, unknown>, slug);
      posts.push({ slug, title, date, excerpt });
    } catch {
      posts.push({ slug, title: slug, date: null, excerpt: null });
    }
  }
  posts.sort((a, b) => {
    const da = a.date || '';
    const db = b.date || '';
    if (da !== db) return db.localeCompare(da);
    return (a.title || a.slug).localeCompare(b.title || b.slug);
  });
  return posts;
}

function getBlogPostBySlugUncached(slug: string): BlogPostFull | null {
  const safe = sanitizeSlug(slug);
  if (!safe || safe !== slug) return null;
  const filePath = path.join(BLOGS_DIR, `${safe}.md`);
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const { title, date, excerpt } = parseFrontmatter(data as Record<string, unknown>, safe);
    return { slug: safe, title, date, excerpt, content };
  } catch {
    return null;
  }
}

const getBlogPostsCached = unstable_cache(
  async () => getBlogPostsUncached(),
  ['blog-list'],
  { revalidate: BLOG_REVALIDATE_SEC }
);

export async function getBlogPosts(): Promise<BlogPostPublic[]> {
  return getBlogPostsCached();
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostFull | null> {
  return unstable_cache(
    async () => getBlogPostBySlugUncached(slug),
    ['blog-post', slug],
    { revalidate: BLOG_REVALIDATE_SEC }
  )();
}

