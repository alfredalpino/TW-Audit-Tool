/** Browser-only helpers for visitor conversation tokens (not secrets in URLs). */

const CHAT_TOKENS_KEY = 'torpedo_chat_tokens';

export function getStoredConversationToken(conversationId: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CHAT_TOKENS_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, string>;
    const token = map[conversationId];
    return typeof token === 'string' && token.length > 0 ? token : null;
  } catch {
    return null;
  }
}

export function storeConversationToken(conversationId: string, token: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(CHAT_TOKENS_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, string>) : {};
    map[conversationId] = token;
    localStorage.setItem(CHAT_TOKENS_KEY, JSON.stringify(map));
  } catch {
    // ignore quota / private mode
  }
}

export function chatAuthHeaders(conversationId: string | null): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (conversationId) {
    const token = getStoredConversationToken(conversationId);
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export function chatAuthHeadersForGet(conversationId: string | null): HeadersInit {
  if (!conversationId) return {};
  const token = getStoredConversationToken(conversationId);
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
