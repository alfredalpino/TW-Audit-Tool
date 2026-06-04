'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect, useRef } from 'react';
import { getStatusDisplay } from '@/lib/crm-status';

export type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  created_at: string;
  conversationId: string | null;
  deleted_at?: string | null;
};

export function LeadsView({
  initialLeads,
  error: initialError,
}: {
  initialLeads: LeadRow[];
  error?: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<'active' | 'deleted'>('active');
  const [activeLeads, setActiveLeads] = useState<LeadRow[]>(initialLeads);
  const prevInitialRef = useRef(initialLeads);
  useEffect(() => {
    if (prevInitialRef.current !== initialLeads) {
      prevInitialRef.current = initialLeads;
      setActiveLeads(initialLeads);
    }
  }, [initialLeads]);

  const [deletedLeads, setDeletedLeads] = useState<LeadRow[] | null>(null);
  const [loadingDeleted, setLoadingDeleted] = useState(false);
  const [editLead, setEditLead] = useState<LeadRow | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<LeadRow | null>(null);
  const [busy, setBusy] = useState(false);

  const leads = tab === 'active' ? activeLeads : (deletedLeads ?? []);
  const showDeleted = tab === 'deleted';

  const fetchDeleted = useCallback(async () => {
    setLoadingDeleted(true);
    try {
      const res = await fetch('/api/admin/leads?deleted=true');
      const data = (await res.json()) as { leads?: LeadRow[] };
      setDeletedLeads(data.leads ?? []);
    } catch {
      setDeletedLeads([]);
    } finally {
      setLoadingDeleted(false);
    }
  }, []);

  const handleTabChange = (t: 'active' | 'deleted') => {
    setTab(t);
    if (t === 'deleted' && deletedLeads === null) void fetchDeleted();
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLead || busy) return;
    const form = e.currentTarget;
    const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value?.trim();
    const email = (form.querySelector('[name="email"]') as HTMLInputElement)?.value?.trim();
    const phone = (form.querySelector('[name="phone"]') as HTMLInputElement)?.value?.trim() || null;
    const status = (form.querySelector('[name="status"]') as HTMLSelectElement)?.value;
    if (!name || !email) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/leads/${editLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, status }),
      });
      if (res.ok) {
        setEditLead(null);
        router.refresh();
        setActiveLeads((prev) =>
          prev.map((l) =>
            l.id === editLead.id ? { ...l, name, email, phone, status } : l
          )
        );
      }
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (lead: LeadRow) => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteConfirm(null);
        router.refresh();
        setActiveLeads((prev) => prev.filter((l) => l.id !== lead.id));
      }
    } finally {
      setBusy(false);
    }
  };

  const handleRestore = async (lead: LeadRow) => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/restore`, { method: 'POST' });
      if (res.ok) {
        router.refresh();
        setDeletedLeads((prev) => (prev ?? []).filter((l) => l.id !== lead.id));
        setActiveLeads((prev) => [...prev, { ...lead, deleted_at: null }]);
      }
    } finally {
      setBusy(false);
    }
  };

  if (initialError) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
        <p className="font-medium text-amber-800">Failed to load leads</p>
        <p className="mt-1 text-sm text-amber-700">Refresh the page or try again in a moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[#0A0A0B] sm:text-2xl">Leads</h2>
          <p className="mt-1 text-sm text-gray-600">Manage and follow up with contacts from the chat widget.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200/90 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex gap-0" aria-label="Tabs">
            <button
              type="button"
              onClick={() => handleTabChange('active')}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                tab === 'active'
                  ? 'border-[#FF4F00] text-[#FF4F00]'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('deleted')}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                tab === 'deleted'
                  ? 'border-[#FF4F00] text-[#FF4F00]'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Deleted
            </button>
          </nav>
        </div>

        {tab === 'deleted' && loadingDeleted ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-gray-500">Loading deleted leads…</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="px-4 py-3.5 font-semibold text-[#0A0A0B]">Name</th>
                  <th className="px-4 py-3.5 font-semibold text-[#0A0A0B]">Email</th>
                  <th className="hidden px-4 py-3.5 font-semibold text-[#0A0A0B] sm:table-cell">Phone</th>
                  <th className="px-4 py-3.5 font-semibold text-[#0A0A0B]">Status</th>
                  <th className="hidden px-4 py-3.5 font-semibold text-[#0A0A0B] md:table-cell">Created</th>
                  <th className="px-4 py-3.5 font-semibold text-[#0A0A0B]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                      {showDeleted ? 'No deleted leads.' : 'No leads yet.'}
                    </td>
                  </tr>
                ) : (
                  leads.map((l) => (
                    <tr
                      key={l.id}
                      className="border-b border-gray-100 transition-colors hover:bg-gray-50/50"
                    >
                      <td className="px-4 py-3.5 font-medium text-[#0A0A0B]">{l.name}</td>
                      <td className="px-4 py-3.5 text-[#0A0A0B]">{l.email}</td>
                      <td className="hidden px-4 py-3.5 text-gray-600 sm:table-cell">{l.phone ?? '—'}</td>
                      <td className="px-4 py-3.5">
                        {!showDeleted && (() => {
                          const { label, isOnline } = getStatusDisplay(l.status);
                          return (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs font-medium">
                              <span
                                className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
                                aria-hidden
                              />
                              {label}
                            </span>
                          );
                        })()}
                        {showDeleted && (
                          <span className="text-xs text-gray-500">
                            Deleted {l.deleted_at ? new Date(l.deleted_at).toLocaleDateString() : ''}
                          </span>
                        )}
                      </td>
                      <td className="hidden px-4 py-3.5 text-gray-600 md:table-cell">
                        {new Date(l.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap items-center gap-2">
                          {showDeleted ? (
                            <button
                              type="button"
                              onClick={() => handleRestore(l)}
                              disabled={busy}
                              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#FF4F00] transition-colors hover:bg-[#FF4F00]/10 disabled:opacity-50"
                            >
                              Restore
                            </button>
                          ) : (
                            <>
                              {l.conversationId && (
                                <Link
                                  href={`/crm/chat/${l.conversationId}`}
                                  className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#FF4F00] transition-colors hover:bg-[#FF4F00]/10"
                                >
                                  Chat
                                </Link>
                              )}
                              <button
                                type="button"
                                onClick={() => setEditLead(l)}
                                disabled={busy}
                                className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#0A0A0B] disabled:opacity-50"
                                aria-label="Edit lead"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                                  <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirm(l)}
                                disabled={busy}
                                className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                aria-label="Delete lead"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                                  <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-lead-title">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-xl">
            <h3 id="edit-lead-title" className="border-b border-gray-100 px-4 py-3 text-lg font-semibold text-[#0A0A0B]">Edit lead</h3>
            <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Name</label>
                <input id="edit-name" name="name" type="text" defaultValue={editLead.name} required className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#FF4F00] focus:ring-1 focus:ring-[#FF4F00]" />
              </div>
              <div>
                <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">Email</label>
                <input id="edit-email" name="email" type="email" defaultValue={editLead.email} required className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#FF4F00] focus:ring-1 focus:ring-[#FF4F00]" />
              </div>
              <div>
                <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input id="edit-phone" name="phone" type="tel" defaultValue={editLead.phone ?? ''} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#FF4F00] focus:ring-1 focus:ring-[#FF4F00]" />
              </div>
              <div>
                <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">Status</label>
                <select id="edit-status" name="status" defaultValue={editLead.status} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#FF4F00] focus:ring-1 focus:ring-[#FF4F00]">
                  <option value="new">New</option>
                  <option value="ai_chatting">AI chatting</option>
                  <option value="agent_joined">Agent joined</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditLead(null)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={busy} className="rounded-lg bg-[#FF4F00] px-3 py-2 text-sm font-medium text-white hover:bg-[#E64800] disabled:opacity-50">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="delete-lead-title">
          <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
            <h3 id="delete-lead-title" className="font-semibold text-[#0A0A0B]">Delete lead?</h3>
            <p className="mt-2 text-sm text-gray-600">This will move &quot;{deleteConfirm.name}&quot; to Deleted. You can restore them later.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setDeleteConfirm(null)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={() => handleDelete(deleteConfirm)} disabled={busy} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
