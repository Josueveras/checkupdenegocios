
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate, formatROI } from '@/utils/formatters';
import { getCompletedActionsCount } from '@/utils/calculations';

interface CheckupData {
  id: string;
  mes: string | Date;
  score_geral?: number;
  roi?: number;
  faturamento?: number | string;
  destaque?: string;
  acoes?: any;
  observacoes?: string;
}

interface EmpresaCheckupsTableProps {
  checkupsEmpresa: CheckupData[];
}

export const EmpresaCheckupsTable = ({ checkupsEmpresa }: EmpresaCheckupsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-petrol" />
          📆 Histórico de Check-ups
        </CardTitle>
        <CardDescription>
          Todos os check-ups registrados para esta empresa em formato tabular.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mês</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>ROI</TableHead>
              <TableHead>Faturamento</TableHead>
              <TableHead>Destaque</TableHead>
              <TableHead>Ações</TableHead>
              <TableHead>Observações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checkupsEmpresa && checkupsEmpresa.length > 0 ? (
              checkupsEmpresa.map((checkup) => (
                <TableRow key={checkup.id}>
                  <TableCell className="font-medium">
                    {formatDate(checkup.mes)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{checkup.score_geral}%</Badge>
                  </TableCell>
                  <TableCell>
                    {checkup.roi ? formatROI(checkup.roi) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {checkup.faturamento ? formatCurrency(Number(checkup.faturamento)) : 'N/A'}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {checkup.destaque || 'Não informado'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {getCompletedActionsCount(checkup.acoes)} concluídas
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {checkup.observacoes || 'Nenhuma observação'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Nenhum check-up registrado para esta empresa.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
