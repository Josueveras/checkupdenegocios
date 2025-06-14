
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
      <Card className="w-full overflow-hidden">
        <CardContent className="py-6">
          <div className="text-center">Carregando empresas...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="truncate">Selecionar Empresa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full min-w-0">
          <Label htmlFor="empresa">Empresa *</Label>
          <select
            id="empresa"
            value={selectedEmpresaId}
            onChange={(e) => onChange(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1 min-w-0 truncate"
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
