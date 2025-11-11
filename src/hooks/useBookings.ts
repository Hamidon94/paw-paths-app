import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Booking {
  id: string;
  owner_id: string;
  sitter_id: string;
  pet_id: string;
  booking_date: string;
  start_time: string;
  duration_minutes: number;
  total_price: number;
  commission_rate: number;
  commission_amount: number;
  walker_amount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  pickup_address: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  special_instructions?: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  stripe_payment_intent_id?: string;
  walker_notes?: string;
  started_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  walker?: {
    first_name: string;
    last_name: string;
    rating: number;
    hourly_rate: number;
  };
  dog?: {
    name: string;
    breed: string;
    size: string;
  };
}

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('booking_date', { ascending: false })
        .order('start_time', { ascending: false });

      if (error) throw error;

      // For now, just return the basic data without joins
      const bookingsWithMockData = (data || []).map((booking: any) => ({
        ...booking,
        status: booking.status as Booking['status'],
        walker: {
          first_name: 'Promeneur',
          last_name: 'Test',
          rating: 4.5,
          hourly_rate: 30,
        },
        dog: {
          name: 'Chien',
          breed: 'Race inconnue',
          size: 'Moyen',
        }
      }));

      setBookings(bookingsWithMockData);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer vos réservations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const createBooking = async (bookingData: {
    walkerId: string;
    dogId: string;
    start_date: string;
    end_date: string;
    duration: number;
    service_type: string;
    base_price: number;
    notes?: string;
  }) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get user's hourly rate
      const { data: sitterData } = await supabase
        .from('users')
        .select('hourly_rate')
        .eq('id', bookingData.walkerId)
        .single();

      const hourlyRate = sitterData?.hourly_rate || 30;
      const totalPrice = (hourlyRate * bookingData.duration) / 60;

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          owner_id: user.id,
          sitter_id: bookingData.walkerId,
          pet_id: bookingData.dogId,
          start_date: bookingData.start_date,
          end_date: bookingData.end_date,
          duration: bookingData.duration,
          service_type: bookingData.service_type,
          base_price: bookingData.base_price,
          total_price: totalPrice,
          booking_number: `BK-${Date.now()}`,
          notes: bookingData.notes,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchBookings(); // Refresh the list
      toast({
        title: "Succès",
        description: "Votre réservation a été créée avec succès",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la réservation",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status'], notes?: string) => {
    try {
      const updates: any = { status };
      
      if (status === 'in_progress') {
        updates.started_at = new Date().toISOString();
      } else if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
        if (notes) updates.walker_notes = notes;
      } else if (status === 'cancelled') {
        updates.cancelled_at = new Date().toISOString();
        if (notes) updates.cancellation_reason = notes;
      }

      const { error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchBookings(); // Refresh the list
      toast({
        title: "Succès",
        description: "Le statut de la réservation a été mis à jour",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour la réservation",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    bookings,
    loading,
    createBooking,
    updateBookingStatus,
    refetch: fetchBookings
  };
};