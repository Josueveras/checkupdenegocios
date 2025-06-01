
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmpresasComDiagnosticos } from '@/hooks/useAcompanhamentos';
import { Loader2 } from 'lucide-react';

interface CompanySelectorProps {
  selectedCompany: string;
  setSelectedCompany: (value: string) => void;
}

const CompanySelector = ({ selectedCompany, setSelectedCompany }: CompanySelectorProps) => {
  const { data: empresas, isLoading, error } = useEmpresasComDiagnosticos();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecionar Empresa</CardTitle>
        <CardDescription>
          Escolha uma empresa para visualizar seu histórico de acompanhamentos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Carregando empresas...</span>
          </div>
        ) : error ? (
          <div className="text-red-600 p-4">
            Erro ao carregar empresas. Tente novamente.
          </div>
        ) : (
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-full md:w-80">
              <SelectValue placeholder="Selecione uma empresa..." />
            </SelectTrigger>
            <SelectContent>
              {empresas?.map(empresa => (
                <SelectItem key={empresa.id} value={empresa.id}>
                  {empresa.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanySelector;
