
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDiagnosticoById = (diagnosticoId: string | null) => {
  return useQuery({
    queryKey: ['diagnostico', diagnosticoId],
    queryFn: async () => {
      if (!diagnosticoId) return null;
      
      console.log('🔍 Buscando diagnóstico completo por ID:', diagnosticoId);
      
      // Buscar dados completos do diagnóstico incluindo empresa
      const { data, error } = await supabase
        .from('diagnosticos')
        .select(`
          *,
          empresas!diagnosticos_empresa_id_fkey (*)
        `)
        .eq('id', diagnosticoId)
        .single();

      if (error) {
        console.error('❌ Erro ao buscar diagnóstico completo:', error);
        throw error;
      }

      console.log('✅ Diagnóstico completo encontrado:', data);
      console.log('🏢 Empresa associada:', data?.empresas);
      console.log('📊 Scores do diagnóstico:', {
        total: data?.score_total,
        marketing: data?.score_marketing,
        vendas: data?.score_vendas,
        estrategia: data?.score_estrategia,
        gestao: data?.score_gestao
      });
      
      return data;
    },
    enabled: !!diagnosticoId,
  });
};
