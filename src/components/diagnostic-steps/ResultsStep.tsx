
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DiagnosticResults {
  overallScore: number;
  level: string;
  categoryScores: {[key: string]: number};
  strongPoints: string[];
  attentionPoints: string[];
  recommendations: {[key: string]: string[]};
}

interface ResultsStepProps {
  results: DiagnosticResults;
}

export const ResultsStep = ({ results }: ResultsStepProps) => {
  return (
    <div className="space-y-6">
      {/* Score Geral */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Resultado do Diagnóstico</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-petrol to-blue-light text-white">
            <div>
              <div className="text-3xl font-bold">{results.overallScore}%</div>
              <div className="text-sm">{results.level}</div>
            </div>
          </div>
          <p className="text-gray-600">
            Sua empresa está no nível <strong>{results.level}</strong> de maturidade empresarial.
          </p>
        </CardContent>
      </Card>

      {/* Scores por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Scores por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(results.categoryScores).map(([category, score]) => (
            <div key={category} className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{category}</span>
                <span className="text-sm text-gray-600">{score}%</span>
              </div>
              <Progress value={score} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pontos Fortes e de Atenção */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">🎯 Pontos Fortes</CardTitle>
          </CardHeader>
          <CardContent>
            {results.strongPoints?.length > 0 ? (
              <ul className="space-y-2">
                {results.strongPoints.map((point: string) => (
                  <li key={point} className="text-green-700">✅ {point}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Continue trabalhando para desenvolver pontos fortes.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">⚠️ Pontos de Atenção</CardTitle>
          </CardHeader>
          <CardContent>
            {results.attentionPoints?.length > 0 ? (
              <ul className="space-y-2">
                {results.attentionPoints.map((point: string) => (
                  <li key={point} className="text-red-700">🔴 {point}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Parabéns! Nenhum ponto crítico identificado.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recomendações */}
      {results.recommendations && Object.keys(results.recommendations).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>💡 Recomendações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(results.recommendations).map(([category, recs]) => (
              <div key={category}>
                <h5 className="font-medium text-gray-900 mb-2">{category}</h5>
                <ul className="space-y-1 ml-4">
                  {(recs as string[]).map((rec, index) => (
                    <li key={index} className="text-gray-700">• {rec}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
