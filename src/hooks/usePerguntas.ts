
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Perguntas
export const usePerguntas = () => {
  return useQuery({
    queryKey: ['perguntas'],
    queryFn: async () => {
      console.log('🔍 Buscando perguntas...');
      const { data, error } = await supabase
        .from('perguntas')
        .select('*')
        .order('categoria', { ascending: true });
      
      if (error) {
        console.error('❌ Erro ao buscar perguntas:', error);
        throw error;
      }
      
      console.log('✅ Perguntas encontradas:', data?.length || 0);
      
      // Log das categorias encontradas
      const categorias = [...new Set(data?.map(p => p.categoria) || [])];
      console.log('📂 Categorias encontradas:', categorias);
      
      return data;
    }
  });
};
