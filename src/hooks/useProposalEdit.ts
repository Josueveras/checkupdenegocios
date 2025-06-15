
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProposalEdit = (proposalId: string | null, planoId: string | null = null) => {
  return useQuery({
    queryKey: ['proposal', proposalId, 'plano', planoId],
    queryFn: async () => {
      // Se tem proposalId, buscar proposta existente
      if (proposalId) {
        const { data, error } = await supabase
          .from('propostas')
          .select(`
            *,
            diagnosticos!propostas_diagnostico_id_fkey (
              *,
              empresas!diagnosticos_empresa_id_fkey (*)
            ),
            empresas!propostas_empresa_id_fkey (*)
          `)
          .eq('id', proposalId)
          .single();
        
        if (error) throw error;
        return { type: 'existing', data };
      }
      
      // Se tem planoId, buscar dados do plano para nova proposta
      if (planoId) {
        const { data, error } = await supabase
          .from('planos')
          .select('*')
          .eq('id', planoId)
          .single();
        
        if (error) throw error;
        return { type: 'plan', data };
      }
      
      return null;
    },
    enabled: !!(proposalId || planoId),
  });
};
