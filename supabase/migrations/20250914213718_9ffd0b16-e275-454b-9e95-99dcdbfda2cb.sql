-- Create dogs table for client pets (if not exists)
CREATE TABLE IF NOT EXISTS public.dogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  age INTEGER NOT NULL,
  size TEXT NOT NULL CHECK (size IN ('Petit', 'Moyen', 'Grand')),
  weight NUMERIC,
  description TEXT,
  medical_notes TEXT,
  behavior_notes TEXT,
  photo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create walkers table for dog walkers
CREATE TABLE IF NOT EXISTS public.walkers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bio TEXT,
  experience_years INTEGER DEFAULT 0,
  hourly_rate NUMERIC NOT NULL DEFAULT 30.00,
  service_radius INTEGER NOT NULL DEFAULT 5,
  latitude NUMERIC,
  longitude NUMERIC,
  address TEXT,
  city TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  total_walks INTEGER DEFAULT 0,
  certifications TEXT[],
  languages TEXT[] DEFAULT ARRAY['Français'],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create walker availability
CREATE TABLE IF NOT EXISTS public.walker_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  walker_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_user_id UUID NOT NULL,
  walker_id UUID NOT NULL,
  dog_id UUID NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  total_price NUMERIC NOT NULL,
  commission_rate NUMERIC NOT NULL DEFAULT 0.20,
  commission_amount NUMERIC NOT NULL,
  walker_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  pickup_address TEXT NOT NULL,
  pickup_latitude NUMERIC,
  pickup_longitude NUMERIC,
  special_instructions TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  stripe_payment_intent_id TEXT,
  walker_notes TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL,
  client_user_id UUID NOT NULL,
  walker_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create walker photos table
CREATE TABLE IF NOT EXISTS public.walker_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  walker_id UUID NOT NULL,
  photo_url TEXT NOT NULL,
  is_profile_photo BOOLEAN NOT NULL DEFAULT false,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.walkers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.walker_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.walker_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dogs
DROP POLICY IF EXISTS "Users can view their own dogs" ON public.dogs;
DROP POLICY IF EXISTS "Users can create their own dogs" ON public.dogs;
DROP POLICY IF EXISTS "Users can update their own dogs" ON public.dogs;
DROP POLICY IF EXISTS "Users can delete their own dogs" ON public.dogs;

CREATE POLICY "Users can view their own dogs" ON public.dogs FOR SELECT USING (user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));
CREATE POLICY "Users can create their own dogs" ON public.dogs FOR INSERT WITH CHECK (user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));
CREATE POLICY "Users can update their own dogs" ON public.dogs FOR UPDATE USING (user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));
CREATE POLICY "Users can delete their own dogs" ON public.dogs FOR DELETE USING (user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));

-- RLS Policies for walkers
DROP POLICY IF EXISTS "Anyone can view active walkers" ON public.walkers;
DROP POLICY IF EXISTS "Users can create their walker profile" ON public.walkers;
DROP POLICY IF EXISTS "Users can update their own walker profile" ON public.walkers;

CREATE POLICY "Anyone can view active walkers" ON public.walkers FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create their walker profile" ON public.walkers FOR INSERT WITH CHECK (user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));
CREATE POLICY "Users can update their own walker profile" ON public.walkers FOR UPDATE USING (user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));

-- RLS Policies for walker availability
DROP POLICY IF EXISTS "Anyone can view walker availability" ON public.walker_availability;
DROP POLICY IF EXISTS "Walker owners can manage availability" ON public.walker_availability;

CREATE POLICY "Anyone can view walker availability" ON public.walker_availability FOR SELECT USING (true);
CREATE POLICY "Walker owners can manage availability" ON public.walker_availability FOR ALL USING (walker_id IN (SELECT walkers.id FROM walkers WHERE walkers.user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid())));

-- RLS Policies for bookings
DROP POLICY IF EXISTS "Users can view their own bookings as client" ON public.bookings;
DROP POLICY IF EXISTS "Walkers can view their bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Clients can update their bookings" ON public.bookings;
DROP POLICY IF EXISTS "Walkers can update their bookings" ON public.bookings;

CREATE POLICY "Users can view their own bookings as client" ON public.bookings FOR SELECT USING (client_user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));
CREATE POLICY "Walkers can view their bookings" ON public.bookings FOR SELECT USING (walker_id IN (SELECT walkers.id FROM walkers WHERE walkers.user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid())));
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (client_user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));
CREATE POLICY "Clients can update their bookings" ON public.bookings FOR UPDATE USING (client_user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));
CREATE POLICY "Walkers can update their bookings" ON public.bookings FOR UPDATE USING (walker_id IN (SELECT walkers.id FROM walkers WHERE walkers.user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid())));

-- RLS Policies for reviews
DROP POLICY IF EXISTS "Anyone can view visible reviews" ON public.reviews;
DROP POLICY IF EXISTS "Clients can create reviews for their bookings" ON public.reviews;
DROP POLICY IF EXISTS "Clients can update their own reviews" ON public.reviews;

CREATE POLICY "Anyone can view visible reviews" ON public.reviews FOR SELECT USING (is_visible = true);
CREATE POLICY "Clients can create reviews for their bookings" ON public.reviews FOR INSERT WITH CHECK (client_user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));
CREATE POLICY "Clients can update their own reviews" ON public.reviews FOR UPDATE USING (client_user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));

-- RLS Policies for walker photos
DROP POLICY IF EXISTS "Anyone can view walker photos" ON public.walker_photos;
DROP POLICY IF EXISTS "Walker owners can manage photos" ON public.walker_photos;

CREATE POLICY "Anyone can view walker photos" ON public.walker_photos FOR SELECT USING (true);
CREATE POLICY "Walker owners can manage photos" ON public.walker_photos FOR ALL USING (walker_id IN (SELECT walkers.id FROM walkers WHERE walkers.user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid())));

-- Functions and triggers
CREATE OR REPLACE FUNCTION public.calculate_booking_amounts()
RETURNS TRIGGER AS $$
BEGIN
  NEW.commission_amount = NEW.total_price * NEW.commission_rate;
  NEW.walker_amount = NEW.total_price - NEW.commission_amount;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS calculate_booking_amounts_trigger ON public.bookings;
CREATE TRIGGER calculate_booking_amounts_trigger
  BEFORE INSERT OR UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_booking_amounts();