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
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user profile to get internal ID
      const { data: profile } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!profile) {
        setDogs([]);
        return;
      }

      const { data, error} = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', profile.id)
        .order('created_at', { ascending: false });
      
      // Map pets to dogs interface
      const mappedDogs = (data || []).map(pet => ({
        id: pet.id,
        user_id: pet.owner_id,
        name: pet.name,
        breed: pet.breed || '',
        age: pet.age || 0,
        size: pet.type || '',
        weight: pet.weight,
        description: pet.bio,
        medical_notes: pet.medical_history,
        behavior_notes: pet.temperament,
        photo_url: pet.photo_url,
        is_active: true,
        created_at: pet.created_at,
        updated_at: pet.updated_at
      }));

      if (error) throw error;
      setDogs(mappedDogs);
    } catch (error: any) {
      console.error('Error fetching dogs:', error);
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
        .from('pets')
        .insert([{ 
          name: dogData.name,
          breed: dogData.breed,
          age: dogData.age,
          type: dogData.size,
          weight: dogData.weight,
          bio: dogData.description,
          medical_history: dogData.medical_notes,
          temperament: dogData.behavior_notes,
          photo_url: dogData.photo_url,
          owner_id: userData.id
        }])
        .select()
        .single();
      
      const mappedDog: Dog = {
        id: data.id,
        user_id: data.owner_id,
        name: data.name,
        breed: data.breed || '',
        age: data.age || 0,
        size: data.type || '',
        weight: data.weight,
        description: data.bio,
        medical_notes: data.medical_history,
        behavior_notes: data.temperament,
        photo_url: data.photo_url,
        is_active: true,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      if (error) throw error;

      setDogs(prev => [mappedDog, ...prev]);
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
      const petUpdates: any = {};
      if (updates.name) petUpdates.name = updates.name;
      if (updates.breed) petUpdates.breed = updates.breed;
      if (updates.age) petUpdates.age = updates.age;
      if (updates.size) petUpdates.type = updates.size;
      if (updates.weight) petUpdates.weight = updates.weight;
      if (updates.description) petUpdates.bio = updates.description;
      if (updates.medical_notes) petUpdates.medical_history = updates.medical_notes;
      if (updates.behavior_notes) petUpdates.temperament = updates.behavior_notes;
      if (updates.photo_url) petUpdates.photo_url = updates.photo_url;
      
      const { data, error } = await supabase
        .from('pets')
        .update(petUpdates)
        .eq('id', id)
        .select()
        .single();
      
      const mappedDog: Dog = {
        id: data.id,
        user_id: data.owner_id,
        name: data.name,
        breed: data.breed || '',
        age: data.age || 0,
        size: data.type || '',
        weight: data.weight,
        description: data.bio,
        medical_notes: data.medical_history,
        behavior_notes: data.temperament,
        photo_url: data.photo_url,
        is_active: true,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      if (error) throw error;

      setDogs(prev => prev.map(dog => dog.id === id ? mappedDog : dog));
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
        .from('pets')
        .delete()
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