import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useBookings } from "@/hooks/useBookings";
import { ArrowLeft, Calendar, Clock, MapPin, Dog, User, Search } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const MyBookings = () => {
  const navigate = useNavigate();
  const { bookings, loading } = useBookings();
  const [searchTerm, setSearchTerm] = useState('');

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

  const filterBookings = (status?: string[]) => {
    let filtered = bookings;
    
    if (status && status.length > 0) {
      filtered = filtered.filter(booking => status.includes(booking.status));
    }
    
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.dog?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.walker?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.walker?.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.pickup_address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const upcomingBookings = filterBookings(['pending', 'confirmed']);
  const activeBookings = filterBookings(['in_progress']);
  const pastBookings = filterBookings(['completed', 'cancelled']);

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

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/bookings/${booking.id}`)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Dog className="h-5 w-5 mr-2 text-primary" />
            {booking.dog?.name}
          </CardTitle>
          <Badge variant={getStatusColor(booking.status)}>
            {getStatusLabel(booking.status)}
          </Badge>
        </div>
        <CardDescription className="flex items-center">
          <User className="h-4 w-4 mr-1" />
          avec {booking.walker?.first_name} {booking.walker?.last_name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          {format(new Date(booking.booking_date), 'EEEE d MMMM yyyy', { locale: fr })}
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          {booking.start_time} • {booking.duration_minutes} minutes
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2" />
          {booking.pickup_address}
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-muted-foreground">Prix:</span>
          <span className="font-medium text-primary">{booking.total_price.toFixed(2)}€</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold text-primary">Mes réservations</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher par chien, promeneur ou adresse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">
              À venir ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              En cours ({activeBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Terminées ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Aucune réservation à venir</h3>
                  <p className="text-muted-foreground mb-4">
                    Trouvez un promeneur pour votre prochain balade
                  </p>
                  <Button onClick={() => navigate('/walkers')}>
                    Trouver un promeneur
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            {activeBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Aucune balade en cours</h3>
                  <p className="text-muted-foreground">
                    Les balades en cours apparaîtront ici
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Aucune réservation passée</h3>
                  <p className="text-muted-foreground">
                    Votre historique de balades apparaîtra ici
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MyBookings;