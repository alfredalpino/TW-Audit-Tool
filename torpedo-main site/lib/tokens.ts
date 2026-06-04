import { createHmac, randomBytes } from 'crypto';
import {
  PREVIEW_TOKEN_LENGTH,
  PREVIEW_TOKEN_CHARS,
  PREVIEW_JWT_TTL_SEC,
} from '@/lib/constants';

const SALT_ENV = 'PREVIEW_TOKEN_PEEK';
const JWT_SECRET_ENV = 'PREVIEW_JWT_SECRET';

export function getSalt(): string {
  const salt = process.env[SALT_ENV];
  if (!salt) throw new Error('PREVIEW_TOKEN_PEEK is not set');
  return salt;
}

export function getJwtSecret(): string {
  const secret = process.env[JWT_SECRET_ENV];
  if (!secret) throw new Error('PREVIEW_JWT_SECRET is not set');
  return secret;
}

export function hashToken(token: string): string {
  const salt = getSalt();
  return createHmac('sha256', salt).update(token).digest('hex');
}

export function generatePreviewToken(): string {
  const bytes = randomBytes(PREVIEW_TOKEN_LENGTH);
  let token = '';
  for (let i = 0; i < PREVIEW_TOKEN_LENGTH; i++) {
    token += PREVIEW_TOKEN_CHARS[bytes[i]! % PREVIEW_TOKEN_CHARS.length];
  }
  return token;
}

export interface PreviewJwtPayload {
  slug: string;
  exp: number;
  iat: number;
}

export function createPreviewJWT(slug: string): string {
  const secret = getJwtSecret();
  const now = Math.floor(Date.now() / 1000);
  const payload: PreviewJwtPayload = {
    slug,
    exp: now + PREVIEW_JWT_TTL_SEC,
    iat: now,
  };
  const header = { alg: 'HS256', typ: 'JWT' };
  const b64 = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url');
  const signature = createHmac('sha256', secret)
    .update(`${b64(header)}.${b64(payload)}`)
    .digest('base64url');
  return `${b64(header)}.${b64(payload)}.${signature}`;
}

export function verifyPreviewJWT(token: string): PreviewJwtPayload | null {
  try {
    const secret = getJwtSecret();
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sig] = parts;
    const expectedSig = createHmac('sha256', secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');
    if (sig !== expectedSig) return null;
    const payload = JSON.parse(
      Buffer.from(payloadB64!, 'base64url').toString('utf8')
    ) as PreviewJwtPayload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now || !payload.slug) return null;
    return payload;
  } catch {
    return null;
  }
}
