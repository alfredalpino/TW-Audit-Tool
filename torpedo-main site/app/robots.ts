import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/site';

const baseUrl = SITE_URL;

export default function robots(): MetadataRoute.Robots {
  const guardedPaths = ['/api/', '/admin/', '/crm/', '/portal/'];
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: guardedPaths },
      { userAgent: 'Googlebot', allow: '/', disallow: guardedPaths },
      { userAgent: 'Bingbot', allow: '/', disallow: guardedPaths },
      { userAgent: 'GPTBot', allow: '/', disallow: guardedPaths },
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: guardedPaths },
      { userAgent: 'PerplexityBot', allow: '/', disallow: guardedPaths },
      { userAgent: 'ClaudeBot', allow: '/', disallow: guardedPaths },
      { userAgent: 'Google-Extended', allow: '/', disallow: guardedPaths },
      { userAgent: 'CCBot', allow: '/', disallow: guardedPaths },
      { userAgent: 'Bytespider', allow: '/', disallow: guardedPaths },
    ],
    host: new URL(baseUrl).host,
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
