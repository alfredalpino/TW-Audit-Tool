import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';
import { GOOGLE_CALENDAR_APPOINTMENT_URL } from './lib/constants';
import { getLegacyEnglishSlugRedirects } from './lib/i18n/legacy-slug-redirects';
import { legacyServiceSlugRedirects } from './lib/seo/services';

function buildLegacyServiceRedirects() {
  return Object.entries(legacyServiceSlugRedirects).flatMap(([from, to]) => [
    { source: `/services/${from}`, destination: `/services/${to}`, permanent: true },
    { source: `/en-in/services/${from}`, destination: `/en-in/services/${to}`, permanent: true },
  ]);
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'gsap'],
    cssChunking: true,
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.target = ['web', 'es2022'];
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'book.torpedoweb.org' }],
        destination: GOOGLE_CALENDAR_APPOINTMENT_URL,
        permanent: false,
      },
      { source: '/blocked', destination: '/', permanent: true },
      { source: '/en-in/blocked', destination: '/en-in', permanent: true },
      { source: '/how-we-build', destination: '/process', permanent: true },
      { source: '/en-in/how-we-build', destination: '/en-in/process', permanent: true },
      { source: '/portfolio', destination: '/plans', permanent: true },
      { source: '/en-in/plans', destination: '/en-in/portfolio', permanent: true },
      { source: '/our-work', destination: '/plans', permanent: true },
      { source: '/en-in/our-work', destination: '/en-in/portfolio', permanent: true },
      { source: '/book', destination: GOOGLE_CALENDAR_APPOINTMENT_URL, permanent: true },
      { source: '/en-in/book', destination: GOOGLE_CALENDAR_APPOINTMENT_URL, permanent: true },
      { source: '/services/web3', destination: '/services', permanent: true },
      { source: '/en-in/services/web3', destination: '/en-in/services', permanent: true },
      ...buildLegacyServiceRedirects(),
      { source: '/es-mx', destination: '/es', permanent: true },
      { source: '/es-mx/:path*', destination: '/es/:path*', permanent: true },
      ...getLegacyEnglishSlugRedirects(),
    ];
  },
  // Lucide: import icons from `lucide-react/dist/esm/icons/<name>.js` (see types/lucide-react-subpaths.d.ts).
  // Use `next dev --webpack` and `next build --webpack` — Turbopack often breaks lucide icon chunks.
  async headers() {
    // In development, `immutable` caching on `/_next/static` breaks Turbopack/HMR: the browser
    // keeps old JS chunks while new modules load, causing lucide-react "module factory is not available" errors.
    // Only apply long-lived cache for production builds.
    if (process.env.NODE_ENV !== 'production') {
      return [];
    }
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
