
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface EmpresaConsolidada {
  id: string;
  nome: string;
  cliente_nome?: string;
  cliente_email?: string;
  cliente_telefone?: string;
  created_at: string;
  totalCheckups: number;
  scoreGeral: number;
  roiMedio: number;
  faturamentoMedio: number;
  acoesConcluidasTotal: number;
  ultimoCheckup: string;
  status: 'ativo' | 'inativo';
}

interface EmpresaFilters {
  empresaId: string;
  mes: string;
  scoreMinimo: string;
  scoreMaximo: string;
  roiMinimo: string;
  roiMaximo: string;
  status: string;
}

export const useEmpresasConsolidadas = () => {
  const [filters, setFilters] = useState<EmpresaFilters>({
    empresaId: 'all',
    mes: '',
    scoreMinimo: '',
    scoreMaximo: '',
    roiMinimo: '',
    roiMaximo: '',
    status: 'todos'
  });

  const [appliedFilters, setAppliedFilters] = useState<EmpresaFilters>({
    empresaId: 'all',
    mes: '',
    scoreMinimo: '',
    scoreMaximo: '',
    roiMinimo: '',
    roiMaximo: '',
    status: 'todos'
  });

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
      const empresasConsolidadas: EmpresaConsolidada[] = data
        .filter(empresa => empresa.acompanhamentos && empresa.acompanhamentos.length > 0)
        .map(empresa => {
          const acompanhamentos = empresa.acompanhamentos || [];
          
          // Calcular métricas consolidadas
          const totalCheckups = acompanhamentos.length;
          const scoreGeral = Math.round(
            acompanhamentos.reduce((sum, acomp) => sum + (acomp.score_geral || 0), 0) / totalCheckups
          );
          const roiMedio = Number((
            acompanhamentos
              .filter(acomp => acomp.roi)
              .reduce((sum, acomp) => sum + (acomp.roi || 0), 0) / 
            acompanhamentos.filter(acomp => acomp.roi).length || 0
          ).toFixed(2));
          const faturamentoMedio = 
            acompanhamentos
              .filter(acomp => acomp.faturamento)
              .reduce((sum, acomp) => sum + (Number(acomp.faturamento) || 0), 0) / 
            acompanhamentos.filter(acomp => acomp.faturamento).length || 0;

          // Contar ações concluídas
          const acoesConcluidasTotal = acompanhamentos.reduce((total, acomp) => {
            if (!acomp.acoes) return total;
            
            let parsedAcoes = acomp.acoes;
            if (typeof acomp.acoes === 'string') {
              try {
                parsedAcoes = JSON.parse(acomp.acoes);
              } catch {
                return total;
              }
            }
            
            if (!Array.isArray(parsedAcoes)) return total;
            
            return total + parsedAcoes.filter(acao => acao && acao.status === 'concluido').length;
          }, 0);

          // Último check-up
          const ultimoCheckup = acompanhamentos
            .sort((a, b) => new Date(b.mes).getTime() - new Date(a.mes).getTime())[0]?.mes || '';

          // Status baseado no último check-up (se foi nos últimos 2 meses)
          const agora = new Date();
          const ultimaData = new Date(ultimoCheckup);
          const diffMeses = (agora.getFullYear() - ultimaData.getFullYear()) * 12 + 
                           (agora.getMonth() - ultimaData.getMonth());
          const status: 'ativo' | 'inativo' = diffMeses <= 2 ? 'ativo' : 'inativo';

          return {
            id: empresa.id,
            nome: empresa.nome,
            cliente_nome: empresa.cliente_nome,
            cliente_email: empresa.cliente_email,
            cliente_telefone: empresa.cliente_telefone,
            created_at: empresa.created_at,
            totalCheckups,
            scoreGeral,
            roiMedio,
            faturamentoMedio,
            acoesConcluidasTotal,
            ultimoCheckup,
            status
          };
        });

      return empresasConsolidadas;
    }
  });

  // Aplicar filtros
  const empresasFiltradas = useMemo(() => {
    if (!empresasComAcompanhamentos || empresasComAcompanhamentos.length === 0) {
      return [];
    }

    return empresasComAcompanhamentos.filter(empresa => {
      try {
        // Filtro por empresa específica
        if (appliedFilters.empresaId && appliedFilters.empresaId !== 'all' && empresa.id !== appliedFilters.empresaId) {
          return false;
        }

        // Filtro por mês (último check-up)
        if (appliedFilters.mes) {
          const mesUltimoCheckup = new Date(empresa.ultimoCheckup).toISOString().slice(0, 7);
          if (mesUltimoCheckup !== appliedFilters.mes) return false;
        }

        // Filtro por score mínimo
        if (appliedFilters.scoreMinimo && empresa.scoreGeral < parseInt(appliedFilters.scoreMinimo)) {
          return false;
        }

        // Filtro por score máximo
        if (appliedFilters.scoreMaximo && empresa.scoreGeral > parseInt(appliedFilters.scoreMaximo)) {
          return false;
        }

        // Filtro por ROI mínimo
        if (appliedFilters.roiMinimo && empresa.roiMedio < parseFloat(appliedFilters.roiMinimo)) {
          return false;
        }

        // Filtro por ROI máximo
        if (appliedFilters.roiMaximo && empresa.roiMedio > parseFloat(appliedFilters.roiMaximo)) {
          return false;
        }

        // Filtro por status
        if (appliedFilters.status !== 'todos') {
          if (appliedFilters.status === 'ativo' && empresa.status !== 'ativo') return false;
          if (appliedFilters.status === 'inativo' && empresa.status !== 'inativo') return false;
        }

        return true;
      } catch (error) {
        console.error('Erro ao filtrar empresa:', error);
        return true;
      }
    });
  }, [empresasComAcompanhamentos, appliedFilters]);

  const applyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const clearFilters = () => {
    const emptyFilters = {
      empresaId: 'all',
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
