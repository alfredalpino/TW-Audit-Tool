const WP_HEADERS_TO_STRIP = [
  'content-encoding',
  'transfer-encoding',
  'content-length',
  'connection',
  'set-cookie',
  'x-frame-options',
  'content-security-policy',
  'x-content-type-options',
];

export async function fetchFromWordPress(
  baseUrl: string,
  path: string,
  headers?: HeadersInit
): Promise<Response> {
  const url = new URL(path, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
  const res = await fetch(url.toString(), {
    headers: {
      ...(headers && 'forEach' in headers
        ? Object.fromEntries(
            (headers as Headers).entries()
          )
        : (headers as Record<string, string>)),
      'user-agent': 'Torpedo-Preview-Proxy/1',
    },
    redirect: 'follow',
  });
  return res;
}

export function stripWpHeaders(original: Headers): Headers {
  const next = new Headers();
  original.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (WP_HEADERS_TO_STRIP.includes(lower)) return;
    next.set(key, value);
  });
  next.set('x-content-type-options', 'nosniff');
  return next;
}
