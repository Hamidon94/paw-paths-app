-- Create dogs view (alias for pets table)
CREATE OR REPLACE VIEW public.dogs
WITH (security_invoker = true)
AS
SELECT 
  id,
  owner_id as user_id,
  name,
  breed,
  age,
  weight,
  type as size,
  bio as description,
  medical_history as medical_notes,
  temperament as behavior_notes,
  photo_url,
  true as is_active,
  created_at,
  updated_at
FROM public.pets;

-- Add missing columns to users table for walker features
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC DEFAULT 20.0,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;