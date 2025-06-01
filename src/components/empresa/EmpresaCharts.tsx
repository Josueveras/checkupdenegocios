
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, BarChart3 } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart as RechartsLineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { formatDateShort } from '@/utils/formatters';

interface CheckupData {
  mes: string | Date;
  score_geral?: number;
  faturamento?: number | string;
}

interface EmpresaChartsProps {
  checkupsEmpresa: CheckupData[];
}

export const EmpresaCharts = ({ checkupsEmpresa }: EmpresaChartsProps) => {
  const dadosGraficoScore = checkupsEmpresa?.map(checkup => ({
    mes: formatDateShort(checkup.mes),
    score: checkup.score_geral
  })) || [];

  const dadosGraficoFaturamento = checkupsEmpresa?.map(checkup => ({
    mes: formatDateShort(checkup.mes),
    faturamento: checkup.faturamento || 0
  })) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-petrol" />
            📈 Evolução do Score Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ score: { label: "Score", color: "#0F3244" } }} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={dadosGraficoScore}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="score" stroke="var(--color-score)" strokeWidth={2} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-petrol" />
            💰 Faturamento Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ faturamento: { label: "Faturamento", color: "#3C9CD6" } }} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={dadosGraficoFaturamento}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="faturamento" fill="var(--color-faturamento)" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
