
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Hook para propostas de planos (empresa_id não nulo e diagnostico_id nulo)
export const usePropostasPlanos = () => {
  return useQuery({
    queryKey: ['propostas-planos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('propostas')
        .select(`
          *,
          empresas!propostas_empresa_id_fkey (
            nome,
            cliente_nome,
            cliente_email,
            cliente_telefone
          )
        `)
        .is('diagnostico_id', null)
        .not('empresa_id', 'is', null)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
};
