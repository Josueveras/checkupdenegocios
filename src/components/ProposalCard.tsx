
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Download, Edit, Eye, Trash2 } from 'lucide-react';
import { useProposalOperations } from '@/hooks/useProposalOperations';

interface ProposalCardProps {
  proposta: any;
  onEdit: (proposta: any) => void;
  onView: (proposta: any) => void;
}

export const ProposalCard = ({ proposta, onEdit, onView }: ProposalCardProps) => {
  const { deleteProposal, handleDownloadPDF, handleSendWhatsApp } = useProposalOperations();

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

  const empresa = proposta.diagnosticos?.empresas;
  const acoesSugeridas = getAcoesSugeridas(proposta.acoes_sugeridas);

  return (
    <Card className="hover:shadow-md transition-shadow relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10"
        onClick={() => onEdit(proposta)}
      >
        <Edit className="h-4 w-4" />
      </Button>

      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pr-12">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-xl text-gray-900 truncate">{empresa?.nome || 'Empresa não informada'}</h3>
              <Badge className={getStatusBadge(proposta.status)}>
                {proposta.status?.charAt(0).toUpperCase() + proposta.status?.slice(1)}
              </Badge>
            </div>
            <p className="text-gray-600 truncate"><strong>Cliente:</strong> {empresa?.cliente_nome || 'N/A'}</p>
            <p className="text-gray-600"><strong>Data:</strong> {new Date(proposta.created_at).toLocaleDateString('pt-BR')}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-bold text-green-600">
              {(proposta.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h5 className="font-medium text-gray-900 mb-2">Objetivo</h5>
          <p className="text-gray-700 break-words">{proposta.objetivo || 'Objetivo não definido'}</p>
        </div>
        
        <div>
          <h5 className="font-medium text-gray-900 mb-2">Ações Sugeridas</h5>
          <ul className="space-y-1">
            {acoesSugeridas.length > 0 ? acoesSugeridas.map((acao: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-petrol rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 break-words">{acao}</span>
              </li>
            )) : <li className="text-gray-500">Nenhuma ação definida</li>}
          </ul>
        </div>

        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => handleDownloadPDF(proposta)}
              className="flex items-center gap-2 text-xs"
              size="sm"
            >
              <Download className="h-4 w-4" />
              PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSendWhatsApp(proposta)}
              className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-600 hover:text-white text-xs"
              size="sm"
            >
              📤 WhatsApp
            </Button>
            <Button
              variant="outline"
              onClick={() => onView(proposta)}
              className="flex items-center gap-2 text-xs"
              size="sm"
            >
              <Eye className="h-4 w-4" />
              Ver
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-600 hover:text-white text-xs"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir esta proposta? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteProposal.mutate(proposta.id)}>
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
