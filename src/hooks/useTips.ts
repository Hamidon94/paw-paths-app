import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Tip {
  id: string;
  booking_id: string;
  client_user_id: string;
  walker_id: string;
  amount: number;
  stripe_payment_intent_id?: string;
  created_at: string;
}

export const useTips = (walkerId?: string) => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [totalTips, setTotalTips] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTips = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase.from('tips').select('*');

      if (walkerId) {
        query = query.eq('walker_id', walkerId);
      } else {
        // Use auth user id directly
        const userId = user.id;

        // Query users table for sitter role
        const { data: sitterData } = await supabase
          .from('users')
          .select('id')
          .eq('id', userId)
          .eq('role', 'sitter')
          .maybeSingle();

        if (sitterData) {
          query = query.eq('walker_id', sitterData.id);
        } else {
          query = query.eq('client_user_id', userId);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      setTips(data || []);
      setTotalTips(data?.reduce((sum, tip) => sum + Number(tip.amount), 0) || 0);
    } catch (error) {
      console.error('Error fetching tips:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTip = async (bookingId: string, walkerId: string, amount: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Use auth user id directly
      const userId = user.id;

      const { error } = await supabase
        .from('tips')
        .insert({
          booking_id: bookingId,
          client_user_id: userId,
          walker_id: walkerId,
          amount
        });

      if (error) throw error;

      await fetchTips();
    } catch (error) {
      console.error('Error creating tip:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTips();
  }, [walkerId]);

  return {
    tips,
    totalTips,
    loading,
    createTip,
    refetch: fetchTips
  };
};
