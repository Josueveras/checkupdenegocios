
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Diagnosticos
export const useDiagnosticos = () => {
  return useQuery({
    queryKey: ['diagnosticos'],
    queryFn: async () => {
      console.log('🔍 Buscando diagnósticos...');
      const { data, error } = await supabase
        .from('diagnosticos')
        .select(`
          *,
          empresas!diagnosticos_empresa_id_fkey (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Erro ao buscar diagnósticos:', error);
        throw error;
      }
      
      console.log('✅ Diagnósticos encontrados:', data?.length || 0);
      // Log para verificar se scores_por_categoria está sendo retornado
      if (data && data.length > 0) {
        console.log('📊 Primeiro diagnóstico - scores_por_categoria:', data[0].scores_por_categoria);
      }
      
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

// Save Empresa
export const useSaveEmpresa = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (empresaData: any) => {
      console.log('💾 Salvando empresa:', empresaData);
      const { data, error } = await supabase
        .from('empresas')
        .insert(empresaData)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao salvar empresa:', error);
        throw error;
      }
      
      console.log('✅ Empresa salva:', data);
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
      console.log('💾 Salvando diagnóstico:', diagnosticoData);
      console.log('📊 Verificando scores_por_categoria:', diagnosticoData.scores_por_categoria);
      
      const { data, error } = await supabase
        .from('diagnosticos')
        .insert(diagnosticoData)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao salvar diagnóstico:', error);
        console.error('📊 Dados que causaram erro:', diagnosticoData);
        throw error;
      }
      
      console.log('✅ Diagnóstico salvo:', data);
      console.log('📊 Verificando se scores_por_categoria foi salvo:', data.scores_por_categoria);
      
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
      console.log('💾 Salvando respostas:', respostasData.length, 'respostas');
      const { data, error } = await supabase
        .from('respostas')
        .insert(respostasData)
        .select();
      
      if (error) {
        console.error('❌ Erro ao salvar respostas:', error);
        throw error;
      }
      
      console.log('✅ Respostas salvas:', data?.length || 0);
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
