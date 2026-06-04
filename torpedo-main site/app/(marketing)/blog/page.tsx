import React from 'react';
import type { Metadata } from 'next';
import { buildItemList } from '@/lib/seo/schema';
import { toAbsoluteUrl } from '@/lib/seo/site';
import {
  buildBlogIndexPath,
  getBlogIndexCopy,
} from '@/lib/i18n/blog-metadata';
import { buildLocaleMetadata } from '@/lib/i18n/seo-metadata';
import { getRequestLocale } from '@/lib/i18n/server';
import { getLocalizedBlogPosts } from '@/lib/blog-localized';
import { BlogListWithSearch } from './BlogListWithSearch';
import { BackToHomeLinkSm } from '@/components/BackToHomeLink';
import { FeaturedPostCard } from './FeaturedPostCard';
import { BlogHeroHeadline } from '@/components/blog/BlogHeroHeadline';

/** Slug of the post to highlight in the Featured section (revenue-focused / conversion). */
const FEATURED_POST_SLUG = 'future-of-ownership-proprietary-ecommerce-infrastructure';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildLocaleMetadata('/blog', locale, 'blog');
}

export default async function BlogPage() {
  const locale = await getRequestLocale();
  const copy = getBlogIndexCopy(locale);
  const posts = await getLocalizedBlogPosts(locale);
  const featuredPost = posts.find((p) => p.slug === FEATURED_POST_SLUG) ?? posts[0];
  const blogPath = buildBlogIndexPath(locale);
  const listSchema = buildItemList(
    copy.schemaListName,
    posts.slice(0, 30).map((post) => ({ name: post.title, url: toAbsoluteUrl(`${blogPath}/${post.slug}`) })),
  );

  return (
    <main id="main-content" className="flex min-h-screen w-full flex-col bg-[var(--bg-base)] text-[var(--fg-primary)]">
      <div className="tw-blog-section pb-20 pt-6 md:pb-24 md:pt-8">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
        />
        <BackToHomeLinkSm variant="dark" />
        <BlogHeroHeadline title={copy.heroTitle} />
        <p className="tw-blog-intro tw-prose-flow mt-4 leading-[1.6] text-[var(--fg-secondary)]">
          {copy.heroIntro}
        </p>
        {featuredPost && <FeaturedPostCard post={featuredPost} featuredLabel={copy.featuredLabel} readGuide={copy.readGuide} />}
        <BlogListWithSearch posts={posts} copy={copy} locale={locale} />
      </div>
    </main>
  );
}
