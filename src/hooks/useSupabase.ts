
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Diagnosticos
export const useDiagnosticos = () => {
  return useQuery({
    queryKey: ['diagnosticos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('diagnosticos')
        .select(`
          *,
          empresas!diagnosticos_empresa_id_fkey (*)
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

// Save Empresa
export const useSaveEmpresa = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (empresaData: any) => {
      const { data, error } = await supabase
        .from('empresas')
        .insert(empresaData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
    }
  });
};

// Save Diagnostico
export const useSaveDiagnostico = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (diagnosticoData: any) => {
      const { data, error } = await supabase
        .from('diagnosticos')
        .insert(diagnosticoData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnosticos'] });
    }
  });
};

// Save Respostas
export const useSaveRespostas = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (respostasData: any[]) => {
      const { data, error } = await supabase
        .from('respostas')
        .insert(respostasData)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['respostas'] });
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
