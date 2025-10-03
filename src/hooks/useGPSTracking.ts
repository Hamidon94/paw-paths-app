import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LocationPoint {
  id: string;
  booking_id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  recorded_at: string;
}

export const useGPSTracking = (bookingId: string) => {
  const [locations, setLocations] = useState<LocationPoint[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('booking_locations')
        .select('*')
        .eq('booking_id', bookingId)
        .order('recorded_at', { ascending: true });

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported');
      return;
    }

    setIsTracking(true);

    // Watch position with high accuracy
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error('Error getting location:', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
    );

    // Send location every 10 seconds
    trackingIntervalRef.current = setInterval(async () => {
      if (currentLocation) {
        try {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            
            const { error } = await supabase
              .from('booking_locations')
              .insert({
                booking_id: bookingId,
                latitude,
                longitude,
                accuracy
              });

            if (error) throw error;
          });
        } catch (error) {
          console.error('Error saving location:', error);
        }
      }
    }, 10000); // Every 10 seconds
  };

  const stopTracking = () => {
    setIsTracking(false);

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }
  };

  useEffect(() => {
    fetchLocations();

    // Subscribe to realtime location updates
    const channel = supabase
      .channel(`booking-locations-${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'booking_locations',
          filter: `booking_id=eq.${bookingId}`
        },
        (payload) => {
          setLocations(prev => [...prev, payload.new as LocationPoint]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      stopTracking();
    };
  }, [bookingId]);

  return {
    locations,
    currentLocation,
    isTracking,
    startTracking,
    stopTracking,
    refetch: fetchLocations
  };
};
