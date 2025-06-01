
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Calendar, 
  TrendingUp, 
  Target, 
  FileText, 
  Edit, 
  Trash2,
  Eye
} from 'lucide-react';
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

const EmpresaConsolidadaCard = ({
  empresa,
  onEdit,
  onDelete,
  onGeneratePDF
}: EmpresaConsolidadaCardProps) => {
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  const handleVerMais = () => {
    navigate(`/empresa/${empresa.id}`);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-petrol" />
            <span>{empresa.nome}</span>
          </div>
          <Badge variant={empresa.status === 'ativo' ? 'default' : 'secondary'}>
            {empresa.status === 'ativo' ? 'Ativo' : 'Inativo'}
          </Badge>
        </CardTitle>
        <CardDescription>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <span className="text-sm">
              <Calendar className="h-4 w-4 inline mr-1" />
              Cadastro: {formatDate(empresa.created_at)}
            </span>
            <span className="text-sm">
              <Target className="h-4 w-4 inline mr-1" />
              Check-ups: {empresa.totalCheckups}
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-petrol">{empresa.scoreGeral}%</div>
            <p className="text-xs text-gray-600">Score Médio</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{empresa.roiMedio}x</div>
            <p className="text-xs text-gray-600">ROI Médio</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {formatCurrency(empresa.faturamentoMedio)}
            </div>
            <p className="text-xs text-gray-600">Faturamento Médio</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{empresa.acoesConcluidasTotal}</div>
            <p className="text-xs text-gray-600">Ações Concluídas</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            size="sm" 
            className="bg-petrol hover:bg-petrol/90 text-white"
            onClick={handleVerMais}
          >
            <Eye className="mr-1 h-4 w-4" />
            Ver Mais
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(empresa.id)}>
            <Edit className="mr-1 h-4 w-4" />
            Editar
          </Button>
          <Button size="sm" variant="outline" onClick={() => onGeneratePDF(empresa.id)}>
            <FileText className="mr-1 h-4 w-4" />
            PDF
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(empresa.id)}>
            <Trash2 className="mr-1 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmpresaConsolidadaCard;
