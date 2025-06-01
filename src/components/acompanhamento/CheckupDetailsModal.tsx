
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CheckupDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkup: any;
}

const CheckupDetailsModal = ({ open, onOpenChange, checkup }: CheckupDetailsModalProps) => {
  if (!checkup) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'MMMM/yyyy', { locale: ptBR });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Check-up</DialogTitle>
          <DialogDescription>
            {checkup.empresas?.nome} - {formatDate(checkup.mes)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-petrol">{checkup.score_geral}%</div>
              <div className="text-sm text-gray-600">Score Geral</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {checkup.faturamento ? formatCurrency(checkup.faturamento) : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Faturamento</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{checkup.roi || 'N/A'}x</div>
              <div className="text-sm text-gray-600">ROI</div>
            </div>
          </div>

          <Separator />

          {/* Destaque do Mês */}
          {checkup.destaque && (
            <div>
              <h4 className="font-semibold mb-2">Destaque do Mês</h4>
              <p className="text-gray-700">{checkup.destaque}</p>
            </div>
          )}

          {/* Score por Categoria */}
          {checkup.score_por_categoria && (
            <div>
              <h4 className="font-semibold mb-3">Score por Categoria</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(checkup.score_por_categoria).map(([categoria, dados]: [string, any]) => (
                  <div key={categoria} className="p-3 border rounded">
                    <div className="font-medium text-sm">{categoria}</div>
                    <div className="text-lg font-bold text-petrol">{dados.score_atual}%</div>
                    {dados.score_anterior && (
                      <div className="text-xs text-gray-600">
                        Anterior: {dados.score_anterior}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ações do Mês */}
          {checkup.acoes && checkup.acoes.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Ações do Mês</h4>
              <div className="space-y-2">
                {checkup.acoes.map((acao: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <span>{acao.acao}</span>
                    <Badge 
                      variant={acao.status === 'concluido' ? 'default' : 'secondary'}
                      className={acao.status === 'concluido' ? 'bg-green-500' : ''}
                    >
                      {acao.status === 'concluido' ? 'Concluído' : 
                       acao.status === 'em_andamento' ? 'Em Andamento' : 'Pendente'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recomendações */}
          {checkup.recomendacoes && (
            <div>
              <h4 className="font-semibold mb-2">Recomendações</h4>
              <p className="text-gray-700 whitespace-pre-line">{checkup.recomendacoes}</p>
            </div>
          )}

          {/* Pontos Fortes */}
          {checkup.pontos_fortes_desenvolvidos && (
            <div>
              <h4 className="font-semibold mb-2">Pontos Fortes Desenvolvidos</h4>
              <p className="text-gray-700 whitespace-pre-line">{checkup.pontos_fortes_desenvolvidos}</p>
            </div>
          )}

          {/* Gargalos */}
          {checkup.gargalos_atuais && (
            <div>
              <h4 className="font-semibold mb-2">Gargalos Atuais</h4>
              <p className="text-gray-700 whitespace-pre-line">{checkup.gargalos_atuais}</p>
            </div>
          )}

          {/* Estratégias Validadas */}
          {checkup.estrategias_validadas && (
            <div>
              <h4 className="font-semibold mb-2">Estratégias Validadas</h4>
              <p className="text-gray-700 whitespace-pre-line">{checkup.estrategias_validadas}</p>
            </div>
          )}

          {/* Case */}
          {checkup.virou_case && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold mb-2 text-yellow-800">🏆 Projeto virou Case!</h4>
              {checkup.destaque_case && (
                <p className="text-yellow-700">{checkup.destaque_case}</p>
              )}
            </div>
          )}

          {/* Observações */}
          {checkup.observacoes && (
            <div>
              <h4 className="font-semibold mb-2">Observações do Consultor</h4>
              <p className="text-gray-700 whitespace-pre-line">{checkup.observacoes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckupDetailsModal;
