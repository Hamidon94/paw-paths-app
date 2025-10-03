import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Message {
  id: string;
  conversation_id: string;
  sender_user_id: string;
  receiver_user_id: string;
  booking_id?: string;
  message_text: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export interface Conversation {
  conversation_id: string;
  other_user: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export const useMessages = (conversationId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    if (!conversationId) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) return;

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Fetch sender info separately to avoid relationship ambiguity
      const messagesWithSenders = await Promise.all(
        (data || []).map(async (msg) => {
          const { data: senderData } = await supabase
            .from('users')
            .select('first_name, last_name, avatar_url')
            .eq('id', msg.sender_user_id)
            .single();
          
          return {
            ...msg,
            sender: senderData
          };
        })
      );
      
      setMessages(messagesWithSenders as Message[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) return;

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_user_id.eq.${userData.id},receiver_user_id.eq.${userData.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by conversation
      const conversationMap = new Map<string, Conversation>();
      
      for (const msg of data || []) {
        if (!conversationMap.has(msg.conversation_id)) {
          const otherUserId = msg.sender_user_id === userData.id 
            ? msg.receiver_user_id 
            : msg.sender_user_id;

          const { data: otherUserData } = await supabase
            .from('users')
            .select('id, first_name, last_name, avatar_url')
            .eq('id', otherUserId)
            .single();

          const unreadCount = data.filter(
            m => m.conversation_id === msg.conversation_id && 
                 m.receiver_user_id === userData.id && 
                 !m.is_read
          ).length;

          if (otherUserData) {
            conversationMap.set(msg.conversation_id, {
              conversation_id: msg.conversation_id,
              other_user: otherUserData,
              last_message: msg.message_text,
              last_message_time: msg.created_at,
              unread_count: unreadCount
            });
          }
        }
      }

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (receiverUserId: string, messageText: string, bookingId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) throw new Error('User not found');

      const convId = conversationId || `${userData.id}_${receiverUserId}`;

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: convId,
          sender_user_id: userData.id,
          receiver_user_id: receiverUserId,
          message_text: messageText,
          booking_id: bookingId
        });

      if (error) throw error;
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    } else {
      fetchConversations();
    }

    // Subscribe to realtime updates
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          if (conversationId) {
            fetchMessages();
          } else {
            fetchConversations();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  return {
    messages,
    conversations,
    loading,
    sendMessage,
    markAsRead,
    refetch: conversationId ? fetchMessages : fetchConversations
  };
};
