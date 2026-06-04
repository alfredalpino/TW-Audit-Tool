import { BOOKING_URL } from "@/lib/constants";

const BRAND = {
  orange: "#FF5500",
  dark: "#0A0A0B",
  gray: "#888888",
  light: "#F5F5F7",
  white: "#FFFFFF",
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildAuditReportEmailHtml(params: {
  name: string;
  url: string;
  scoreLine: string;
  reportUrl: string;
}): string {
  const n = escapeHtml(params.name);
  const url = escapeHtml(params.url);
  const score = params.scoreLine
    ? `<p style="margin: 0 0 16px; font-size: 16px; color: ${BRAND.dark}; line-height: 1.6;">${escapeHtml(params.scoreLine)}</p>`
    : "";
  const reportUrl = escapeHtml(params.reportUrl);
  const bookingUrl = escapeHtml(BOOKING_URL);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Torpedo audit report</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #e8e8e8; color: ${BRAND.dark};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #e8e8e8;">
    <tr>
      <td style="padding: 40px 20px 32px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; margin: 0 auto;">
          <tr>
            <td style="border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(10,10,11,0.12);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: ${BRAND.white}; border: 1px solid rgba(0,0,0,0.06); border-radius: 16px;">
                <tr>
                  <td style="padding: 28px 24px; text-align: center; background: ${BRAND.dark};">
                    <span style="font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: ${BRAND.orange};">Website Intelligence</span>
                    <h1 style="margin: 8px 0 0; font-size: 22px; font-weight: 700; color: ${BRAND.white}; line-height: 1.3;">Your audit report</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0; height: 4px; background: ${BRAND.orange};"></td>
                </tr>
                <tr>
                  <td style="padding: 36px 32px;">
                    <p style="margin: 0 0 16px; font-size: 16px; color: ${BRAND.dark}; line-height: 1.6;">Hi ${n},</p>
                    <p style="margin: 0 0 16px; font-size: 16px; color: ${BRAND.dark}; line-height: 1.6;">
                      Your full Website Intelligence audit for <strong>${url}</strong> is ready.
                    </p>
                    ${score}
                    <p style="margin: 0 0 16px; font-size: 16px; color: ${BRAND.dark}; line-height: 1.6;">
                      We've attached a PDF with scores, business impact ranges, and prioritized findings. You can also download it here:
                    </p>
                    <p style="margin: 0 0 20px; text-align: center;">
                      <a href="${reportUrl}" style="display: inline-block; padding: 10px 18px; background: ${BRAND.orange}; color: ${BRAND.white}; text-decoration: none; border-radius: 999px; font-size: 14px; font-weight: 600;">
                        Download report (PDF)
                      </a>
                    </p>
                    <p style="margin: 0 0 16px; font-size: 16px; color: ${BRAND.dark}; line-height: 1.6;">
                      Want help prioritizing fixes? Book a strategy call with our team:
                    </p>
                    <p style="margin: 0 0 20px; text-align: center;">
                      <a href="${bookingUrl}" style="display: inline-block; padding: 10px 18px; background: ${BRAND.dark}; color: ${BRAND.white}; text-decoration: none; border-radius: 999px; font-size: 14px; font-weight: 600;">
                        Book a strategy call
                      </a>
                    </p>
                    <p style="margin: 0; font-size: 12px; color: ${BRAND.gray}; line-height: 1.5;">
                      Business impact figures are indicative ranges only — not financial advice.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 32px; background: ${BRAND.light}; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0; font-size: 13px; color: ${BRAND.gray};">
                      Torpedo Web · <a href="https://torpedoweb.org" style="color: ${BRAND.orange}; text-decoration: none;">torpedoweb.org</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
