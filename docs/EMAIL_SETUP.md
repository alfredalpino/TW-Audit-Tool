# Email setup (Resend) — all Torpedo apps

Use **one Resend account** and **one verified domain** (`torpedoweb.org`) for transactional email across:

| App | Repo / folder | From address (example) | Purpose |
|-----|----------------|------------------------|---------|
| Main website | `torpedo-main site/` or `Torpedo/` | `Torpedo Web <hello@invite.torpedoweb.org>` via `BOOKING_FROM_EMAIL` | Contact form, booking confirmations, OTP |
| Offer page | `TW-Offer/` | `Torpedo Web <hello@torpedoweb.org>` via `BOOKING_FROM_EMAIL` | Audit request form (internal + client ack) |
| Audit tool | `TW-Audit-Tool/` (this repo) | `Torpedo Web <reports@audit.torpedoweb.org>` via `RESEND_FROM_EMAIL` | PDF audit report after lead unlock |

## Why Resend (free tier)

- **100 emails/day** on the free plan — enough for early production across three apps.
- Same API and SDK as the main site (`resend` npm package).
- Alternatives (SendGrid, Mailgun, Postmark) also have free tiers but would mean **three different integrations**; Resend is already wired on the main site and offer page.

## One-time Resend setup

1. Sign up at [resend.com](https://resend.com).
2. **Domains** → Add `torpedoweb.org` (and optionally `audit.torpedoweb.org` if you send from `reports@audit.torpedoweb.org`).
3. Add the DNS records Resend shows (SPF, DKIM). Wait until status is **Verified**.
4. **API Keys** → Create a key → copy `re_...` (never commit it).

## Environment variables (shared convention)

| Variable | Used by | Notes |
|----------|---------|--------|
| `RESEND_API_KEY` | All three apps | Same key in each `.env` / Vercel project |
| `BOOKING_FROM_EMAIL` | Main site, offer page | Display name + address, e.g. `Torpedo Web <hello@invite.torpedoweb.org>` — **no quotes** in `.env` |
| `BOOKING_REPLY_TO` | Main site (optional) | Internal notification recipient |
| `RESEND_FROM_EMAIL` | Audit tool (primary), offer (fallback) | Audit-specific from address |
| `NEXT_PUBLIC_SITE_URL` | Main site | Logo link in HTML emails |
| `NEXT_PUBLIC_BOOKING_URL` | Audit tool, offer | Strategy call link (default `https://book.torpedoweb.org`) |
| `NEXT_PUBLIC_APP_URL` | Audit tool | PDF download link in email body |

### `.env` formatting

```bash
# Correct — no quotes around the value
RESEND_FROM_EMAIL=Torpedo Web <reports@audit.torpedoweb.org>

# Wrong — quotes become part of the address and Resend will reject sends
RESEND_FROM_EMAIL="Torpedo Web <reports@audit.torpedoweb.org>"
```

## Per-app enablement

### 1. Main website (`torpedo-main site/`)

```bash
RESEND_API_KEY=re_xxxxxxxx
BOOKING_FROM_EMAIL=Torpedo Web <hello@invite.torpedoweb.org>
BOOKING_REPLY_TO=hello@torpedoweb.org
NEXT_PUBLIC_SITE_URL=https://torpedoweb.org
```

- `POST /api/contact` — internal + client confirmation
- `POST /api/booking/create` — booking notification + client confirmation
- Templates: `lib/email-templates.ts`, client: `lib/resend.ts`

### 2. Offer page (`TW-Offer/`)

```bash
RESEND_API_KEY=re_xxxxxxxx
BOOKING_FROM_EMAIL=Torpedo Web <hello@torpedoweb.org>
NEXT_PUBLIC_BOOKING_URL=https://book.torpedoweb.org
```

- `POST /api/audit` — growth audit form emails

### 3. Audit tool (this repo)

```bash
RESEND_API_KEY=re_xxxxxxxx
RESEND_FROM_EMAIL=Torpedo Web <reports@audit.torpedoweb.org>
NEXT_PUBLIC_APP_URL=https://audit.torpedoweb.org
NEXT_PUBLIC_BOOKING_URL=https://book.torpedoweb.org
```

- `POST /api/leads` → `deliverAuditReport` → `sendAuditReportEmail` (PDF attachment)
- If `RESEND_API_KEY` or from address is missing, unlock still works; email is skipped (`emailSkipped: true` in API response).
- UI after unlock: “A copy is emailed when Resend is configured” + **Book a strategy call** → `NEXT_PUBLIC_BOOKING_URL`.

## Verify audit tool email locally

1. Copy `.env.example` → `.env.local` and set `RESEND_API_KEY` + `RESEND_FROM_EMAIL`.
2. Run audit to completion, submit lead form on results page.
3. Check Resend dashboard **Logs** and `email_logs` table in Postgres.

## Production (Vercel)

Add the same `RESEND_API_KEY` to each Vercel project (main, offer, audit). Use app-specific from addresses on the verified domain. Redeploy after changing env vars.

## “Book a strategy call”

| Location | Link |
|----------|------|
| Audit results UI (`ReportActions`) | `NEXT_PUBLIC_BOOKING_URL` (default `https://book.torpedoweb.org`) |
| Audit report email | Same booking URL in CTA button |
| Main site CTAs / i18n | `/booking` and `BOOKING_SHORT_URL` in `lib/constants.ts` |
| Client confirmation emails (main site) | Google Calendar “Book a free consultation” in `buildClientConfirmationEmail` |
