-- Create booking_reports table for walk reports
CREATE TABLE IF NOT EXISTS public.booking_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  report_text TEXT NOT NULL,
  duration_minutes INTEGER,
  distance_km NUMERIC,
  behavior_notes TEXT,
  bathroom_breaks INTEGER DEFAULT 0,
  water_provided BOOLEAN DEFAULT false,
  treats_given BOOLEAN DEFAULT false,
  incidents TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.booking_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for booking_reports
CREATE POLICY "Sitters can create reports for their bookings"
ON public.booking_reports FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = booking_reports.booking_id 
    AND bookings.sitter_id = auth.uid()
  )
);

CREATE POLICY "Users can view reports for their bookings"
ON public.booking_reports FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = booking_reports.booking_id 
    AND (bookings.owner_id = auth.uid() OR bookings.sitter_id = auth.uid())
  )
);

-- Create walkers view (for admin interface)
CREATE OR REPLACE VIEW public.walkers AS
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
  20.0 as hourly_rate, -- Default rate, you can adjust this
  0 as total_reviews,
  true as is_active
FROM public.users u
WHERE u.role = 'sitter';

-- Create booking_media view (alias for service_photos)
CREATE OR REPLACE VIEW public.booking_media AS
SELECT 
  id,
  booking_id,
  url as media_url,
  'photo' as media_type,
  caption,
  created_at,
  sent
FROM public.service_photos;

-- Rename documents table columns to match code expectations
-- First, let's add an alias/view for user_documents
CREATE OR REPLACE VIEW public.user_documents AS
SELECT 
  id,
  user_id,
  type as document_type,
  url as document_url,
  status as verified,
  created_at as uploaded_at,
  verified_at,
  updated_at
FROM public.documents;