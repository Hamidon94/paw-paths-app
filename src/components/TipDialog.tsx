import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { DollarSign, Heart } from 'lucide-react';
import { useTips } from '@/hooks/useTips';
import { useToast } from '@/hooks/use-toast';

interface TipDialogProps {
  bookingId: string;
  walkerId: string;
  walkerName: string;
}

export const TipDialog = ({ bookingId, walkerId, walkerName }: TipDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { createTip } = useTips();
  const { toast } = useToast();

  const predefinedAmounts = [2, 5, 10, 15, 20];

  const handleTipSubmit = async () => {
    const amount = selectedAmount || parseFloat(customAmount);
    
    if (!amount || amount <= 0) {
      toast({
        title: "Montant invalide",
        description: "Veuillez sélectionner ou saisir un montant valide",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await createTip(bookingId, walkerId, amount);
      
      toast({
        title: "Pourboire envoyé !",
        description: `Merci d'avoir donné ${amount}€ à ${walkerName}`,
      });

      setOpen(false);
      setSelectedAmount(null);
      setCustomAmount('');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du pourboire",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Heart className="w-4 h-4" />
          Laisser un pourboire
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Laisser un pourboire à {walkerName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label className="mb-3 block">Montants suggérés</Label>
            <div className="grid grid-cols-5 gap-2">
              {predefinedAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  className="w-full"
                >
                  {amount}€
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="custom-amount">Ou montant personnalisé</Label>
            <div className="relative mt-2">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="custom-amount"
                type="number"
                min="0"
                step="0.01"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                className="pl-9 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="0.00"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                €
              </span>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 Les pourboires sont un excellent moyen de montrer votre appréciation pour un excellent service. 100% du pourboire va directement au promeneur.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleTipSubmit}
              disabled={loading || (!selectedAmount && !customAmount)}
              className="flex-1"
            >
              {loading ? "Envoi..." : `Envoyer ${selectedAmount || parseFloat(customAmount) || 0}€`}
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
