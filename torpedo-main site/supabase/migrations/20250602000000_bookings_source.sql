-- Track where a booking originated (popup, future /book flow, etc.)
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'web';

CREATE INDEX IF NOT EXISTS idx_bookings_source ON public.bookings(source);
