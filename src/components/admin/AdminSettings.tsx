import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export const AdminSettings = () => {
  const [settings, setSettings] = useState({
    stripeKey: '',
    mapboxKey: '',
    resendKey: '',
    twilioKey: ''
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration des clés API</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Stripe Secret Key</Label>
          <Input
            type="password"
            placeholder="sk_..."
            value={settings.stripeKey}
            onChange={(e) => setSettings({ ...settings, stripeKey: e.target.value })}
          />
          <p className="text-sm text-muted-foreground mt-1">Pour les paiements et abonnements</p>
        </div>

        <div>
          <Label>Mapbox API Key</Label>
          <Input
            type="password"
            placeholder="pk_..."
            value={settings.mapboxKey}
            onChange={(e) => setSettings({ ...settings, mapboxKey: e.target.value })}
          />
          <p className="text-sm text-muted-foreground mt-1">Pour les cartes GPS interactives</p>
        </div>

        <div>
          <Label>Resend API Key</Label>
          <Input
            type="password"
            placeholder="re_..."
            value={settings.resendKey}
            onChange={(e) => setSettings({ ...settings, resendKey: e.target.value })}
          />
          <p className="text-sm text-muted-foreground mt-1">Pour l'envoi d'emails</p>
        </div>

        <div>
          <Label>Twilio API Key (optionnel)</Label>
          <Input
            type="password"
            placeholder="AC_..."
            value={settings.twilioKey}
            onChange={(e) => setSettings({ ...settings, twilioKey: e.target.value })}
          />
          <p className="text-sm text-muted-foreground mt-1">Pour les notifications SMS</p>
        </div>

        <Button onClick={() => toast.info('Fonctionnalité de sauvegarde à implémenter')}>
          Sauvegarder les clés
        </Button>
      </CardContent>
    </Card>
  );
};
