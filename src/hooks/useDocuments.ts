import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserDocument {
  id: string;
  user_id: string;
  document_type: 'id_card' | 'criminal_record' | 'certification' | 'other';
  document_url: string;
  verified: boolean;
  verified_at?: string;
  verified_by?: string;
  uploaded_at: string;
}

export const useDocuments = () => {
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Use auth user id directly as user id in the users table
      const userId = user.id;

      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments((data || []) as UserDocument[]);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (
    file: File,
    documentType: 'id_card' | 'criminal_record' | 'certification' | 'other'
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Use auth user id directly as user id
      const userId = user.id;

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${documentType}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Insert document record
      const { error: insertError } = await supabase
        .from('user_documents')
        .insert({
          user_id: userId,
          document_type: documentType,
          document_url: publicUrl
        });

      if (insertError) throw insertError;

      await fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    loading,
    uploadDocument,
    refetch: fetchDocuments
  };
};
