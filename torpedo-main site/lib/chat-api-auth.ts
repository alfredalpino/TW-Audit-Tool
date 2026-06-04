import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import {
  extractBearerToken,
  verifyConversationToken,
} from '@/lib/chat-conversation-token';

/**
 * Allow access when the request presents a valid visitor token for the conversation,
 * or when the caller is an authenticated admin (CRM).
 */
export async function requireConversationAccess(
  request: Request,
  conversationId: string
): Promise<NextResponse | null> {
  const token = extractBearerToken(request);
  if (token && verifyConversationToken(conversationId, token)) {
    return null;
  }

  const admin = await requireAdmin();
  if (admin) return null;

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
