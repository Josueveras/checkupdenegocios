
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
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Target className="h-4 w-4 sm:h-5 sm:w-5 text-petrol flex-shrink-0" />
          🔍 Análise Estratégica
        </CardTitle>
        <CardDescription className="text-sm">
          Sinais extraídos automaticamente da jornada da empresa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-sm sm:text-base">Variação de Score</h4>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{formatPercentage(metricasDerivadas.variacaoScore)}</p>
            <p className="text-xs sm:text-sm text-gray-600">Crescimento total</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-sm sm:text-base">Variação de ROI</h4>
            <p className="text-xl sm:text-2xl font-bold text-yellow-600">{formatPercentage(metricasDerivadas.variacaoROI)}</p>
            <p className="text-xs sm:text-sm text-gray-600">Evolução do retorno</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-sm sm:text-base">Check-ups sem ação</h4>
            <p className="text-xl sm:text-2xl font-bold text-red-600">{metricasDerivadas.checkupsSemAcao}</p>
            <p className="text-xs sm:text-sm text-gray-600">Meses sem implementação</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-sm sm:text-base">Tempo Inativo</h4>
            <p className="text-xl sm:text-2xl font-bold text-orange-600">{metricasDerivadas.tempoInativo}</p>
            <p className="text-xs sm:text-sm text-gray-600">Dias desde último check-up</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-sm sm:text-base">Ações por mês</h4>
            <p className="text-xl sm:text-2xl font-bold text-green-600">{metricasDerivadas.mediaAcoesPorMes}</p>
            <p className="text-xs sm:text-sm text-gray-600">Média de implementações</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
