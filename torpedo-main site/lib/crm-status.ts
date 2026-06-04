import { CRM_NEW_LEAD_IDLE_MINUTES } from '@/lib/constants';

export type StatusDisplay = { label: string; isOnline: boolean };

const IDLE_MS = CRM_NEW_LEAD_IDLE_MINUTES * 60 * 1000;

/**
 * Returns user-facing label and online/offline for CRM status display.
 * Label is always "Online" or "Offline". Uses lastActivityAt for status 'new' to decide.
 */
export function getStatusDisplay(
  status: string,
  lastActivityAt?: string | null
): StatusDisplay {
  const s = status ?? 'new';
  if (s === 'closed') {
    return { label: 'Offline', isOnline: false };
  }
  if (s === 'ai_chatting' || s === 'agent_joined') {
    return { label: 'Online', isOnline: true };
  }
  // status 'new': use lastActivityAt to decide online vs idle
  if (lastActivityAt) {
    const age = Date.now() - new Date(lastActivityAt).getTime();
    if (age > IDLE_MS) {
      return { label: 'Offline', isOnline: false };
    }
  }
  return { label: 'Online', isOnline: true };
}
