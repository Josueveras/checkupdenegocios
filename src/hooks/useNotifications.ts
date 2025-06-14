
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
      console.log('DEBUG: Tentando buscar notificações...');
      
      // Por enquanto, vamos verificar se a tabela existe
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('count')
          .limit(1);
        
        if (error) {
          console.warn('DEBUG: Tabela notifications não existe ou não está acessível:', error.message);
          // Retornar array vazio se a tabela não existir
          return [];
        }
        
        // Se chegou até aqui, a tabela existe, buscar dados reais
        const { data: notifications, error: fetchError } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (fetchError) {
          console.error('DEBUG: Erro ao buscar notificações:', fetchError);
          throw fetchError;
        }
        
        console.log('DEBUG: Notificações encontradas:', notifications?.length || 0);
        return (notifications as Notification[]) || [];
        
      } catch (error) {
        console.warn('DEBUG: Erro na verificação da tabela notifications:', error);
        return [];
      }
    },
    retry: 1, // Tentar apenas uma vez se der erro
    retryDelay: 1000
  });
};

// Hook para marcar notificação como lida
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      console.log('DEBUG: Tentando marcar notificação como lida:', notificationId);
      
      const { error } = await supabase
        .from('notifications')
        .update({ lida: true })
        .eq('id', notificationId);
      
      if (error) {
        console.error('DEBUG: Erro ao marcar como lida:', error);
        throw error;
      }
      
      console.log('DEBUG: Notificação marcada como lida com sucesso');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('DEBUG: Falha ao marcar notificação como lida:', error);
    }
  });
};

// Hook para criar nova notificação
export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notification: Omit<Notification, 'id' | 'created_at' | 'user_id'>) => {
      console.log('DEBUG: Criando nova notificação:', notification);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('DEBUG: Usuário não autenticado');
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('notifications')
        .insert({
          ...notification,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) {
        console.error('DEBUG: Erro ao criar notificação:', error);
        throw error;
      }
      
      console.log('DEBUG: Notificação criada com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('DEBUG: Falha ao criar notificação:', error);
    }
  });
};
