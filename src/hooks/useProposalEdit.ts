
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProposalEdit = (proposalId: string | null) => {
  return useQuery({
    queryKey: ['proposal', proposalId],
    queryFn: async () => {
      if (!proposalId) return null;
      
      const { data, error } = await supabase
        .from('propostas')
        .select(`
          *,
          diagnosticos!propostas_diagnostico_id_fkey (
            *,
            empresas!diagnosticos_empresa_id_fkey (*)
          )
        `)
        .eq('id', proposalId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!proposalId,
  });
};
