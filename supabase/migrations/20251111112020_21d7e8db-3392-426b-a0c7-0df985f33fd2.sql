-- Create tips table
CREATE TABLE IF NOT EXISTS public.tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  client_user_id UUID NOT NULL,
  walker_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;

-- Policies for tips
CREATE POLICY "Users can view tips for their bookings"
  ON public.tips FOR SELECT
  USING (
    client_user_id = auth.uid() OR 
    walker_id = auth.uid()
  );

CREATE POLICY "Clients can create tips"
  ON public.tips FOR INSERT
  WITH CHECK (client_user_id = auth.uid());

-- Add to realtime
ALTER TABLE public.tips REPLICA IDENTITY FULL;