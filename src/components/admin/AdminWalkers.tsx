import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Eye, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Walker {
  id: string;
  user_id: string;
  hourly_rate: number;
  rating: number;
  total_reviews: number;
  is_active: boolean;
  is_verified: boolean;
  users: {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
}

export const AdminWalkers = () => {
  const [walkers, setWalkers] = useState<Walker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalkers();
  }, []);

  const fetchWalkers = async () => {
    try {
      const { data, error } = await supabase
        .from('walkers')
        .select('*, users(email, first_name, last_name, phone)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWalkers(data || []);
    } catch (error) {
      console.error('Error fetching walkers:', error);
      toast.error('Erreur lors du chargement des promeneurs');
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (walkerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('walkers')
        .update({ is_verified: !currentStatus })
        .eq('id', walkerId);

      if (error) throw error;
      
      toast.success(`Promeneur ${!currentStatus ? 'vérifié' : 'non vérifié'}`);
      fetchWalkers();
    } catch (error) {
      console.error('Error updating walker:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const toggleActive = async (walkerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('walkers')
        .update({ is_active: !currentStatus })
        .eq('id', walkerId);

      if (error) throw error;
      
      toast.success(`Promeneur ${!currentStatus ? 'activé' : 'suspendu'}`);
      fetchWalkers();
    } catch (error) {
      console.error('Error updating walker:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Gestion des Promeneurs ({walkers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Tarif/h</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {walkers.map((walker) => (
              <TableRow key={walker.id}>
                <TableCell className="font-medium">
                  {walker.users.first_name} {walker.users.last_name}
                </TableCell>
                <TableCell>{walker.users.email}</TableCell>
                <TableCell>{walker.users.phone || 'N/A'}</TableCell>
                <TableCell>{walker.hourly_rate} €</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    ⭐ {walker.rating?.toFixed(1) || 'N/A'} ({walker.total_reviews})
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {walker.is_verified && (
                      <Badge variant="default" className="bg-green-500">Vérifié</Badge>
                    )}
                    <Badge variant={walker.is_active ? 'default' : 'secondary'}>
                      {walker.is_active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={walker.is_verified ? 'outline' : 'default'}
                      onClick={() => toggleVerification(walker.id, walker.is_verified)}
                    >
                      {walker.is_verified ? (
                        <><XCircle className="h-4 w-4 mr-1" /> Retirer</>
                      ) : (
                        <><CheckCircle className="h-4 w-4 mr-1" /> Vérifier</>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant={walker.is_active ? 'destructive' : 'default'}
                      onClick={() => toggleActive(walker.id, walker.is_active)}
                    >
                      {walker.is_active ? 'Suspendre' : 'Activer'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
