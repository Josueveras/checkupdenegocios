
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Hook para buscar empresas que já têm diagnósticos
export const useEmpresasComDiagnosticos = () => {
  return useQuery({
    queryKey: ['empresas-com-diagnosticos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select(`
          id,
          nome,
          diagnosticos!inner(id)
        `)
        .order('nome');
      
      if (error) throw error;
      return data || [];
    }
  });
};

// Hook para buscar acompanhamentos de uma empresa
export const useAcompanhamentosByEmpresa = (empresaId: string) => {
  return useQuery({
    queryKey: ['acompanhamentos', empresaId],
    queryFn: async () => {
      if (!empresaId) return [];
      
      const { data, error } = await supabase
        .from('acompanhamentos')
        .select(`
          *,
          empresas(nome)
        `)
        .eq('empresa_id', empresaId)
        .order('mes', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaId
  });
};

// Hook para buscar todos os acompanhamentos (para evolução consolidada)
export const useAllAcompanhamentos = () => {
  return useQuery({
    queryKey: ['all-acompanhamentos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('acompanhamentos')
        .select(`
          *,
          empresas(nome)
        `)
        .order('mes', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
};

// Hook para salvar acompanhamento
export const useSaveAcompanhamento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (acompanhamento: any) => {
      const { data, error } = await supabase
        .from('acompanhamentos')
        .insert(acompanhamento)
        .select(`
          *,
          empresas(nome)
        `)
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acompanhamentos'] });
      queryClient.invalidateQueries({ queryKey: ['all-acompanhamentos'] });
      toast({
        title: "Check-up salvo",
        description: "Acompanhamento mensal registrado com sucesso!"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao salvar",
        description: error.message || "Erro ao salvar o acompanhamento",
        variant: "destructive"
      });
    }
  });
};
