
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/useDebounce';

interface CompanyData {
  clientName: string;
  companyName: string;
  email: string;
  phone: string;
  website: string;
  sector: string;
  employees: string;
  revenue: string;
}

interface CompanyDataStepProps {
  companyData: CompanyData;
  setCompanyData: (data: CompanyData) => void;
}

const sectors = [
  "Tecnologia", "Varejo", "Serviços", "Indústria", "Saúde", 
  "Educação", "Consultoria", "E-commerce", "Construção", "Outro"
];

const employeeRanges = [
  "1-5", "6-10", "11-25", "26-50", "51-100", "101-500", "500+"
];

const revenueRanges = [
  "Até R$ 100k", "R$ 100k - R$ 500k", "R$ 500k - R$ 1M", 
  "R$ 1M - R$ 5M", "R$ 5M - R$ 10M", "Acima de R$ 10M"
];

export const CompanyDataStep = ({ companyData, setCompanyData }: CompanyDataStepProps) => {
  // Debounce para campos de texto
  const debouncedUpdate = useDebounce((field: string, value: string) => {
    setCompanyData({...companyData, [field]: value});
  }, 300);

  const handleInputChange = (field: string, value: string) => {
    debouncedUpdate(field, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados da Empresa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Campo honeypot invisível para proteção anti-bot */}
        <input
          type="text"
          name="website_url"
          autoComplete="off"
          style={{ display: 'none' }}
          tabIndex={-1}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Nome do Cliente *</Label>
            <Input
              id="clientName"
              defaultValue={companyData.clientName}
              onChange={(e) => handleInputChange('clientName', e.target.value)}
              placeholder="Nome completo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da Empresa *</Label>
            <Input
              id="companyName"
              defaultValue={companyData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="Razão social ou nome fantasia"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              defaultValue={companyData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="contato@empresa.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">WhatsApp</Label>
            <Input
              id="phone"
              defaultValue={companyData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Site ou Instagram</Label>
            <Input
              id="website"
              defaultValue={companyData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="www.empresa.com ou @empresa"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sector">Setor de Atuação</Label>
            <Select value={companyData.sector} onValueChange={(value) => setCompanyData({...companyData, sector: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o setor" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map(sector => (
                  <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employees">Número de Funcionários</Label>
            <Select value={companyData.employees} onValueChange={(value) => setCompanyData({...companyData, employees: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o porte" />
              </SelectTrigger>
              <SelectContent>
                {employeeRanges.map(range => (
                  <SelectItem key={range} value={range}>{range}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="revenue">Faturamento Anual</Label>
            <Select value={companyData.revenue} onValueChange={(value) => setCompanyData({...companyData, revenue: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a faixa" />
              </SelectTrigger>
              <SelectContent>
                {revenueRanges.map(range => (
                  <SelectItem key={range} value={range}>{range}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
