import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileCheck, AlertCircle } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface DocumentUploaderProps {
  documentType: 'id_card' | 'criminal_record' | 'certification' | 'other';
  title: string;
  description: string;
  required?: boolean;
}

export const DocumentUploader = ({
  documentType,
  title,
  description,
  required = false
}: DocumentUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { documents, uploadDocument } = useDocuments();
  const { toast } = useToast();

  const existingDoc = documents.find(doc => doc.document_type === documentType);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale est de 10 MB",
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Type de fichier invalide",
        description: "Formats acceptés : JPG, PNG, PDF",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(10);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await uploadDocument(file, documentType);

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast({
        title: "Document envoyé avec succès",
        description: "Votre document est en cours de vérification"
      });

      // Reset after 1 second
      setTimeout(() => {
        setUploadProgress(0);
        setUploading(false);
      }, 1000);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erreur d'envoi",
        description: "Une erreur est survenue lors de l'envoi du document",
        variant: "destructive"
      });
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            {required && (
              <span className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded">
                Obligatoire
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        
        {existingDoc && existingDoc.verified && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <FileCheck className="w-4 h-4" />
            <span>Vérifié</span>
          </div>
        )}
      </div>

      {existingDoc && !existingDoc.verified && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            Document en cours de vérification
          </p>
        </div>
      )}

      {uploading && (
        <div className="mb-4">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Envoi en cours... {uploadProgress}%
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          variant={existingDoc ? "outline" : "default"}
          disabled={uploading}
          onClick={() => document.getElementById(`file-${documentType}`)?.click()}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {existingDoc ? "Remplacer le document" : "Télécharger le document"}
        </Button>
        <input
          id={`file-${documentType}`}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {existingDoc && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(existingDoc.document_url, '_blank')}
          >
            Voir le document
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Formats acceptés : JPG, PNG, PDF (Max 10 MB)
      </p>
    </Card>
  );
};
