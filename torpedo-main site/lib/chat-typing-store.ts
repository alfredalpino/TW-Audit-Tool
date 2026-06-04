/**
 * In-memory typing indicator store with TTL (e.g. 5s).
 * Keys: `${conversationId}:user` and `${conversationId}:agent`. Value: expiresAt number.
 * For multi-instance deployments (e.g. Vercel serverless), replace with a shared store:
 * e.g. a Supabase table (conversation_id, role, expires_at) or Supabase Realtime
 * so typing state is consistent across instances. Keep setTyping/clearTyping/isTyping API.
 */

const TTL_MS = 5000;
const store = new Map<string, number>();

function key(conversationId: string, role: 'user' | 'agent'): string {
  return `${conversationId}:${role}`;
}

function prune(): void {
  const now = Date.now();
  for (const [k, expiresAt] of store.entries()) {
    if (expiresAt <= now) store.delete(k);
  }
}

export function setTyping(conversationId: string, role: 'user' | 'agent'): void {
  prune();
  store.set(key(conversationId, role), Date.now() + TTL_MS);
}

export function clearTyping(conversationId: string, role: 'user' | 'agent'): void {
  store.delete(key(conversationId, role));
}

export function isTyping(conversationId: string, role: 'user' | 'agent'): boolean {
  prune();
  const expiresAt = store.get(key(conversationId, role));
  return Boolean(expiresAt && expiresAt > Date.now());
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidConversationId(id: string): boolean {
  return typeof id === 'string' && UUID_REGEX.test(id.trim());
}
