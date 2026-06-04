import { getBlogPosts } from '@/lib/blog';
import { cities } from '@/lib/seo/cities';
import { listicleTopics } from '@/lib/seo/listicles';
import { SITE_URL } from '@/lib/seo/site';
import { services } from '@/lib/seo/services';

function summarizeExcerpt(excerpt: string | null): string {
  if (!excerpt) return 'Strategic implementation guide for growth-focused teams.';
  return excerpt.replace(/\s+/g, ' ').trim();
}

export async function GET() {
  const posts = await getBlogPosts();

  const blogLines = posts
    .map((post) => {
      const summary = summarizeExcerpt(post.excerpt);
      return `- ${post.title}\n  URL: ${SITE_URL}/en-in/blog/${post.slug}\n  Summary: ${summary}`;
    })
    .join('\n');

  const cityLines = cities.map((city) => `- ${city.name}, ${city.state}: ${SITE_URL}/en-in/${city.slug}`).join('\n');

  const serviceLines = services
    .map((service) => `- ${service.name}\n  URL: ${SITE_URL}/en-in/services/${service.slug}\n  Summary: ${service.intro}`)
    .join('\n');

  const listicleLines = listicleTopics
    .map((topic) => `- ${topic.title}\n  URL: ${SITE_URL}/en-in/best/${topic.slug}\n  Keyword: ${topic.keyword}`)
    .join('\n');

  const content = `# Torpedo Web LLM Index (Full)

This file is intended for AI retrieval and indexing systems.

## Services
${serviceLines}

## City Landing Pages
${cityLines}

## Comparison Pages
${listicleLines}

## Blog Articles
${blogLines}
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
