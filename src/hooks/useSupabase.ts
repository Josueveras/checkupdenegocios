
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Hook para empresas
export const useEmpresas = () => {
  return useQuery({
    queryKey: ['empresas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
};

// Hook para diagnósticos com dados completos
export const useDiagnosticos = () => {
  return useQuery({
    queryKey: ['diagnosticos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('diagnosticos')
        .select(`
          *,
          empresas (
            nome,
            cliente_nome,
            cliente_email,
            cliente_telefone
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
};

// Hook para perguntas
export const usePerguntas = () => {
  return useQuery({
    queryKey: ['perguntas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('perguntas')
        .select('*')
        .eq('ativa', true)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });
};

// Hook para propostas
export const usePropostas = () => {
  return useQuery({
    queryKey: ['propostas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('propostas')
        .select(`
          *,
          diagnosticos (
            *,
            empresas (
              nome,
              cliente_nome,
              cliente_email,
              cliente_telefone
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
};

// Hook para perfil do usuário
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user_profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });
};

// Hook para notificações do usuário
export const useUserNotifications = () => {
  return useQuery({
    queryKey: ['user_notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });
};

// Hook para configurações
export const useConfiguracoes = () => {
  return useQuery({
    queryKey: ['configuracoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });
};

// Hook para salvar empresa
export const useSaveEmpresa = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (empresa: any) => {
      const { data, error } = await supabase
        .from('empresas')
        .insert(empresa)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
    }
  });
};

// Hook para salvar diagnóstico
export const useSaveDiagnostico = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (diagnostico: any) => {
      const { data, error } = await supabase
        .from('diagnosticos')
        .insert(diagnostico)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnosticos'] });
    }
  });
};

// Hook para atualizar diagnóstico
export const useUpdateDiagnostico = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('diagnosticos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnosticos'] });
    }
  });
};

// Hook para excluir diagnóstico
export const useDeleteDiagnostico = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('diagnosticos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnosticos'] });
    }
  });
};

// Hook para salvar respostas
export const useSaveRespostas = () => {
  return useMutation({
    mutationFn: async (respostas: any[]) => {
      const { data, error } = await supabase
        .from('respostas')
        .insert(respostas)
        .select();
      
      if (error) throw error;
      return data;
    }
  });
};

// Hook para salvar proposta
export const useSaveProposta = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (proposta: any) => {
      const { data, error } = await supabase
        .from('propostas')
        .insert(proposta)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
    }
  });
};

// Hook para salvar perfil do usuário
export const useSaveUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profile: any) => {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profile)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_profile'] });
    }
  });
};

// Hook para salvar notificações do usuário
export const useSaveUserNotifications = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notifications: any) => {
      const { data, error } = await supabase
        .from('user_notifications')
        .upsert(notifications)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_notifications'] });
    }
  });
};

// Hook para salvar configurações
export const useSaveConfiguracoes = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (config: any) => {
      const { data, error } = await supabase
        .from('configuracoes')
        .upsert(config)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes'] });
    }
  });
};

// Hook para adicionar pergunta
export const useSavePergunta = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pergunta: any) => {
      const { data, error } = await supabase
        .from('perguntas')
        .insert(pergunta)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perguntas'] });
    }
  });
};

// Hook para atualizar pergunta
export const useUpdatePergunta = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('perguntas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perguntas'] });
    }
  });
};

// Hook para excluir pergunta
export const useDeletePergunta = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('perguntas')
        .update({ ativa: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perguntas'] });
    }
  });
};
