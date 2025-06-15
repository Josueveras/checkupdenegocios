
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useEmpresas } from '@/hooks/useEmpresas';

interface EmpresaSelectorProps {
  selectedEmpresaId: string;
  onChange: (empresaId: string) => void;
}

export const EmpresaSelector = ({ selectedEmpresaId, onChange }: EmpresaSelectorProps) => {
  const { data: empresas = [], isLoading } = useEmpresas();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmpresas = useMemo(() => {
    if (!searchTerm.trim()) return empresas;
    
    return empresas.filter(empresa =>
      empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (empresa.setor && empresa.setor.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [empresas, searchTerm]);

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="py-4 px-2 sm:px-3">
          <div className="text-center text-sm">Carregando empresas...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-2 sm:p-3">
        <CardTitle className="text-sm sm:text-base truncate">
          Selecionar Empresa
        </CardTitle>
        {empresas.length > 5 && (
          <div className="text-xs text-gray-500">
            {filteredEmpresas.length} de {empresas.length} empresas
          </div>
        )}
      </CardHeader>
      <CardContent className="p-2 sm:p-3 pt-0 space-y-3">
        {/* Campo de busca */}
        {empresas.length > 5 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* Seletor de empresa */}
        <div className="min-w-0">
          <Label htmlFor="empresa" className="text-sm">Empresa *</Label>
          <select
            id="empresa"
            value={selectedEmpresaId}
            onChange={(e) => onChange(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
          >
            <option value="">
              {filteredEmpresas.length === 0 && searchTerm 
                ? `Nenhuma empresa encontrada para "${searchTerm}"` 
                : 'Selecione uma empresa'
              }
            </option>
            {filteredEmpresas.map((empresa) => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.nome} {empresa.setor && `(${empresa.setor})`}
              </option>
            ))}
          </select>
        </div>

        {searchTerm && filteredEmpresas.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-2">
            Nenhuma empresa encontrada para "{searchTerm}"
          </div>
        )}
      </CardContent>
    </Card>
  );
};
