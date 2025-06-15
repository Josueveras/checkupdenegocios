
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDiagnosticoById = (diagnosticoId: string | null) => {
  return useQuery({
    queryKey: ['diagnostico', diagnosticoId],
    queryFn: async () => {
      if (!diagnosticoId) return null;
      
      console.log('🔍 Buscando diagnóstico por ID:', diagnosticoId);
      
      const { data, error } = await supabase
        .from('diagnosticos')
        .select('empresa_id, empresas(*)')
        .eq('id', diagnosticoId)
        .single();

      if (error) {
        console.error('❌ Erro ao buscar diagnóstico:', error);
        throw error;
      }

      console.log('✅ Diagnóstico encontrado:', data);
      return data;
    },
    enabled: !!diagnosticoId,
  });
};
