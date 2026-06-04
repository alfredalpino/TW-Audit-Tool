import { redirect } from 'next/navigation';

export default async function AdminChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/crm/chat/${id}`);
}
