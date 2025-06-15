
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePlanos = () => {
  return useQuery({
    queryKey: ['planos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('planos')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to ensure servicos is always an array of strings
      return (data || []).map(plano => ({
        ...plano,
        servicos: Array.isArray(plano.tarefas) 
          ? plano.tarefas.map(t => String(t)) 
          : typeof plano.tarefas === 'string' 
          ? [plano.tarefas] 
          : []
      }));
    }
  });
};
