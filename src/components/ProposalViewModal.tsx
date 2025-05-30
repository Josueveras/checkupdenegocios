
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProposalViewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  proposta: any;
  onEdit: (proposta: any) => void;
}

export const ProposalViewModal = ({ isOpen, onOpenChange, proposta, onEdit }: ProposalViewModalProps) => {
  if (!proposta) return null;

  const getStatusBadge = (status: string) => {
    const colors = {
      "aprovada": "bg-green-100 text-green-800",
      "enviada": "bg-blue-100 text-blue-800",
      "rascunho": "bg-gray-100 text-gray-800",
      "rejeitada": "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || colors["rascunho"];
  };

  const getAcoesSugeridas = (acoes: any): string[] => {
    if (!acoes) return [];
    if (typeof acoes === 'string') {
      try {
        const parsed = JSON.parse(acoes);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [acoes];
      }
    }
    if (Array.isArray(acoes)) {
      return acoes;
    }
    return [];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Visualizar Proposta</DialogTitle>
          <DialogDescription>
            Detalhes completos da proposta comercial
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-gray-900">Empresa</h5>
              <p className="text-gray-700">{proposta.diagnosticos?.empresas?.nome || 'N/A'}</p>
            </div>
            <div>
              <h5 className="font-medium text-gray-900">Cliente</h5>
              <p className="text-gray-700">{proposta.diagnosticos?.empresas?.cliente_nome || 'N/A'}</p>
            </div>
            <div>
              <h5 className="font-medium text-gray-900">E-mail</h5>
              <p className="text-gray-700">{proposta.diagnosticos?.empresas?.cliente_email || 'N/A'}</p>
            </div>
            <div>
              <h5 className="font-medium text-gray-900">Telefone</h5>
              <p className="text-gray-700">{proposta.diagnosticos?.empresas?.cliente_telefone || 'N/A'}</p>
            </div>
            <div>
              <h5 className="font-medium text-gray-900">Valor</h5>
              <p className="text-gray-700 font-semibold text-green-600">
                {(proposta.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-900">Status</h5>
              <Badge className={getStatusBadge(proposta.status)}>
                {proposta.status?.charAt(0).toUpperCase() + proposta.status?.slice(1)}
              </Badge>
            </div>
            <div>
              <h5 className="font-medium text-gray-900">Prazo</h5>
              <p className="text-gray-700">{proposta.prazo || 'A definir'}</p>
            </div>
            <div>
              <h5 className="font-medium text-gray-900">Data de Criação</h5>
              <p className="text-gray-700">{new Date(proposta.created_at).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Objetivo</h5>
            <p className="text-gray-700">{proposta.objetivo || 'Objetivo não definido'}</p>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Ações Sugeridas</h5>
            <ul className="space-y-2">
              {getAcoesSugeridas(proposta.acoes_sugeridas).map((acao: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-petrol rounded-full mt-2"></div>
                  <span className="text-gray-700">{acao}</span>
                </li>
              ))}
              {getAcoesSugeridas(proposta.acoes_sugeridas).length === 0 && (
                <li className="text-gray-500">Nenhuma ação definida</li>
              )}
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={() => {
            onOpenChange(false);
            onEdit(proposta);
          }}>
            Editar Proposta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
