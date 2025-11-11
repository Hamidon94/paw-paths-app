import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBookings } from "@/hooks/useBookings";
import { useTips } from "@/hooks/useTips";
import { User, Session } from '@supabase/supabase-js';
import { 
  Calendar, 
  Clock, 
  Dog, 
  Euro, 
  MapPin, 
  Star, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  XCircle,
  LogOut,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const WalkerDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [walker, setWalker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { bookings, updateBookingStatus } = useBookings();
  const { totalTips } = useTips();
  const navigate = useNavigate();

  // Calculate real stats from bookings
  const completedBookings = bookings.filter(b => b.status === 'completed' && b.sitter_id === walker?.user_id);
  const stats = {
    totalWalks: completedBookings.length,
    totalEarnings: completedBookings.reduce((sum, b) => sum + (b.walker_amount || 0), 0) + totalTips,
    totalTips: totalTips,
    rating: walker?.rating || 0,
    reviews: walker?.total_reviews || 0
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/auth');
        return;
      }
      setSession(session);
      setUser(session.user);
      await fetchWalkerProfile(session.user.id);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchWalkerProfile = async (authUserId: string) => {
    try {
      // Get user ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', authUserId)
        .single();

      if (userError) throw userError;

      // Get walker profile
      const { data: walkerData, error: walkerError } = await supabase
        .from('walkers')
        .select('*')
        .eq('user_id', userData.id)
        .single();

      if (walkerError) {
        if (walkerError.code === 'PGRST116') {
          // No walker profile found, redirect to registration
          navigate('/walker/register');
          return;
        }
        throw walkerError;
      }

      setWalker(walkerData);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer votre profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur de déconnexion",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBookingAction = async (bookingId: string, action: 'accept' | 'reject', notes?: string) => {
    const status = action === 'accept' ? 'confirmed' : 'cancelled';
    await updateBookingStatus(bookingId, status, notes);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': return 'default';
      case 'in_progress': return 'default';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  // Filter bookings for this walker
  const walkerBookings = bookings.filter(booking => booking.sitter_id === walker?.user_id);
  const pendingBookings = walkerBookings.filter(b => b.status === 'pending');
  const upcomingBookings = walkerBookings.filter(b => b.status === 'confirmed');
  const pastBookings = walkerBookings.filter(b => ['completed', 'cancelled'].includes(b.status));

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
      <header className="border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">DogWalking Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Bonjour, {user?.user_metadata?.first_name || 'promeneur'}
              </span>
              <Button variant="ghost" size="sm" onClick={() => navigate('/walker/earnings')}>
                <Euro className="h-4 w-4 mr-2" />
                Mes revenus
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                <Settings className="h-4 w-4 mr-2" />
                Profil
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome & Stats */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Tableau de bord promeneur</h2>
          <p className="text-muted-foreground mb-6">
            Gérez vos réservations et suivez votre activité
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Balades totales</CardTitle>
                <Dog className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalWalks}</div>
                <p className="text-xs text-muted-foreground">
                  +2 cette semaine
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
                <Euro className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEarnings.toFixed(2)}€</div>
                <p className="text-xs text-muted-foreground">
                  dont {stats.totalTips.toFixed(2)}€ de pourboires
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.rating}/5</div>
                <p className="text-xs text-muted-foreground">
                  {stats.reviews} avis
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Demandes en attente</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingBookings.length}</div>
                <p className="text-xs text-muted-foreground">
                  Nécessite votre réponse
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bookings Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Demandes ({pendingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              À venir ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Terminées ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {pendingBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Aucune demande en attente</h3>
                  <p className="text-muted-foreground">
                    Les nouvelles demandes de réservation apparaîtront ici
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <Dog className="h-5 w-5 text-primary" />
                            <h3 className="font-medium">{booking.dog?.name}</h3>
                            <Badge variant={getStatusColor(booking.status)}>
                              {getStatusLabel(booking.status)}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {format(new Date(booking.booking_date), 'EEEE d MMMM yyyy', { locale: fr })}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              {booking.start_time} • {booking.duration_minutes} minutes
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {booking.pickup_address}
                            </div>
                            <div className="flex items-center">
                              <Euro className="h-4 w-4 mr-2" />
                              {booking.walker_amount.toFixed(2)}€ (votre part)
                            </div>
                          </div>

                          {booking.special_instructions && (
                            <div className="mt-3 p-3 bg-muted rounded-lg">
                              <p className="text-sm">{booking.special_instructions}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <Button 
                            size="sm"
                            onClick={() => handleBookingAction(booking.id, 'accept')}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accepter
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleBookingAction(booking.id, 'reject', 'Non disponible')}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Refuser
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Aucune balade prévue</h3>
                  <p className="text-muted-foreground">
                    Vos prochaines balades confirmées apparaîtront ici
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <Dog className="h-5 w-5 text-primary" />
                            <h3 className="font-medium">{booking.dog?.name}</h3>
                            <Badge variant={getStatusColor(booking.status)}>
                              {getStatusLabel(booking.status)}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {format(new Date(booking.booking_date), 'EEEE d MMMM yyyy', { locale: fr })}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              {booking.start_time} • {booking.duration_minutes} minutes
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {booking.pickup_address}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-medium text-primary">
                            {booking.walker_amount.toFixed(2)}€
                          </p>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/bookings/${booking.id}`)}
                          >
                            Détails
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Aucune balade terminée</h3>
                  <p className="text-muted-foreground">
                    Votre historique de balades apparaîtra ici
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <Card key={booking.id} className="opacity-75">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <Dog className="h-5 w-5 text-primary" />
                            <h3 className="font-medium">{booking.dog?.name}</h3>
                            <Badge variant={getStatusColor(booking.status)}>
                              {getStatusLabel(booking.status)}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {format(new Date(booking.booking_date), 'EEEE d MMMM yyyy', { locale: fr })}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              {booking.start_time} • {booking.duration_minutes} minutes
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-medium">
                            {booking.walker_amount.toFixed(2)}€
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Terminée
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default WalkerDashboard;