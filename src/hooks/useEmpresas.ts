
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Hook para buscar todas as empresas
export const useEmpresas = () => {
  return useQuery({
    queryKey: ['empresas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select('id, nome, setor')
        .order('nome');
      
      if (error) throw error;
      return data || [];
    }
  });
};

// Hook para salvar nova empresa
export const useSaveEmpresa = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (empresa: { nome: string; setor?: string }) => {
      const { data, error } = await supabase
        .from('empresas')
        .insert(empresa)
        .select('id, nome, setor')
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      queryClient.invalidateQueries({ queryKey: ['empresas-com-diagnosticos'] });
      toast({
        title: "Empresa cadastrada",
        description: "Empresa cadastrada com sucesso!"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao cadastrar",
        description: error.message || "Erro ao cadastrar a empresa",
        variant: "destructive"
      });
    }
  });
};
