'use client';

import React from 'react';
import Link from 'next/link';
import { useContactInfo } from '@/components/ContactInfoContext';
import { buildPathForLocale } from '@/lib/i18n/build-path';
import type { LocaleCode } from '@/lib/i18n/config';
import type { BlogPostPublic } from '@/lib/blog';

export function FeaturedPostCard({
  post,
  featuredLabel = 'Featured',
  readGuide = 'Read the guide →',
}: {
  post: BlogPostPublic;
  featuredLabel?: string;
  readGuide?: string;
}) {
  const { locale } = useContactInfo();
  const postHref = buildPathForLocale(locale as LocaleCode, `/blog/${post.slug}`);
  return (
    <div className="mb-10 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
      <span className="text-sm font-semibold uppercase tracking-wider text-[var(--brand)]">{featuredLabel}</span>
      <h2 className="tw-prose-flow mt-1 mb-2 font-display text-lg font-bold text-[var(--fg-primary)] md:text-xl">
        <Link
          href={postHref}
          className="text-[var(--brand)] transition-colors hover:text-[var(--brand-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] rounded"
        >
          {post.title}
        </Link>
      </h2>
      <p className="mb-3 text-sm leading-[1.6] text-[var(--fg-primary)]">{post.excerpt ?? post.title}</p>
      <Link
        href={postHref}
        className="text-sm font-semibold text-[var(--brand)] hover:text-[var(--brand-hover)] hover:underline"
      >
        {readGuide}
      </Link>
    </div>
  );
}
