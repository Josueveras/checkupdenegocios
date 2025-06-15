
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Save Respostas
export const useSaveRespostas = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (respostasData: any[]) => {
      console.log('💾 Salvando respostas:', respostasData.length, 'respostas');
      const { data, error } = await supabase
        .from('respostas')
        .insert(respostasData)
        .select();
      
      if (error) {
        console.error('❌ Erro ao salvar respostas:', error);
        throw error;
      }
      
      console.log('✅ Respostas salvas:', data?.length || 0);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['respostas'] });
    }
  });
};

// Update Respostas (deletar antigas e inserir novas)
export const useUpdateRespostas = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ diagnosticoId, respostasData }: { diagnosticoId: string; respostasData: any[] }) => {
      console.log('🔄 Atualizando respostas para diagnóstico:', diagnosticoId);
      
      // Primeiro, deletar respostas antigas
      const { error: deleteError } = await supabase
        .from('respostas')
        .delete()
        .eq('diagnostico_id', diagnosticoId);
      
      if (deleteError) {
        console.error('❌ Erro ao deletar respostas antigas:', deleteError);
        throw deleteError;
      }
      
      console.log('🗑️ Respostas antigas deletadas');
      
      // Inserir novas respostas
      if (respostasData.length > 0) {
        const { data, error } = await supabase
          .from('respostas')
          .insert(respostasData)
          .select();
        
        if (error) {
          console.error('❌ Erro ao inserir novas respostas:', error);
          throw error;
        }
        
        console.log('✅ Novas respostas inseridas:', data?.length || 0);
        return data;
      }
      
      return [];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['respostas'] });
    }
  });
};
