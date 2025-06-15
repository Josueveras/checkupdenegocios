
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Hook para propostas de planos (plano_id não nulo)
export const usePropostasPlanos = () => {
  return useQuery({
    queryKey: ['propostas-planos'],
    queryFn: async () => {
      // Buscar propostas que têm plano_id (propostas baseadas em planos)
      const { data: propostas, error: propostasError } = await supabase
        .from('propostas')
        .select(`
          *,
          diagnosticos!propostas_diagnostico_id_fkey (
            *,
            empresas!diagnosticos_empresa_id_fkey (*)
          )
        `)
        .not('plano_id', 'is', null)
        .order('created_at', { ascending: false });
      
      if (propostasError) throw propostasError;
      if (!propostas || propostas.length === 0) return [];

      // As empresas já vêm via diagnosticos, então só precisamos mapear
      const propostasComEmpresas = propostas.map(proposta => {
        const empresa = proposta.diagnosticos?.empresas;
        return {
          ...proposta,
          empresas: empresa || null
        };
      });

      return propostasComEmpresas;
    }
  });
};
