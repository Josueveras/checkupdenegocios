
import { EmpresaConsolidada, EmpresaFilters } from '@/types/empresa';

export const applyEmpresaFilters = (
  empresas: EmpresaConsolidada[],
  filters: EmpresaFilters
): EmpresaConsolidada[] => {
  if (!empresas || empresas.length === 0) {
    return [];
  }

  return empresas.filter(empresa => {
    try {
      // Filtro por empresa específica
      if (filters.empresaId && filters.empresaId !== 'all' && empresa.id !== filters.empresaId) {
        return false;
      }

      // Filtro por mês (último check-up)
      if (filters.mes) {
        const mesUltimoCheckup = new Date(empresa.ultimoCheckup).toISOString().slice(0, 7);
        if (mesUltimoCheckup !== filters.mes) return false;
      }

      // Filtro por score mínimo
      if (filters.scoreMinimo && empresa.scoreGeral < parseInt(filters.scoreMinimo)) {
        return false;
      }

      // Filtro por score máximo
      if (filters.scoreMaximo && empresa.scoreGeral > parseInt(filters.scoreMaximo)) {
        return false;
      }

      // Filtro por ROI mínimo
      if (filters.roiMinimo && empresa.roiMedio < parseFloat(filters.roiMinimo)) {
        return false;
      }

      // Filtro por ROI máximo
      if (filters.roiMaximo && empresa.roiMedio > parseFloat(filters.roiMaximo)) {
        return false;
      }

      // Filtro por status
      if (filters.status !== 'todos') {
        if (filters.status === 'ativo' && empresa.status !== 'ativo') return false;
        if (filters.status === 'inativo' && empresa.status !== 'inativo') return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao filtrar empresa:', error);
      return true;
    }
  });
};

export const createEmptyFilters = (): EmpresaFilters => ({
  empresaId: 'all',
  mes: '',
  scoreMinimo: '',
  scoreMaximo: '',
  roiMinimo: '',
  roiMaximo: '',
  status: 'todos'
});
