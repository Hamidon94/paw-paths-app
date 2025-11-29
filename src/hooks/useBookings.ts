import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  owner_id: string;
  sitter_id: string;
  pet_id: string;
  booking_number: string;
  start_date: string;
  end_date: string;
  duration: number;
  service_type: string;
  base_price: number;
  additional_price: number;
  total_price: number;
  status: BookingStatus;
  payment_status: string;
  notes?: string;
  additional_services?: string[];
  created_at: string;
  updated_at: string;
  // For compatibility with existing code
  booking_date: string;
  start_time: string;
  duration_minutes: number;
  pickup_address: string;
  special_instructions?: string;
  walker_amount?: number;
  commission_rate?: number;
  commission_amount?: number;
  // Joined data
  walker?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
    rating: number;
    hourly_rate: number;
    phone?: string;
  };
  dog?: {
    id: string;
    name: string;
    breed: string;
    size: string;
    age?: number;
    photo_url?: string;
  };
  owner?: {
    id: string;
    first_name: string;
    last_name: string;
    phone?: string;
  };
}

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch bookings where user is either owner or sitter
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select('*')
        .or(`owner_id.eq.${user.id},sitter_id.eq.${user.id}`)
        .order('start_date', { ascending: false });

      if (error) throw error;

      if (!bookingsData || bookingsData.length === 0) {
        setBookings([]);
        setLoading(false);
        return;
      }

      // Get unique user IDs and pet IDs
      const sitterIds = [...new Set(bookingsData.map(b => b.sitter_id))];
      const ownerIds = [...new Set(bookingsData.map(b => b.owner_id))];
      const petIds = [...new Set(bookingsData.map(b => b.pet_id))];

      // Fetch walkers (sitters)
      const { data: walkersData } = await supabase
        .from('users')
        .select('id, first_name, last_name, avatar_url, average_rating, hourly_rate, phone')
        .in('id', sitterIds);

      // Fetch owners
      const { data: ownersData } = await supabase
        .from('users')
        .select('id, first_name, last_name, phone')
        .in('id', ownerIds);

      // Fetch pets
      const { data: petsData } = await supabase
        .from('pets')
        .select('id, name, breed, age, weight, photo_url, temperament')
        .in('id', petIds);

      // Create lookup maps
      const walkersMap = new Map(walkersData?.map(w => [w.id, w]) || []);
      const ownersMap = new Map(ownersData?.map(o => [o.id, o]) || []);
      const petsMap = new Map(petsData?.map(p => [p.id, p]) || []);

      // Map bookings with joined data
      const enrichedBookings: Booking[] = bookingsData.map((booking) => {
        const walker = walkersMap.get(booking.sitter_id);
        const owner = ownersMap.get(booking.owner_id);
        const pet = petsMap.get(booking.pet_id);

        // Determine size based on weight
        let size = 'Moyen';
        if (pet?.weight) {
          if (pet.weight < 10) size = 'Petit';
          else if (pet.weight > 25) size = 'Grand';
        }

        // Calculate walker amount (85% of total)
        const walkerAmount = booking.total_price * 0.85;
        const commissionRate = 0.15;
        const commissionAmount = booking.total_price * commissionRate;

        return {
          ...booking,
          status: booking.status as BookingStatus,
          // Compatibility fields
          booking_date: booking.start_date,
          start_time: new Date(booking.start_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          duration_minutes: booking.duration * 60,
          pickup_address: booking.notes || 'Adresse non spécifiée',
          special_instructions: booking.notes,
          walker_amount: walkerAmount,
          commission_rate: commissionRate,
          commission_amount: commissionAmount,
          // Joined data
          walker: walker ? {
            id: walker.id,
            first_name: walker.first_name,
            last_name: walker.last_name,
            avatar_url: walker.avatar_url || undefined,
            rating: walker.average_rating || 4.0,
            hourly_rate: walker.hourly_rate || 30,
            phone: walker.phone || undefined,
          } : {
            id: booking.sitter_id,
            first_name: 'Promeneur',
            last_name: '',
            rating: 4.0,
            hourly_rate: 30,
          },
          dog: pet ? {
            id: pet.id,
            name: pet.name,
            breed: pet.breed || 'Race inconnue',
            size,
            age: pet.age || undefined,
            photo_url: pet.photo_url || undefined,
          } : {
            id: booking.pet_id,
            name: 'Chien',
            breed: 'Race inconnue',
            size: 'Moyen',
          },
          owner: owner ? {
            id: owner.id,
            first_name: owner.first_name,
            last_name: owner.last_name,
            phone: owner.phone || undefined,
          } : undefined,
        };
      });

      setBookings(enrichedBookings);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
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
    additional_services?: string[];
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Get walker's hourly rate
      const { data: sitterData } = await supabase
        .from('users')
        .select('hourly_rate')
        .eq('id', bookingData.walkerId)
        .single();

      const hourlyRate = sitterData?.hourly_rate || 30;
      const totalPrice = hourlyRate * bookingData.duration;

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
          additional_services: bookingData.additional_services || [],
        })
        .select()
        .single();

      if (error) throw error;

      // Create notification for walker
      await supabase.from('notifications').insert({
        user_id: bookingData.walkerId,
        type: 'booking',
        title: 'Nouvelle réservation',
        description: `Vous avez reçu une nouvelle demande de réservation pour le ${new Date(bookingData.start_date).toLocaleDateString('fr-FR')}`,
        link: `/bookings/${data.id}`,
      });

      await fetchBookings();
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

  const updateBookingStatus = async (
    id: string, 
    status: BookingStatus, 
    notes?: string
  ) => {
    try {
      const { data: booking } = await supabase
        .from('bookings')
        .select('owner_id, sitter_id, start_date')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('bookings')
        .update({ 
          status,
          notes: notes || undefined,
        })
        .eq('id', id);

      if (error) throw error;

      // Send notification based on status
      if (booking) {
        const { data: { user } } = await supabase.auth.getUser();
        const recipientId = user?.id === booking.owner_id ? booking.sitter_id : booking.owner_id;
        
        const statusMessages: Record<string, string> = {
          'CONFIRMED': 'Votre réservation a été confirmée',
          'IN_PROGRESS': 'La promenade a commencé',
          'COMPLETED': 'La promenade est terminée',
          'CANCELLED': 'La réservation a été annulée',
        };

        await supabase.from('notifications').insert({
          user_id: recipientId,
          type: 'booking_update',
          title: 'Mise à jour de réservation',
          description: statusMessages[status] || 'Le statut de votre réservation a été mis à jour',
          link: `/bookings/${id}`,
        });
      }

      await fetchBookings();
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

  const cancelBooking = async (id: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'CANCELLED',
          notes: reason,
        })
        .eq('id', id);

      if (error) throw error;

      await fetchBookings();
      toast({
        title: "Réservation annulée",
        description: "La réservation a été annulée avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'annuler la réservation",
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
    cancelBooking,
    refetch: fetchBookings
  };
};
