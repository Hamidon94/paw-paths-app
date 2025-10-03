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
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('auth_user_id', user.id)
          .single();

        if (!userData) return;

        const { data: walkerData } = await supabase
          .from('walkers')
          .select('id')
          .eq('user_id', userData.id)
          .maybeSingle();

        if (walkerData) {
          query = query.eq('walker_id', walkerData.id);
        } else {
          query = query.eq('client_user_id', userData.id);
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

      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) throw new Error('User not found');

      const { error } = await supabase
        .from('tips')
        .insert({
          booking_id: bookingId,
          client_user_id: userData.id,
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
