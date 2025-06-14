
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
      
      try {
        // Usar a tabela user_notifications que existe no schema
        const { data, error } = await supabase
          .from('user_notifications')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.warn('DEBUG: Erro ao buscar notificações:', error.message);
          return [];
        }
        
        console.log('DEBUG: Notificações encontradas:', data?.length || 0);
        
        // Como a tabela user_notifications pode ter estrutura diferente,
        // vamos retornar array vazio por enquanto até a estrutura correta ser definida
        return [];
        
      } catch (error) {
        console.warn('DEBUG: Erro na busca de notificações:', error);
        return [];
      }
    },
    retry: 1,
    retryDelay: 1000
  });
};

// Hook para criar nova notificação (desabilitado por enquanto)
export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notification: Omit<Notification, 'id' | 'created_at' | 'user_id'>) => {
      console.log('DEBUG: Funcionalidade de notificações desabilitada temporariamente');
      throw new Error('Funcionalidade não disponível');
    },
    onError: (error) => {
      console.error('DEBUG: Falha ao criar notificação:', error);
    }
  });
};

// Hook para marcar notificação como lida (desabilitado por enquanto)
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      console.log('DEBUG: Funcionalidade de notificações desabilitada temporariamente');
      throw new Error('Funcionalidade não disponível');
    },
    onError: (error) => {
      console.error('DEBUG: Falha ao marcar notificação como lida:', error);
    }
  });
};
