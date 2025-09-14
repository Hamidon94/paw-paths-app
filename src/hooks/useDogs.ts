import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Dog {
  id: string;
  user_id: string;
  name: string;
  breed: string;
  age: number;
  size: string;
  weight?: number;
  description?: string;
  medical_notes?: string;
  behavior_notes?: string;
  photo_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useDogs = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDogs = async () => {
    try {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDogs(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer vos chiens",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  const addDog = async (dogData: Omit<Dog, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      // Get current user ID from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (userError) throw userError;

      const { data, error } = await supabase
        .from('dogs')
        .insert([{ ...dogData, user_id: userData.id }])
        .select()
        .single();

      if (error) throw error;

      setDogs(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Votre chien a été ajouté avec succès",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter le chien",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateDog = async (id: string, updates: Partial<Dog>) => {
    try {
      const { data, error } = await supabase
        .from('dogs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setDogs(prev => prev.map(dog => dog.id === id ? data : dog));
      toast({
        title: "Succès",
        description: "Les informations du chien ont été mises à jour",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le chien",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteDog = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dogs')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      setDogs(prev => prev.filter(dog => dog.id !== id));
      toast({
        title: "Succès",
        description: "Le chien a été supprimé",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le chien",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    dogs,
    loading,
    addDog,
    updateDog,
    deleteDog,
    refetch: fetchDogs
  };
};