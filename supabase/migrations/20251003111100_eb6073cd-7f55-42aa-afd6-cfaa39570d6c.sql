-- Table pour la messagerie entre propriétaires et promeneurs
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL,
  sender_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  message_text TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_user_id);

-- Table pour les médias des promenades (photos/vidéos)
CREATE TABLE IF NOT EXISTS public.booking_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video')),
  caption TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_booking_media_booking ON public.booking_media(booking_id);

-- Table pour les rapports de promenade
CREATE TABLE IF NOT EXISTS public.booking_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  walker_id UUID NOT NULL REFERENCES public.walkers(id),
  distance_km NUMERIC,
  duration_actual_minutes INTEGER,
  behavior_notes TEXT,
  health_notes TEXT,
  incidents TEXT,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_booking_reports_booking ON public.booking_reports(booking_id);

-- Table pour les pourboires
CREATE TABLE IF NOT EXISTS public.tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  client_user_id UUID NOT NULL REFERENCES public.users(id),
  walker_id UUID NOT NULL REFERENCES public.walkers(id),
  amount NUMERIC NOT NULL,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tips_booking ON public.tips(booking_id);
CREATE INDEX IF NOT EXISTS idx_tips_walker ON public.tips(walker_id);

-- Table pour les documents uploadés (CI, casier judiciaire, etc.)
CREATE TABLE IF NOT EXISTS public.user_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('id_card', 'criminal_record', 'certification', 'other')),
  document_url TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_documents_user ON public.user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_type ON public.user_documents(document_type);

-- Table pour les certifications et formations des promeneurs
CREATE TABLE IF NOT EXISTS public.walker_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  walker_id UUID NOT NULL REFERENCES public.walkers(id) ON DELETE CASCADE,
  certification_name TEXT NOT NULL,
  certification_type TEXT NOT NULL CHECK (certification_type IN ('first_aid', 'training', 'veterinary', 'behavior', 'other')),
  issuer TEXT,
  issue_date DATE,
  expiry_date DATE,
  certificate_url TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_walker_certifications_walker ON public.walker_certifications(walker_id);

-- Table pour les notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('booking', 'message', 'review', 'payment', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_id UUID,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(user_id, is_read);

-- Table pour le tracking GPS en temps réel
CREATE TABLE IF NOT EXISTS public.booking_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  accuracy NUMERIC,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_booking_locations_booking ON public.booking_locations(booking_id, recorded_at DESC);

-- Activer le realtime pour le tracking GPS
ALTER PUBLICATION supabase_realtime ADD TABLE public.booking_locations;

-- RLS Policies pour messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages"
ON public.messages FOR SELECT
USING (
  sender_user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  OR receiver_user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
WITH CHECK (
  sender_user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "Users can update their sent messages"
ON public.messages FOR UPDATE
USING (sender_user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- RLS Policies pour booking_media
ALTER TABLE public.booking_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Walkers can upload media for their bookings"
ON public.booking_media FOR INSERT
WITH CHECK (
  booking_id IN (
    SELECT b.id FROM public.bookings b
    JOIN public.walkers w ON b.walker_id = w.id
    JOIN public.users u ON w.user_id = u.id
    WHERE u.auth_user_id = auth.uid()
  )
);

CREATE POLICY "Users can view media from their bookings"
ON public.booking_media FOR SELECT
USING (
  booking_id IN (
    SELECT b.id FROM public.bookings b
    JOIN public.users u ON b.client_user_id = u.id
    WHERE u.auth_user_id = auth.uid()
  )
  OR booking_id IN (
    SELECT b.id FROM public.bookings b
    JOIN public.walkers w ON b.walker_id = w.id
    JOIN public.users u ON w.user_id = u.id
    WHERE u.auth_user_id = auth.uid()
  )
);

-- RLS Policies pour booking_reports
ALTER TABLE public.booking_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Walkers can create reports for their bookings"
ON public.booking_reports FOR INSERT
WITH CHECK (
  walker_id IN (
    SELECT w.id FROM public.walkers w
    JOIN public.users u ON w.user_id = u.id
    WHERE u.auth_user_id = auth.uid()
  )
);

CREATE POLICY "Users can view reports from their bookings"
ON public.booking_reports FOR SELECT
USING (
  booking_id IN (
    SELECT b.id FROM public.bookings b
    JOIN public.users u ON b.client_user_id = u.id
    WHERE u.auth_user_id = auth.uid()
  )
  OR walker_id IN (
    SELECT w.id FROM public.walkers w
    JOIN public.users u ON w.user_id = u.id
    WHERE u.auth_user_id = auth.uid()
  )
);

-- RLS Policies pour tips
ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can create tips"
ON public.tips FOR INSERT
WITH CHECK (
  client_user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "Users can view their own tips"
ON public.tips FOR SELECT
USING (
  client_user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  OR walker_id IN (
    SELECT w.id FROM public.walkers w
    JOIN public.users u ON w.user_id = u.id
    WHERE u.auth_user_id = auth.uid()
  )
);

-- RLS Policies pour user_documents
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can upload their own documents"
ON public.user_documents FOR INSERT
WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can view their own documents"
ON public.user_documents FOR SELECT
USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own documents"
ON public.user_documents FOR UPDATE
USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- RLS Policies pour walker_certifications
ALTER TABLE public.walker_certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Walkers can manage their certifications"
ON public.walker_certifications FOR ALL
USING (
  walker_id IN (
    SELECT w.id FROM public.walkers w
    JOIN public.users u ON w.user_id = u.id
    WHERE u.auth_user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can view verified certifications"
ON public.walker_certifications FOR SELECT
USING (verified = true);

-- RLS Policies pour notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- RLS Policies pour booking_locations
ALTER TABLE public.booking_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Walkers can add locations for their bookings"
ON public.booking_locations FOR INSERT
WITH CHECK (
  booking_id IN (
    SELECT b.id FROM public.bookings b
    JOIN public.walkers w ON b.walker_id = w.id
    JOIN public.users u ON w.user_id = u.id
    WHERE u.auth_user_id = auth.uid()
  )
);

CREATE POLICY "Users can view locations from their bookings"
ON public.booking_locations FOR SELECT
USING (
  booking_id IN (
    SELECT b.id FROM public.bookings b
    JOIN public.users u ON b.client_user_id = u.id
    WHERE u.auth_user_id = auth.uid()
  )
  OR booking_id IN (
    SELECT b.id FROM public.bookings b
    JOIN public.walkers w ON b.walker_id = w.id
    JOIN public.users u ON w.user_id = u.id
    WHERE u.auth_user_id = auth.uid()
  )
);

-- Créer les buckets de storage pour les documents et médias
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('booking-media', 'booking-media', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Policies pour le bucket documents
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policies pour le bucket booking-media
CREATE POLICY "Walkers can upload booking media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'booking-media' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view booking media"
ON storage.objects FOR SELECT
USING (bucket_id = 'booking-media' AND auth.role() = 'authenticated');

-- Policies pour le bucket avatars
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);