
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
      // Log para verificar as 4 colunas de score existentes
      if (data && data.length > 0) {
        console.log('📊 Primeiro diagnóstico - scores:', {
          marketing: data[0].score_marketing,
          vendas: data[0].score_vendas,
          estrategia: data[0].score_estrategia,
          gestao: data[0].score_gestao
        });
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

// Update Empresa
export const useUpdateEmpresa = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, empresaData }: { id: string; empresaData: any }) => {
      console.log('🔄 Atualizando empresa:', id, empresaData);
      const { data, error } = await supabase
        .from('empresas')
        .update(empresaData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao atualizar empresa:', error);
        throw error;
      }
      
      console.log('✅ Empresa atualizada:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      queryClient.invalidateQueries({ queryKey: ['diagnosticos'] });
    }
  });
};

// Save Diagnostico
export const useSaveDiagnostico = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (diagnosticoData: any) => {
      console.log('💾 Salvando diagnóstico:', diagnosticoData);
      
      // Garantir que apenas as 4 colunas existentes sejam enviadas
      const cleanedData = {
        empresa_id: diagnosticoData.empresa_id,
        score_total: diagnosticoData.score_total,
        score_marketing: diagnosticoData.score_marketing,
        score_vendas: diagnosticoData.score_vendas,
        score_estrategia: diagnosticoData.score_estrategia,
        score_gestao: diagnosticoData.score_gestao,
        nivel: diagnosticoData.nivel,
        pontos_fortes: diagnosticoData.pontos_fortes,
        pontos_atencao: diagnosticoData.pontos_atencao,
        recomendacoes: diagnosticoData.recomendacoes,
        planos: diagnosticoData.planos,
        valores: diagnosticoData.valores,
        observacoes: diagnosticoData.observacoes,
        status: diagnosticoData.status
      };
      
      console.log('💾 Dados limpos para salvar:', cleanedData);
      
      const { data, error } = await supabase
        .from('diagnosticos')
        .insert(cleanedData)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao salvar diagnóstico:', error);
        console.error('📊 Dados que causaram erro:', cleanedData);
        throw error;
      }
      
      console.log('✅ Diagnóstico salvo:', data);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnosticos'] });
    }
  });
};

// Update Diagnostico
export const useUpdateDiagnostico = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, diagnosticoData }: { id: string; diagnosticoData: any }) => {
      console.log('🔄 Atualizando diagnóstico:', id, diagnosticoData);
      
      // Garantir que apenas as 4 colunas existentes sejam enviadas
      const cleanedData = {
        score_total: diagnosticoData.score_total,
        score_marketing: diagnosticoData.score_marketing,
        score_vendas: diagnosticoData.score_vendas,
        score_estrategia: diagnosticoData.score_estrategia,
        score_gestao: diagnosticoData.score_gestao,
        nivel: diagnosticoData.nivel,
        pontos_fortes: diagnosticoData.pontos_fortes,
        pontos_atencao: diagnosticoData.pontos_atencao,
        recomendacoes: diagnosticoData.recomendacoes,
        planos: diagnosticoData.planos,
        valores: diagnosticoData.valores,
        observacoes: diagnosticoData.observacoes,
        status: diagnosticoData.status
      };
      
      console.log('🔄 Dados limpos para atualizar:', cleanedData);
      
      const { data, error } = await supabase
        .from('diagnosticos')
        .update(cleanedData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao atualizar diagnóstico:', error);
        throw error;
      }
      
      console.log('✅ Diagnóstico atualizado:', data);
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

// Update Respostas (deletar antigas e inserir novas)
export const useUpdateRespostas = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ diagnosticoId, respostasData }: { diagnosticoId: string; respostasData: any[] }) => {
      console.log('🔄 Atualizando respostas para diagnóstico:', diagnosticoId);
      
      // Primeiro, deletar respostas antigas
      const { error: deleteError } = await supabase
        .from('respostas')
        .delete()
        .eq('diagnostico_id', diagnosticoId);
      
      if (deleteError) {
        console.error('❌ Erro ao deletar respostas antigas:', deleteError);
        throw deleteError;
      }
      
      console.log('🗑️ Respostas antigas deletadas');
      
      // Inserir novas respostas
      if (respostasData.length > 0) {
        const { data, error } = await supabase
          .from('respostas')
          .insert(respostasData)
          .select();
        
        if (error) {
          console.error('❌ Erro ao inserir novas respostas:', error);
          throw error;
        }
        
        console.log('✅ Novas respostas inseridas:', data?.length || 0);
        return data;
      }
      
      return [];
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
