import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, MapPin, Clock, Dog, User, Euro, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { GPSTracker } from '@/components/GPSTracker';
import { MediaUploader } from '@/components/MediaUploader';
import { TipDialog } from '@/components/TipDialog';
import { WalkReportForm } from '@/components/WalkReportForm';
import { useBookingMedia } from '@/hooks/useBookingMedia';

interface BookingDetail {
  id: string;
  start_date: string;
  end_date: string;
  duration: number;
  total_price: number;
  base_price: number;
  status: string;
  notes?: string;
  created_at: string;
  sitter_id?: string;
  walker: {
    first_name: string;
    last_name: string;
    rating: number;
    bio?: string;
    phone_number?: string;
  };
  dog: {
    name: string;
    breed: string;
    size: string;
    age: number;
  };
}

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [isWalker, setIsWalker] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { media } = useBookingMedia(id || '');

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);
      
      // Check if user is a sitter
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      setIsWalker(userData?.role === 'sitter');
    };

    checkUserRole();

    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setBooking({
        ...data,
        walker: {
          first_name: 'Jean',
          last_name: 'Dupont',
          rating: 4.5,
          bio: 'Promeneur expérimenté',
          phone_number: '0123456789',
        },
        dog: {
          name: 'Rex',
          breed: 'Labrador',
          size: 'Grand',
          age: 3,
        }
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les détails de la réservation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  const submitReview = async () => {
    if (!booking) return;

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('reviews')
        .insert([{
          booking_id: booking.id,
          author_id: user.id,
          sitter_id: booking.sitter_id || '',
          rating,
          comment: review,
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre avis a été publié",
      });

      setReview('');
      setRating(5);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de publier l'avis",
        variant: "destructive",
      });
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

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Réservation introuvable</h2>
          <Button onClick={() => navigate('/dashboard')}>
            Retour au tableau de bord
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
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold text-primary">Détails de la réservation</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    Informations de la balade
                  </CardTitle>
                  <Badge variant={getStatusColor(booking.status)}>
                    {getStatusLabel(booking.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {format(new Date(booking.start_date), 'EEEE d MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Durée</p>
                    <p className="font-medium">{booking.duration} heures</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prix total</p>
                    <p className="font-medium text-primary">{booking.total_price.toFixed(2)}€</p>
                  </div>
                </div>
                
                <Separator />

                {booking.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Notes</p>
                    <p className="text-sm bg-muted p-3 rounded-lg">{booking.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* GPS Tracking */}
            {(booking.status === 'in_progress' || booking.status === 'completed') && (
              <GPSTracker bookingId={booking.id} isWalker={isWalker} />
            )}

            {/* Media Gallery */}
            {media.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Photos et vidéos de la balade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {media.map((item) => (
                      <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden">
                        {item.media_type === 'photo' ? (
                          <img 
                            src={item.media_url} 
                            alt={item.caption || 'Photo de balade'} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video 
                            src={item.media_url} 
                            controls 
                            className="w-full h-full object-cover"
                          />
                        )}
                        {item.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs">
                            {item.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Media Uploader for Walker */}
            {isWalker && booking.status === 'in_progress' && (
              <MediaUploader bookingId={booking.id} />
            )}

            {/* Review Section */}
            {booking.status === 'completed' && !isWalker && (
              <Card>
                <CardHeader>
                  <CardTitle>Laisser un avis</CardTitle>
                  <CardDescription>
                    Partagez votre expérience avec ce promeneur
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="rating">Note</Label>
                    <div className="flex space-x-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`text-2xl ${
                            star <= rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="review">Votre avis</Label>
                    <Textarea
                      id="review"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Partagez votre expérience..."
                      className="mt-2"
                    />
                  </div>

                  <Button onClick={submitReview} disabled={!review.trim()}>
                    Publier l'avis
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Tip Dialog for completed bookings */}
            {booking.status === 'completed' && !isWalker && (
              <TipDialog 
                bookingId={booking.id} 
                walkerId={booking.sitter_id || ''}
                walkerName={`${booking.walker.first_name} ${booking.walker.last_name}`} 
              />
            )}

            {/* Walk Report Form for walkers */}
            {booking.status === 'completed' && isWalker && (
              <WalkReportForm 
                bookingId={booking.id} 
                walkerId={booking.sitter_id || ''} 
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Walker Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Promeneur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">
                    {booking.walker.first_name} {booking.walker.last_name}
                  </h3>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-sm">{booking.walker.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                {booking.walker.bio && (
                  <p className="text-sm text-muted-foreground">{booking.walker.bio}</p>
                )}

                {booking.walker.phone_number && (
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-medium">{booking.walker.phone_number}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dog Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Dog className="h-5 w-5 mr-2 text-primary" />
                  Chien
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <h3 className="font-medium">{booking.dog.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {booking.dog.breed} • {booking.dog.size} • {booking.dog.age} ans
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingDetails;