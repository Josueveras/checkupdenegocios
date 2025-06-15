
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
        .select('*')
        .order('nome');
      
      if (error) throw error;
      return data;
    }
  });
};

// Hook para salvar nova empresa
export const useSaveEmpresa = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (empresaData: any) => {
      console.log('💾 Salvando empresa:', empresaData);
      const { data, error } = await supabase
        .from('empresas')
        .insert(empresaData)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao salvar empresa:', error);
        throw error;
      }
      
      console.log('✅ Empresa salva:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
    }
  });
};

// Update Empresa
export const useUpdateEmpresa = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, empresaData }: { id: string; empresaData: any }) => {
      console.log('🔄 Atualizando empresa:', id, empresaData);
      const { data, error } = await supabase
        .from('empresas')
        .update(empresaData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao atualizar empresa:', error);
        throw error;
      }
      
      console.log('✅ Empresa atualizada:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      queryClient.invalidateQueries({ queryKey: ['diagnosticos'] });
    }
  });
};
