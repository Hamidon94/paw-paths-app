import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Booking {
  id: string;
  client_user_id: string;
  walker_id: string;
  dog_id: string;
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
    walker_id: string;
    dog_id: string;
    booking_date: string;
    start_time: string;
    duration_minutes: number;
    pickup_address: string;
    pickup_latitude?: number;
    pickup_longitude?: number;
    special_instructions?: string;
  }) => {
    try {
      // Get current user ID from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (userError) throw userError;

      // Get walker hourly rate to calculate total price
      const { data: walkerData, error: walkerError } = await supabase
        .from('walkers')
        .select('hourly_rate')
        .eq('id', bookingData.walker_id)
        .single();

      if (walkerError) throw walkerError;

      const totalPrice = (walkerData.hourly_rate / 60) * bookingData.duration_minutes;

      const commissionAmount = totalPrice * 0.20;
      const walkerAmount = totalPrice - commissionAmount;

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          client_user_id: userData.id,
          total_price: totalPrice,
          commission_rate: 0.20,
          commission_amount: commissionAmount,
          walker_amount: walkerAmount,
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