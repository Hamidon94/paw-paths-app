import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useDogs } from "@/hooks/useDogs";
import { useBookings } from "@/hooks/useBookings";
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, Dog, Euro } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Walker {
  id: string;
  hourly_rate: number;
  first_name: string;
  last_name: string;
  rating: number;
  bio?: string;
}

const BookWalk = () => {
  const { walkerId } = useParams<{ walkerId: string }>();
  const navigate = useNavigate();
  const { dogs } = useDogs();
  const { createBooking } = useBookings();

  const [walker, setWalker] = useState<Walker | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [selectedDog, setSelectedDog] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    if (walkerId) {
      fetchWalkerDetails();
    }
  }, [walkerId]);

  const fetchWalkerDetails = async () => {
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
        .eq('id', walkerId)
        .single();

      if (error) throw error;

      setWalker({
        id: data.id,
        hourly_rate: data.hourly_rate,
        first_name: data.users.first_name,
        last_name: data.users.last_name,
        rating: data.rating,
        bio: data.bio,
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les informations du promeneur",
        variant: "destructive",
      });
      navigate('/walkers');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!walker) return 0;
    return (walker.hourly_rate / 60) * duration;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !selectedDog || !pickupAddress.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      await createBooking({
        walker_id: walkerId!,
        dog_id: selectedDog,
        booking_date: format(selectedDate, 'yyyy-MM-dd'),
        start_time: selectedTime,
        duration_minutes: duration,
        pickup_address: pickupAddress,
        special_instructions: specialInstructions || undefined,
      });

      navigate('/dashboard');
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setSubmitting(false);
    }
  };

  // Generate time slots (8:00 - 20:00)
  const timeSlots = [];
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(timeString);
    }
  }

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

  if (!walker) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Promeneur introuvable</h2>
          <Button onClick={() => navigate('/walkers')}>
            Retour à la recherche
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/walkers')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold text-primary">Réserver une balade</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Détails de la réservation</CardTitle>
                <CardDescription>
                  Remplissez les informations pour réserver une balade avec {walker.first_name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Dog Selection */}
                  <div>
                    <Label htmlFor="dog">Chien à promener *</Label>
                    <Select value={selectedDog} onValueChange={setSelectedDog}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre chien" />
                      </SelectTrigger>
                      <SelectContent>
                        {dogs.map((dog) => (
                          <SelectItem key={dog.id} value={dog.id}>
                            {dog.name} ({dog.breed}, {dog.size})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <Label>Date de la balade *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal mt-2"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })
                          ) : (
                            "Sélectionnez une date"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date()}
                          locale={fr}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time and Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="time">Heure de début *</Label>
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Heure" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="duration">Durée (minutes)</Label>
                      <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 heure</SelectItem>
                          <SelectItem value="90">1h30</SelectItem>
                          <SelectItem value="120">2 heures</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Pickup Address */}
                  <div>
                    <Label htmlFor="address">Adresse de récupération *</Label>
                    <Input
                      id="address"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder="Adresse complète où récupérer le chien"
                      required
                    />
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <Label htmlFor="instructions">Instructions spéciales</Label>
                    <Textarea
                      id="instructions"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Informations importantes sur votre chien, habitudes, préférences..."
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Réservation en cours..." : `Réserver pour ${calculatePrice().toFixed(2)}€`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Walker Info & Summary */}
          <div className="space-y-6">
            {/* Walker Info */}
            <Card>
              <CardHeader>
                <CardTitle>Votre promeneur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">
                    {walker.first_name} {walker.last_name}
                  </h3>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-sm">{walker.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                {walker.bio && (
                  <p className="text-sm text-muted-foreground">{walker.bio}</p>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tarif horaire:</span>
                  <span className="font-medium">{walker.hourly_rate}€/h</span>
                </div>
              </CardContent>
            </Card>

            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Durée:</span>
                  <span>{duration} minutes</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tarif:</span>
                  <span>{walker.hourly_rate}€/h</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between font-medium">
                    <span>Total:</span>
                    <span className="text-primary">{calculatePrice().toFixed(2)}€</span>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Le paiement sera traité après confirmation de la réservation par le promeneur.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookWalk;