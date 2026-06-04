-- Run this in Supabase → SQL Editor → New query
-- Updates the bookings table: remove budget column, add business_info

ALTER TABLE public.bookings DROP COLUMN IF EXISTS budget_range;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS business_info TEXT;
