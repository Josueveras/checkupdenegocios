
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BarChart, TrendingUp, Settings } from 'lucide-react';
import { formatPercentage, formatROI } from '@/utils/formatters';

interface MetricasDerivadas {
  acoesConcluidasTotal: number;
  variacaoScore: number;
  roiMedio: number;
}

interface EmpresaMetricCardsProps {
  totalCheckups: number;
  metricasDerivadas: MetricasDerivadas;
}

export const EmpresaMetricCards = ({ totalCheckups, metricasDerivadas }: EmpresaMetricCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-l-4 border-l-petrol">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Check-ups Realizados
          </CardTitle>
          <div className="text-2xl">📊</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{totalCheckups}</div>
          <p className="text-xs text-gray-500 mt-1">
            Check-ups registrados
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-light">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Crescimento do Score
          </CardTitle>
          <div className="text-2xl">📈</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {formatPercentage(metricasDerivadas.variacaoScore)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Desde o primeiro check-up
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-mustard">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            ROI Médio
          </CardTitle>
          <div className="text-2xl">🎯</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {formatROI(metricasDerivadas.roiMedio)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Retorno sobre investimento
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Ações Concluídas
          </CardTitle>
          <div className="text-2xl">⚙️</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {metricasDerivadas.acoesConcluidasTotal}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Estratégias finalizadas
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
