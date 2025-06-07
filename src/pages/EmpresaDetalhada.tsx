
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

import { 
  calculateScoreVariation, 
  calculateROIVariation, 
  calculateAverageScore, 
  calculateAverageROI, 
  calculateAverageRevenue,
  getTotalCompletedActions,
  getDaysSinceLastCheckup,
  getCheckupsWithoutActions,
  getAverageActionsPerMonth
} from '@/utils/calculations';

import { EmpresaHeader } from '@/components/empresa/EmpresaHeader';
import { EmpresaMetricCards } from '@/components/empresa/EmpresaMetricCards';
import { EmpresaCharts } from '@/components/empresa/EmpresaCharts';
import { EmpresaCheckupsTable } from '@/components/empresa/EmpresaCheckupsTable';
import { EmpresaStrategicAnalysis } from '@/components/empresa/EmpresaStrategicAnalysis';
import { EmpresaStrategicSummary } from '@/components/empresa/EmpresaStrategicSummary';

const EmpresaDetalhada = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: empresaSelecionada, isLoading: loadingEmpresa } = useQuery({
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

  const { data: checkupsEmpresa, isLoading: loadingCheckups } = useQuery({
    queryKey: ['checkups-empresa', id],
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

  const metricasDerivadas = {
    scoreMedio: calculateAverageScore(checkupsEmpresa || []),
    roiMedio: calculateAverageROI(checkupsEmpresa || []),
    faturamentoMedio: calculateAverageRevenue(checkupsEmpresa || []),
    variacaoScore: calculateScoreVariation(checkupsEmpresa || []),
    variacaoROI: calculateROIVariation(checkupsEmpresa || []),
    acoesConcluidasTotal: getTotalCompletedActions(checkupsEmpresa || []),
    tempoInativo: getDaysSinceLastCheckup(checkupsEmpresa || []),
    checkupsSemAcao: getCheckupsWithoutActions(checkupsEmpresa || []),
    mediaAcoesPorMes: getAverageActionsPerMonth(checkupsEmpresa || [])
  };

  const ultimoCheckup = checkupsEmpresa?.[checkupsEmpresa.length - 1];

  if (loadingEmpresa || loadingCheckups) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petrol mx-auto mb-4"></div>
          <p>Carregando dados da empresa...</p>
        </div>
      </div>
    );
  }

  if (!empresaSelecionada) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Empresa não encontrada</h2>
          <Button onClick={() => navigate('/acompanhamento')} className="bg-petrol hover:bg-petrol/90 text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Acompanhamento
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in px-4 md:px-6 py-6 max-w-6xl mx-auto">
      <EmpresaHeader empresaNome={empresaSelecionada.nome} />

      <EmpresaMetricCards 
        totalCheckups={checkupsEmpresa?.length || 0}
        metricasDerivadas={metricasDerivadas}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <EmpresaCharts checkupsEmpresa={checkupsEmpresa || []} />
      </div>

      <EmpresaCheckupsTable checkupsEmpresa={checkupsEmpresa || []} />

      <EmpresaStrategicAnalysis metricasDerivadas={metricasDerivadas} />

      {ultimoCheckup && (
        <EmpresaStrategicSummary ultimoCheckup={ultimoCheckup} />
      )}

      <div className="flex justify-center pt-4">
        <Button 
          onClick={() => navigate('/acompanhamento')} 
          className="bg-petrol hover:bg-petrol/90 text-white w-full sm:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          ⬅️ Voltar para Acompanhamento
        </Button>
      </div>
    </div>
  );
};

export default EmpresaDetalhada;
