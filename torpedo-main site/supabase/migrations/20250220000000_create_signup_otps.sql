-- Store pending sign-up OTPs (email verification before creating Supabase user).
-- One row per email; upsert on new OTP request.
CREATE TABLE IF NOT EXISTS public.signup_otps (
  email TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  otp_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.signup_otps IS 'Pending sign-up verification OTPs; cleared after use or expiry';
