-- Fix security warnings by setting proper search_path for functions
CREATE OR REPLACE FUNCTION public.update_walker_rating()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Update the existing function with proper search_path
CREATE OR REPLACE FUNCTION public.calculate_booking_amounts()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.commission_amount = NEW.total_price * NEW.commission_rate;
  NEW.walker_amount = NEW.total_price - NEW.commission_amount;
  RETURN NEW;
END;
$$;