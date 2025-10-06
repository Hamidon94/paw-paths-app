import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Gift, Plus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PromoCode {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  valid_until: string;
}

interface Referral {
  id: string;
  referral_code: string;
  reward_amount: number;
  reward_claimed: boolean;
  created_at: string;
  referrer_user_id: string;
  users: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

export const AdminPromotions = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [promoRes, referralRes] = await Promise.all([
        supabase.from('promo_codes').select('*').order('created_at', { ascending: false }),
        supabase.from('referrals').select('*, users(email, first_name, last_name)').order('created_at', { ascending: false })
      ]);

      if (promoRes.data) setPromoCodes(promoRes.data);
      if (referralRes.data) setReferrals(referralRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const togglePromoCode = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success('Code promo mis à jour');
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <Tabs defaultValue="promo" className="space-y-4">
      <TabsList>
        <TabsTrigger value="promo">
          <Gift className="h-4 w-4 mr-2" />
          Codes Promo
        </TabsTrigger>
        <TabsTrigger value="referral">
          <Users className="h-4 w-4 mr-2" />
          Parrainage
        </TabsTrigger>
      </TabsList>

      <TabsContent value="promo">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Codes Promotionnels ({promoCodes.length})
              </CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Créer un code
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Valeur</TableHead>
                  <TableHead>Utilisations</TableHead>
                  <TableHead>Validité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promoCodes.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell className="font-mono font-bold">{promo.code}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {promo.discount_type === 'percentage' ? 'Pourcentage' : 'Montant fixe'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `${promo.discount_value}€`}
                    </TableCell>
                    <TableCell>
                      {promo.current_uses} / {promo.max_uses || '∞'}
                    </TableCell>
                    <TableCell>
                      {promo.valid_until ? new Date(promo.valid_until).toLocaleDateString() : 'Illimité'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={promo.is_active ? 'default' : 'secondary'}>
                        {promo.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePromoCode(promo.id, promo.is_active)}
                      >
                        {promo.is_active ? 'Désactiver' : 'Activer'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="referral">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Programme de Parrainage ({referrals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{referrals.length}</div>
                  <p className="text-sm text-muted-foreground">Total parrainages</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {referrals.filter(r => r.reward_claimed).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Récompenses réclamées</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {referrals.reduce((sum, r) => sum + Number(r.reward_amount), 0).toFixed(2)} €
                  </div>
                  <p className="text-sm text-muted-foreground">Total récompenses</p>
                </CardContent>
              </Card>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parrain</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Récompense</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>
                      {referral.users.first_name} {referral.users.last_name}
                      <div className="text-xs text-muted-foreground">{referral.users.email}</div>
                    </TableCell>
                    <TableCell className="font-mono">{referral.referral_code}</TableCell>
                    <TableCell>{referral.reward_amount} €</TableCell>
                    <TableCell>{new Date(referral.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={referral.reward_claimed ? 'default' : 'secondary'}>
                        {referral.reward_claimed ? 'Réclamé' : 'En attente'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
