
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Target } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    mes: string;
    scoreMinimo: string;
    faturamentoMinimo: string;
    roiMinimo: string;
    palavraChave: string;
  };
  setFilters: (filters: any) => void;
  clearFilters: () => void;
}

export const FilterPanel = ({ filters, setFilters, clearFilters }: FilterPanelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-petrol" />
          Filtros de Acompanhamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <Label htmlFor="mes">Mês de Referência</Label>
            <Input
              id="mes"
              placeholder="Ex: janeiro/2024"
              value={filters.mes}
              onChange={(e) => setFilters(prev => ({ ...prev, mes: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="score">Score Mínimo</Label>
            <Input
              id="score"
              type="number"
              placeholder="Ex: 70"
              value={filters.scoreMinimo}
              onChange={(e) => setFilters(prev => ({ ...prev, scoreMinimo: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="faturamento">Faturamento Mín.</Label>
            <CurrencyInput
              id="faturamento"
              value={filters.faturamentoMinimo}
              onChange={(value) => setFilters(prev => ({ ...prev, faturamentoMinimo: value }))}
              placeholder="0,00"
            />
          </div>
          <div>
            <Label htmlFor="roi">ROI Mínimo</Label>
            <Input
              id="roi"
              type="number"
              step="0.1"
              placeholder="Ex: 1.5"
              value={filters.roiMinimo}
              onChange={(e) => setFilters(prev => ({ ...prev, roiMinimo: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="palavra">Palavra-chave</Label>
            <Input
              id="palavra"
              placeholder="Buscar..."
              value={filters.palavraChave}
              onChange={(e) => setFilters(prev => ({ ...prev, palavraChave: e.target.value }))}
            />
          </div>
          <div className="flex items-end">
            <Button variant="outline" onClick={clearFilters} className="w-full">
              Limpar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
