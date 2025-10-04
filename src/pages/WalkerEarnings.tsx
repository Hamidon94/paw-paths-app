import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTips } from '@/hooks/useTips';
import { useBookings } from '@/hooks/useBookings';
import { User, Session } from '@supabase/supabase-js';
import { 
  ArrowLeft,
  Euro, 
  TrendingUp, 
  Calendar,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const WalkerEarnings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { tips, totalTips } = useTips();
  const { bookings } = useBookings();

  useEffect(() => {
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalFromBookings = completedBookings.reduce((sum, b) => sum + (b.walker_amount || 0), 0);
  const totalEarnings = totalFromBookings + totalTips;

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
      <header className="border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/walker/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold text-primary">Mes revenus</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEarnings.toFixed(2)}€</div>
              <p className="text-xs text-muted-foreground">
                Tous les temps
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balades complétées</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFromBookings.toFixed(2)}€</div>
              <p className="text-xs text-muted-foreground">
                {completedBookings.length} balades
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pourboires</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTips.toFixed(2)}€</div>
              <p className="text-xs text-muted-foreground">
                {tips.length} pourboires reçus
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bookings">Historique balades</TabsTrigger>
            <TabsTrigger value="tips">Pourboires</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Historique des balades complétées</CardTitle>
                <CardDescription>
                  Liste de toutes vos balades terminées avec les gains
                </CardDescription>
              </CardHeader>
              <CardContent>
                {completedBookings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Aucune balade complétée</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {completedBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex-1">
                          <p className="font-medium">{booking.dog?.name || 'Chien'}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(booking.booking_date), 'EEEE d MMMM yyyy', { locale: fr })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.duration_minutes} minutes
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">
                            {(booking.walker_amount || 0).toFixed(2)}€
                          </p>
                          <Badge variant="default">Complétée</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pourboires reçus</CardTitle>
                <CardDescription>
                  Liste de tous les pourboires que vous avez reçus
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tips.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Aucun pourboire reçu</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tips.map((tip) => (
                      <div key={tip.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Pourboire</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(tip.created_at), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            +{Number(tip.amount).toFixed(2)}€
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default WalkerEarnings;
