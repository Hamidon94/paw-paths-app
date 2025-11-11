import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Walker {
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
  languages?: string[];
  created_at: string;
  updated_at: string;
  // User info from joined table
  user?: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
  };
}

export const useWalkers = () => {
  const [walkers, setWalkers] = useState<Walker[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWalkers = async () => {
    try {
      const { data, error } = await supabase
        .from('walkers')
        .select(`
          *,
          users!inner(
            first_name,
            last_name,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;

      const walkersWithUserData = (data || []).map((walker: any) => ({
        ...walker,
        user: walker.users
      }));

      setWalkers(walkersWithUserData);
    } catch (error: any) {
      console.error('Error fetching walkers:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les promeneurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalkers();
  }, []);

  const createWalkerProfile = async (walkerData: {
    bio?: string;
    experience_years: number;
    hourly_rate: number;
    service_radius: number;
    address?: string;
    city?: string;
    certifications?: string[];
    languages?: string[];
  }) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('users')
        .update({
          ...walkerData,
          role: 'sitter',
          hourly_rate: walkerData.hourly_rate
        })
        .eq('id', user.id)

      if (error) throw error;

      await fetchWalkers(); // Refresh the list
      toast({
        title: "Succès",
        description: "Votre profil de promeneur a été créé avec succès",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le profil de promeneur",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateWalkerProfile = async (userId: string, updates: Partial<Walker>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)

      if (error) throw error;

      await fetchWalkers(); // Refresh the list
      toast({
        title: "Succès",
        description: "Votre profil de promeneur a été mis à jour",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
      throw error;
    }
  };

  const searchWalkers = async (filters: {
    latitude?: number;
    longitude?: number;
    radius?: number;
    minRating?: number;
    maxRate?: number;
  }) => {
    try {
      let query = supabase
        .from('walkers')
        .select(`
          *,
          users!inner(
            first_name,
            last_name,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('is_active', true);

      if (filters.minRating) {
        query = query.gte('rating', filters.minRating);
      }

      if (filters.maxRate) {
        query = query.lte('hourly_rate', filters.maxRate);
      }

      const { data, error } = await query.order('rating', { ascending: false });

      if (error) throw error;

      const walkersWithUserData = (data || []).map((walker: any) => ({
        ...walker,
        user: walker.users
      }));

      return walkersWithUserData;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la recherche",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    walkers,
    loading,
    createWalkerProfile,
    updateWalkerProfile,
    searchWalkers,
    refetch: fetchWalkers
  };
};