
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-l-4 border-l-petrol">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Check-ups Realizados</p>
              <p className="text-xl sm:text-2xl font-bold text-petrol mb-1">{totalCheckups}</p>
              <p className="text-xs text-gray-500">Check-ups registrados</p>
            </div>
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-petrol flex-shrink-0 ml-2" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-400">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Crescimento do Score</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">
                {formatPercentage(metricasDerivadas.variacaoScore)}
              </p>
              <p className="text-xs text-gray-500">Desde o primeiro check-up</p>
            </div>
            <BarChart className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0 ml-2" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">ROI Médio</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600 mb-1">
                {formatROI(metricasDerivadas.roiMedio)}
              </p>
              <p className="text-xs text-gray-500">Retorno sobre investimento</p>
            </div>
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 flex-shrink-0 ml-2" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Ações Concluídas</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600 mb-1">
                {metricasDerivadas.acoesConcluidasTotal}
              </p>
              <p className="text-xs text-gray-500">Estratégias finalizadas</p>
            </div>
            <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0 ml-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
