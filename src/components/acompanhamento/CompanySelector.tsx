
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CompanySelectorProps {
  selectedCompany: string;
  setSelectedCompany: (value: string) => void;
}

const CompanySelector = ({ selectedCompany, setSelectedCompany }: CompanySelectorProps) => {
  const mockCompanies = [
    { id: '1', name: 'Tech Solutions LTDA' },
    { id: '2', name: 'Marketing Digital Pro' },
    { id: '3', name: 'Inovação & Estratégia' },
    { id: '4', name: 'Consultoria Business' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecionar Empresa</CardTitle>
        <CardDescription>
          Escolha uma empresa para visualizar seu histórico de diagnósticos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
          <SelectTrigger className="w-full md:w-80">
            <SelectValue placeholder="Selecione uma empresa..." />
          </SelectTrigger>
          <SelectContent>
            {mockCompanies.map(company => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default CompanySelector;
