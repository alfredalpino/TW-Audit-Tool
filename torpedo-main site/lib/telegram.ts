/**
 * Send a plain text message to the configured Telegram chat.
 * Used for notifications (e.g. new lead, new message). No reply flow.
 */
export async function sendTelegramMessage(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token?.trim() || !chatId?.trim()) return false;
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId.trim(),
          text: text.slice(0, 4096),
          disable_web_page_preview: true,
        }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}
