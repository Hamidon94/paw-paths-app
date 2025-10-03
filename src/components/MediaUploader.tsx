import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Video, Upload } from 'lucide-react';
import { useBookingMedia } from '@/hooks/useBookingMedia';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface MediaUploaderProps {
  bookingId: string;
}

export const MediaUploader = ({ bookingId }: MediaUploaderProps) => {
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [uploading, setUploading] = useState(false);
  const { uploadMedia, media } = useBookingMedia(bookingId);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale est de 50 MB",
        variant: "destructive"
      });
      return;
    }

    const isVideo = file.type.startsWith('video/');
    setMediaType(isVideo ? 'video' : 'photo');
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      await uploadMedia(selectedFile, mediaType, caption);
      
      toast({
        title: "Média envoyé",
        description: "Votre photo/vidéo a été envoyée au propriétaire"
      });

      // Reset form
      setSelectedFile(null);
      setCaption('');
      setOpen(false);
    } catch (error) {
      toast({
        title: "Erreur d'envoi",
        description: "Une erreur est survenue lors de l'envoi",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Envoyer photo/vidéo
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Envoyer une photo ou vidéo</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="media-file">Fichier</Label>
              <div className="mt-2 flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('media-file')?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {selectedFile ? selectedFile.name : "Choisir un fichier"}
                </Button>
                <input
                  id="media-file"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              {selectedFile && (
                <p className="text-sm text-muted-foreground mt-2">
                  Type: {mediaType === 'photo' ? 'Photo' : 'Vidéo'} • Taille: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="caption">Légende (optionnel)</Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Ajoutez une description..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="flex-1"
              >
                {uploading ? "Envoi en cours..." : "Envoyer"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={uploading}
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Display media */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {media.map((item) => (
          <div key={item.id} className="relative group">
            {item.media_type === 'photo' ? (
              <img
                src={item.media_url}
                alt={item.caption || ''}
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              <video
                src={item.media_url}
                controls
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            {item.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 rounded-b-lg">
                <p className="text-xs">{item.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
