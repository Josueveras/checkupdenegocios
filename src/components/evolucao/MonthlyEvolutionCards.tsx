
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, ArrowUp, ArrowDown, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonthlyEvolutionCardsProps {
  acompanhamentosFiltrados: any[];
  formatDate: (date: string | Date) => string;
  formatCurrency: (value: number) => string;
  getAcoesConcluidasCount: (acoes: any) => number;
  getVariacaoScore: (atual: number, anterior: number) => any;
}

export const MonthlyEvolutionCards = ({ 
  acompanhamentosFiltrados, 
  formatDate, 
  formatCurrency, 
  getAcoesConcluidasCount, 
  getVariacaoScore 
}: MonthlyEvolutionCardsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-petrol" />
          Evolução Mensal - Cards Visuais
        </CardTitle>
        <CardDescription>
          Acompanhamentos mensais organizados cronologicamente
        </CardDescription>
      </CardHeader>
      <CardContent>
        {acompanhamentosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {acompanhamentosFiltrados.map((acomp, index) => {
              const anterior = index > 0 ? acompanhamentosFiltrados[index - 1] : null;
              const variacao = anterior ? getVariacaoScore(acomp.score_geral, anterior.score_geral) : null;

              return (
                <Card key={acomp.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do Card */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg">{formatDate(acomp.mes)}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-2xl font-bold text-petrol">{acomp.score_geral}%</span>
                            {variacao && variacao.icone && (
                              <div className={`flex items-center gap-1 text-sm ${
                                variacao.tipo === 'positiva' ? 'text-green-600' : 
                                variacao.tipo === 'negativa' ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                <variacao.icone className="h-4 w-4" />
                                <span>{Math.abs(variacao.valor)}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Métricas */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Faturamento:</span>
                          <div className="font-semibold">
                            {acomp.faturamento ? formatCurrency(Number(acomp.faturamento)) : 'N/A'}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">ROI:</span>
                          <div className="font-semibold">{acomp.roi || 'N/A'}x</div>
                        </div>
                      </div>

                      {/* Destaque */}
                      {acomp.destaque && (
                        <div>
                          <span className="text-gray-600 text-sm">Destaque do Mês:</span>
                          <p className="text-sm mt-1 line-clamp-3">{acomp.destaque}</p>
                        </div>
                      )}

                      {/* Ações */}
                      <div>
                        <span className="text-gray-600 text-sm">Ações Concluídas:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-semibold">{getAcoesConcluidasCount(acomp.acoes)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhum acompanhamento encontrado com os filtros aplicados
          </div>
        )}
      </CardContent>
    </Card>
  );
};
