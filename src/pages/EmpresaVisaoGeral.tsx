
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EmpresaHeader } from '@/components/empresa/EmpresaHeader';
import { EmpresaCharts } from '@/components/empresa/EmpresaCharts';
import { EmpresaCheckupsTable } from '@/components/empresa/EmpresaCheckupsTable';
import { EmpresaStrategicAnalysis } from '@/components/empresa/EmpresaStrategicAnalysis';
import { EmpresaStrategicSummary } from '@/components/empresa/EmpresaStrategicSummary';
import { calculateScoreVariation, calculateROIVariation, calculateAverageScore, calculateAverageROI, calculateAverageRevenue, getTotalCompletedActions, getDaysSinceLastCheckup, getCheckupsWithoutActions, getAverageActionsPerMonth } from '@/utils/calculations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const EmpresaVisaoGeral = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: empresaSelecionada } = useQuery({
    queryKey: ['empresa', id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await supabase.from('empresas').select('*').eq('id', id).single();
      return data;
    },
    enabled: !!id
  });

  const { data: checkupsEmpresa } = useQuery({
    queryKey: ['checkups-empresa', id],
    queryFn: async () => {
      if (!id) return [];
      const { data } = await supabase.from('acompanhamentos').select('*').eq('empresa_id', id).order('mes', { ascending: true });
      return data || [];
    },
    enabled: !!id
  });

  const metricas = {
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

  return (
    <div className="space-y-6 px-4 md:px-6 py-6 max-w-6xl mx-auto animate-fade-in">
      <EmpresaHeader empresaNome={empresaSelecionada?.nome || 'Empresa'} />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-petrol">
          <CardHeader>
            <CardTitle>Check-ups Realizados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{checkupsEmpresa?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Check-ups registrados</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-light">
          <CardHeader>
            <CardTitle>Crescimento do Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metricas.variacaoScore}%</p>
            <p className="text-sm text-muted-foreground">Desde o primeiro check-up</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-mustard">
          <CardHeader>
            <CardTitle>ROI Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metricas.roiMedio.toFixed(1)}x</p>
            <p className="text-sm text-muted-foreground">Retorno sobre investimento</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-600">
          <CardHeader>
            <CardTitle>Ações Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metricas.acoesConcluidasTotal}</p>
            <p className="text-sm text-muted-foreground">Estratégias finalizadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <EmpresaCharts checkupsEmpresa={checkupsEmpresa || []} />
      </div>

      {/* Tabela */}
      <EmpresaCheckupsTable checkupsEmpresa={checkupsEmpresa || []} />

      {/* Análises */}
      <EmpresaStrategicAnalysis metricasDerivadas={metricas} />

      {ultimoCheckup && (
        <EmpresaStrategicSummary ultimoCheckup={ultimoCheckup} />
      )}

      {/* Botão voltar */}
      <div className="flex justify-center pt-4">
        <Button onClick={() => navigate('/acompanhamento')} className="bg-petrol hover:bg-petrol/90 text-white w-full sm:w-auto">
          <ArrowLeft className="mr-2 h-4 w-4" />
          ⬅ Voltar para Acompanhamento
        </Button>
      </div>
    </div>
  );
};

export default EmpresaVisaoGeral;
