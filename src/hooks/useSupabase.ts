
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDiagnosticNotifications } from './useDiagnosticNotifications';

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

// Hook para diagnósticos
export const useDiagnosticos = () => {
  return useQuery({
    queryKey: ['diagnosticos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('diagnosticos')
        .select(`
          *,
          empresas!diagnosticos_empresa_id_fkey (
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
          diagnosticos!propostas_diagnostico_id_fkey (
            empresas!diagnosticos_empresa_id_fkey (
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
  const { notifyDiagnosticCompleted } = useDiagnosticNotifications();
  
  return useMutation({
    mutationFn: async (diagnostico: any) => {
      const { data, error } = await supabase
        .from('diagnosticos')
        .insert(diagnostico)
        .select(`
          *,
          empresas!diagnosticos_empresa_id_fkey (nome)
        `)
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['diagnosticos'] });
      // Criar notificação quando diagnóstico for concluído
      if (data?.empresas?.nome) {
        notifyDiagnosticCompleted(data.empresas.nome, data.id);
      }
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

// Hook para CRM
export const useCRM = () => {
  return useQuery({
    queryKey: ['crm'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('propostas')
        .select(`
          *,
          diagnosticos!propostas_diagnostico_id_fkey (
            empresas!diagnosticos_empresa_id_fkey (
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
