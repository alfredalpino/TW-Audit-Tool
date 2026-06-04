'use client';

import { useState, useCallback } from 'react';

export function CRMChatReply({
  conversationId,
  onReplySent,
  onTypingChange,
}: {
  conversationId: string;
  onReplySent?: () => void;
  onTypingChange?: (typing: boolean) => void;
}) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const sendAgentTyping = useCallback((typing: boolean) => {
    fetch(`/api/admin/chat/${conversationId}/typing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ typing }),
    }).catch(() => {});
  }, [conversationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || sending) return;
    setSending(true);
    onTypingChange?.(false);
    sendAgentTyping(false);
    try {
      const res = await fetch(`/api/admin/chat/${conversationId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });
      if (res.ok) {
        setMessage('');
        onReplySent?.();
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-100 bg-white p-4 sm:p-5">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => {
            onTypingChange?.(true);
            sendAgentTyping(true);
          }}
          onBlur={() => {
            onTypingChange?.(false);
            sendAgentTyping(false);
          }}
          placeholder="Reply as agent..."
          disabled={sending}
          className="min-h-[44px] flex-1 rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-2.5 text-sm transition-colors focus:border-[#FF4F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4F00]/20 disabled:opacity-60 sm:min-h-0"
        />
        <button
          type="submit"
          disabled={sending || !message.trim()}
          className="min-h-[44px] touch-manipulation rounded-xl bg-[#FF4F00] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#E64800] hover:shadow disabled:opacity-50 sm:min-h-0"
        >
          {sending ? 'Sending…' : 'Send'}
        </button>
      </div>
    </form>
  );
}
