
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useEmpresas } from '@/hooks/useEmpresas';

interface EmpresaSelectorProps {
  selectedEmpresaId: string;
  onChange: (empresaId: string) => void;
}

export const EmpresaSelector = ({ selectedEmpresaId, onChange }: EmpresaSelectorProps) => {
  const { data: empresas = [], isLoading } = useEmpresas();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-3 px-2 sm:px-4">
          <div className="text-center text-sm">Carregando empresas...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-2 sm:p-4">
        <CardTitle className="text-sm sm:text-base truncate">
          Selecionar Empresa
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 pt-0">
        <div className="min-w-0">
          <Label htmlFor="empresa" className="text-sm">Empresa *</Label>
          <select
            id="empresa"
            value={selectedEmpresaId}
            onChange={(e) => onChange(e.target.value)}
            className="flex h-8 sm:h-9 w-full rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
          >
            <option value="">Selecione uma empresa</option>
            {empresas.map((empresa) => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.nome}
              </option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  );
};
