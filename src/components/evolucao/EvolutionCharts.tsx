
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, BarChart3 } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart as RechartsLineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface EvolutionChartsProps {
  dadosGrafico: Array<{
    mes: string;
    score: number;
    faturamento: number;
    roi: number;
  }>;
}

export const EvolutionCharts = ({ dadosGrafico }: EvolutionChartsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Score Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-petrol" />
            Score Geral por Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ score: { label: "Score", color: "#0F3244" } }} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={dadosGrafico}>
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

      {/* ROI e Faturamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-petrol" />
            ROI e Faturamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ 
            faturamento: { label: "Faturamento", color: "#3C9CD6" },
            roi: { label: "ROI", color: "#0F3244" }
          }} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="faturamento" fill="var(--color-faturamento)" />
                <Bar dataKey="roi" fill="var(--color-roi)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
