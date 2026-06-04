'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { chatAuthHeaders } from '@/lib/chat-client-storage';

const TYPING_DEBOUNCE_MS = 300;
const TYPING_IDLE_MS = 3000;

export function ChatInput({
  onSend,
  disabled,
  placeholder = 'Type your message...',
  conversationId = null,
}: {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  conversationId?: string | null;
}) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingStartRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSentTypingRef = useRef(false);

  const sendTyping = useCallback((active: boolean) => {
    if (!conversationId) return;
    if (!active) hasSentTypingRef.current = false;
    fetch('/api/chat/typing', {
      method: 'POST',
      headers: chatAuthHeaders(conversationId),
      body: JSON.stringify({ conversationId, active }),
    }).catch(() => {});
  }, [conversationId]);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  useEffect(() => {
    return () => {
      if (typingStartRef.current) clearTimeout(typingStartRef.current);
      if (typingStopRef.current) clearTimeout(typingStopRef.current);
    };
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    if (!conversationId) return;
    if (typingStopRef.current) {
      clearTimeout(typingStopRef.current);
      typingStopRef.current = null;
    }
    if (hasSentTypingRef.current) {
      typingStopRef.current = setTimeout(() => {
        typingStopRef.current = null;
        sendTyping(false);
      }, TYPING_IDLE_MS);
      return;
    }
    if (typingStartRef.current) return;
    typingStartRef.current = setTimeout(() => {
      typingStartRef.current = null;
      hasSentTypingRef.current = true;
      sendTyping(true);
      typingStopRef.current = setTimeout(() => {
        typingStopRef.current = null;
        sendTyping(false);
      }, TYPING_IDLE_MS);
    }, TYPING_DEBOUNCE_MS);
  }, [conversationId, sendTyping]);

  const handleBlur = useCallback(() => {
    if (conversationId) sendTyping(false);
    hasSentTypingRef.current = false;
    if (typingStartRef.current) {
      clearTimeout(typingStartRef.current);
      typingStartRef.current = null;
    }
    if (typingStopRef.current) {
      clearTimeout(typingStopRef.current);
      typingStopRef.current = null;
    }
  }, [conversationId, sendTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="shrink-0 border-t border-[var(--chat-divider)] bg-[var(--bg-base)]/50 p-3">
      <div className="flex gap-2">
        <textarea
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="tw-clay-input min-h-[44px] max-h-[120px] flex-1 resize-none bg-[var(--bg-muted)]/60 px-4 py-2.5 text-sm text-[var(--fg-primary)] placeholder:text-[var(--fg-tertiary)] focus:border-[var(--brand)] focus:bg-[var(--bg-base)] disabled:opacity-60"
          maxLength={4000}
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="tw-clay-btn tw-clay-btn-brand flex h-[44px] w-[44px] shrink-0 items-center justify-center disabled:opacity-50"
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
          </svg>
        </button>
      </div>
    </form>
  );
}
