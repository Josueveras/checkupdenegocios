
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Diagnosticos
export const useDiagnosticos = () => {
  return useQuery({
    queryKey: ['diagnosticos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('diagnosticos')
        .select(`
          *,
          empresas (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
};

// Empresas
export const useEmpresas = () => {
  return useQuery({
    queryKey: ['empresas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      return data;
    }
  });
};

// Perguntas
export const usePerguntas = () => {
  return useQuery({
    queryKey: ['perguntas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('perguntas')
        .select('*')
        .order('categoria', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });
};

// Dashboard stats
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Buscar estatísticas básicas
      const [diagnosticosRes, empresasRes] = await Promise.all([
        supabase.from('diagnosticos').select('*', { count: 'exact' }),
        supabase.from('empresas').select('*', { count: 'exact' })
      ]);

      if (diagnosticosRes.error) throw diagnosticosRes.error;
      if (empresasRes.error) throw empresasRes.error;

      return {
        totalDiagnosticos: diagnosticosRes.count || 0,
        totalEmpresas: empresasRes.count || 0,
        diagnosticos: diagnosticosRes.data || [],
        empresas: empresasRes.data || []
      };
    }
  });
};
