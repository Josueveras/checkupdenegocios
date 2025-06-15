
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Diagnosticos
export const useDiagnosticos = () => {
  return useQuery({
    queryKey: ['diagnosticos'],
    queryFn: async () => {
      console.log('🔍 Buscando diagnósticos...');
      const { data, error } = await supabase
        .from('diagnosticos')
        .select(`
          *,
          empresas!diagnosticos_empresa_id_fkey (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Erro ao buscar diagnósticos:', error);
        throw error;
      }
      
      console.log('✅ Diagnósticos encontrados:', data?.length || 0);
      // Log para verificar as 4 colunas de score existentes
      if (data && data.length > 0) {
        console.log('📊 Primeiro diagnóstico - scores:', {
          marketing: data[0].score_marketing,
          vendas: data[0].score_vendas,
          estrategia: data[0].score_estrategia,
          gestao: data[0].score_gestao
        });
      }
      
      return data;
    }
  });
};

// Save Diagnostico
export const useSaveDiagnostico = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (diagnosticoData: any) => {
      console.log('💾 Salvando diagnóstico:', diagnosticoData);
      
      // Garantir que apenas as 4 colunas existentes sejam enviadas
      const cleanedData = {
        empresa_id: diagnosticoData.empresa_id,
        score_total: diagnosticoData.score_total,
        score_marketing: diagnosticoData.score_marketing,
        score_vendas: diagnosticoData.score_vendas,
        score_estrategia: diagnosticoData.score_estrategia,
        score_gestao: diagnosticoData.score_gestao,
        nivel: diagnosticoData.nivel,
        pontos_fortes: diagnosticoData.pontos_fortes,
        pontos_atencao: diagnosticoData.pontos_atencao,
        recomendacoes: diagnosticoData.recomendacoes,
        planos: diagnosticoData.planos,
        valores: diagnosticoData.valores,
        observacoes: diagnosticoData.observacoes,
        status: diagnosticoData.status
      };
      
      console.log('💾 Dados limpos para salvar:', cleanedData);
      
      const { data, error } = await supabase
        .from('diagnosticos')
        .insert(cleanedData)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao salvar diagnóstico:', error);
        console.error('📊 Dados que causaram erro:', cleanedData);
        throw error;
      }
      
      console.log('✅ Diagnóstico salvo:', data);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnosticos'] });
    }
  });
};

// Update Diagnostico
export const useUpdateDiagnostico = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, diagnosticoData }: { id: string; diagnosticoData: any }) => {
      console.log('🔄 Atualizando diagnóstico:', id, diagnosticoData);
      
      // Garantir que apenas as 4 colunas existentes sejam enviadas
      const cleanedData = {
        score_total: diagnosticoData.score_total,
        score_marketing: diagnosticoData.score_marketing,
        score_vendas: diagnosticoData.score_vendas,
        score_estrategia: diagnosticoData.score_estrategia,
        score_gestao: diagnosticoData.score_gestao,
        nivel: diagnosticoData.nivel,
        pontos_fortes: diagnosticoData.pontos_fortes,
        pontos_atencao: diagnosticoData.pontos_atencao,
        recomendacoes: diagnosticoData.recomendacoes,
        planos: diagnosticoData.planos,
        valores: diagnosticoData.valores,
        observacoes: diagnosticoData.observacoes,
        status: diagnosticoData.status
      };
      
      console.log('🔄 Dados limpos para atualizar:', cleanedData);
      
      const { data, error } = await supabase
        .from('diagnosticos')
        .update(cleanedData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao atualizar diagnóstico:', error);
        throw error;
      }
      
      console.log('✅ Diagnóstico atualizado:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnosticos'] });
    }
  });
};
