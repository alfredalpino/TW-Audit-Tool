import fs from 'fs';
import path from 'path';
import type { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/blog';
import { cities } from '@/lib/seo/cities';
import { publishedLocalSeoPages } from '@/lib/seo/local-pages';
import { listicleTopics } from '@/lib/seo/listicles';
import { globalMarkets, publishedServiceMarkets, getMarketPath, getServiceMarketPath } from '@/lib/seo/global-markets';
import { services } from '@/lib/seo/services';
import {
  SITE_URL,
  buildSitemapLanguageAlternates,
  isGloballyLocalizedBasePath,
} from '@/lib/seo/site';

const baseUrl = SITE_URL;
const MARKETING_APP_DIR = path.join(process.cwd(), 'app', '(marketing)');
type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
type SitemapEntry = MetadataRoute.Sitemap[number];

function withLanguageAlternates(
  entry: SitemapEntry,
  pathname: string,
  includeAlternates: boolean,
): SitemapEntry {
  if (!includeAlternates) return entry;
  return {
    ...entry,
    alternates: {
      languages: buildSitemapLanguageAlternates(pathname),
    },
  };
}

function collectMarketingPageFiles(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const pageFiles: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      pageFiles.push(...collectMarketingPageFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name === 'page.tsx') {
      pageFiles.push(fullPath);
    }
  }

  return pageFiles;
}

function pageFileToRoute(filePath: string): string | null {
  const relativePath = path.relative(MARKETING_APP_DIR, filePath);
  const routeSegments = relativePath
    .replace(/(^|\/)page\.tsx$/, '')
    .split(path.sep)
    .filter(Boolean)
    .filter((segment) => !segment.startsWith('(') && !segment.endsWith(')'));

  if (routeSegments.some((segment) => segment.includes('['))) return null;

  const route = routeSegments.length ? `/${routeSegments.join('/')}` : '/';
  return route;
}

function getMarketingStaticRoutes(): string[] {
  const routeSet = new Set<string>();
  const pageFiles = collectMarketingPageFiles(MARKETING_APP_DIR);
  for (const filePath of pageFiles) {
    const route = pageFileToRoute(filePath);
    if (route) routeSet.add(route);
  }
  return [...routeSet].sort();
}

function getStaticRouteMeta(route: string): { changeFrequency: ChangeFrequency; priority: number } {
  if (route === '/') return { changeFrequency: 'weekly', priority: 1 };
  if (route === '/blog' || route === '/en-in/blog') return { changeFrequency: 'daily', priority: 0.95 };
  if (route.startsWith('/services') || route.includes('/portfolio')) return { changeFrequency: 'weekly', priority: 0.9 };
  if (route.startsWith('/plans')) return { changeFrequency: 'weekly', priority: 0.9 };
  if (route.includes('terms-of-service') || route.includes('privacy-policy') || route.includes('/dmca')) {
    return { changeFrequency: 'yearly', priority: 0.4 };
  }
  return { changeFrequency: 'weekly', priority: 0.85 };
}

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const generatedAt = new Date();
  const marketingRoutes = getMarketingStaticRoutes();

  const staticEntries = marketingRoutes.map((route) => {
    const meta = getStaticRouteMeta(route);
    return withLanguageAlternates(
      {
        url: `${baseUrl}${route}`,
        lastModified: generatedAt,
        changeFrequency: meta.changeFrequency,
        priority: meta.priority,
      },
      route,
      isGloballyLocalizedBasePath(route),
    );
  });

  const posts = await getBlogPosts();
  const blogEntries = posts.flatMap((post) => {
    const blogDate = post.date ? new Date(post.date) : null;
    const lastModified = blogDate && !Number.isNaN(blogDate.getTime()) ? blogDate : generatedAt;
    const ageInDays = Math.floor((generatedAt.getTime() - lastModified.getTime()) / (1000 * 60 * 60 * 24));
    const isRecentPost = ageInDays >= 0 && ageInDays <= 14;
    const blogPriority = isRecentPost ? 0.86 : 0.8;
    const blogChangeFrequency = isRecentPost ? ('weekly' as const) : ('monthly' as const);
    const blogBasePath = `/blog/${post.slug}`;

    return [
      withLanguageAlternates(
        {
          url: `${baseUrl}${blogBasePath}`,
          lastModified,
          changeFrequency: blogChangeFrequency,
          priority: blogPriority,
        },
        blogBasePath,
        true,
      ),
      withLanguageAlternates(
        {
          url: `${baseUrl}/en-in${blogBasePath}`,
          lastModified,
          changeFrequency: blogChangeFrequency,
          priority: blogPriority,
        },
        `/en-in${blogBasePath}`,
        true,
      ),
    ];
  });

  const cityEntries = cities.map((city) => ({
    url: `${baseUrl}/en-in/${city.slug}`,
    lastModified: generatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.88,
  }));

  const serviceEntries = services.map((service) =>
    withLanguageAlternates(
      {
        url: `${baseUrl}/en-in/services/${service.slug}`,
        lastModified: generatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
      `/en-in/services/${service.slug}`,
      true,
    ),
  );

  const listicleEntries = listicleTopics.map((topic) => ({
    url: `${baseUrl}/en-in/best/${topic.slug}`,
    lastModified: generatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.87,
  }));

  const localIntentEntries = publishedLocalSeoPages.map((page) => ({
    url: `${baseUrl}/en-in/local/${page.urlSlug}`,
    lastModified: generatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.89,
  }));

  const globalMarketEntries = globalMarkets.map((market) =>
    withLanguageAlternates(
      {
        url: `${baseUrl}${getMarketPath(market.id)}`,
        lastModified: generatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.84,
      },
      getMarketPath(market.id),
      true,
    ),
  );

  const globalServiceEntries = publishedServiceMarkets.map((combo) =>
    withLanguageAlternates(
      {
        url: `${baseUrl}${getServiceMarketPath(combo.slug)}`,
        lastModified: generatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.83,
      },
      getServiceMarketPath(combo.slug),
      true,
    ),
  );

  return [
    ...staticEntries,
    ...cityEntries,
    ...serviceEntries,
    ...listicleEntries,
    ...localIntentEntries,
    ...globalMarketEntries,
    ...globalServiceEntries,
    ...blogEntries,
  ];
}
