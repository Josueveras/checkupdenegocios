
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface ProposalStatsProps {
  propostas: any[];
}

export const ProposalStats = ({ propostas }: ProposalStatsProps) => {
  const totalValue = propostas.reduce((sum, proposta) => sum + (proposta.valor || 0), 0);
  const approvedValue = propostas
    .filter(p => p.status === 'aprovada')
    .reduce((sum, proposta) => sum + (proposta.valor || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <Card className="border-l-4 border-l-petrol min-w-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 truncate">
            Total de Propostas
          </CardTitle>
          <FileText className="h-4 w-4 text-petrol flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{propostas.length}</div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500 min-w-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 truncate">
            Aprovadas
          </CardTitle>
          <FileText className="h-4 w-4 text-green-500 flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {propostas.filter(p => p.status === 'aprovada').length}
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-mustard min-w-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 truncate">
            Valor Total
          </CardTitle>
          <FileText className="h-4 w-4 text-mustard flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold text-gray-900 truncate">
            {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-light min-w-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 truncate">
            Valor Aprovado
          </CardTitle>
          <FileText className="h-4 w-4 text-blue-light flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold text-gray-900 truncate">
            {approvedValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
