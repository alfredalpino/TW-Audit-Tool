'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChatMessages, type ChatMessage } from './ChatMessages';
import { ChatInput } from './ChatInput';
import {
  chatAuthHeaders,
  chatAuthHeadersForGet,
  getStoredConversationToken,
  storeConversationToken,
} from '@/lib/chat-client-storage';

const PAST_CHATS_KEY = 'torpedo_chat_conversations';
const MAX_PAST_CHATS = 50;

type PastChat = { id: string; name: string; createdAt: string };

function getPastConversations(): PastChat[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PAST_CHATS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PastChat[];
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    return parsed.filter((c) => c?.id && !seen.has(c.id) && seen.add(c.id)).slice(-MAX_PAST_CHATS);
  } catch {
    return [];
  }
}

function appendPastConversation(entry: PastChat): void {
  const list = getPastConversations();
  const filtered = list.filter((c) => c.id !== entry.id);
  filtered.push(entry);
  try {
    localStorage.setItem(PAST_CHATS_KEY, JSON.stringify(filtered.slice(-MAX_PAST_CHATS)));
  } catch {
    // ignore
  }
}

function formatPastChatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const sameDay = d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (sameDay) return 'Today';
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth()) return 'Yesterday';
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

const POLL_MS = 2000;

async function parseResponseJson<T>(res: Response): Promise<T | null> {
  const raw = await res.text();
  if (!raw.trim()) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function ChatWindow() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'home' | 'lead' | 'chat'>('lead');
  const [pastConversations, setPastConversations] = useState<PastChat[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [agentJoined, setAgentJoined] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const [messagesError, setMessagesError] = useState(false);

  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');

  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState('');
  const [requestingAgent, setRequestingAgent] = useState(false);

  useEffect(() => setMounted(true), []);

  const fetchMessages = useCallback(async (cid: string, signal?: AbortSignal) => {
    try {
      const res = await fetch(
        `/api/chat/messages?conversationId=${encodeURIComponent(cid)}`,
        { signal, cache: 'no-store', headers: chatAuthHeadersForGet(cid) }
      );
      if (signal?.aborted) return;
      if (res.ok) {
        const data = await parseResponseJson<{ messages: ChatMessage[]; agentJoined?: boolean }>(res);
        if (signal?.aborted) return;
        if (!data) {
          setMessagesError(true);
          return;
        }
        setMessages((prev) => {
          const fetched = data.messages ?? [];
          const byId = new Map(prev.map((m) => [m.id, m]));
          for (const f of fetched) {
            if (!byId.has(f.id)) byId.set(f.id, f);
          }
          for (const f of fetched) {
            const matchingPending = prev.find(
              (p) =>
                p.id.startsWith('pending-') &&
                p.sender === f.sender &&
                p.message === f.message &&
                Math.abs(new Date(p.created_at).getTime() - new Date(f.created_at).getTime()) < 6000
            );
            if (matchingPending) byId.delete(matchingPending.id);
          }
          return Array.from(byId.values()).sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        });
        if (typeof data.agentJoined === 'boolean') setAgentJoined(data.agentJoined);
        setMessagesError(false);
      } else {
        setMessagesError(true);
      }
    } catch (err) {
      if (signal?.aborted) return;
      setMessagesError(true);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const list = getPastConversations();
    setPastConversations(list);
    if (list.length === 0) {
      setStep('lead');
    } else {
      setStep('home');
    }
  }, [open]);

  const openPastChat = useCallback(
    (cid: string) => {
      if (!getStoredConversationToken(cid)) {
        setLeadError('This chat session expired. Please start a new conversation.');
        setStep('lead');
        return;
      }
      setConversationId(cid);
      setStep('chat');
      setMessages([]);
      setAgentJoined(false);
      setAgentTyping(false);
      setMessagesError(false);
      setLeadError('');
      fetchMessages(cid);
    },
    [fetchMessages]
  );

  const goToHome = useCallback(() => {
    setStep('home');
    setPastConversations(getPastConversations());
  }, []);

  const goToNewMessage = useCallback(() => {
    setStep('lead');
    setLeadName('');
    setLeadEmail('');
    setLeadPhone('');
    setLeadError('');
  }, []);

  useEffect(() => {
    if (!open || step !== 'chat' || !conversationId) return;
    const ac = new AbortController();
    const tick = () => fetchMessages(conversationId, ac.signal);
    tick();
    const t = setInterval(tick, POLL_MS);
    return () => {
      ac.abort();
      clearInterval(t);
    };
  }, [open, step, conversationId, fetchMessages]);

  useEffect(() => {
    if (!open || step !== 'chat' || !conversationId) return;
    const pollTyping = async () => {
      try {
        const res = await fetch(
          `/api/chat/typing?conversationId=${encodeURIComponent(conversationId)}`,
          { headers: chatAuthHeadersForGet(conversationId) }
        );
        if (res.ok) {
          const data = (await res.json()) as { agentTyping?: boolean };
          setAgentTyping(Boolean(data.agentTyping));
        }
      } catch {
        setAgentTyping(false);
      }
    };
    pollTyping();
    const t = setInterval(pollTyping, POLL_MS);
    return () => clearInterval(t);
  }, [open, step, conversationId]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadError('');
    const name = leadName.trim();
    const email = leadEmail.trim().toLowerCase();
    const phone = leadPhone.trim() || undefined;
    if (!name || !email) {
      setLeadError('Name and email are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLeadError('Please enter a valid email.');
      return;
    }
    setLeadSubmitting(true);
    try {
      const res = await fetch('/api/chat/create-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await parseResponseJson<{
        error?: string;
        conversationId?: string;
        conversationToken?: string;
        leadId?: string;
      }>(res);
      if (data === null) {
        setLeadError(
          res.ok
            ? 'Unexpected response from server. Please try again.'
            : `Server error (${res.status}). Please try again.`
        );
        return;
      }
      if (!res.ok) {
        setLeadError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }
      const cid = data.conversationId;
      const token = data.conversationToken;
      if (cid && token) {
        storeConversationToken(cid, token);
        const entry: PastChat = { id: cid, name, createdAt: new Date().toISOString() };
        appendPastConversation(entry);
        setPastConversations(getPastConversations());
        setConversationId(cid);
        setStep('chat');
        setMessages([]);
        setAgentJoined(false);
        setAgentTyping(false);
        setMessagesError(false);
      }
    } catch {
      setLeadError('Network error. Please try again.');
    } finally {
      setLeadSubmitting(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!conversationId || sending) return;
    const pendingId = `pending-${Date.now()}`;
    const optimistic: ChatMessage = {
      id: pendingId,
      sender: 'user',
      message,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) =>
      [...prev, optimistic].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
    );
    setSending(true);
    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: chatAuthHeaders(conversationId),
        body: JSON.stringify({ conversationId, message, notifyTelegram: false }),
      });
      const data = await parseResponseJson<{
        messages?: ChatMessage[];
        agentMode?: boolean;
      }>(res);
      if (data === null) {
        setMessages((prev) => prev.filter((m) => m.id !== pendingId));
        setMessagesError(true);
        return;
      }
      if (typeof data.agentMode === 'boolean' && data.agentMode) {
        setAgentJoined(true);
      }
      if (res.ok && Array.isArray(data.messages)) {
        setMessagesError(false);
        setMessages((prev) => {
          const withoutPending = prev.filter((m) => !m.id.startsWith('pending-'));
          const seen = new Set(withoutPending.map((m) => m.id));
          const next = [...withoutPending];
          for (const m of data.messages!) {
            if (!seen.has(m.id)) {
              seen.add(m.id);
              next.push(m);
            }
          }
          return next.sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        });
      } else {
        setMessagesError(true);
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== pendingId));
      setMessagesError(true);
    } finally {
      setSending(false);
    }
  };

  const handleRequestLiveAgent = async () => {
    if (!conversationId || agentJoined || requestingAgent) return;
    setRequestingAgent(true);
    try {
      const res = await fetch('/api/chat/request-agent', {
        method: 'POST',
        headers: chatAuthHeaders(conversationId),
        body: JSON.stringify({ conversationId }),
      });
      if (res.ok) setAgentJoined(true);
    } finally {
      setRequestingAgent(false);
    }
  };

  if (pathname?.startsWith('/crm') || !mounted) return null;

  return createPortal(
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="tw-clay-btn tw-clay-btn-brand tw-chat-fab bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] flex h-14 w-14 shrink-0 items-center justify-center p-0 text-[var(--brand-fg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))] sm:right-[max(1.5rem,env(safe-area-inset-right))] sm:h-16 sm:w-16"
        aria-label={open ? 'Close Tor AI chat' : 'Open Tor AI chat'}
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden>
            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        ) : (
          <Image
            src="/chat-icon.png"
            alt=""
            width={28}
            height={28}
            className="h-6 w-6 object-contain object-center sm:h-7 sm:w-7"
          />
        )}
      </button>

      {open && (
        <div className="tw-chat-shell fixed bottom-[max(5rem,calc(env(safe-area-inset-bottom)+4.5rem))] left-[max(1rem,env(safe-area-inset-left))] right-[max(1rem,env(safe-area-inset-right))] z-50 flex max-h-[90vh] min-h-[320px] flex-col sm:bottom-[max(6rem,calc(env(safe-area-inset-bottom)+5.5rem))] sm:left-auto sm:right-[max(1.5rem,env(safe-area-inset-right))] sm:min-w-[360px] sm:max-w-[360px] sm:min-h-0 sm:h-[580px]">
          <div className="tw-chat-header flex shrink-0 items-center gap-3 px-4 py-3.5">
            <Image
              src="/logo.svg"
              alt="Torpedo Web"
              width={28}
              height={28}
              className="relative z-[1] h-7 w-7 shrink-0 object-contain"
              priority
            />
            <div className="relative z-[1] min-w-0 flex-1">
              <h2 className="truncate text-sm font-semibold tracking-tight">Tor AI</h2>
              <p className="truncate text-xs" style={{ color: 'var(--chat-header-subtle)' }}>
                We&apos;re here to help
              </p>
            </div>
          </div>

          {step === 'home' && (
            <div className="flex flex-1 flex-col overflow-y-auto p-5">
              <p className="mb-5 inline-block border-b-2 border-[var(--brand)] pb-1.5 text-sm font-semibold tracking-tight text-[var(--fg-primary)]">
                How can we help?
              </p>
              <button
                type="button"
                onClick={goToNewMessage}
                className="tw-clay-btn tw-clay-btn-brand w-full min-h-[48px] px-4 py-3.5 text-sm"
              >
                Send a Message
              </button>
              {pastConversations.length > 0 && (
                <>
                  <p className="mt-6 mb-2 text-xs font-medium uppercase tracking-wider text-[var(--fg-tertiary)]">
                    Past chats
                  </p>
                  <ul className="tw-chat-well flex max-h-[40vh] flex-col divide-y divide-[var(--chat-divider)] overflow-y-auto rounded-xl">
                    {[...pastConversations].reverse().map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => openPastChat(c.id)}
                          className="flex min-h-[48px] w-full items-center justify-between px-4 py-3 text-left text-sm text-[var(--fg-primary)] transition-[background,box-shadow] hover:bg-[var(--bg-base)]/60 hover:shadow-sm"
                        >
                          <span className="truncate font-medium">{c.name}</span>
                          <span className="ml-2 shrink-0 text-xs text-[var(--fg-tertiary)]">
                            {formatPastChatDate(c.createdAt)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {step === 'lead' && (
            <div className="flex flex-1 flex-col overflow-y-auto p-5">
              {pastConversations.length > 0 && (
                <button
                  type="button"
                  onClick={goToHome}
                  className="mb-4 flex items-center gap-1.5 text-sm text-[var(--fg-secondary)] transition-colors hover:text-[var(--brand)]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                  </svg>
                  Back
                </button>
              )}
              <p className="mb-5 text-sm font-medium text-[var(--fg-primary)]">
                Hi there. Before we start, may I know your name?
              </p>
              <form onSubmit={handleLeadSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Name"
                  required
                  className="tw-clay-input px-4 py-3 text-sm text-[var(--fg-primary)] placeholder:text-[var(--fg-tertiary)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/25"
                />
                <input
                  type="email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="tw-clay-input px-4 py-3 text-sm text-[var(--fg-primary)] placeholder:text-[var(--fg-tertiary)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/25"
                />
                <input
                  type="tel"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  placeholder="Phone (optional)"
                  className="tw-clay-input px-4 py-3 text-sm text-[var(--fg-primary)] placeholder:text-[var(--fg-tertiary)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/25"
                />
                {leadError && (
                  <p className="text-sm text-red-600 dark:text-red-400">{leadError}</p>
                )}
                <button
                  type="submit"
                  disabled={leadSubmitting}
                  className="tw-clay-btn tw-clay-btn-brand w-full min-h-[48px] px-4 py-3.5 text-sm disabled:opacity-60"
                >
                  {leadSubmitting ? 'Starting…' : 'Start chat'}
                </button>
                <p className="text-xs text-[var(--fg-tertiary)]">We&apos;ll use this to follow up with you.</p>
              </form>
            </div>
          )}

          {step === 'chat' && (
            <>
              <div className="flex min-h-[48px] shrink-0 items-center border-b border-[var(--chat-divider)] bg-[var(--bg-base)]/40 px-3">
                <button
                  type="button"
                  onClick={goToHome}
                  className="flex items-center gap-2 rounded-lg py-2.5 pr-2 text-sm font-medium text-[var(--fg-secondary)] transition-colors hover:bg-[var(--bg-muted)]/60 hover:text-[var(--brand)] active:bg-[var(--bg-muted)]"
                  aria-label="Back to chats"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                  </svg>
                  Chats
                </button>
              </div>
              {messagesError && (
                <div
                  className="shrink-0 border-b px-3 py-3 text-center"
                  style={{
                    borderColor: 'var(--chat-error-border)',
                    background: 'var(--chat-error-bg)',
                    color: 'var(--chat-error-fg)',
                  }}
                >
                  <p className="text-sm font-medium">
                    We see you&apos;re not connected, so we&apos;re closing this chat.
                  </p>
                  <p className="mt-1 text-xs opacity-90">
                    Reply &quot;Hi&quot; to continue the chat.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMessagesError(false);
                      void handleSendMessage('Hi');
                    }}
                    className="tw-clay-btn tw-clay-btn-brand mt-3 min-h-[44px] px-4 py-2 text-sm"
                  >
                    Rejoin chat
                  </button>
                </div>
              )}
              <ChatMessages
                messages={messages}
                isLoading={sending}
                waitingForAgent={agentJoined}
                agentTyping={agentTyping}
                visitorName={leadName}
              />
              <div className="flex shrink-0 justify-end border-t border-[var(--chat-divider)] bg-[var(--bg-base)]/40 px-3 pt-2 -translate-y-[2px]">
                <button
                  type="button"
                  onClick={handleRequestLiveAgent}
                  disabled={agentJoined || requestingAgent}
                  title="Request a live agent"
                  className="rounded-lg px-3 py-1.5 text-xs font-medium transition-[background,opacity] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    background: 'var(--chat-live-agent-bg)',
                    color: 'var(--chat-live-agent-fg)',
                  }}
                >
                  {requestingAgent ? 'Requesting…' : agentJoined ? 'Agent joined' : 'Live Agent'}
                </button>
              </div>
              <ChatInput
                onSend={handleSendMessage}
                disabled={sending}
                conversationId={conversationId}
              />
            </>
          )}
        </div>
      )}
    </>,
    document.body,
  );
}
