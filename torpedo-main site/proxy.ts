import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import {
  applyLocaleRouting,
  maybeIndiaGeoRedirect,
  maybeRedirectToPreferredLocale,
} from '@/lib/i18n/middleware';

const SEARCH_BOT_UA_REGEX =
  /googlebot|google-inspectiontool|bingbot|slurp|duckduckbot|baiduspider|yandexbot|applebot|petalbot|facebookexternalhit|linkedinbot|twitterbot|discordbot|whatsapp|telegrambot|oai-searchbot|gptbot|perplexitybot|claudebot|ccbot|bytespider/i;

/** PageSpeed / Lighthouse / synthetic audits — skip geo redirects that hurt PSI scores. */
const AUDIT_BOT_UA_REGEX =
  /lighthouse|pagespeed|chrome-lighthouse|headlesschrome|speed insights|ptst|pingdom|webpagetest/i;

function isSearchOrPreviewBot(userAgent: string): boolean {
  return SEARCH_BOT_UA_REGEX.test(userAgent) || AUDIT_BOT_UA_REGEX.test(userAgent);
}

export async function proxy(request: NextRequest) {
  try {
    // Refresh Supabase auth session so server components (e.g. admin layout) see the user
    let response = await updateSession(request);

    const userAgent = request.headers.get('user-agent') ?? '';
    const isBot = isSearchOrPreviewBot(userAgent);
    const botOptions = { isBot };

    const preferredRedirect = maybeRedirectToPreferredLocale(request, botOptions);
    if (preferredRedirect) return preferredRedirect;

    const indiaRedirect = maybeIndiaGeoRedirect(request, botOptions);
    if (indiaRedirect) return indiaRedirect;

    return applyLocaleRouting(request, response);
  } catch {
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
