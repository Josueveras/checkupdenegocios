
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { formatPercentage } from '@/utils/formatters';

interface MetricasDerivadas {
  variacaoScore: number;
  variacaoROI: number;
  checkupsSemAcao: number;
  tempoInativo: number;
  mediaAcoesPorMes: number;
}

interface EmpresaStrategicAnalysisProps {
  metricasDerivadas: MetricasDerivadas;
}

export const EmpresaStrategicAnalysis = ({ metricasDerivadas }: EmpresaStrategicAnalysisProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Análise Estratégica
        </CardTitle>
        <CardDescription>
          Sinais extraídos automaticamente da jornada da empresa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">
                Variação de Score
              </CardTitle>
              <div className="text-2xl">📊</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatPercentage(metricasDerivadas.variacaoScore)}</div>
              <p className="text-xs text-blue-600 mt-1">
                Crescimento total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800">
                Variação de ROI
              </CardTitle>
              <div className="text-2xl">💰</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{formatPercentage(metricasDerivadas.variacaoROI)}</div>
              <p className="text-xs text-yellow-600 mt-1">
                Evolução do retorno
              </p>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800">
                Check-ups sem ação
              </CardTitle>
              <div className="text-2xl">⚠️</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{metricasDerivadas.checkupsSemAcao}</div>
              <p className="text-xs text-red-600 mt-1">
                Meses sem implementação
              </p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">
                Tempo Inativo
              </CardTitle>
              <div className="text-2xl">⏰</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{metricasDerivadas.tempoInativo}</div>
              <p className="text-xs text-orange-600 mt-1">
                Dias desde último check-up
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">
                Ações por mês
              </CardTitle>
              <div className="text-2xl">📈</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metricasDerivadas.mediaAcoesPorMes}</div>
              <p className="text-xs text-green-600 mt-1">
                Média de implementações
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
