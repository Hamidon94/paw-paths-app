import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';
import { ArrowLeft, Upload } from 'lucide-react';

const dogBreeds = [
  "Labrador", "Golden Retriever", "Berger Allemand", "Bulldog Français", "Beagle",
  "Rottweiler", "Yorkshire Terrier", "Boxer", "Husky Sibérien", "Border Collie",
  "Caniche", "Chihuahua", "Dalmatien", "Jack Russell", "Cocker Spaniel",
  "Autre"
];

const dogSizes = [
  { value: "Petit", label: "Petit (moins de 10kg)" },
  { value: "Moyen", label: "Moyen (10-25kg)" },
  { value: "Grand", label: "Grand (25-45kg)" }
];

const AddDog = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [dogData, setDogData] = useState({
    name: '',
    breed: '',
    age: '',
    size: '',
    weight: '',
    description: '',
    medical_info: '',
    is_friendly_with_dogs: false,
    is_friendly_with_children: false,
    is_trained: false,
    needs_special_care: false,
    photo_url: ''
  });

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/auth');
        return;
      }
      setSession(session);
      setUser(session.user);
    };

    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      // Get user profile to get the internal user ID
      const { data: profile } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!profile) {
        toast({
          title: "Erreur",
          description: "Profil utilisateur introuvable",
          variant: "destructive",
        });
        return;
      }

      // Insert dog data
      const { error } = await supabase
        .from('dogs')
        .insert({
          user_id: profile.id,
          name: dogData.name,
          breed: dogData.breed,
          age: parseInt(dogData.age),
          size: dogData.size,
          weight: dogData.weight ? parseFloat(dogData.weight) : null,
          description: dogData.description,
          medical_notes: dogData.medical_info,
          behavior_notes: `Amical avec chiens: ${dogData.is_friendly_with_dogs}, Amical avec enfants: ${dogData.is_friendly_with_children}, Bien éduqué: ${dogData.is_trained}, Soins spéciaux: ${dogData.needs_special_care}`,
          photo_url: dogData.photo_url
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Chien ajouté",
        description: `${dogData.name} a été ajouté à votre profil`,
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-primary">Ajouter un chien</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Informations de votre chien</CardTitle>
            <CardDescription>
              Renseignez les détails de votre compagnon pour que les promeneurs puissent mieux s'en occuper
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom *</Label>
                  <Input
                    id="name"
                    value={dogData.name}
                    onChange={(e) => setDogData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Âge (années) *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="25"
                    value={dogData.age}
                    onChange={(e) => setDogData(prev => ({ ...prev, age: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="breed">Race *</Label>
                  <Select onValueChange={(value) => setDogData(prev => ({ ...prev, breed: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une race" />
                    </SelectTrigger>
                    <SelectContent>
                      {dogBreeds.map(breed => (
                        <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Taille *</Label>
                  <Select onValueChange={(value) => setDogData(prev => ({ ...prev, size: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez la taille" />
                    </SelectTrigger>
                    <SelectContent>
                      {dogSizes.map(size => (
                        <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Poids (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  value={dogData.weight}
                  onChange={(e) => setDogData(prev => ({ ...prev, weight: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez le caractère, les habitudes de votre chien..."
                  value={dogData.description}
                  onChange={(e) => setDogData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medical_info">Informations médicales</Label>
                <Textarea
                  id="medical_info"
                  placeholder="Allergies, traitements, problèmes de santé..."
                  value={dogData.medical_info}
                  onChange={(e) => setDogData(prev => ({ ...prev, medical_info: e.target.value }))}
                />
              </div>

              {/* Behavioral traits */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Comportement</Label>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="friendly_dogs"
                    checked={dogData.is_friendly_with_dogs}
                    onCheckedChange={(checked) => 
                      setDogData(prev => ({ ...prev, is_friendly_with_dogs: checked as boolean }))
                    }
                  />
                  <Label htmlFor="friendly_dogs">S'entend bien avec les autres chiens</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="friendly_children"
                    checked={dogData.is_friendly_with_children}
                    onCheckedChange={(checked) => 
                      setDogData(prev => ({ ...prev, is_friendly_with_children: checked as boolean }))
                    }
                  />
                  <Label htmlFor="friendly_children">S'entend bien avec les enfants</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trained"
                    checked={dogData.is_trained}
                    onCheckedChange={(checked) => 
                      setDogData(prev => ({ ...prev, is_trained: checked as boolean }))
                    }
                  />
                  <Label htmlFor="trained">Bien éduqué (rappel, laisse)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="special_care"
                    checked={dogData.needs_special_care}
                    onCheckedChange={(checked) => 
                      setDogData(prev => ({ ...prev, needs_special_care: checked as boolean }))
                    }
                  />
                  <Label htmlFor="special_care">Nécessite des soins spéciaux</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo_url">Photo (URL)</Label>
                <Input
                  id="photo_url"
                  type="url"
                  placeholder="https://exemple.com/photo-chien.jpg"
                  value={dogData.photo_url}
                  onChange={(e) => setDogData(prev => ({ ...prev, photo_url: e.target.value }))}
                />
              </div>

              <div className="flex space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                  Annuler
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Ajout en cours..." : "Ajouter mon chien"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddDog;