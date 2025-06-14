
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart } from 'lucide-react';

interface LevelDistributionProps {
  distribuicaoNivel: {
    'Avançado': number;
    'Intermediário': number;
    'Emergente': number;
    'Iniciante': number;
  };
}

export const LevelDistribution = ({ distribuicaoNivel }: LevelDistributionProps) => {
  const totalParaDistribuicao = Object.values(distribuicaoNivel).reduce((sum, count) => sum + count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-petrol" />
          Distribuição por Nível
        </CardTitle>
        <CardDescription>
          Classificação das empresas diagnosticadas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {totalParaDistribuicao === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Sem dados para exibir</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Avançado</span>
                <span>{Math.round((distribuicaoNivel.Avançado / totalParaDistribuicao) * 100)}%</span>
              </div>
              <Progress value={(distribuicaoNivel.Avançado / totalParaDistribuicao) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Intermediário</span>
                <span>{Math.round((distribuicaoNivel.Intermediário / totalParaDistribuicao) * 100)}%</span>
              </div>
              <Progress value={(distribuicaoNivel.Intermediário / totalParaDistribuicao) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Emergente</span>
                <span>{Math.round((distribuicaoNivel.Emergente / totalParaDistribuicao) * 100)}%</span>
              </div>
              <Progress value={(distribuicaoNivel.Emergente / totalParaDistribuicao) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Iniciante</span>
                <span>{Math.round((distribuicaoNivel.Iniciante / totalParaDistribuicao) * 100)}%</span>
              </div>
              <Progress value={(distribuicaoNivel.Iniciante / totalParaDistribuicao) * 100} className="h-2" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
