import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

interface Document {
  id: string;
  user_id: string;
  document_type: string;
  document_url: string;
  verified: boolean;
  uploaded_at: string;
  users: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

export const AdminDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('user_documents')
        .select('*, users(email, first_name, last_name)')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Erreur lors du chargement des documents');
    } finally {
      setLoading(false);
    }
  };

  const verifyDocument = async (documentId: string, verified: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      const { error } = await supabase
        .from('user_documents')
        .update({
          verified: false,
          verified_at: null
        })
        .eq('id', documentId);

      if (error) throw error;
      toast.success(verified ? 'Document vérifié' : 'Document rejeté');
      fetchDocuments();
    } catch (error) {
      console.error('Error verifying document:', error);
      toast.error('Erreur lors de la vérification');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vérification des documents</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date d'upload</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  {doc.users.first_name} {doc.users.last_name}
                  <div className="text-sm text-muted-foreground">{doc.users.email}</div>
                </TableCell>
                <TableCell>{doc.document_type}</TableCell>
                <TableCell>{new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>
                  {doc.verified ? (
                    <Badge variant="default">Vérifié</Badge>
                  ) : (
                    <Badge variant="secondary">En attente</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(doc.document_url, '_blank')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {!doc.verified && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => verifyDocument(doc.id, true)}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => verifyDocument(doc.id, false)}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}
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
