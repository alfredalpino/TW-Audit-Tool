import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MarkdownProse } from '@/components/MarkdownProse';
import { BackToBlogLink } from '@/components/BackToHomeLink';
import { RelatedPosts } from '@/components/seo/RelatedPosts';
import { buildArticle, buildBreadcrumb } from '@/lib/seo/schema';
import { toAbsoluteUrl } from '@/lib/seo/site';
import { getRequestLocale } from '@/lib/i18n/server';
import {
  buildBlogIndexPath,
  buildBlogPostMetadata,
  buildBlogPostPath,
  formatBlogDate,
  getBlogIndexCopy,
} from '@/lib/i18n/blog-metadata';
import { getLocalizedBlogPost, getLocalizedBlogPosts, getLocalizedBlogSlugs } from '@/lib/blog-localized';
import { buildPathForLocale } from '@/lib/i18n/config';

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getLocalizedBlogSlugs('en-US');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const post = await getLocalizedBlogPost(locale, slug);
  if (!post) return { title: 'Post not found' };
  return buildBlogPostMetadata(locale, slug, post);
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const post = await getLocalizedBlogPost(locale, slug);
  if (!post) notFound();
  const allPosts = await getLocalizedBlogPosts(locale);
  const copy = getBlogIndexCopy(locale);

  const { title, date, excerpt, content } = post;
  const blogPath = buildBlogIndexPath(locale);
  const postPath = buildBlogPostPath(locale, slug);
  const homePath = buildPathForLocale(locale, '/');
  const url = toAbsoluteUrl(postPath);
  const schemaGraph = [
    buildBreadcrumb([
      { name: 'Home', url: toAbsoluteUrl(homePath) },
      { name: copy.breadcrumbBlog, url: toAbsoluteUrl(blogPath) },
      { name: title, url },
    ]),
    buildArticle({
      headline: title,
      description: excerpt ?? undefined,
      url,
      datePublished: date,
      dateModified: date,
    }),
  ];

  return (
    <main id="main-content" className="flex min-h-screen w-full flex-col bg-[var(--bg-base)] text-[var(--fg-primary)]">
      <div className="tw-blog-section tw-blog-article pb-20 pt-6 md:pb-24 md:pt-8">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
        />
        <BackToBlogLink />
        <article>
          <h1 className="tw-heading-section mb-4 font-display font-bold tracking-tight text-[var(--fg-primary)]">
            {title}
          </h1>
          {date && (
            <time dateTime={date} className="mb-6 block text-sm text-[var(--fg-tertiary)]">
              {formatBlogDate(date, locale)}
            </time>
          )}
          {excerpt && (
            <p className="mb-8 text-lg leading-relaxed text-[var(--fg-primary)]">{excerpt}</p>
          )}
          <MarkdownProse content={content} />
        </article>
        <RelatedPosts currentSlug={slug} posts={allPosts} basePath={blogPath} />
      </div>
    </main>
  );
}
