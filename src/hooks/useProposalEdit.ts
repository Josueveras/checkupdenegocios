
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProposalEdit = (proposalId: string | null, planoId: string | null = null) => {
  return useQuery({
    queryKey: ['proposal', proposalId, 'plano', planoId],
    queryFn: async () => {
      // Se tem proposalId, buscar proposta existente
      if (proposalId) {
        const { data: proposta, error } = await supabase
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

        // Se a proposta não tem diagnóstico, buscar empresa diretamente
        if (proposta && !proposta.diagnostico_id && (proposta as any).empresa_id) {
          const { data: empresa, error: empresaError } = await supabase
            .from('empresas')
            .select('*')
            .eq('id', (proposta as any).empresa_id)
            .single();
          
          if (empresaError) throw empresaError;
          
          return { 
            type: 'existing', 
            data: { 
              ...proposta, 
              empresas: empresa 
            } 
          };
        }
        
        return { type: 'existing', data: proposta };
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
