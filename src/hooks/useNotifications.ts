
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  titulo: string;
  descricao: string;
  link_pdf?: string;
  tipo: 'diagnostico' | 'proposta' | 'sistema';
  lida: boolean;
  created_at: string;
  user_id: string;
}

// Hook para buscar notificações do usuário
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      // Usando any para contornar a limitação dos tipos do Supabase
      const { data, error } = await (supabase as any)
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data as Notification[]) || [];
    }
  });
};

// Hook para marcar notificação como lida
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      // Usando any para contornar a limitação dos tipos do Supabase
      const { error } = await (supabase as any)
        .from('notifications')
        .update({ lida: true })
        .eq('id', notificationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
};

// Hook para criar nova notificação
export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notification: Omit<Notification, 'id' | 'created_at' | 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Usando any para contornar a limitação dos tipos do Supabase
      const { data, error } = await (supabase as any)
        .from('notifications')
        .insert({
          ...notification,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
};
