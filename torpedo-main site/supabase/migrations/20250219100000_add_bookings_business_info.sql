-- Add business_info for "About your business" (map, social links, website, etc.)
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS business_info TEXT;
