import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';
import { ArrowLeft, MapPin, Star, Clock, Euro, Search } from 'lucide-react';
import { useWalkers } from '@/hooks/useWalkers';

const FindWalkers = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [filteredWalkers, setFilteredWalkers] = useState<any[]>([]);
  const navigate = useNavigate();
  const { walkers, loading: walkersLoading } = useWalkers();

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

  useEffect(() => {
    // Initialize filtered walkers when walkers data is loaded
    if (walkers.length > 0) {
      setFilteredWalkers(walkers);
    }
  }, [walkers]);

  const handleSearch = () => {
    if (!searchLocation.trim()) {
      setFilteredWalkers(walkers);
      return;
    }

    // Filter by name, city, or bio content
    const filtered = walkers.filter(walker => 
      (walker.user?.first_name + ' ' + walker.user?.last_name).toLowerCase().includes(searchLocation.toLowerCase()) ||
      walker.city?.toLowerCase().includes(searchLocation.toLowerCase()) ||
      walker.bio?.toLowerCase().includes(searchLocation.toLowerCase())
    );
    
    setFilteredWalkers(filtered);
  };

  const handleBookWalker = (walkerId: string) => {
    navigate(`/book/${walkerId}`);
  };

  if (!user || walkersLoading) {
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
          <h1 className="text-2xl font-bold text-primary">Trouver un promeneur</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Rechercher dans votre zone</CardTitle>
            <CardDescription>
              Trouvez le promeneur parfait pour votre compagnon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="location">Localisation</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    id="location"
                    placeholder="Adresse, ville..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Walkers List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Promeneurs disponibles ({filteredWalkers.length})
            </h2>
          </div>

          {filteredWalkers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Aucun promeneur trouvé</h3>
                <p className="text-muted-foreground">
                  Essayez d'élargir votre zone de recherche
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredWalkers.map((walker) => (
                <Card key={walker.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={walker.user?.avatar_url} alt={`${walker.user?.first_name} ${walker.user?.last_name}`} />
                        <AvatarFallback>
                          {walker.user?.first_name?.[0]}{walker.user?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {walker.user?.first_name} {walker.user?.last_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {walker.experience_years} an{walker.experience_years > 1 ? 's' : ''} d'expérience
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center mb-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                              <span className="font-medium">{walker.rating.toFixed(1)}</span>
                              <span className="text-sm text-muted-foreground ml-1">
                                ({walker.total_reviews})
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1" />
                              {walker.city || 'Paris'}
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {walker.bio || 'Promeneur expérimenté passionné par les animaux'}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {walker.certifications?.map((cert, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {cert}
                            </Badge>
                          )) || (
                            <>
                              <Badge variant="secondary" className="text-xs">Promenades</Badge>
                              <Badge variant="secondary" className="text-xs">Soins</Badge>
                            </>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Euro className="h-4 w-4 mr-1" />
                              <span className="font-medium">{walker.hourly_rate}€</span>
                              <span className="text-sm text-muted-foreground ml-1">/heure</span>
                            </div>
                            {walker.is_active ? (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <Clock className="h-3 w-3 mr-1" />
                                Disponible
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                Non disponible
                              </Badge>
                            )}
                          </div>

                          <div className="space-x-2">
                            <Button variant="outline" size="sm">
                              Voir profil
                            </Button>
                            <Button 
                              size="sm" 
                              disabled={!walker.is_active}
                              onClick={() => handleBookWalker(walker.id)}
                            >
                              Réserver
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FindWalkers;