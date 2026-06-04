import { loadConversations } from '@/lib/admin-conversations';
import { InboxView } from './InboxView';

export default async function CRMInboxPage() {
  const { conversations, error } = await loadConversations();

  return (
    <main className="min-w-0">
      <InboxView initialConversations={conversations} error={error} />
    </main>
  );
}
