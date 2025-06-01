
import { useMemo } from 'react';
import { useAcompanhamentosWithFilters } from './useAcompanhamentosWithFilters';

interface EmpresaGroup {
  empresa: {
    id: string;
    nome: string;
    cliente_nome?: string;
  };
  acompanhamentos: any[];
  totalCheckups: number;
  scoreMediaGeral: number;
  status: 'ativo' | 'case' | 'inativo';
}

export const useAcompanhamentosGrouped = () => {
  const {
    acompanhamentos,
    allAcompanhamentos,
    isLoading,
    error,
    filters,
    setFilters,
    clearFilters
  } = useAcompanhamentosWithFilters();

  const groupedData = useMemo(() => {
    const groups: { [key: string]: EmpresaGroup } = {};

    acompanhamentos.forEach((acomp) => {
      const empresaId = acomp.empresa_id;
      const empresa = acomp.empresas;

      if (!groups[empresaId]) {
        groups[empresaId] = {
          empresa: {
            id: empresaId,
            nome: empresa?.nome || 'Empresa não encontrada',
            cliente_nome: empresa?.cliente_nome
          },
          acompanhamentos: [],
          totalCheckups: 0,
          scoreMediaGeral: 0,
          status: 'ativo'
        };
      }

      groups[empresaId].acompanhamentos.push(acomp);
    });

    // Calcular estatísticas para cada grupo
    Object.keys(groups).forEach((empresaId) => {
      const group = groups[empresaId];
      const totalAcompanhamentos = allAcompanhamentos.filter(
        a => a.empresa_id === empresaId
      );
      
      group.totalCheckups = totalAcompanhamentos.length;
      
      if (totalAcompanhamentos.length > 0) {
        const somaScores = totalAcompanhamentos.reduce(
          (sum, acomp) => sum + (acomp.score_geral || 0), 0
        );
        group.scoreMediaGeral = Math.round(somaScores / totalAcompanhamentos.length);
        
        // Determinar status baseado no último acompanhamento
        const ultimoAcomp = totalAcompanhamentos.sort(
          (a, b) => new Date(b.mes).getTime() - new Date(a.mes).getTime()
        )[0];
        
        group.status = ultimoAcomp?.virou_case ? 'case' : 'ativo';
      }
    });

    return Object.values(groups).sort((a, b) => a.empresa.nome.localeCompare(b.empresa.nome));
  }, [acompanhamentos, allAcompanhamentos]);

  return {
    groupedData,
    isLoading,
    error,
    filters,
    setFilters,
    clearFilters,
    totalEmpresas: groupedData.length,
    totalAcompanhamentos: acompanhamentos.length
  };
};
