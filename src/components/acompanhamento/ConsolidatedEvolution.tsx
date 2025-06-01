
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Loader2 } from 'lucide-react';
import { useAllAcompanhamentos } from '@/hooks/useAcompanhamentos';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ConsolidatedEvolution = () => {
  const { data: acompanhamentos, isLoading, error } = useAllAcompanhamentos();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM/yyyy', { locale: ptBR });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-petrol" />
          📊 Evolução Consolidada
        </CardTitle>
        <CardDescription>
          Comparação mês a mês da performance dos clientes acompanhados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Carregando dados...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Erro ao carregar os dados. Tente novamente.
          </div>
        ) : acompanhamentos && acompanhamentos.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Mês</TableHead>
                <TableHead>Score Geral</TableHead>
                <TableHead>Faturamento</TableHead>
                <TableHead>ROI</TableHead>
                <TableHead>Destaque</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {acompanhamentos.map((acompanhamento) => (
                <TableRow key={acompanhamento.id}>
                  <TableCell className="font-medium">{acompanhamento.empresas?.nome}</TableCell>
                  <TableCell>{formatDate(acompanhamento.mes)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-petrol">
                      {acompanhamento.score_geral}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {acompanhamento.faturamento ? formatCurrency(acompanhamento.faturamento) : 'N/A'}
                  </TableCell>
                  <TableCell>{acompanhamento.roi || 'N/A'}x</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {acompanhamento.destaque || 'Sem destaque registrado'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhum acompanhamento encontrado
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsolidatedEvolution;
