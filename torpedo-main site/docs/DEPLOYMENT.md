# Deployment and environment

## Deploying app.torpedoweb.org (or app.torpedo.web)

Use a single Next.js app for the marketing site and blog admin. Deploy to one domain (or a subdomain for the app).

### 1. Hosting (e.g. Vercel)

- Connect your Git repo (GitHub/GitLab) to Vercel.
- Build command: `npm run build`. Output: Next.js (default).
- Root directory: project root.
- Set **all** environment variables (see below) in Project Settings → Environment Variables for Production (and Preview if you use branches).

### 2. Subdomain setup

- **Option A – Same domain:** Deploy once at `torpedoweb.org`. The app serves the marketing site (/). No subdomain needed.
- **Option B – Subdomain:** To use `app.torpedoweb.org` or `app.torpedo.web`:
  - In your DNS provider, add a **CNAME** record: `app` → `cname.vercel-dns.com` (or the host value Vercel shows for your project).
  - In Vercel: Project Settings → Domains → Add `app.torpedoweb.org` (or `app.torpedo.web`). Vercel will issue SSL.
  - Set **Site URL** in Supabase Auth to `https://app.torpedoweb.org` (or your chosen app URL) so login redirects and password reset go to the right place.

### 3. Environment variables (production)

Copy from `.env.example` and set for production:

- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **Booking**: `RESEND_API_KEY`, `BOOKING_FROM_EMAIL`, `BOOKING_REPLY_TO` (optional), `NEXT_PUBLIC_SITE_URL` (e.g. `https://torpedoweb.org` for email logo link)

Do not commit `.env.local`. Use Vercel (or your host) project settings for production env.

### 4. Supabase Auth redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:

- **Site URL:** Your app URL (e.g. `https://app.torpedoweb.org` or `https://torpedoweb.org`).
- **Redirect URLs:** Add `https://<your-app-domain>/api/auth/callback`.

---

## Environment variables (reference)

Copy `.env.example` to `.env.local` and set values. Required for full functionality:

- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (auth, DB, booking)
- **Booking**: `RESEND_API_KEY`, `BOOKING_FROM_EMAIL` (optional; enables confirmation email)

Do not commit `.env.local`. Use Vercel (or your host) project settings to set env in production.

## Database

1. Create a Supabase project.
2. Run migrations in order (see `supabase/migrations/`). Use Supabase Dashboard SQL editor or `supabase db push` if using Supabase CLI.
3. Enable **Email** auth in Supabase Auth. Set **Site URL** and **Redirect URLs** to your app origin and `/api/auth/callback`.

## Vercel

- Deploy from Git; build command `npm run build`, output Next.js.
- Set all env vars in Project Settings → Environment Variables.
- Add custom domain (e.g. `app.torpedoweb.org`) in Domains; add CNAME in DNS.
- No custom rewrites needed; Next.js handles routes.
