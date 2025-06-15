
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Hook para propostas de planos (empresa_id não nulo e diagnostico_id nulo)
export const usePropostasPlanos = () => {
  return useQuery({
    queryKey: ['propostas-planos'],
    queryFn: async () => {
      // Primeiro buscar as propostas de planos
      const { data: propostas, error: propostasError } = await supabase
        .from('propostas')
        .select('*')
        .is('diagnostico_id', null)
        .not('empresa_id', 'is', null)
        .order('created_at', { ascending: false });
      
      if (propostasError) throw propostasError;
      if (!propostas || propostas.length === 0) return [];

      // Buscar todas as empresas relacionadas
      const empresaIds = propostas.map(p => (p as any).empresa_id).filter(Boolean);
      
      if (empresaIds.length === 0) return propostas;

      const { data: empresas, error: empresasError } = await supabase
        .from('empresas')
        .select('id, nome, cliente_nome, cliente_email, cliente_telefone')
        .in('id', empresaIds);
      
      if (empresasError) throw empresasError;

      // Combinar propostas com empresas
      const propostasComEmpresas = propostas.map(proposta => {
        const empresa = empresas?.find(e => e.id === (proposta as any).empresa_id);
        return {
          ...proposta,
          empresas: empresa || null
        };
      });

      return propostasComEmpresas;
    }
  });
};
