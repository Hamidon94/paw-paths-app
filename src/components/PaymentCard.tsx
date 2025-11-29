import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Lock, Shield, Check, Euro } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentCardProps {
  amount: number;
  description: string;
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentError?: (error: string) => void;
  disabled?: boolean;
}

export const PaymentCard = ({ 
  amount, 
  description, 
  onPaymentSuccess, 
  onPaymentError,
  disabled = false 
}: PaymentCardProps) => {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate payment processing
      // In production, this would call a Stripe/payment API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentId = `pay_${Date.now()}`;
      toast.success('Paiement effectué avec succès');
      onPaymentSuccess?.(paymentId);
    } catch (error: any) {
      toast.error('Erreur lors du paiement');
      onPaymentError?.(error.message);
    } finally {
      setLoading(false);
    }
  };

  const serviceFee = amount * 0.05;
  const total = amount + serviceFee;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Paiement sécurisé
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Price Summary */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Service</span>
              <span>{amount.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Frais de service (5%)</span>
              <span>{serviceFee.toFixed(2)}€</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span className="text-primary">{total.toFixed(2)}€</span>
            </div>
          </div>

          {/* Card Details */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="name">Nom sur la carte</Label>
              <Input
                id="name"
                placeholder="JEAN DUPONT"
                value={name}
                onChange={(e) => setName(e.target.value.toUpperCase())}
                required
              />
            </div>

            <div>
              <Label htmlFor="cardNumber">Numéro de carte</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  required
                />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="expiry">Date d'expiration</Label>
                <Input
                  id="expiry"
                  placeholder="MM/AA"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || disabled}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Traitement en cours...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Payer {total.toFixed(2)}€
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Paiement 100% sécurisé par cryptage SSL</span>
        </div>
        <div className="flex items-center gap-2">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
        </div>
      </CardFooter>
    </Card>
  );
};

interface PaymentStatusProps {
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  amount?: number;
}

export const PaymentStatus = ({ status, amount }: PaymentStatusProps) => {
  const statusConfig = {
    pending: { label: 'En attente', variant: 'secondary' as const, icon: Euro },
    paid: { label: 'Payé', variant: 'default' as const, icon: Check },
    failed: { label: 'Échoué', variant: 'destructive' as const, icon: CreditCard },
    refunded: { label: 'Remboursé', variant: 'outline' as const, icon: Euro },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
      {amount && ` - ${amount.toFixed(2)}€`}
    </Badge>
  );
};
