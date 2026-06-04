# Supabase DB setup for Torpedo

Use this to get the database (and booking form) working with your Supabase project.

---

## 1. Create / use a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Create a new project (or use an existing one).
3. Wait until the project is ready (database and API are up).

---

## 2. Get your env values

In the Supabase dashboard:

1. Open **Project Settings** (gear) → **API**.
2. Copy:
   - **Project URL** → use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → use as `SUPABASE_SERVICE_ROLE_KEY` (keep this secret; server-only)

Put them in `.env` at the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

---

## 3. Create the `bookings` table

Your app expects a `bookings` table. Use **one** of these options.

### Option A: Run SQL in the dashboard (fastest)

1. In Supabase, open **SQL Editor**.
2. Click **New query**.
3. Paste and run this SQL:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT NOT NULL,
  timeline TEXT,
  business_info TEXT,
  description TEXT,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS bookings_insert_anon ON public.bookings;
CREATE POLICY bookings_insert_anon ON public.bookings FOR INSERT WITH CHECK (true);
```

4. Click **Run**. You should see “Success. No rows returned.”

### Option B: Use Supabase CLI migrations

1. Install Supabase CLI and log in:
   ```bash
   npx supabase login
   ```
2. Link this repo to your project:
   ```bash
   npx supabase link --project-ref YOUR_PROJECT_REF
   ```
   (`YOUR_PROJECT_REF` is in the project URL: `https://YOUR_PROJECT_REF.supabase.co`.)
3. Push migrations:
   ```bash
   npx supabase db push
   ```

---

## 4. Confirm the table exists

1. In Supabase, open **Table Editor**.
2. You should see a **bookings** table with columns: `id`, `name`, `email`, `project_type`, `timeline`, `business_info`, `description`, `scheduled_at`, `created_at`.

If you see that, the booking form can save to the DB.

---

## 5. Restart the app

After changing `.env` or the database:

```bash
npm run dev
```

Submit the booking form again; it should return 201 and you should get the two emails (you + customer) if Resend is configured.

---

## Summary checklist

- [ ] Supabase project created
- [ ] `.env` has `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `bookings` table created with `timeline`, `business_info`, `description` (no `budget_range`)
- [ ] App restarted; form submitted successfully
