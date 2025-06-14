
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompanyData {
  nome: string;
  cliente_nome?: string;
  cliente_email?: string;
  cliente_telefone?: string;
}

interface CompanyInfoProps {
  empresa: CompanyData;
}

export const CompanyInfo = ({ empresa }: CompanyInfoProps) => {
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="truncate">Informações da Empresa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-600">Nome da Empresa</p>
            <p className="text-lg truncate">{empresa.nome}</p>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-600">Cliente</p>
            <p className="text-lg truncate">{empresa.cliente_nome || 'N/A'}</p>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-600">E-mail</p>
            <p className="text-lg truncate">{empresa.cliente_email || 'N/A'}</p>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-600">Telefone</p>
            <p className="text-lg truncate">{empresa.cliente_telefone || 'N/A'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
