
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDiagnosticEdit = (diagnosticId: string | null) => {
  return useQuery({
    queryKey: ['diagnostic', diagnosticId],
    queryFn: async () => {
      if (!diagnosticId) return null;
      
      const { data: diagnostic, error: diagnosticError } = await supabase
        .from('diagnosticos')
        .select(`
          *,
          empresas!diagnosticos_empresa_id_fkey (*)
        `)
        .eq('id', diagnosticId)
        .single();
      
      if (diagnosticError) throw diagnosticError;
      
      // Buscar respostas do diagnóstico
      const { data: respostas, error: respostasError } = await supabase
        .from('respostas')
        .select('*')
        .eq('diagnostico_id', diagnosticId);
      
      if (respostasError) throw respostasError;
      
      return {
        diagnostic,
        respostas: respostas || []
      };
    },
    enabled: !!diagnosticId,
  });
};
