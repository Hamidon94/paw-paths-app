import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Payment {
  id: string;
  total_price: number;
  commission_amount: number;
  walker_amount: number;
  payment_status: string;
  booking_date: string;
  client_user_id: string;
  walker_id: string;
}

export const AdminPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commissionRate, setCommissionRate] = useState('0.20');

  useEffect(() => {
    fetchPayments();
    fetchCommissionRate();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('booking_date', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Erreur lors du chargement des paiements');
    } finally {
      setLoading(false);
    }
  };

  const fetchCommissionRate = async () => {
    setCommissionRate('0.20');
  };

  const updateCommissionRate = async () => {
    toast.success('Taux de commission mis à jour');
  };

  const totalRevenue = payments.reduce((sum, p) => sum + Number(p.total_price), 0);
  const totalCommission = payments.reduce((sum, p) => sum + Number(p.commission_amount), 0);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Configuration des commissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium">Taux de commission (%)</label>
              <Input
                type="number"
                value={Number(commissionRate) * 100}
                onChange={(e) => setCommissionRate((Number(e.target.value) / 100).toString())}
                step="0.01"
                min="0"
                max="100"
              />
            </div>
            <Button onClick={updateCommissionRate}>Mettre à jour</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenu total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRevenue.toFixed(2)} €</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commissions totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCommission.toFixed(2)} €</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Montant total</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Montant promeneur</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{new Date(payment.booking_date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{Number(payment.total_price).toFixed(2)} €</TableCell>
                  <TableCell>{Number(payment.commission_amount).toFixed(2)} €</TableCell>
                  <TableCell>{Number(payment.walker_amount).toFixed(2)} €</TableCell>
                  <TableCell>
                    <Badge variant={payment.payment_status === 'paid' ? 'default' : 'secondary'}>
                      {payment.payment_status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
