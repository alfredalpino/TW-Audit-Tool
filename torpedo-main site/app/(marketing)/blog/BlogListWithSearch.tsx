'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import type { BlogPostPublic } from '@/lib/blog';
import type { BlogIndexCopy } from '@/lib/i18n/blog-metadata';
import { useContactInfo } from '@/components/ContactInfoContext';
import { buildPathForLocale } from '@/lib/i18n/build-path';
import type { LocaleCode } from '@/lib/i18n/config';

function getYear(date: string | null): string | null {
  if (!date) return null;
  const y = new Date(date).getFullYear();
  return Number.isNaN(y) ? null : String(y);
}

type Props = { posts: BlogPostPublic[]; copy: BlogIndexCopy; locale: LocaleCode };

export function BlogListWithSearch({ posts, copy, locale }: Props) {
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState<string | null>(null);
  const postHref = (slug: string) => buildPathForLocale(locale, `/blog/${slug}`);

  const years = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      const y = getYear(p.date);
      if (y) set.add(y);
    });
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [posts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((post) => {
      const matchYear = !yearFilter || getYear(post.date) === yearFilter;
      if (!matchYear) return false;
      if (!q) return true;
      const title = (post.title ?? '').toLowerCase();
      const excerpt = (post.excerpt ?? '').toLowerCase();
      const slug = (post.slug ?? '').toLowerCase();
      return title.includes(q) || excerpt.includes(q) || slug.includes(q);
    });
  }, [posts, search, yearFilter]);

  const dateLocale = locale.startsWith('ar') ? 'ar-AE' : locale.replace('_', '-');

  if (posts.length === 0) {
    return <p className="text-sm text-[var(--fg-secondary)]">{copy.postsComingSoon}</p>;
  }

  return (
    <section aria-label={copy.listAriaLabel} className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <label htmlFor="blog-search" className="sr-only">
            {copy.searchLabel}
          </label>
          <input
            id="blog-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={copy.searchPlaceholder}
            className="w-full max-w-[min(100%,23.8rem)] rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm text-[var(--fg-primary)] placeholder:text-[var(--fg-tertiary)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            aria-describedby="blog-result-count"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-[var(--fg-secondary)]">{copy.yearLabel}</span>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label={copy.yearLabel}>
            <button
              type="button"
              onClick={() => setYearFilter(null)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                yearFilter === null
                  ? 'bg-[var(--brand)] text-[var(--brand-fg)]'
                  : 'bg-[var(--bg-muted)] text-[var(--fg-secondary)] hover:bg-[var(--bg-ghost)]'
              }`}
            >
              {copy.yearAll}
            </button>
            {years.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setYearFilter(y)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  yearFilter === y
                    ? 'bg-[var(--brand)] text-[var(--brand-fg)]'
                    : 'bg-[var(--bg-muted)] text-[var(--fg-secondary)] hover:bg-[var(--bg-ghost)]'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p id="blog-result-count" className="text-sm text-[var(--fg-secondary)]" aria-live="polite">
        {filtered.length === 0
          ? copy.noResults
          : filtered.length === 1
            ? copy.resultCountOne
            : `${filtered.length} ${copy.resultCountOther}`}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-muted)]/40 py-12 text-center text-[var(--fg-secondary)]">
          {copy.emptyFilterHint}
        </div>
      ) : (
        <ul className="space-y-6" role="list">
          {filtered.map((post) => (
            <li key={post.slug}>
              <article className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 transition-all hover:border-[var(--brand)]/40 hover:shadow-md md:p-6">
                {post.date && (
                  <time dateTime={post.date} className="mb-2 block text-sm text-[var(--fg-tertiary)]">
                    {new Date(post.date).toLocaleDateString(dateLocale, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                )}
                <h2 className="tw-prose-flow mb-2 font-display text-xl font-bold text-[var(--fg-primary)] md:text-2xl">
                  <Link
                    href={postHref(post.slug)}
                    className="text-[var(--brand)] transition-colors hover:text-[var(--brand-hover)] focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
                  >
                    {post.title}
                  </Link>
                </h2>
                {post.excerpt && (
                  <p className="mb-4 line-clamp-3 leading-[1.6] text-[var(--fg-primary)]">{post.excerpt}</p>
                )}
                <Link
                  href={postHref(post.slug)}
                  className="text-sm font-semibold text-[var(--brand)] hover:text-[var(--brand-hover)] hover:underline"
                >
                  {copy.readMore}
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
