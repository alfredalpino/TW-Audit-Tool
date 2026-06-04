'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { getStatusDisplay } from '@/lib/crm-status';
import { CRMChatReply } from './CRMChatReply';

const POLL_MS = 3000;
const AVATAR_SIZE = 36;

type Message = { id: string; sender: string; message: string; created_at: string };

function CRMMessageAvatar({ sender, visitorName }: { sender: string; visitorName?: string }) {
  const [imgError, setImgError] = useState(false);
  const isUser = sender === 'user';
  const letter = isUser ? (visitorName?.trim()[0] || 'V').toUpperCase() : 'T';
  const label = isUser ? 'Visitor' : 'Team';
  if (!isUser && !imgError) {
    return (
      <div className="relative shrink-0 overflow-hidden rounded-full bg-gray-200 w-9 h-9">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/chatbot-icon.webp"
          alt=""
          width={AVATAR_SIZE}
          height={AVATAR_SIZE}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
          aria-label={label}
        />
      </div>
    );
  }
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full text-sm font-semibold w-9 h-9 ${
        isUser ? 'bg-[#FF4F00]/20 text-[#FF4F00]' : 'bg-[#FF4F00]/10 text-[#FF4F00]'
      }`}
      aria-label={label}
    >
      {letter}
    </div>
  );
}

type ConversationData = {
  conversation: { id: string; lead_id: string; created_at: string };
  lead: { id: string; name: string; email: string; phone: string | null; status: string } | null;
  messages: Message[];
  visitorTyping?: boolean;
};

export function CRMConversationView({ conversationId }: { conversationId: string }) {
  const [data, setData] = useState<ConversationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshFailed, setRefreshFailed] = useState(false);
  const [joined, setJoined] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const hasDataRef = useRef(false);

  const fetchConversation = useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await fetch(`/api/admin/chat/${conversationId}`, { signal });
      if (signal?.aborted) return;
      if (!res.ok) {
        if (hasDataRef.current) {
          setRefreshFailed(true);
        } else {
          setError(true);
          setData(null);
        }
        return;
      }
      const next = (await res.json()) as ConversationData;
      if (signal?.aborted) return;
      hasDataRef.current = true;
      setData(next);
      setError(false);
      setRefreshFailed(false);
      setJoined((j) => j || next.lead?.status === 'agent_joined');
    } catch {
      if (signal?.aborted) return;
      if (hasDataRef.current) {
        setRefreshFailed(true);
      } else {
        setError(true);
        setData(null);
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  useEffect(() => {
    if (!data) return;
    const ac = new AbortController();
    const tick = () => fetchConversation(ac.signal);
    const t = setInterval(tick, POLL_MS);
    return () => {
      ac.abort();
      clearInterval(t);
    };
  }, [data, fetchConversation]);

  const handleJoin = async () => {
    try {
      const res = await fetch('/api/chat/request-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId }),
      });
      if (res.ok) setJoined(true);
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <main className="min-w-0 px-0 py-4 sm:py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-20 rounded-xl bg-gray-200 sm:h-24" />
          <div className="h-64 rounded-xl bg-gray-200 sm:h-80" />
        </div>
      </main>
    );
  }

  if (error || !data) {
    hasDataRef.current = false;
    return (
      <main className="min-w-0 px-0 py-4 sm:py-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
          <p className="font-medium text-amber-800">Could not load conversation</p>
          <p className="mt-1 text-sm text-amber-700">It may have been deleted or the connection failed.</p>
          <button
            type="button"
            onClick={() => {
              setError(false);
              setLoading(true);
              void fetchConversation();
            }}
            className="mt-4 rounded-lg bg-[#FF4F00] px-4 py-2 text-sm font-medium text-white hover:bg-[#E64800]"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  const { conversation, lead, messages } = data;
  const showJoinButton = !joined && lead?.status !== 'agent_joined';
  const lastActivityAt =
    messages.length > 0
      ? messages[messages.length - 1].created_at
      : conversation.created_at;
  const statusDisplay = getStatusDisplay(lead?.status ?? 'new', lastActivityAt);

  return (
    <main className="min-w-0 px-0 py-4 sm:py-6">
      <p className="mb-3 text-sm">
        <Link href="/crm" className="touch-manipulation text-[#FF4F00] hover:underline">
          ← Back to Inbox
        </Link>
      </p>
      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-semibold text-[#0A0A0B]">
              {lead?.name ?? 'Unknown'} – {lead?.email ?? ''}
            </h2>
            {lead?.phone && (
              <p className="text-sm text-gray-600">{lead.phone}</p>
            )}
            <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2 py-0.5 font-medium">
                <span
                  className={`h-2 w-2 rounded-full ${statusDisplay.isOnline ? 'bg-green-500' : 'bg-red-500'}`}
                  aria-hidden
                />
                <span
                  className={
                    statusDisplay.isOnline ? 'text-green-700' : 'text-gray-600'
                  }
                >
                  {statusDisplay.label}
                </span>
              </span>
              {' · '}
              Conversation {conversation.id.slice(0, 8)}…
            </p>
          </div>
          {showJoinButton && (
            <button
              type="button"
              onClick={handleJoin}
              className="min-h-[44px] shrink-0 touch-manipulation rounded-xl bg-[#FF4F00] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#E64800] hover:shadow"
            >
              Join conversation
            </button>
          )}
          {joined && (
            <p className="shrink-0 text-sm font-medium text-[#FF4F00]">
              You&apos;re replying to this conversation
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {refreshFailed && (
          <div className="flex items-center justify-between border-b border-amber-200 bg-amber-50 px-3 py-2 sm:px-4">
            <span className="text-xs text-amber-800">Couldn&apos;t refresh.</span>
            <button
              type="button"
              onClick={() => {
                setRefreshFailed(false);
                void fetchConversation();
              }}
              className="text-xs font-medium text-[#FF4F00] hover:underline"
            >
              Retry
            </button>
          </div>
        )}
        <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2 sm:px-4">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Messages
          </span>
          {isTyping ? (
            <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
              Typing…
            </span>
          ) : data.visitorTyping ? (
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800">
              Visitor is typing…
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium">
              <span
                className={`h-2 w-2 rounded-full ${statusDisplay.isOnline ? 'bg-green-500' : 'bg-red-500'}`}
                aria-hidden
              />
              <span
                className={
                  statusDisplay.isOnline ? 'text-green-700' : 'text-gray-600'
                }
              >
                {statusDisplay.label}
              </span>
            </span>
          )}
        </div>
        <div className="max-h-[20rem] overflow-y-auto p-4 sm:max-h-[28rem] sm:p-5">
          {messages.length === 0 ? (
            <p className="text-sm text-gray-500">No messages yet.</p>
          ) : (
            <ul className="space-y-3">
              {messages.map((m) => (
                <li
                  key={m.id}
                  className={`flex items-end gap-2 ${m.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  {m.sender === 'user' && <CRMMessageAvatar sender={m.sender} visitorName={lead?.name} />}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                      m.sender === 'user'
                        ? 'border border-gray-200 bg-gray-50 text-[#0A0A0B]'
                        : 'bg-[#FF4F00] text-white shadow-gray-900/10'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.message}</p>
                    <p className="mt-1.5 text-xs opacity-70">
                      {new Date(m.created_at).toLocaleString()}
                    </p>
                  </div>
                  {m.sender !== 'user' && <CRMMessageAvatar sender={m.sender} visitorName={lead?.name} />}
                </li>
              ))}
            </ul>
          )}
        </div>
        <CRMChatReply
          conversationId={conversationId}
          onReplySent={fetchConversation}
          onTypingChange={setIsTyping}
        />
      </div>
    </main>
  );
}
