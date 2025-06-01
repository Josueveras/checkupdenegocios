
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search, X } from 'lucide-react';

interface AcompanhamentoFiltersProps {
  filters: {
    empresaId: string;
    mes: string;
    scoreMinimo: string;
    scoreMaximo: string;
    roiMinimo: string;
    roiMaximo: string;
    status: string;
  };
  setFilters: (filters: any) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  empresasComAcompanhamentos: Array<{
    id: string;
    nome: string;
    cliente_nome?: string;
  }>;
}

const AcompanhamentoFilters = ({ 
  filters, 
  setFilters, 
  applyFilters,
  clearFilters,
  empresasComAcompanhamentos 
}: AcompanhamentoFiltersProps) => {
  const updateFilter = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-petrol" />
          Filtros de Empresas
        </CardTitle>
        <CardDescription>
          Filtre as empresas por nome, período do último check-up ou métricas consolidadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          <div className="space-y-2">
            <Label htmlFor="empresa">Empresa ou Cliente</Label>
            <Select value={filters.empresaId} onValueChange={(value) => updateFilter('empresaId', value)}>
              <SelectTrigger className="h-10 border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:bg-background">
                <SelectValue placeholder="Selecione uma empresa..." />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-md z-50">
                <SelectItem value="all">Todas as empresas</SelectItem>
                {empresasComAcompanhamentos && empresasComAcompanhamentos.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id}>
                    {empresa.nome} {empresa.cliente_nome && `(${empresa.cliente_nome})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mes">Último Check-up</Label>
            <Input
              id="mes"
              type="month"
              value={filters.mes}
              onChange={(e) => updateFilter('mes', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scoreMin">Score Médio Mín.</Label>
            <Input
              id="scoreMin"
              type="number"
              placeholder="Ex: 70"
              value={filters.scoreMinimo}
              onChange={(e) => updateFilter('scoreMinimo', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scoreMax">Score Médio Máx.</Label>
            <Input
              id="scoreMax"
              type="number"
              placeholder="Ex: 100"
              value={filters.scoreMaximo}
              onChange={(e) => updateFilter('scoreMaximo', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="roiMin">ROI Médio Mín.</Label>
            <Input
              id="roiMin"
              type="number"
              step="0.1"
              placeholder="Ex: 1.5"
              value={filters.roiMinimo}
              onChange={(e) => updateFilter('roiMinimo', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="roiMax">ROI Médio Máx.</Label>
            <Input
              id="roiMax"
              type="number"
              step="0.1"
              placeholder="Ex: 5.0"
              value={filters.roiMaximo}
              onChange={(e) => updateFilter('roiMaximo', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status da Empresa</Label>
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger className="bg-background border shadow-sm z-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-md z-50">
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Limpar Filtros
          </Button>
          <Button onClick={applyFilters} className="bg-petrol hover:bg-petrol/90 text-white flex items-center gap-2">
            <Search className="h-4 w-4" />
            Filtrar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AcompanhamentoFilters;
