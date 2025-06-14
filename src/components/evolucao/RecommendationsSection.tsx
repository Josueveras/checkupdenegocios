
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface RecommendationsSectionProps {
  acompanhamentos: any[];
  formatDate: (date: string | Date) => string;
}

export const RecommendationsSection = ({ acompanhamentos, formatDate }: RecommendationsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-petrol" />
          Recomendações e Ações
        </CardTitle>
      </CardHeader>
      <CardContent>
        {acompanhamentos && acompanhamentos.length > 0 ? (
          <div className="space-y-4">
            {acompanhamentos.slice(-3).map((acomp) => (
              <div key={acomp.id} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">{formatDate(acomp.mes)}</h4>
                {acomp.recomendacoes && (
                  <div className="mb-3">
                    <span className="text-sm text-gray-600">Recomendações:</span>
                    <p className="text-sm mt-1">{acomp.recomendacoes}</p>
                  </div>
                )}
                {acomp.acoes && (
                  <div>
                    <span className="text-sm text-gray-600">Ações do Mês:</span>
                    <div className="mt-2 space-y-2">
                      {JSON.parse(String(acomp.acoes)).map((acao: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          {acao.status === 'concluido' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : acao.status === 'em_andamento' ? (
                            <Clock className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span>{acao.descricao || acao.titulo}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">Nenhuma recomendação ou ação registrada</p>
        )}
      </CardContent>
    </Card>
  );
};
