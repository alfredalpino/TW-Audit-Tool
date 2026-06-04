import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/service';
import { CRMConversationView } from './CRMConversationView';

export default async function CRMChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', id)
    .single();
  if (!data) notFound();
  return <CRMConversationView conversationId={id} />;
}
