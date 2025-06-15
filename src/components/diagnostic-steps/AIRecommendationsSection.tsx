
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Clock, DollarSign, Target, Lightbulb } from 'lucide-react';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';

interface AIRecommendationsSectionProps {
  diagnosticData: {
    companyName: string;
    sector: string;
    employees: string;
    revenue: string;
    overallScore: number;
    level: string;
    categoryScores: {[key: string]: number};
    strongPoints: string[];
    attentionPoints: string[];
  };
}

export const AIRecommendationsSection = ({ diagnosticData }: AIRecommendationsSectionProps) => {
  const { recommendations, generateRecommendations, isGenerating, clearRecommendations } = useAIRecommendations();

  const handleGenerateRecommendations = () => {
    generateRecommendations(diagnosticData);
  };

  if (!recommendations) {
    return (
      <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-blue-800">
            <Sparkles className="h-6 w-6" />
            Recomendações Inteligentes com IA
          </CardTitle>
          <p className="text-gray-600">
            Gere recomendações personalizadas e específicas para sua empresa usando inteligência artificial
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            onClick={handleGenerateRecommendations}
            disabled={isGenerating}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
            size="lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {isGenerating ? 'Gerando recomendações...' : 'Gerar Recomendações com IA'}
          </Button>
          {isGenerating && (
            <p className="text-sm text-gray-500 mt-2">
              Analisando seus dados e gerando recomendações personalizadas...
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Sparkles className="h-6 w-6" />
              Recomendações Personalizadas com IA
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateRecommendations}
                disabled={isGenerating}
              >
                {isGenerating ? 'Regenerando...' : 'Regenerar'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearRecommendations}
              >
                Ocultar
              </Button>
            </div>
          </div>
          <Badge variant="secondary" className="w-fit">
            Gerado por Inteligência Artificial
          </Badge>
        </CardHeader>
      </Card>

      {/* Ações Prioritárias */}
      {recommendations.priorityActions && recommendations.priorityActions.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Target className="h-5 w-5" />
              Ações Prioritárias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.priorityActions.map((action, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Badge variant="destructive" className="mt-1 text-xs">
                    {index + 1}
                  </Badge>
                  <span className="text-red-700">{action}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recomendações por Categoria */}
      {recommendations.recommendations && Object.keys(recommendations.recommendations).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Recomendações por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(recommendations.recommendations).map(([category, recs]) => (
              <div key={category}>
                <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Badge variant="outline">{category}</Badge>
                </h5>
                <ul className="space-y-1 ml-4">
                  {(recs as string[]).map((rec, index) => (
                    <li key={index} className="text-gray-700 flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Informações Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.nextSteps && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4" />
                Próximos Passos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{recommendations.nextSteps}</p>
            </CardContent>
          </Card>
        )}

        {recommendations.estimatedTimeframe && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Prazo Estimado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{recommendations.estimatedTimeframe}</p>
            </CardContent>
          </Card>
        )}

        {recommendations.estimatedInvestment && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Investimento Estimado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{recommendations.estimatedInvestment}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
