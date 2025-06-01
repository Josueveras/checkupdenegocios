
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, BarChart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DiagnosticComparisonProps {
  selectedDiagnostics: string[];
}

const DiagnosticComparison = ({ selectedDiagnostics }: DiagnosticComparisonProps) => {
  const mockDiagnosticHistory = [
    {
      id: '1',
      date: '2024-01-15',
      type: 'Diagnóstico Completo',
      overallScore: 78,
      categoryScores: {
        Marketing: 85,
        Vendas: 70,
        Estratégia: 75,
        Gestão: 82
      }
    },
    {
      id: '2',
      date: '2023-10-20',
      type: 'Diagnóstico Inicial',
      overallScore: 65,
      categoryScores: {
        Marketing: 60,
        Vendas: 55,
        Estratégia: 70,
        Gestão: 75
      }
    },
    {
      id: '3',
      date: '2023-07-10',
      type: 'Avaliação Básica',
      overallScore: 52,
      categoryScores: {
        Marketing: 45,
        Vendas: 50,
        Estratégia: 60,
        Gestão: 55
      }
    }
  ];

  const getScoreVariation = (current: number, previous: number) => {
    const diff = current - previous;
    if (diff > 0) return { icon: TrendingUp, color: 'text-green-600', text: `+${diff}%`, bg: 'bg-green-50' };
    if (diff < 0) return { icon: TrendingDown, color: 'text-red-600', text: `${diff}%`, bg: 'bg-red-50' };
    return { icon: Minus, color: 'text-gray-600', text: '0%', bg: 'bg-gray-50' };
  };

  const handleCompareSelected = () => {
    if (selectedDiagnostics.length !== 2) {
      toast({
        title: "Seleção incompleta",
        description: "Selecione exatamente 2 diagnósticos para comparar.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Comparativo gerado",
      description: "PDF de comparação foi gerado com sucesso!"
    });
  };

  if (selectedDiagnostics.length !== 2) return null;

  const diagnostic1 = mockDiagnosticHistory.find(d => d.id === selectedDiagnostics[0]);
  const diagnostic2 = mockDiagnosticHistory.find(d => d.id === selectedDiagnostics[1]);

  if (!diagnostic1 || !diagnostic2) return null;

  // Ensure we're comparing with the newer one first
  const [newer, older] = diagnostic1.date > diagnostic2.date ? [diagnostic1, diagnostic2] : [diagnostic2, diagnostic1];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-petrol" />
          Comparativo Detalhado
        </CardTitle>
        <CardDescription>
          Comparação entre {new Date(older.date).toLocaleDateString('pt-BR')} e {new Date(newer.date).toLocaleDateString('pt-BR')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score Comparison */}
        <div className="text-center">
          <h4 className="font-medium text-gray-900 mb-4">Score Geral</h4>
          <div className="flex justify-center items-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">{older.overallScore}%</div>
              <div className="text-sm text-gray-500">Anterior</div>
            </div>
            <div className="text-center">
              <div className="text-lg text-gray-400">→</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-petrol">{newer.overallScore}%</div>
              <div className="text-sm text-gray-500">Atual</div>
            </div>
          </div>
          <div className="mt-4">
            {(() => {
              const variation = getScoreVariation(newer.overallScore, older.overallScore);
              const VariationIcon = variation.icon;
              return (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${variation.bg}`}>
                  <VariationIcon className={`h-5 w-5 ${variation.color}`} />
                  <span className={`font-medium ${variation.color}`}>
                    Variação: {variation.text}
                  </span>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Category Comparison */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Comparação por Categoria</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(newer.categoryScores).map(category => {
              const olderScore = older.categoryScores[category as keyof typeof older.categoryScores];
              const newerScore = newer.categoryScores[category as keyof typeof newer.categoryScores];
              const variation = getScoreVariation(newerScore, olderScore);
              const VariationIcon = variation.icon;

              return (
                <div key={category} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">{category}</h5>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded ${variation.bg}`}>
                      <VariationIcon className={`h-3 w-3 ${variation.color}`} />
                      <span className={`text-xs ${variation.color}`}>{variation.text}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Anterior: {olderScore}%</span>
                      <span>Atual: {newerScore}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={Math.max(olderScore, newerScore)} className="h-3" />
                      <div 
                        className="absolute top-0 h-3 bg-gray-300 rounded-full opacity-50"
                        style={{ width: `${Math.min(olderScore, newerScore)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          <Button 
            onClick={handleCompareSelected}
            className="bg-petrol hover:bg-petrol/90 text-white"
          >
            📄 Gerar PDF Comparativo
          </Button>
          <Button variant="outline">
            📤 Enviar por WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiagnosticComparison;
