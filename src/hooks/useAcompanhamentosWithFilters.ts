
import { useState, useMemo } from 'react';
import { useAllAcompanhamentos } from '@/hooks/useAcompanhamentos';

interface AcompanhamentoFilters {
  searchTerm: string;
  mes: string;
  scoreMinimo: string;
  scoreMaximo: string;
  roiMinimo: string;
  roiMaximo: string;
  status: string;
}

export const useAcompanhamentosWithFilters = () => {
  const { data: acompanhamentos = [], isLoading, error } = useAllAcompanhamentos();
  
  const [filters, setFilters] = useState<AcompanhamentoFilters>({
    searchTerm: '',
    mes: '',
    scoreMinimo: '',
    scoreMaximo: '',
    roiMinimo: '',
    roiMaximo: '',
    status: 'todos'
  });

  const filteredAcompanhamentos = useMemo(() => {
    return acompanhamentos.filter(acomp => {
      const empresa = acomp.empresas;
      
      // Filtro por texto (empresa ou cliente)
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const nomeEmpresa = empresa?.nome?.toLowerCase() || '';
        const nomeCliente = empresa?.cliente_nome?.toLowerCase() || '';
        if (!nomeEmpresa.includes(searchLower) && !nomeCliente.includes(searchLower)) {
          return false;
        }
      }

      // Filtro por mês
      if (filters.mes) {
        const mesAcomp = new Date(acomp.mes).toISOString().slice(0, 7);
        if (mesAcomp !== filters.mes) return false;
      }

      // Filtro por score mínimo
      if (filters.scoreMinimo && acomp.score_geral < parseInt(filters.scoreMinimo)) {
        return false;
      }

      // Filtro por score máximo
      if (filters.scoreMaximo && acomp.score_geral > parseInt(filters.scoreMaximo)) {
        return false;
      }

      // Filtro por ROI mínimo
      if (filters.roiMinimo && (!acomp.roi || acomp.roi < parseFloat(filters.roiMinimo))) {
        return false;
      }

      // Filtro por ROI máximo
      if (filters.roiMaximo && (!acomp.roi || acomp.roi > parseFloat(filters.roiMaximo))) {
        return false;
      }

      // Filtro por status
      if (filters.status !== 'todos') {
        if (filters.status === 'case' && !acomp.virou_case) return false;
        if (filters.status === 'ativo' && acomp.virou_case) return false;
      }

      return true;
    });
  }, [acompanhamentos, filters]);

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      mes: '',
      scoreMinimo: '',
      scoreMaximo: '',
      roiMinimo: '',
      roiMaximo: '',
      status: 'todos'
    });
  };

  return {
    acompanhamentos: filteredAcompanhamentos,
    allAcompanhamentos: acompanhamentos,
    isLoading,
    error,
    filters,
    setFilters,
    clearFilters
  };
};
