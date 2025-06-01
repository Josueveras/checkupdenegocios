
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, FileText, Building2, Calendar } from 'lucide-react';
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

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  const getStatusBadge = () => {
    if (acompanhamento.virou_case) {
      return <Badge className="bg-yellow-100 text-yellow-800">Case</Badge>;
    }
    return <Badge variant="secondary" className="bg-green-100 text-green-800">Ativo</Badge>;
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
                <span className="text-sm text-gray-600">
                  Cadastro: {formatDate(acompanhamento.empresas?.created_at || acompanhamento.created_at)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge()}
            </div>
          </div>

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
