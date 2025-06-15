
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface ProposalStatsProps {
  propostas: any[];
}

export const ProposalStats = ({ propostas }: ProposalStatsProps) => {
  const totalValue = propostas.reduce((sum, proposta) => sum + (proposta.valor || 0), 0);
  const approvedValue = propostas
    .filter(p => p.status === 'aprovada')
    .reduce((sum, proposta) => sum + (proposta.valor || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-l-4 border-l-petrol">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total de Propostas
          </CardTitle>
          <FileText className="h-4 w-4 text-petrol" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{propostas.length}</div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Aprovadas
          </CardTitle>
          <FileText className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {propostas.filter(p => p.status === 'aprovada').length}
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-mustard">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Valor Total
          </CardTitle>
          <FileText className="h-4 w-4 text-mustard" />
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold text-gray-900">
            {formatCurrency(totalValue)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-light">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Valor Aprovado
          </CardTitle>
          <FileText className="h-4 w-4 text-blue-light" />
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold text-gray-900">
            {formatCurrency(approvedValue)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
