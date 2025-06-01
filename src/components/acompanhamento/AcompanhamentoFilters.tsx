import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';

interface AcompanhamentoFiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
  clearFilters: () => void;
}

const AcompanhamentoFilters = ({ filters, setFilters, clearFilters }: AcompanhamentoFiltersProps) => {
  const updateFilter = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-petrol" />
          Filtros
        </CardTitle>
        <CardDescription>
          Filtre os acompanhamentos por empresa, período ou métricas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Empresa ou Cliente</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="search"
                placeholder="Buscar empresa ou cliente..."
                value={filters.searchTerm}
                onChange={(e) => updateFilter('searchTerm', e.target.value)}
                className="pl-10 h-10 border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:bg-background"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mes">Mês de Referência</Label>
            <Input
              id="mes"
              type="month"
              value={filters.mes}
              onChange={(e) => updateFilter('mes', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scoreMin">Score Mínimo</Label>
            <Input
              id="scoreMin"
              type="number"
              placeholder="Ex: 70"
              value={filters.scoreMinimo}
              onChange={(e) => updateFilter('scoreMinimo', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scoreMax">Score Máximo</Label>
            <Input
              id="scoreMax"
              type="number"
              placeholder="Ex: 100"
              value={filters.scoreMaximo}
              onChange={(e) => updateFilter('scoreMaximo', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="roiMin">ROI Mínimo</Label>
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
            <Label htmlFor="roiMax">ROI Máximo</Label>
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
            <Label htmlFor="status">Status do Projeto</Label>
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="case">Case</SelectItem>
                <SelectItem value="encerrado">Encerrado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={clearFilters}>
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AcompanhamentoFilters;
