-- Fix security definer views by adding RLS policies

-- Drop and recreate walkers view without SECURITY DEFINER
DROP VIEW IF EXISTS public.walkers;
CREATE VIEW public.walkers 
WITH (security_invoker = true)
AS
SELECT 
  u.id as user_id,
  u.first_name,
  u.last_name,
  u.email,
  u.phone,
  u.avatar_url,
  u.bio,
  u.location,
  u.average_rating as rating,
  u.is_verified,
  u.background_checked,
  u.created_at,
  20.0 as hourly_rate,
  0 as total_reviews,
  true as is_active
FROM public.users u
WHERE u.role = 'sitter';

-- Drop and recreate booking_media view without SECURITY DEFINER
DROP VIEW IF EXISTS public.booking_media;
CREATE VIEW public.booking_media
WITH (security_invoker = true)
AS
SELECT 
  id,
  booking_id,
  url as media_url,
  'photo' as media_type,
  caption,
  created_at,
  sent
FROM public.service_photos;

-- Drop and recreate user_documents view without SECURITY DEFINER
DROP VIEW IF EXISTS public.user_documents;
CREATE VIEW public.user_documents
WITH (security_invoker = true)
AS
SELECT 
  id,
  user_id,
  type as document_type,
  url as document_url,
  CASE 
    WHEN status = 'VERIFIED' THEN true
    ELSE false
  END as verified,
  created_at as uploaded_at,
  verified_at,
  updated_at
FROM public.documents;