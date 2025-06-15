
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, FileText } from 'lucide-react';

interface DashboardStatsProps {
  totalDiagnosticos: number;
  scoreMedia: number;
}

export const DashboardStats = ({
  totalDiagnosticos,
  scoreMedia
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-l-4 border-l-petrol">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total de Diagnósticos
          </CardTitle>
          <FileText className="h-4 w-4 text-petrol" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{totalDiagnosticos}</div>
          <p className="text-xs text-gray-500 mt-1">
            {totalDiagnosticos === 0 ? 'Nenhum diagnóstico realizado' : 'Diagnósticos realizados'}
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-light">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Score Médio
          </CardTitle>
          <BarChart className="h-4 w-4 text-blue-light" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{scoreMedia}%</div>
          <p className="text-xs text-gray-500 mt-1">
            {totalDiagnosticos === 0 ? 'Sem dados disponíveis' : 'Score médio geral'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
