-- Create dogs table for client pets
CREATE TABLE public.dogs (
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
CREATE TABLE public.walkers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bio TEXT,
  experience_years INTEGER DEFAULT 0,
  hourly_rate NUMERIC NOT NULL DEFAULT 30.00,
  service_radius INTEGER NOT NULL DEFAULT 5, -- km radius
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
CREATE TABLE public.walker_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  walker_id UUID NOT NULL REFERENCES public.walkers(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_user_id UUID NOT NULL,
  walker_id UUID NOT NULL REFERENCES public.walkers(id),
  dog_id UUID NOT NULL REFERENCES public.dogs(id),
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
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  client_user_id UUID NOT NULL,
  walker_id UUID NOT NULL REFERENCES public.walkers(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create walker photos table
CREATE TABLE public.walker_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  walker_id UUID NOT NULL REFERENCES public.walkers(id) ON DELETE CASCADE,
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
CREATE POLICY "Users can view their own dogs" ON public.dogs FOR SELECT USING (user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));
CREATE POLICY "Users can create their own dogs" ON public.dogs FOR INSERT WITH CHECK (user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));
CREATE POLICY "Users can update their own dogs" ON public.dogs FOR UPDATE USING (user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));
CREATE POLICY "Users can delete their own dogs" ON public.dogs FOR DELETE USING (user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));

-- RLS Policies for walkers (public read, own write)
CREATE POLICY "Anyone can view active walkers" ON public.walkers FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create their walker profile" ON public.walkers FOR INSERT WITH CHECK (user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));
CREATE POLICY "Users can update their own walker profile" ON public.walkers FOR UPDATE USING (user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));

-- RLS Policies for walker availability
CREATE POLICY "Anyone can view walker availability" ON public.walker_availability FOR SELECT USING (true);
CREATE POLICY "Walker owners can manage availability" ON public.walker_availability FOR ALL USING (walker_id IN (SELECT walkers.id FROM walkers WHERE walkers.user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid())));

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings as client" ON public.bookings FOR SELECT USING (client_user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));
CREATE POLICY "Walkers can view their bookings" ON public.bookings FOR SELECT USING (walker_id IN (SELECT walkers.id FROM walkers WHERE walkers.user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid())));
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (client_user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));
CREATE POLICY "Clients can update their bookings" ON public.bookings FOR UPDATE USING (client_user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));
CREATE POLICY "Walkers can update their bookings" ON public.bookings FOR UPDATE USING (walker_id IN (SELECT walkers.id FROM walkers WHERE walkers.user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid())));

-- RLS Policies for reviews
CREATE POLICY "Anyone can view visible reviews" ON public.reviews FOR SELECT USING (is_visible = true);
CREATE POLICY "Clients can create reviews for their bookings" ON public.reviews FOR INSERT WITH CHECK (client_user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));
CREATE POLICY "Clients can update their own reviews" ON public.reviews FOR UPDATE USING (client_user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));

-- RLS Policies for walker photos
CREATE POLICY "Anyone can view walker photos" ON public.walker_photos FOR SELECT USING (true);
CREATE POLICY "Walker owners can manage photos" ON public.walker_photos FOR ALL USING (walker_id IN (SELECT walkers.id FROM walkers WHERE walkers.user_id IN (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid())));

-- Create indexes for performance
CREATE INDEX idx_dogs_user_id ON public.dogs(user_id);
CREATE INDEX idx_walkers_location ON public.walkers(latitude, longitude) WHERE is_active = true;
CREATE INDEX idx_walkers_user_id ON public.walkers(user_id);
CREATE INDEX idx_walker_availability_walker_id ON public.walker_availability(walker_id);
CREATE INDEX idx_bookings_client_user_id ON public.bookings(client_user_id);
CREATE INDEX idx_bookings_walker_id ON public.bookings(walker_id);
CREATE INDEX idx_bookings_date_status ON public.bookings(booking_date, status);
CREATE INDEX idx_reviews_walker_id ON public.reviews(walker_id);
CREATE INDEX idx_walker_photos_walker_id ON public.walker_photos(walker_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_dogs_updated_at BEFORE UPDATE ON public.dogs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_walkers_updated_at BEFORE UPDATE ON public.walkers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update walker rating when new review is added
CREATE OR REPLACE FUNCTION public.update_walker_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.walkers 
  SET 
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM public.reviews 
      WHERE walker_id = NEW.walker_id AND is_visible = true
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.reviews 
      WHERE walker_id = NEW.walker_id AND is_visible = true
    )
  WHERE id = NEW.walker_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update walker rating on review insert/update
CREATE TRIGGER update_walker_rating_on_review
  AFTER INSERT OR UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_walker_rating();

-- Function to calculate commission and walker amount
CREATE OR REPLACE FUNCTION public.calculate_booking_amounts()
RETURNS TRIGGER AS $$
BEGIN
  NEW.commission_amount = NEW.total_price * NEW.commission_rate;
  NEW.walker_amount = NEW.total_price - NEW.commission_amount;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to calculate amounts before insert/update
CREATE TRIGGER calculate_booking_amounts_trigger
  BEFORE INSERT OR UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_booking_amounts();