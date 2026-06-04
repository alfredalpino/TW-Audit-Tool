-- Remove pricing/budget column (pricing is after analysis); ensure business_info exists
ALTER TABLE public.bookings DROP COLUMN IF EXISTS budget_range;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS business_info TEXT;
