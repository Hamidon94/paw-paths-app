import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Search, MapPin, Star, Clock, Euro, User } from 'lucide-react';
import { AdvancedFilters } from '@/components/AdvancedFilters';

interface Walker {
  user_id: string;
  hourly_rate: number;
  bio?: string;
  location?: string;
  experience_years: number;
  is_verified: boolean;
  average_rating: number;
  first_name: string;
  last_name: string;
  avatar_url?: string;
}

const FindWalkers = () => {
  const [walkers, setWalkers] = useState<Walker[]>([]);
  const [filteredWalkers, setFilteredWalkers] = useState<Walker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [priceRange, setPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWalkers();
  }, [sortBy, priceRange]);

  const fetchWalkers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'sitter')
        .eq('is_active', true);

      if (error) {
        console.error('Fetch walkers error:', error);
        throw error;
      }

      // Transform the data
      let transformedWalkers = (data || []).map(user => ({
        user_id: user.id,
        hourly_rate: user.hourly_rate || 30,
        bio: user.bio,
        location: user.location,
        experience_years: 2,
        is_verified: user.is_verified,
        average_rating: user.average_rating || 4.0,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar_url: user.avatar_url,
      }));

      // Apply price filter
      if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        transformedWalkers = transformedWalkers.filter(walker => 
          walker.hourly_rate >= min && walker.hourly_rate <= max
        );
      }

      // Apply sorting
      if (sortBy === 'rating') {
        transformedWalkers.sort((a, b) => b.average_rating - a.average_rating);
      } else if (sortBy === 'price_low') {
        transformedWalkers.sort((a, b) => a.hourly_rate - b.hourly_rate);
      } else if (sortBy === 'price_high') {
        transformedWalkers.sort((a, b) => b.hourly_rate - a.hourly_rate);
      }

      setWalkers(transformedWalkers);
      setFilteredWalkers(transformedWalkers);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer la liste des promeneurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters: any) => {
    let filtered = walkers;

    if (filters.priceRange) {
      filtered = filtered.filter(w => 
        w.hourly_rate >= filters.priceRange[0] && 
        w.hourly_rate <= filters.priceRange[1]
      );
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter(w => w.average_rating >= filters.minRating);
    }

    if (filters.experience > 0) {
      filtered = filtered.filter(w => w.experience_years >= filters.experience);
    }

    setFilteredWalkers(filtered);
  };

  const searchFilteredWalkers = filteredWalkers.filter(walker => {
    if (!searchTerm) return true;
    
    const fullName = `${walker.first_name || ''} ${walker.last_name || ''}`.toLowerCase();
    const location = walker.location?.toLowerCase() || '';
    const bio = walker.bio?.toLowerCase() || '';
    
    return fullName.includes(searchTerm.toLowerCase()) ||
           location.includes(searchTerm.toLowerCase()) ||
           bio.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement des promeneurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <h1 className="text-2xl font-bold text-primary">Trouver un promeneur</h1>
            </div>
            <Button onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? 'Masquer les filtres' : 'Filtres avancés'}
            </Button>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, ville ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Meilleure note</SelectItem>
                <SelectItem value="price_low">Prix croissant</SelectItem>
                <SelectItem value="price_high">Prix décroissant</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Prix par heure" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les prix</SelectItem>
                <SelectItem value="0-25">0€ - 25€</SelectItem>
                <SelectItem value="25-40">25€ - 40€</SelectItem>
                <SelectItem value="40-60">40€ - 60€</SelectItem>
                <SelectItem value="60-100">60€+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          {showFilters && (
            <div className="md:col-span-1">
              <AdvancedFilters onFiltersChange={handleFiltersChange} />
            </div>
          )}
          
          <div className={showFilters ? 'md:col-span-3' : 'md:col-span-4'}>
        {searchFilteredWalkers.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun promeneur trouvé</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 
                "Essayez de modifier vos critères de recherche." :
                "Il n'y a pas encore de promeneurs disponibles dans votre région."
              }
            </p>
            <Button variant="outline" onClick={() => setSearchTerm('')}>
              Effacer les filtres
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchFilteredWalkers.map((walker) => (
              <Card key={walker.user_id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage 
                        src={walker.avatar_url} 
                        alt="Photo du promeneur" 
                      />
                      <AvatarFallback>
                        {walker.first_name?.[0] || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {walker.first_name || ''} {walker.last_name || ''}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium">{walker.average_rating.toFixed(1)}</span>
                        </div>
                        {walker.is_verified && (
                          <Badge variant="secondary" className="text-xs">
                            Vérifié
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Euro className="h-4 w-4 mr-1" />
                      <span>{walker.hourly_rate}€/h</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{walker.experience_years} ans d'exp.</span>
                    </div>
                  </div>

                  {walker.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{walker.location}</span>
                    </div>
                  )}

                  {walker.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {walker.bio}
                    </p>
                  )}

                  <Button 
                    className="w-full" 
                    onClick={() => navigate(`/book/${walker.user_id}`)}
                  >
                    Réserver une balade
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FindWalkers;
