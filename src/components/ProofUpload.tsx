import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Camera, Video, Upload, Send, CheckCircle, Clock, Image as ImageIcon } from 'lucide-react';

interface ProofUploadProps {
  bookingId: string;
  walkerId: string;
  isWalker: boolean;
  onProofSent?: () => void;
}

export const ProofUpload = ({ bookingId, walkerId, isWalker, onProofSent }: ProofUploadProps) => {
  const [message, setMessage] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [proofsSent, setProofsSent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types (images and videos)
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    if (validFiles.length !== files.length) {
      toast.error('Seuls les images et vidéos sont acceptées');
    }

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setMediaFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (mediaFiles.length === 0) {
      toast.error('Veuillez ajouter au moins une photo ou vidéo');
      return;
    }

    if (!message.trim()) {
      toast.error('Veuillez ajouter un message court');
      return;
    }

    setLoading(true);

    try {
      // Upload each file to storage
      for (const file of mediaFiles) {
        const timestamp = new Date().toISOString();
        const fileExt = file.name.split('.').pop();
        const fileName = `${bookingId}/${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('service-photos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('service-photos')
          .getPublicUrl(fileName);

        // Save photo record with caption
        const { error: dbError } = await supabase
          .from('service_photos')
          .insert({
            booking_id: bookingId,
            url: urlData.publicUrl,
            caption: message,
            sent: true
          });

        if (dbError) throw dbError;
      }

      toast.success('Preuves envoyées avec succès !');
      setProofsSent(true);
      setMediaFiles([]);
      setPreviews([]);
      setMessage('');
      onProofSent?.();
    } catch (error) {
      console.error('Error uploading proof:', error);
      toast.error('Erreur lors de l\'envoi des preuves');
    } finally {
      setLoading(false);
    }
  };

  // View for owner (receiving proofs)
  if (!isWalker) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Preuves de la prestation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {proofsSent ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-sage mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Preuves reçues !</h3>
              <p className="text-muted-foreground text-sm">
                Le promeneur a envoyé les preuves de la prestation.
                Vous pouvez valider pour débloquer le paiement.
              </p>
              <div className="mt-6 flex gap-3 justify-center">
                <Button variant="default">
                  Valider et débloquer le paiement
                </Button>
                <Button variant="outline">
                  Signaler un problème
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">En attente des preuves</h3>
              <p className="text-muted-foreground text-sm">
                Le promeneur doit envoyer des photos/vidéos pendant la prestation.
                Le paiement sera débloqué après validation.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // View for walker (sending proofs)
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Envoyer les preuves
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Rappel important</p>
          <p>
            Vous devez envoyer au moins une photo ou vidéo accompagnée d'un court message 
            pour débloquer le paiement de cette prestation.
          </p>
        </div>

        {/* Media upload area */}
        <div>
          <Label className="mb-2 block">Photos / Vidéos</Label>
          <div 
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex justify-center gap-4 mb-3">
              <div className="p-3 rounded-full bg-sage-light/50">
                <Camera className="h-6 w-6 text-sage" />
              </div>
              <div className="p-3 rounded-full bg-ocean-light/50">
                <Video className="h-6 w-6 text-ocean" />
              </div>
            </div>
            <p className="text-sm font-medium">Cliquez pour ajouter des médias</p>
            <p className="text-xs text-muted-foreground mt-1">Images et vidéos acceptées</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Previews */}
        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                {mediaFiles[index]?.type.startsWith('video/') ? (
                  <video
                    src={preview}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ) : (
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                )}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Message */}
        <div>
          <Label htmlFor="message">Message court (obligatoire)</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ex: 15h30 - Promenade de 45min effectuée au parc. Rex était très joyeux !"
            rows={3}
            className="mt-1"
          />
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={loading || mediaFiles.length === 0 || !message.trim()}
          className="w-full"
        >
          {loading ? (
            'Envoi en cours...'
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Envoyer les preuves
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
