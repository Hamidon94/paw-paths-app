-- Add foreign key constraint between walkers and users tables
ALTER TABLE public.walkers 
ADD CONSTRAINT walkers_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;