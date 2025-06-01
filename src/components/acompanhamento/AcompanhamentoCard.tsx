
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, FileText, Building2, Calendar, TrendingUp, DollarSign, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AcompanhamentoCardProps {
  acompanhamento: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onGeneratePDF: (id: string) => void;
}

const AcompanhamentoCard = ({ acompanhamento, onEdit, onDelete, onGeneratePDF }: AcompanhamentoCardProps) => {
  const navigate = useNavigate();

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
    
    let parsedAcoes = acoes;
    if (typeof acoes === 'string') {
      try {
        parsedAcoes = JSON.parse(acoes);
      } catch {
        return 0;
      }
    }
    
    if (!Array.isArray(parsedAcoes)) return 0;
    
    return parsedAcoes.filter(acao => acao && acao.status === 'concluido').length;
  };

  const handleViewMore = () => {
    navigate(`/clientes/${acompanhamento.empresa_id}`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-petrol" />
                {acompanhamento.empresas?.nome}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{formatDate(acompanhamento.mes)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {acompanhamento.virou_case && (
                <Badge className="bg-yellow-100 text-yellow-800">Case</Badge>
              )}
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Ativo
              </Badge>
            </div>
          </div>

          {/* Métricas principais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="h-4 w-4 text-petrol" />
              </div>
              <div className="text-2xl font-bold text-petrol">{acompanhamento.score_geral}%</div>
              <div className="text-xs text-gray-600">Score Geral</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-sm font-bold text-gray-900">
                {acompanhamento.faturamento ? formatCurrency(Number(acompanhamento.faturamento)) : 'N/A'}
              </div>
              <div className="text-xs text-gray-600">Faturamento</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">{acompanhamento.roi || 'N/A'}x</div>
              <div className="text-xs text-gray-600">ROI</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">{getAcoesConcluidasCount(acompanhamento.acoes)}</div>
              <div className="text-xs text-gray-600">Ações Concluídas</div>
            </div>
          </div>

          {/* Destaque do mês */}
          {acompanhamento.destaque && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <span className="text-sm font-medium text-blue-900">Destaque do Mês:</span>
              <p className="text-sm text-blue-800 mt-1 line-clamp-2">{acompanhamento.destaque}</p>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" onClick={handleViewMore}>
              <Eye className="mr-2 h-4 w-4" />
              Ver Mais
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(acompanhamento.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button variant="outline" size="sm" onClick={() => onGeneratePDF(acompanhamento.id)}>
              <FileText className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete(acompanhamento.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AcompanhamentoCard;
