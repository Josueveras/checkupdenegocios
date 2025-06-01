
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Plus, Building2, TrendingUp, Calendar } from 'lucide-react';
import AcompanhamentoCard from './AcompanhamentoCard';

interface EmpresaGroupProps {
  empresa: {
    id: string;
    nome: string;
    cliente_nome?: string;
  };
  acompanhamentos: any[];
  totalCheckups: number;
  scoreMediaGeral: number;
  status: 'ativo' | 'case' | 'inativo';
  defaultOpen?: boolean;
  onNovoCheckup: (empresaId: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onGeneratePDF: (id: string) => void;
}

const EmpresaGroup = ({
  empresa,
  acompanhamentos,
  totalCheckups,
  scoreMediaGeral,
  status,
  defaultOpen = false,
  onNovoCheckup,
  onEdit,
  onDelete,
  onGeneratePDF
}: EmpresaGroupProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const getStatusBadge = () => {
    switch (status) {
      case 'case':
        return <Badge className="bg-yellow-100 text-yellow-800">Case</Badge>;
      case 'ativo':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inativo':
        return <Badge variant="secondary">Inativo</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  return (
    <Card className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isOpen ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
                <Building2 className="h-5 w-5 text-petrol" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{empresa.nome}</h3>
                  {empresa.cliente_nome && (
                    <p className="text-sm text-gray-600">Cliente: {empresa.cliente_nome}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{totalCheckups} check-ups</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">{scoreMediaGeral}%</span>
                  <span className="text-xs text-gray-500">média</span>
                </div>
                
                {getStatusBadge()}
                
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNovoCheckup(empresa.id);
                  }}
                  className="bg-petrol hover:bg-petrol/90 text-white"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Novo Check-up
                </Button>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent>
            {acompanhamentos.length > 0 ? (
              <div className="space-y-4">
                {acompanhamentos.map((acompanhamento) => (
                  <AcompanhamentoCard
                    key={acompanhamento.id}
                    acompanhamento={acompanhamento}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onGeneratePDF={onGeneratePDF}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>Nenhum check-up encontrado para os filtros selecionados.</p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default EmpresaGroup;
