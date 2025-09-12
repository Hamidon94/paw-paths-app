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

// Mock data for walkers - in real app this would come from database
const mockWalkers = [
  {
    id: 1,
    name: "Marie Dubois",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    reviews: 127,
    distance: 0.8,
    price: 15,
    experience: "3 ans d'expérience",
    specialties: ["Grands chiens", "Dressage", "Chiens anxieux"],
    available: true,
    bio: "Passionnée par les animaux depuis toujours, j'adore passer du temps avec vos compagnons !"
  },
  {
    id: 2,
    name: "Thomas Martin",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    reviews: 203,
    distance: 1.2,
    price: 18,
    experience: "5 ans d'expérience",
    specialties: ["Petits chiens", "Chiens âgés", "Promenades longues"],
    available: true,
    bio: "Ancien vétérinaire, je connais parfaitement les besoins de chaque animal."
  },
  {
    id: 3,
    name: "Sophie Leroy",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 4.7,
    reviews: 89,
    distance: 2.1,
    price: 16,
    experience: "2 ans d'expérience",
    specialties: ["Chiots", "Socialisation", "Jeux"],
    available: false,
    bio: "Jeune diplômée en comportement animal, j'accompagne vos chiens avec bienveillance."
  }
];

const FindWalkers = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [walkers, setWalkers] = useState(mockWalkers);
  const [filteredWalkers, setFilteredWalkers] = useState(mockWalkers);
  const navigate = useNavigate();

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

  const handleSearch = () => {
    if (!searchLocation.trim()) {
      setFilteredWalkers(walkers);
      return;
    }

    // In a real app, this would be a proper location search
    const filtered = walkers.filter(walker => 
      walker.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
      walker.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchLocation.toLowerCase())
      )
    );
    
    setFilteredWalkers(filtered);
  };

  const handleBookWalker = (walkerId: number) => {
    navigate(`/book/${walkerId}`);
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
                        <AvatarImage src={walker.photo} alt={walker.name} />
                        <AvatarFallback>{walker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold">{walker.name}</h3>
                            <p className="text-sm text-muted-foreground">{walker.experience}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center mb-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                              <span className="font-medium">{walker.rating}</span>
                              <span className="text-sm text-muted-foreground ml-1">
                                ({walker.reviews})
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1" />
                              {walker.distance} km
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">{walker.bio}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {walker.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Euro className="h-4 w-4 mr-1" />
                              <span className="font-medium">{walker.price}€</span>
                              <span className="text-sm text-muted-foreground ml-1">/30min</span>
                            </div>
                            {walker.available ? (
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
                              disabled={!walker.available}
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