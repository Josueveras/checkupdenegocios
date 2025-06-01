
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, TrendingUp, FileText, Trash2, Edit, Eye, Download } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface EmpresaConsolidada {
  id: string;
  nome: string;
  cliente_nome?: string;
  cliente_email?: string;
  cliente_telefone?: string;
  created_at: string;
  totalCheckups: number;
  scoreGeral: number;
  roiMedio: number;
  faturamentoMedio: number;
  acoesConcluidasTotal: number;
  ultimoCheckup: string;
  status: 'ativo' | 'inativo';
}

interface EmpresaConsolidadaCardProps {
  empresa: EmpresaConsolidada;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onGeneratePDF: (id: string) => void;
}

const EmpresaConsolidadaCard = ({ empresa, onEdit, onDelete, onGeneratePDF }: EmpresaConsolidadaCardProps) => {
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string | Date) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  const handleVerMais = () => {
    navigate(`/evolucao-cliente/${empresa.id}`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    return status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-petrol" />
              {empresa.nome}
            </CardTitle>
            <CardDescription className="mt-1">
              {empresa.cliente_nome && (
                <span className="text-sm text-gray-600">
                  Cliente: {empresa.cliente_nome}
                </span>
              )}
            </CardDescription>
          </div>
          <Badge variant="secondary" className={getStatusColor(empresa.status)}>
            {empresa.status === 'ativo' ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Métricas Principais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-petrol">{empresa.totalCheckups}</div>
            <div className="text-xs text-gray-600">Check-ups</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(empresa.scoreGeral)}`}>
              {empresa.scoreGeral}%
            </div>
            <div className="text-xs text-gray-600">Score Médio</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-petrol">
              {empresa.roiMedio > 0 ? `${empresa.roiMedio}x` : '-'}
            </div>
            <div className="text-xs text-gray-600">ROI Médio</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-petrol">{empresa.acoesConcluidasTotal}</div>
            <div className="text-xs text-gray-600">Ações Concluídas</div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Cadastro: {formatDate(empresa.created_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>
              Faturamento Médio: {empresa.faturamentoMedio > 0 ? formatCurrency(empresa.faturamentoMedio) : 'N/A'}
            </span>
          </div>
        </div>

        {/* Último Check-up */}
        {empresa.ultimoCheckup && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Último Check-up:</span> {formatDate(empresa.ultimoCheckup)}
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Button 
            onClick={handleVerMais}
            className="bg-petrol hover:bg-petrol/90 text-white"
            size="sm"
          >
            <Eye className="mr-1 h-4 w-4" />
            Ver Mais
          </Button>
          <Button 
            variant="outline"
            onClick={() => onEdit(empresa.id)}
            size="sm"
          >
            <Edit className="mr-1 h-4 w-4" />
            Editar
          </Button>
          <Button 
            variant="outline"
            onClick={() => onGeneratePDF(empresa.id)}
            size="sm"
          >
            <Download className="mr-1 h-4 w-4" />
            PDF Geral
          </Button>
          <Button 
            variant="outline"
            onClick={() => onDelete(empresa.id)}
            size="sm"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmpresaConsolidadaCard;
