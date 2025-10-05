import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Copy, Gift, Users } from 'lucide-react';

const Referral = () => {
  const [referralCode, setReferralCode] = useState('');
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    pendingRewards: 0
  });

  useEffect(() => {
    generateReferralCode();
  }, []);

  const generateReferralCode = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (userData) {
        const code = `PAW${userData.id.substring(0, 8).toUpperCase()}`;
        setReferralCode(code);
      }
    } catch (error) {
      console.error('Error generating referral code:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://pawpaths.com/signup?ref=${referralCode}`);
    toast.success('Lien de parrainage copié !');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Programme de parrainage</h1>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parrainages</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referralStats.totalReferrals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gains totaux</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referralStats.totalEarnings}€</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referralStats.pendingRewards}€</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Votre code de parrainage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={`https://pawpaths.com/signup?ref=${referralCode}`} readOnly />
            <Button onClick={copyToClipboard}>
              <Copy className="w-4 h-4 mr-2" />
              Copier
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Comment ça marche ?</h3>
            <ul className="space-y-2 text-sm">
              <li>✓ Partagez votre lien avec vos amis</li>
              <li>✓ Recevez 10€ lorsqu'ils effectuent leur première réservation</li>
              <li>✓ Votre filleul reçoit également 5€ de réduction</li>
              <li>✓ Pas de limite de parrainages !</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Referral;
