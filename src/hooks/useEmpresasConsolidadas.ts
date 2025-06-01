
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EmpresaConsolidada, EmpresaFilters, EmpresaRawData } from '@/types/empresa';
import { calculateConsolidatedMetrics } from '@/utils/empresaCalculations';
import { applyEmpresaFilters, createEmptyFilters } from '@/utils/empresaFilters';

export const useEmpresasConsolidadas = () => {
  const [filters, setFilters] = useState<EmpresaFilters>(createEmptyFilters());
  const [appliedFilters, setAppliedFilters] = useState<EmpresaFilters>(createEmptyFilters());

  // Buscar empresas com acompanhamentos
  const { data: empresasComAcompanhamentos = [], isLoading } = useQuery({
    queryKey: ['empresas-consolidadas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select(`
          id,
          nome,
          cliente_nome,
          cliente_email,
          cliente_telefone,
          created_at,
          acompanhamentos(
            id,
            mes,
            score_geral,
            roi,
            faturamento,
            acoes,
            created_at
          )
        `)
        .order('nome');
      
      if (error) {
        console.error('Erro ao buscar empresas:', error);
        return [];
      }

      // Processar dados consolidados
      const empresasConsolidadas: EmpresaConsolidada[] = (data as EmpresaRawData[])
        .filter(empresa => empresa.acompanhamentos && empresa.acompanhamentos.length > 0)
        .map(calculateConsolidatedMetrics);

      return empresasConsolidadas;
    }
  });

  // Aplicar filtros
  const empresasFiltradas = useMemo(() => {
    return applyEmpresaFilters(empresasComAcompanhamentos, appliedFilters);
  }, [empresasComAcompanhamentos, appliedFilters]);

  const applyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const clearFilters = () => {
    const emptyFilters = createEmptyFilters();
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  return {
    empresas: empresasFiltradas,
    allEmpresas: empresasComAcompanhamentos,
    empresasComAcompanhamentos, // Para o dropdown de filtros
    isLoading,
    filters,
    setFilters,
    applyFilters,
    clearFilters
  };
};
