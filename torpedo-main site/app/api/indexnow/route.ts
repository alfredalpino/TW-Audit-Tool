import { NextRequest, NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/seo/site';

const INDEXNOW_API = 'https://api.indexnow.org/indexnow';

export async function POST(request: NextRequest) {
  const key = process.env.INDEXNOW_KEY;
  const keyFile = process.env.INDEXNOW_KEY_FILE;
  if (!key || !keyFile) {
    return NextResponse.json(
      { error: 'IndexNow not configured (INDEXNOW_KEY, INDEXNOW_KEY_FILE)' },
      { status: 503 }
    );
  }

  const authHeader = request.headers.get('authorization');
  const secret = process.env.INDEXNOW_API_SECRET;
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { urls?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const urls = Array.isArray(body.urls) ? body.urls : [];
  if (urls.length === 0) {
    return NextResponse.json({ error: 'urls array is required and must not be empty' }, { status: 400 });
  }

  const baseUrl = SITE_URL;
  const keyLocation = `${baseUrl}/${keyFile}`;
  const allowedUrl = new URL(baseUrl);
  const allowedOrigin = allowedUrl.origin;
  const allowedHost = allowedUrl.hostname;

  const validUrls: string[] = [];
  for (const u of urls) {
    try {
      const parsed = new URL(u);
      if (parsed.origin !== allowedOrigin || parsed.hostname !== allowedHost) {
        continue;
      }
      validUrls.push(u);
    } catch {
      // skip invalid URLs
    }
  }

  if (validUrls.length === 0) {
    return NextResponse.json({ error: 'No URLs allowed for this host' }, { status: 400 });
  }

  const payload = {
    host: allowedHost,
    key,
    keyLocation,
    urlList: validUrls,
  };

  const res = await fetch(INDEXNOW_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    return NextResponse.json(
      { error: 'IndexNow submission failed', status: res.status, body: text },
      { status: res.status >= 500 ? 502 : 400 }
    );
  }

  return NextResponse.json({ submitted: validUrls.length, urls: validUrls });
}
