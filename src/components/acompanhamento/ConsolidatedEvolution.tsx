
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart } from 'lucide-react';

const ConsolidatedEvolution = () => {
  const mockCheckups = [
    {
      id: '1',
      mes_referencia: '2024-01',
      nome_empresa: 'Tech Solutions LTDA',
      score_geral: 85,
      faturamento_atual: 150000,
      roi_estimado: 2.5,
      destaque_mes: 'Implementação do novo CRM aumentou conversão em 30%'
    },
    {
      id: '2',
      mes_referencia: '2024-02',
      nome_empresa: 'Marketing Digital Pro',
      score_geral: 78,
      faturamento_atual: 95000,
      roi_estimado: 1.8,
      destaque_mes: 'Campanhas de mídia paga geraram 40% mais leads'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-petrol" />
          📊 Evolução Consolidada
        </CardTitle>
        <CardDescription>
          Comparativo mês a mês da performance dos projetos acompanhados.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            {mockCheckups.map((checkup) => (
              <TableRow key={checkup.id}>
                <TableCell className="font-medium">{checkup.nome_empresa}</TableCell>
                <TableCell>{checkup.mes_referencia}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-petrol">
                    {checkup.score_geral}%
                  </Badge>
                </TableCell>
                <TableCell>R$ {checkup.faturamento_atual.toLocaleString()}</TableCell>
                <TableCell>{checkup.roi_estimado}x</TableCell>
                <TableCell className="max-w-xs truncate">{checkup.destaque_mes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ConsolidatedEvolution;
