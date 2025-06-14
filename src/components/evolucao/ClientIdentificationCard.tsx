
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientIdentificationCardProps {
  empresa: {
    id: string;
    nome: string;
    created_at: string;
  };
}

export const ClientIdentificationCard = ({ empresa }: ClientIdentificationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-petrol" />
          {empresa.nome}
        </CardTitle>
        <CardDescription>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Ativo
            </Badge>
            <span className="text-sm text-gray-600">
              Data de entrada: {format(new Date(empresa.created_at), 'dd/MM/yyyy', { locale: ptBR })}
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-petrol hover:bg-petrol/90 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Novo Check-up
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Ver Diagnóstico Inicial
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Gerar Relatório
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
