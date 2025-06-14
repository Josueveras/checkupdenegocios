
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BackButton } from '@/components/ui/back-button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowUp, ArrowDown } from 'lucide-react';

// Componentes refatorados
import { ClientIdentificationCard } from '@/components/evolucao/ClientIdentificationCard';
import { EvolutionCharts } from '@/components/evolucao/EvolutionCharts';
import { FilterPanel } from '@/components/evolucao/FilterPanel';
import { MonthlyEvolutionCards } from '@/components/evolucao/MonthlyEvolutionCards';
import { RecommendationsSection } from '@/components/evolucao/RecommendationsSection';
import { StrategicSummary } from '@/components/evolucao/StrategicSummary';
import { ActionButtons } from '@/components/evolucao/ActionButtons';

const EvolucaoCliente = () => {
  const { id } = useParams<{ id: string }>();
  const [filters, setFilters] = useState({
    mes: '',
    scoreMinimo: '',
    faturamentoMinimo: '',
    roiMinimo: '',
    palavraChave: ''
  });

  // Buscar dados da empresa
  const { data: empresa, isLoading: loadingEmpresa } = useQuery({
    queryKey: ['empresa', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  // Buscar acompanhamentos da empresa
  const { data: acompanhamentos, isLoading: loadingAcompanhamentos } = useQuery({
    queryKey: ['acompanhamentos-empresa', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('acompanhamentos')
        .select('*')
        .eq('empresa_id', id)
        .order('mes', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!id
  });

  // Buscar diagnóstico inicial
  const { data: diagnosticoInicial } = useQuery({
    queryKey: ['diagnostico-inicial', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('diagnosticos')
        .select('*')
        .eq('empresa_id', id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();
      
      if (error) return null;
      return data;
    },
    enabled: !!id
  });

  // Funções utilitárias
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string | Date) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'MMMM/yyyy', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  const getAcoesConcluidasCount = (acoes: any) => {
    if (!acoes) return 0;
    
    let parsedAcoes = acoes;
    if (typeof acoes === 'string') {
      try {
        parsedAcoes = JSON.parse(acoes);
      } catch {
        return 0;
      }
    }
    
    if (!Array.isArray(parsedAcoes)) return 0;
    
    return parsedAcoes.filter(acao => acao && acao.status === 'concluido').length;
  };

  const getVariacaoScore = (atual: number, anterior: number) => {
    const variacao = atual - anterior;
    return {
      valor: variacao,
      tipo: variacao > 0 ? 'positiva' : variacao < 0 ? 'negativa' : 'neutra',
      icone: variacao > 0 ? ArrowUp : variacao < 0 ? ArrowDown : null
    };
  };

  // Filtrar acompanhamentos
  const acompanhamentosFiltrados = acompanhamentos?.filter(acomp => {
    if (filters.mes && !formatDate(acomp.mes).toLowerCase().includes(filters.mes.toLowerCase())) return false;
    if (filters.scoreMinimo && acomp.score_geral < parseInt(filters.scoreMinimo)) return false;
    if (filters.faturamentoMinimo && (!acomp.faturamento || acomp.faturamento < parseFloat(filters.faturamentoMinimo))) return false;
    if (filters.roiMinimo && (!acomp.roi || acomp.roi < parseFloat(filters.roiMinimo))) return false;
    if (filters.palavraChave) {
      const palavra = filters.palavraChave.toLowerCase();
      const destaque = acomp.destaque?.toLowerCase() || '';
      const observacoes = acomp.observacoes?.toLowerCase() || '';
      if (!destaque.includes(palavra) && !observacoes.includes(palavra)) return false;
    }
    return true;
  }) || [];

  // Preparar dados para gráficos
  const dadosGrafico = acompanhamentos?.map(acomp => ({
    mes: formatDate(acomp.mes),
    score: acomp.score_geral,
    faturamento: acomp.faturamento || 0,
    roi: acomp.roi || 0
  })) || [];

  const clearFilters = () => {
    setFilters({
      mes: '',
      scoreMinimo: '',
      faturamentoMinimo: '',
      roiMinimo: '',
      palavraChave: ''
    });
  };

  if (loadingEmpresa || loadingAcompanhamentos) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petrol mx-auto mb-4"></div>
          <p>Carregando evolução do cliente...</p>
        </div>
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Cliente não encontrado</h2>
        <BackButton fallbackRoute="/acompanhamento" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Evolução do Cliente</h1>
          <p className="text-gray-600 mt-1">Acompanhamento detalhado da evolução empresarial</p>
        </div>
        <BackButton fallbackRoute="/acompanhamento" />
      </div>

      {/* Componentes refatorados */}
      <ClientIdentificationCard empresa={empresa} />
      
      <EvolutionCharts dadosGrafico={dadosGrafico} />
      
      <FilterPanel 
        filters={filters} 
        setFilters={setFilters} 
        clearFilters={clearFilters} 
      />
      
      <MonthlyEvolutionCards 
        acompanhamentosFiltrados={acompanhamentosFiltrados}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
        getAcoesConcluidasCount={getAcoesConcluidasCount}
        getVariacaoScore={getVariacaoScore}
      />
      
      <RecommendationsSection 
        acompanhamentos={acompanhamentos}
        formatDate={formatDate}
      />
      
      <StrategicSummary acompanhamentos={acompanhamentos} />
      
      <ActionButtons />
    </div>
  );
};

export default EvolucaoCliente;
