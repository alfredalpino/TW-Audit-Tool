import Link from 'next/link';
import type { BlogPostPublic } from '@/lib/blog';

type RelatedPostsProps = {
  currentSlug: string;
  posts: BlogPostPublic[];
  /** Blog index path including locale prefix, e.g. `/blog`, `/en-in/blog`, `/fr/blog`. */
  basePath: string;
};

export function RelatedPosts({ currentSlug, posts, basePath }: RelatedPostsProps) {
  const related = posts.filter((post) => post.slug !== currentSlug).slice(0, 4);
  if (related.length === 0) return null;

  return (
    <section className="mt-12 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
      <h2 className="tw-prose-flow mb-4 font-display text-xl font-bold text-[var(--fg-primary)] md:text-2xl">
        Related Articles
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`${basePath}/${post.slug}`}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-base)]/60 px-4 py-3 text-sm leading-snug text-[var(--fg-secondary)] transition-colors hover:border-[var(--brand)]/50 hover:bg-[var(--bg-muted)] hover:text-[var(--brand)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]"
          >
            {post.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
