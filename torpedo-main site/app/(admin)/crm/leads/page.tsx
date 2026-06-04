import { getLeadsForAdmin } from '@/lib/admin-data';
import { LeadsView } from './LeadsView';

export default async function CRMLeadsPage() {
  const { leads, error } = await getLeadsForAdmin(false);

  return (
    <main className="min-w-0">
      <LeadsView initialLeads={leads} error={error} />
    </main>
  );
}
