'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect, useRef } from 'react';
import { getStatusDisplay } from '@/lib/crm-status';

export type ConversationRow = {
  id: string;
  lead_id: string;
  created_at: string;
  deleted_at?: string | null;
  lead: { id: string; name: string; email: string; phone: string | null; status: string } | null;
  lastMessage: { message: string; created_at: string; sender: string } | null;
  lastActivityAt: string;
};

export function InboxView({
  initialConversations,
  error: initialError,
}: {
  initialConversations: ConversationRow[];
  error?: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<'active' | 'deleted'>('active');
  const [activeConversations, setActiveConversations] = useState<ConversationRow[]>(initialConversations);
  const prevInitialRef = useRef(initialConversations);
  useEffect(() => {
    if (prevInitialRef.current !== initialConversations) {
      prevInitialRef.current = initialConversations;
      setActiveConversations(initialConversations);
    }
  }, [initialConversations]);

  const [deletedConversations, setDeletedConversations] = useState<ConversationRow[] | null>(null);
  const [loadingDeleted, setLoadingDeleted] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<ConversationRow | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const selectAllRef = useRef<HTMLInputElement | null>(null);

  const conversations = tab === 'active' ? activeConversations : (deletedConversations ?? []);
  const showDeleted = tab === 'deleted';

  const fetchDeleted = useCallback(async () => {
    setLoadingDeleted(true);
    try {
      const res = await fetch('/api/admin/conversations?deleted=true');
      const data = (await res.json()) as { conversations?: ConversationRow[] };
      setDeletedConversations(data.conversations ?? []);
    } catch {
      setDeletedConversations([]);
    } finally {
      setLoadingDeleted(false);
    }
  }, []);

  const handleTabChange = (t: 'active' | 'deleted') => {
    setTab(t);
    setSelectedIds(new Set());
    if (t === 'deleted' && deletedConversations === null) void fetchDeleted();
  };

  const activeIds = activeConversations.map((c) => c.id);
  const isAllSelected = activeIds.length > 0 && activeIds.every((id) => selectedIds.has(id));
  const isSomeSelected = selectedIds.size > 0;

  useEffect(() => {
    const el = selectAllRef.current;
    if (el) el.indeterminate = isSomeSelected && !isAllSelected;
  }, [isSomeSelected, isAllSelected]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(activeIds));
  };

  const handleBulkDelete = async () => {
    if (busy || selectedIds.size === 0) return;
    const idsToDelete = new Set(selectedIds);
    setBusy(true);
    setBulkError(null);
    try {
      const res = await fetch('/api/admin/conversations/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [...idsToDelete] }),
      });
      if (res.ok) {
        setBulkDeleteConfirm(false);
        setSelectedIds(new Set());
        router.refresh();
        setActiveConversations((prev) => prev.filter((c) => !idsToDelete.has(c.id)));
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string; hint?: string };
        setBulkError([data.error ?? 'Failed to delete. Try again.', data.hint].filter(Boolean).join(''));
      }
    } catch {
      setBulkError('Request failed. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (c: ConversationRow) => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/conversations/${c.id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteConfirm(null);
        router.refresh();
        setActiveConversations((prev) => prev.filter((x) => x.id !== c.id));
      }
    } finally {
      setBusy(false);
    }
  };

  const handleRestore = async (c: ConversationRow) => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/conversations/${c.id}/restore`, { method: 'POST' });
      if (res.ok) {
        router.refresh();
        setDeletedConversations((prev) => (prev ?? []).filter((x) => x.id !== c.id));
        setActiveConversations((prev) => [...prev, { ...c, deleted_at: null }]);
      }
    } finally {
      setBusy(false);
    }
  };

  if (initialError) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
        <p className="font-medium text-amber-800">Failed to load conversations</p>
        <p className="mt-1 text-sm text-amber-700">Refresh the page or try again in a moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-[#0A0A0B] sm:text-2xl">Inbox</h2>
        <p className="mt-1 text-sm text-gray-600">
          Open a conversation to reply. Use &quot;Join conversation&quot; so the visitor sees an agent has joined.
        </p>
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
            <p className="text-sm text-gray-500">Loading deleted conversations…</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="px-4 py-12 text-center text-gray-500">
            <p className="font-medium">{showDeleted ? 'No deleted conversations' : 'No conversations yet'}</p>
            <p className="mt-1 text-sm">{showDeleted ? '' : 'New chats will appear here when visitors use the widget.'}</p>
          </div>
        ) : (
          <>
            {!showDeleted && conversations.length > 0 && (
              <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-2.5">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-[#FF4F00] focus:ring-[#FF4F00]"
                    aria-label="Select all"
                  />
                  <span>Select all</span>
                </label>
                {isSomeSelected && (
                  <button
                    type="button"
                    onClick={() => setBulkDeleteConfirm(true)}
                    disabled={busy}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Delete selected ({selectedIds.size})
                  </button>
                )}
              </div>
            )}
          <ul className="divide-y divide-gray-100">
            {conversations.map((c) => (
              <li key={c.id} className="transition-colors hover:bg-gray-50/50">
                <div className="flex min-h-[52px] items-center gap-3 px-4 py-3.5 sm:gap-4">
                  {!showDeleted && (
                    <label className="flex shrink-0 cursor-pointer items-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(c.id)}
                        onChange={() => toggleSelect(c.id)}
                        className="h-4 w-4 rounded border-gray-300 text-[#FF4F00] focus:ring-[#FF4F00]"
                        aria-label={`Select ${c.lead?.name ?? c.id}`}
                      />
                    </label>
                  )}
                  <Link
                    href={showDeleted ? '#' : `/crm/chat/${c.id}`}
                    onClick={showDeleted ? (e) => e.preventDefault() : undefined}
                    className={`min-w-0 flex-1 ${showDeleted ? 'pointer-events-none' : ''}`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate font-semibold text-[#0A0A0B]">
                        {c.lead?.name ?? 'Unknown'}
                      </span>
                      {!showDeleted && (() => {
                        const { label, isOnline } = getStatusDisplay(
                          c.lead?.status ?? 'new',
                          c.lastActivityAt
                        );
                        return (
                          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium">
                            <span
                              className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
                              aria-hidden
                            />
                            <span className={isOnline ? 'text-green-700' : 'text-gray-600'}>{label}</span>
                          </span>
                        );
                      })()}
                      {showDeleted && (
                        <span className="text-xs text-gray-500">
                          Deleted {c.deleted_at ? new Date(c.deleted_at).toLocaleDateString() : ''}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-gray-600">{c.lead?.email ?? '—'}</p>
                    {c.lastMessage && (
                      <p className="mt-1 truncate text-sm text-gray-500">
                        {c.lastMessage.sender === 'user' ? 'Visitor: ' : ''}
                        {c.lastMessage.message}
                      </p>
                    )}
                  </Link>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-right text-xs text-gray-500">
                      {new Date(c.lastActivityAt).toLocaleString()}
                    </span>
                    {showDeleted ? (
                      <button
                        type="button"
                        onClick={() => handleRestore(c)}
                        disabled={busy}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#FF4F00] transition-colors hover:bg-[#FF4F00]/10 disabled:opacity-50"
                      >
                        Restore
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setDeleteConfirm(c);
                        }}
                        disabled={busy}
                        className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        aria-label="Delete conversation"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                          <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          </>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="delete-conv-title">
          <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
            <h3 id="delete-conv-title" className="font-semibold text-[#0A0A0B]">Delete conversation?</h3>
            <p className="mt-2 text-sm text-gray-600">
              This will move the conversation with {deleteConfirm.lead?.name ?? 'this lead'} to Deleted. You can restore it later.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setDeleteConfirm(null)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={() => handleDelete(deleteConfirm)} disabled={busy} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">Delete</button>
            </div>
          </div>
        </div>
      )}

      {bulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="bulk-delete-title">
          <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
            <h3 id="bulk-delete-title" className="font-semibold text-[#0A0A0B]">Delete {selectedIds.size} conversation{selectedIds.size !== 1 ? 's' : ''}?</h3>
            <p className="mt-2 text-sm text-gray-600">
              These will be moved to Deleted. You can restore them later from the Deleted tab.
            </p>
            {bulkError && <p className="mt-2 text-sm text-red-600">{bulkError}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => { setBulkDeleteConfirm(false); setBulkError(null); }} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={() => handleBulkDelete()} disabled={busy} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">Delete all</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
