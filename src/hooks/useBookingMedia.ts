import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BookingMedia {
  id: string;
  booking_id: string;
  media_url: string;
  media_type: 'photo' | 'video';
  caption?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
}

export const useBookingMedia = (bookingId: string) => {
  const [media, setMedia] = useState<BookingMedia[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('booking_media')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedia((data || []) as BookingMedia[]);
    } catch (error) {
      console.error('Error fetching booking media:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadMedia = async (
    file: File,
    mediaType: 'photo' | 'video',
    caption?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${bookingId}/${Date.now()}.${fileExt}`;
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('booking-media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('booking-media')
        .getPublicUrl(fileName);

      // Insert media record into service_photos (booking_media is a view)
      const { error: insertError } = await supabase
        .from('service_photos')
        .insert({
          booking_id: bookingId,
          url: publicUrl,
          caption
        });

      if (insertError) throw insertError;

      await fetchMedia();
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchMedia();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`booking-media-${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'booking_media',
          filter: `booking_id=eq.${bookingId}`
        },
        () => {
          fetchMedia();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId]);

  return {
    media,
    loading,
    uploadMedia,
    refetch: fetchMedia
  };
};
