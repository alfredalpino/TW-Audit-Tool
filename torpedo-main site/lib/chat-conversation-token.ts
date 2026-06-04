import { createHmac, timingSafeEqual } from 'crypto';

/** Visitor token lifetime (30 days). */
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function getSecret(): string | null {
  const secret = process.env.CHAT_CONVERSATION_SECRET?.trim();
  return secret || null;
}

export function isConversationTokenConfigured(): boolean {
  return Boolean(getSecret());
}

/** HMAC token: `{conversationId}.{exp}.{sig}` */
export function signConversationToken(conversationId: string): string | null {
  const secret = getSecret();
  if (!secret) return null;

  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = `${conversationId}.${exp}`;
  const sig = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyConversationToken(conversationId: string, token: string): boolean {
  const secret = getSecret();
  if (!secret || !token) return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [id, expStr, sig] = parts;
  if (id !== conversationId) return false;

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  const payload = `${id}.${exp}`;
  const expected = createHmac('sha256', secret).update(payload).digest('base64url');
  if (sig.length !== expected.length) return false;

  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function extractBearerToken(request: Request): string | null {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7).trim();
  return token || null;
}
