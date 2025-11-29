import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useDogs } from "@/hooks/useDogs";
import { useBookings } from "@/hooks/useBookings";
import { User, Session } from '@supabase/supabase-js';
import { 
  Calendar, 
  Clock, 
  Dog, 
  Plus, 
  Search, 
  Settings, 
  MapPin,
  Star,
  Euro
} from 'lucide-react';

interface DashboardStats {
  totalBookings: number;
  upcomingBookings: number;
  totalDogs: number;
  totalSpent: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    upcomingBookings: 0,
    totalDogs: 0,
    totalSpent: 0
  });
  
  const navigate = useNavigate();
  const { dogs } = useDogs();
  const { bookings } = useBookings();

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
      setLoading(false);
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
    if (bookings.length > 0 || dogs.length > 0) {
      const today = new Date();
      const upcomingBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.booking_date);
        const status = booking.status.toUpperCase();
        return bookingDate >= today && status !== 'CANCELLED';
      }).length;

      const totalSpent = bookings
        .filter(booking => booking.status.toUpperCase() === 'COMPLETED')
        .reduce((sum, booking) => sum + Number(booking.total_price), 0);

      setStats({
        totalBookings: bookings.length,
        upcomingBookings,
        totalDogs: dogs.length,
        totalSpent
      });
    }
  }, [bookings, dogs]);

  const getUpcomingBookings = () => {
    const today = new Date();
    return bookings
      .filter(booking => {
        const bookingDate = new Date(booking.booking_date);
        const status = booking.status.toUpperCase();
        return bookingDate >= today && status !== 'CANCELLED';
      })
      .sort((a, b) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime())
      .slice(0, 3);
  };

  const getStatusColor = (status: string) => {
    const s = status.toUpperCase();
    switch (s) {
      case 'CONFIRMED': return 'default';
      case 'PENDING': return 'secondary';
      case 'IN_PROGRESS': return 'default';
      case 'COMPLETED': return 'outline';
      case 'CANCELLED': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    const s = status.toUpperCase();
    switch (s) {
      case 'CONFIRMED': return 'Confirmée';
      case 'PENDING': return 'En attente';
      case 'IN_PROGRESS': return 'En cours';
      case 'COMPLETED': return 'Terminée';
      case 'CANCELLED': return 'Annulée';
      default: return status;
    }
  };

  if (loading) {
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
              <p className="text-muted-foreground">
                Bienvenue, {user?.email}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => navigate('/profile')}>
                <Settings className="h-4 w-4 mr-2" />
                Profil
              </Button>
              <Button 
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate('/');
                }}
                variant="ghost"
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button 
            onClick={() => navigate('/walkers')} 
            className="h-20 flex-col space-y-2"
          >
            <Search className="h-6 w-6" />
            <span>Trouver un promeneur</span>
          </Button>
          
          <Button 
            onClick={() => navigate('/dogs/add')} 
            variant="outline" 
            className="h-20 flex-col space-y-2"
          >
            <Plus className="h-6 w-6" />
            <span>Ajouter un chien</span>
          </Button>
          
          <Button 
            onClick={() => navigate('/bookings')} 
            variant="outline" 
            className="h-20 flex-col space-y-2"
          >
            <Calendar className="h-6 w-6" />
            <span>Mes réservations</span>
          </Button>
          
          <Button 
            onClick={() => navigate('/messages')} 
            variant="outline" 
            className="h-20 flex-col space-y-2"
          >
            <Settings className="h-6 w-6" />
            <span>Messagerie</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Réservations</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prochaines Balades</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mes Chiens</CardTitle>
              <Dog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDogs}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Dépensé</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSpent.toFixed(2)}€</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Prochaines réservations</CardTitle>
              <CardDescription>
                Vos balades à venir
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getUpcomingBookings().length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune réservation à venir</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate('/walkers')}
                  >
                    Réserver une balade
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {getUpcomingBookings().map((booking) => (
                    <div 
                      key={booking.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => navigate(`/bookings/${booking.id}`)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">
                            {new Date(booking.booking_date).toLocaleDateString('fr-FR')} à {booking.start_time}
                          </p>
                          <Badge variant={getStatusColor(booking.status)}>
                            {getStatusLabel(booking.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Durée: {booking.duration_minutes} minutes - {booking.total_price}€
                        </p>
                        {booking.pickup_address && (
                          <div className="flex items-center mt-1">
                            <MapPin className="h-3 w-3 text-muted-foreground mr-1" />
                            <p className="text-xs text-muted-foreground truncate">
                              {booking.pickup_address}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/bookings')}
                  >
                    Voir toutes les réservations
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Dogs */}
          <Card>
            <CardHeader>
              <CardTitle>Mes chiens</CardTitle>
              <CardDescription>
                Gérez vos compagnons à quatre pattes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dogs.length === 0 ? (
                <div className="text-center py-8">
                  <Dog className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucun chien enregistré</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate('/dogs/add')}
                  >
                    Ajouter un chien
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {dogs.slice(0, 3).map((dog) => (
                    <div key={dog.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={dog.photo_url} alt={`Photo de ${dog.name}`} />
                        <AvatarFallback>
                          <Dog className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{dog.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {dog.breed} • {dog.size} • {dog.age} ans
                        </p>
                        {dog.medical_notes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Notes médicales disponibles
                          </p>
                        )}
                      </div>
                      <Badge variant={dog.is_active ? "default" : "secondary"}>
                        {dog.is_active ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                  ))}
                  
                  {dogs.length > 3 && (
                    <p className="text-center text-sm text-muted-foreground">
                      Et {dogs.length - 3} autre(s) chien(s)...
                    </p>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/dogs/add')}
                  >
                    Ajouter un autre chien
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;