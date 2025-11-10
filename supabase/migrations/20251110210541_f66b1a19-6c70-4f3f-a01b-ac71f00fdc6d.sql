-- Create booking_locations table for GPS tracking
CREATE TABLE IF NOT EXISTS public.booking_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accuracy NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.booking_locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for booking_locations
CREATE POLICY "Sitters can create locations for their bookings"
ON public.booking_locations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = booking_locations.booking_id 
    AND bookings.sitter_id = auth.uid()
  )
);

CREATE POLICY "Users can view locations for their bookings"
ON public.booking_locations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = booking_locations.booking_id 
    AND (bookings.owner_id = auth.uid() OR bookings.sitter_id = auth.uid())
  )
);