'use client';

import { useRef, useState, useEffect, useCallback, type ReactNode } from 'react';

export type ChatMessage = {
  id: string;
  sender: 'user' | 'ai' | 'agent';
  message: string;
  created_at: string;
};

const SCROLL_THRESHOLD = 80;
const AVATAR_SIZE = 36;
const URL_REGEX = /((?:https?:\/\/|www\.)[^\s<>"'`]+|book\.torpedoweb\.org)/gi;

function normalizeHref(urlText: string): string {
  if (/^https?:\/\//i.test(urlText)) return urlText;
  return `https://${urlText}`;
}

function splitTrailingPunctuation(urlText: string): { cleanUrl: string; trailing: string } {
  const match = urlText.match(/^(.+?)([),.!?;:]+)?$/);
  if (!match) return { cleanUrl: urlText, trailing: '' };
  return { cleanUrl: match[1], trailing: match[2] ?? '' };
}

function renderMessageWithLinks(message: string) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let idx = 0;

  for (const match of message.matchAll(URL_REGEX)) {
    const fullMatch = match[0];
    const start = match.index ?? 0;

    if (start > lastIndex) {
      nodes.push(<span key={`text-${idx++}`}>{message.slice(lastIndex, start)}</span>);
    }

    const { cleanUrl, trailing } = splitTrailingPunctuation(fullMatch);
    const href = normalizeHref(cleanUrl);

    nodes.push(
      <a
        key={`url-${idx++}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 decoration-[var(--brand)]/50 hover:decoration-[var(--brand)]"
      >
        {cleanUrl}
      </a>
    );

    if (trailing) {
      nodes.push(<span key={`trail-${idx++}`}>{trailing}</span>);
    }

    lastIndex = start + fullMatch.length;
  }

  if (lastIndex < message.length) {
    nodes.push(<span key={`text-${idx++}`}>{message.slice(lastIndex)}</span>);
  }

  if (nodes.length === 0) {
    return [<span key="text-only">{message}</span>];
  }

  return nodes;
}

function MessageAvatar({
  sender,
  visitorName,
}: {
  sender: 'user' | 'ai' | 'agent';
  visitorName?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const src =
    sender === 'user'
      ? '/avatar-user.png'
      : '/chatbot-icon.webp';
  const letter =
    sender === 'user'
      ? (visitorName?.trim()[0] || 'V').toUpperCase()
      : 'T';
  const label = sender === 'user' ? 'You' : sender === 'agent' ? 'TorpedoWeb team' : 'Assistant';

  if (!imgError) {
    return (
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--bg-muted)] shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`${label} avatar`}
          width={AVATAR_SIZE}
          height={AVATAR_SIZE}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold shadow-sm ${
        sender === 'user'
          ? 'border-[var(--brand)]/30 bg-[var(--brand)]/15 text-[var(--brand)]'
          : 'border-[var(--brand)]/20 bg-[var(--brand)]/10 text-[var(--brand)]'
      }`}
      aria-label={label}
    >
      {letter}
    </div>
  );
}

function bubbleClass(sender: 'user' | 'ai' | 'agent'): string {
  if (sender === 'user') return 'tw-chat-bubble-user';
  if (sender === 'agent') return 'tw-chat-bubble-agent';
  return 'tw-chat-bubble-ai';
}

export function ChatMessages({
  messages,
  isLoading,
  waitingForAgent = false,
  agentTyping = false,
  visitorName,
}: {
  messages: ChatMessage[];
  isLoading?: boolean;
  waitingForAgent?: boolean;
  agentTyping?: boolean;
  /** Visitor/lead name; used for user avatar initial (fallback: V) */
  visitorName?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const hasAgentMessage = messages.some((m) => m.sender === 'agent');
  const showPatienceMessage =
    waitingForAgent && !hasAgentMessage;

  const checkAtBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_THRESHOLD;
    setShowScrollDown(!atBottom);
  }, []);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    setShowScrollDown(false);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkAtBottom();
    el.addEventListener('scroll', checkAtBottom);
    return () => el.removeEventListener('scroll', checkAtBottom);
  }, [messages, checkAtBottom]);

  useEffect(() => {
    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.sender === 'agent') {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        setShowScrollDown(false);
      }
    }
  }, [messages]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={scrollRef}
        className="flex flex-1 flex-col gap-3 overflow-y-auto p-3"
      >
      {messages.map((m, idx) => (
        <div key={m.id}>
          {m.sender === 'agent' &&
            messages.findIndex((x) => x.id === m.id) ===
              messages.findIndex((x) => x.sender === 'agent') && (
              <p className="mb-2 text-center text-xs text-[var(--fg-tertiary)]">Agent joined the conversation</p>
            )}
          <div
            className={`flex items-end gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender !== 'user' && <MessageAvatar sender={m.sender} visitorName={visitorName} />}
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-1.5 text-sm ${bubbleClass(m.sender)}`}
            >
              {m.sender !== 'user' && (
                <span className="mb-0.5 block text-xs font-medium text-[var(--brand)]">
                  {m.sender === 'agent' ? 'TorpedoWeb team' : 'Assistant'}
                </span>
              )}
              <p className="whitespace-pre-wrap break-words">{renderMessageWithLinks(m.message)}</p>
              {idx === messages.length - 1 && (
                <p className="mt-1 text-right text-[10px] opacity-70">
                  {new Date(m.created_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                </p>
              )}
            </div>
            {m.sender === 'user' && <MessageAvatar sender="user" visitorName={visitorName} />}
          </div>
        </div>
      ))}
      {agentTyping && (
        <div className="flex items-end justify-start gap-2">
          <MessageAvatar sender="agent" />
          <div className="tw-chat-bubble-ai max-w-[85%] rounded-2xl px-3 py-1.5 text-xs text-[var(--fg-secondary)]">
            TorpedoWeb team is typing…
          </div>
        </div>
      )}
      {showPatienceMessage && (
        <p className="text-center text-xs text-[var(--brand)]/80">
          Please be patient, one of our agents will assist you in a few minutes.
        </p>
      )}
      </div>
      {showScrollDown && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="tw-chat-scroll-btn absolute bottom-4 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full"
          aria-label="Scroll to latest message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 14.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 1 0-1.06 1.06l3 3Z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
}
