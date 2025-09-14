import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Walker {
  id: string;
  user_id: string;
  bio?: string;
  experience_years: number;
  hourly_rate: number;
  service_radius: number;
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  is_verified: boolean;
  is_active: boolean;
  rating: number;
  total_reviews: number;
  total_walks: number;
  certifications?: string[];
  languages: string[];
  created_at: string;
  updated_at: string;
  // Joined data from users table
  first_name?: string;
  last_name?: string;
  email?: string;
}

export const useWalkers = () => {
  const [walkers, setWalkers] = useState<Walker[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWalkers = async (filters?: {
    city?: string;
    maxDistance?: number;
    userLat?: number;
    userLng?: number;
  }) => {
    try {
      let query = supabase
        .from('walkers')
        .select('*')
        .eq('is_active', true)
        .eq('is_verified', true);

      if (filters?.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }

      const { data, error } = await query.order('rating', { ascending: false });

      if (error) throw error;

      // For now, return mock data for walker names
      const walkersWithMockData = (data || []).map(walker => ({
        ...walker,
        first_name: 'Jean',
        last_name: 'Dupont',
        email: 'test@example.com'
      }));

      // Filter by distance if coordinates are provided
      let filteredWalkers = walkersWithMockData;
      if (filters?.maxDistance && filters?.userLat && filters?.userLng) {
        filteredWalkers = walkersWithMockData.filter(walker => {
          if (!walker.latitude || !walker.longitude) return false;
          
          const distance = calculateDistance(
            filters.userLat,
            filters.userLng,
            walker.latitude,
            walker.longitude
          );
          
          return distance <= filters.maxDistance;
        });
      }

      setWalkers(filteredWalkers);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les promeneurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    fetchWalkers();
  }, []);

  return {
    walkers,
    loading,
    fetchWalkers,
    refetch: () => fetchWalkers()
  };
};