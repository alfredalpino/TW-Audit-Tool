import fs from 'fs';
import path from 'path';
import { unstable_cache } from 'next/cache';
import matter from 'gray-matter';
import { getBlogPostBySlug, getBlogPosts, type BlogPostFull, type BlogPostPublic } from '@/lib/blog';
import { getBlogPostMetaOverlay } from '@/lib/i18n/blog-metadata';
import { DEFAULT_LOCALE, type LocaleCode } from '@/lib/i18n/config';

const LOCALIZED_BLOGS_DIR = path.join(process.cwd(), 'content', 'localized-blogs');
const BLOG_REVALIDATE_SEC = 60;

/** Maps overlay locales to on-disk content folders. */
const LOCALE_CONTENT_FOLDER: Partial<Record<LocaleCode, string>> = {
  'fr-FR': 'fr',
  'fr-MA': 'fr',
  'fr-CH': 'fr',
  'es-MX': 'es-MX',
  'de-CH': 'de',
  'it-IT': 'it',
  'fi-FI': 'fi',
  'tr-TR': 'tr',
  'ru-RU': 'ru',
  'ar-AE': 'ar',
};

function sanitizeSlug(slug: string): string {
  return slug.replace(/[^a-zA-Z0-9-]/g, '');
}

function getLocalizedDir(locale: LocaleCode): string | null {
  const folder = LOCALE_CONTENT_FOLDER[locale];
  if (!folder) return null;
  return path.join(LOCALIZED_BLOGS_DIR, folder);
}

type LocalizedPostMeta = BlogPostPublic & {
  sourceSlug: string | null;
  localeOnly: boolean;
};

function parseFrontmatter(data: Record<string, unknown>, slug: string) {
  const title = typeof data.title === 'string' ? data.title : slug;
  const date =
    typeof data.date === 'string'
      ? data.date
      : data.date instanceof Date
        ? data.date.toISOString().slice(0, 10)
        : null;
  const excerpt = typeof data.excerpt === 'string' ? data.excerpt : null;
  const sourceSlug = typeof data.sourceSlug === 'string' ? sanitizeSlug(data.sourceSlug) : null;
  const localeOnly = data.localeOnly === true;
  return { title, date, excerpt, sourceSlug, localeOnly };
}

function toPublicPost({ slug, title, date, excerpt }: LocalizedPostMeta): BlogPostPublic {
  return { slug, title, date, excerpt };
}

/** English slugs that must not be served or listed in this overlay locale (localeOnly translations). */
function getLocaleOnlyBlockedEnglishSlugs(posts: LocalizedPostMeta[]): Set<string> {
  const blocked = new Set<string>();
  for (const post of posts) {
    if (post.localeOnly && post.sourceSlug) {
      blocked.add(post.sourceSlug);
    }
  }
  return blocked;
}

function readLocalizedPostsUncached(locale: LocaleCode): LocalizedPostMeta[] {
  const dir = getLocalizedDir(locale);
  if (!dir || !fs.existsSync(dir)) return [];

  const posts: LocalizedPostMeta[] = [];
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.md')) continue;
    const slug = sanitizeSlug(name.slice(0, -3));
    if (!slug) continue;
    try {
      const raw = fs.readFileSync(path.join(dir, name), 'utf-8');
      const { data } = matter(raw);
      const meta = parseFrontmatter(data as Record<string, unknown>, slug);
      posts.push({ slug, ...meta });
    } catch {
      posts.push({
        slug,
        title: slug,
        date: null,
        excerpt: null,
        sourceSlug: null,
        localeOnly: false,
      });
    }
  }
  return posts;
}

function readLocalizedPostUncached(locale: LocaleCode, slug: string): (BlogPostFull & LocalizedPostMeta) | null {
  const safe = sanitizeSlug(slug);
  if (!safe || safe !== slug) return null;

  const dir = getLocalizedDir(locale);
  if (!dir) return null;

  const filePath = path.join(dir, `${safe}.md`);
  if (!fs.existsSync(filePath)) return null;

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const meta = parseFrontmatter(data as Record<string, unknown>, safe);
    return { slug: safe, ...meta, content };
  } catch {
    return null;
  }
}

function applyMetaOverlay(
  locale: LocaleCode,
  post: BlogPostPublic | BlogPostFull,
): BlogPostPublic | BlogPostFull {
  const overlay = getBlogPostMetaOverlay(locale, post.slug);
  if (!overlay) return post;
  return {
    ...post,
    title: overlay.title,
    excerpt: overlay.excerpt ?? post.excerpt,
  };
}

function mergePostLists(
  english: BlogPostPublic[],
  localized: LocalizedPostMeta[],
  locale: LocaleCode,
): BlogPostPublic[] {
  const localizedSlugs = new Set(localized.map((p) => p.slug));
  const sourceSlugReplacements = new Set<string>();

  for (const post of localized) {
    if (post.sourceSlug) {
      sourceSlugReplacements.add(post.sourceSlug);
    }
  }

  const merged: BlogPostPublic[] = [
    ...localized.map(toPublicPost),
    ...english
      .filter((p) => !sourceSlugReplacements.has(p.slug))
      .map((p) => applyMetaOverlay(locale, p)),
  ];

  merged.sort((a, b) => {
    if (localizedSlugs.has(a.slug) && !localizedSlugs.has(b.slug)) return -1;
    if (!localizedSlugs.has(a.slug) && localizedSlugs.has(b.slug)) return 1;
    const da = a.date || '';
    const db = b.date || '';
    if (da !== db) return db.localeCompare(da);
    return (a.title || a.slug).localeCompare(b.title || b.slug);
  });

  return merged;
}

export function isOverlayBlogLocale(locale: LocaleCode): boolean {
  return locale !== DEFAULT_LOCALE && locale !== 'en-IN';
}

export async function getLocalizedBlogPosts(locale: LocaleCode): Promise<BlogPostPublic[]> {
  if (!isOverlayBlogLocale(locale)) {
    return getBlogPosts();
  }

  return unstable_cache(
    async () => {
      const [english, localized] = await Promise.all([
        getBlogPosts(),
        Promise.resolve(readLocalizedPostsUncached(locale)),
      ]);
      return mergePostLists(english, localized, locale);
    },
    ['localized-blog-list', locale],
    { revalidate: BLOG_REVALIDATE_SEC },
  )();
}

export async function getLocalizedBlogPost(
  locale: LocaleCode,
  slug: string,
): Promise<BlogPostFull | null> {
  if (!isOverlayBlogLocale(locale)) {
    return getBlogPostBySlug(slug);
  }

  return unstable_cache(
    async () => {
      const localizedCatalog = readLocalizedPostsUncached(locale);
      const blockedEnglishSlugs = getLocaleOnlyBlockedEnglishSlugs(localizedCatalog);

      if (blockedEnglishSlugs.has(slug)) {
        return null;
      }

      const localized = readLocalizedPostUncached(locale, slug);
      if (localized) {
        const { content, ...meta } = localized;
        return { ...toPublicPost(meta), content };
      }

      const english = await getBlogPostBySlug(slug);
      if (!english) return null;
      return applyMetaOverlay(locale, english) as BlogPostFull;
    },
    ['localized-blog-post', locale, slug],
    { revalidate: BLOG_REVALIDATE_SEC },
  )();
}

export async function getLocalizedBlogSlugs(locale: LocaleCode): Promise<string[]> {
  const posts = await getLocalizedBlogPosts(locale);
  return posts.map((p) => p.slug);
}
