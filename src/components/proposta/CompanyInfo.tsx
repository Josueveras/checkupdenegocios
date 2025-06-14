
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
    <Card>
      <CardHeader className="p-2 sm:p-4">
        <CardTitle className="text-sm sm:text-base truncate">
          Informações da Empresa
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-600">Nome da Empresa</p>
            <p className="text-sm truncate">{empresa.nome}</p>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-600">Cliente</p>
            <p className="text-sm truncate">{empresa.cliente_nome || 'N/A'}</p>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-600">E-mail</p>
            <p className="text-sm truncate">{empresa.cliente_email || 'N/A'}</p>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-600">Telefone</p>
            <p className="text-sm truncate">{empresa.cliente_telefone || 'N/A'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
