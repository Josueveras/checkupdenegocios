
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, Loader2 } from 'lucide-react';
import { useAcompanhamentosByEmpresa } from '@/hooks/useAcompanhamentos';
import CheckupDetailsModal from './CheckupDetailsModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HistoricalCheckupsProps {
  selectedCompany: string;
}

const HistoricalCheckups = ({ selectedCompany }: HistoricalCheckupsProps) => {
  const [selectedCheckup, setSelectedCheckup] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const { data: acompanhamentos, isLoading, error } = useAcompanhamentosByEmpresa(selectedCompany);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'MMMM/yyyy', { locale: ptBR });
  };

  const getAcoesConcluidasCount = (acoes: any) => {
    if (!acoes) return 0;
    
    // Handle if acoes is a JSON string
    let parsedAcoes = acoes;
    if (typeof acoes === 'string') {
      try {
        parsedAcoes = JSON.parse(acoes);
      } catch {
        return 0;
      }
    }
    
    // Check if it's an array
    if (!Array.isArray(parsedAcoes)) return 0;
    
    return parsedAcoes.filter(acao => acao && acao.status === 'concluido').length;
  };

  const handleVerDetalhes = (checkup: any) => {
    setSelectedCheckup(checkup);
    setModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-petrol" />
            📆 Check-ups Mensais
          </CardTitle>
          <CardDescription>
            Cards com os dados principais de cada acompanhamento mensal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedCompany ? (
            <div className="text-center py-8 text-gray-500">
              Selecione uma empresa para visualizar os check-ups mensais
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Carregando check-ups...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Erro ao carregar os dados. Tente novamente.
            </div>
          ) : acompanhamentos && acompanhamentos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {acompanhamentos.map((acompanhamento) => (
                <Card key={acompanhamento.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{acompanhamento.empresas?.nome}</h4>
                        <p className="text-sm text-gray-600">{formatDate(acompanhamento.mes)}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Score Geral:</span>
                          <div className="font-semibold text-petrol">{acompanhamento.score_geral}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Faturamento:</span>
                          <div className="font-semibold">
                            {acompanhamento.faturamento ? formatCurrency(acompanhamento.faturamento) : 'N/A'}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">ROI:</span>
                          <div className="font-semibold">{acompanhamento.roi || 'N/A'}x</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Ações Concluídas:</span>
                          <div className="font-semibold">{getAcoesConcluidasCount(acompanhamento.acoes)}</div>
                        </div>
                      </div>

                      {acompanhamento.destaque && (
                        <div>
                          <span className="text-gray-600 text-sm">Destaque do Mês:</span>
                          <p className="text-sm mt-1 line-clamp-2">{acompanhamento.destaque}</p>
                        </div>
                      )}

                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleVerDetalhes(acompanhamento)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhum check-up encontrado para esta empresa
            </div>
          )}
        </CardContent>
      </Card>

      <CheckupDetailsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        checkup={selectedCheckup}
      />
    </>
  );
};

export default HistoricalCheckups;
