
import { useState, useMemo } from 'react';
import { useAllAcompanhamentos } from '@/hooks/useAcompanhamentos';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AcompanhamentoFilters {
  empresaId: string;
  mes: string;
  scoreMinimo: string;
  scoreMaximo: string;
  roiMinimo: string;
  roiMaximo: string;
  status: string;
}

// Hook para buscar empresas que têm acompanhamentos
const useEmpresasComAcompanhamentos = () => {
  return useQuery({
    queryKey: ['empresas-com-acompanhamentos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select(`
          id,
          nome,
          cliente_nome,
          acompanhamentos!inner(id)
        `)
        .order('nome');
      
      if (error) {
        console.error('Erro ao buscar empresas:', error);
        return [];
      }
      return data || [];
    }
  });
};

export const useAcompanhamentosWithFilters = () => {
  const { data: acompanhamentos = [], isLoading, error } = useAllAcompanhamentos();
  const { data: empresasComAcompanhamentos = [] } = useEmpresasComAcompanhamentos();
  
  const [filters, setFilters] = useState<AcompanhamentoFilters>({
    empresaId: '',
    mes: '',
    scoreMinimo: '',
    scoreMaximo: '',
    roiMinimo: '',
    roiMaximo: '',
    status: 'todos'
  });

  const [appliedFilters, setAppliedFilters] = useState<AcompanhamentoFilters>({
    empresaId: '',
    mes: '',
    scoreMinimo: '',
    scoreMaximo: '',
    roiMinimo: '',
    roiMaximo: '',
    status: 'todos'
  });

  const filteredAcompanhamentos = useMemo(() => {
    if (!acompanhamentos || acompanhamentos.length === 0) {
      return [];
    }

    return acompanhamentos.filter(acomp => {
      try {
        // Filtro por empresa
        if (appliedFilters.empresaId && acomp.empresa_id !== appliedFilters.empresaId) {
          return false;
        }

        // Filtro por mês
        if (appliedFilters.mes) {
          const mesAcomp = new Date(acomp.mes).toISOString().slice(0, 7);
          if (mesAcomp !== appliedFilters.mes) return false;
        }

        // Filtro por score mínimo
        if (appliedFilters.scoreMinimo && acomp.score_geral < parseInt(appliedFilters.scoreMinimo)) {
          return false;
        }

        // Filtro por score máximo
        if (appliedFilters.scoreMaximo && acomp.score_geral > parseInt(appliedFilters.scoreMaximo)) {
          return false;
        }

        // Filtro por ROI mínimo
        if (appliedFilters.roiMinimo && (!acomp.roi || acomp.roi < parseFloat(appliedFilters.roiMinimo))) {
          return false;
        }

        // Filtro por ROI máximo
        if (appliedFilters.roiMaximo && (!acomp.roi || acomp.roi > parseFloat(appliedFilters.roiMaximo))) {
          return false;
        }

        // Filtro por status
        if (appliedFilters.status !== 'todos') {
          if (appliedFilters.status === 'case' && !acomp.virou_case) return false;
          if (appliedFilters.status === 'ativo' && acomp.virou_case) return false;
        }

        return true;
      } catch (error) {
        console.error('Erro ao filtrar acompanhamento:', error);
        return true;
      }
    });
  }, [acompanhamentos, appliedFilters]);

  const applyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const clearFilters = () => {
    const emptyFilters = {
      empresaId: '',
      mes: '',
      scoreMinimo: '',
      scoreMaximo: '',
      roiMinimo: '',
      roiMaximo: '',
      status: 'todos'
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  return {
    acompanhamentos: filteredAcompanhamentos,
    allAcompanhamentos: acompanhamentos,
    empresasComAcompanhamentos,
    isLoading,
    error,
    filters,
    setFilters,
    applyFilters,
    clearFilters
  };
};
