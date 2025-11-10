import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Eye, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Walker {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  hourly_rate: number;
  rating: number;
  total_reviews: number;
  is_active: boolean;
  is_verified: boolean;
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
        .from('users')
        .select('*')
        .eq('role', 'sitter')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedWalkers: Walker[] = (data || []).map(user => ({
        user_id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone || '',
        hourly_rate: user.hourly_rate || 20,
        rating: user.average_rating || 0,
        total_reviews: 0,
        is_active: user.is_active || true,
        is_verified: user.is_verified || false
      }));
      
      setWalkers(mappedWalkers);
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
        .from('users')
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
        .from('users')
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
              <TableRow key={walker.user_id}>
                <TableCell className="font-medium">
                  {walker.first_name} {walker.last_name}
                </TableCell>
                <TableCell>{walker.email}</TableCell>
                <TableCell>{walker.phone || 'N/A'}</TableCell>
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
                      onClick={() => toggleVerification(walker.user_id, walker.is_verified)}
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
                      onClick={() => toggleActive(walker.user_id, walker.is_active)}
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
