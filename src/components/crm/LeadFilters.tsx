
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';

interface LeadFiltersProps {
  onFiltersChange: (filters: any) => void;
  totalLeads: number;
  filteredLeads: number;
}

export const LeadFilters = ({ onFiltersChange, totalLeads, filteredLeads }: LeadFiltersProps) => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    setor: '',
    tamanho_empresa: '',
    urgencia: '',
    fonte_lead: ''
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleFilterChange = (key: string, value: string) => {
    // Convert "todos" back to empty string for filtering logic
    const filterValue = value === 'todos' || value === 'todas' ? '' : value;
    const newFilters = { ...filters, [key]: filterValue };
    setFilters(newFilters);

    // Update active filters list
    const active = Object.entries(newFilters)
      .filter(([_, val]) => val !== '')
      .map(([key, _]) => key);
    setActiveFilters(active);

    onFiltersChange(newFilters);
  };

  const clearFilter = (key: string) => {
    handleFilterChange(key, 'todos');
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: '',
      status: '',
      setor: '',
      tamanho_empresa: '',
      urgencia: '',
      fonte_lead: ''
    };
    setFilters(clearedFilters);
    setActiveFilters([]);
    onFiltersChange(clearedFilters);
  };

  const getFilterLabel = (key: string) => {
    const labels = {
      search: 'Busca',
      status: 'Status',
      setor: 'Setor',
      tamanho_empresa: 'Tamanho',
      urgencia: 'Urgência',
      fonte_lead: 'Fonte'
    };
    return labels[key as keyof typeof labels] || key;
  };

  const getFilterValue = (key: string) => {
    const value = filters[key as keyof typeof filters];
    if (key === 'status') {
      const statusLabels = {
        'novo': 'Novo',
        'contactado': 'Contactado',
        'qualificado': 'Qualificado',
        'reuniao_agendada': 'Reunião Agendada',
        'ganho': 'Ganho',
        'perdido': 'Perdido'
      };
      return statusLabels[value as keyof typeof statusLabels] || value;
    }
    return value;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros
          <span className="text-sm font-normal text-gray-500">
            ({filteredLeads} de {totalLeads} leads)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div>
          <Input
            placeholder="Buscar leads..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Status */}
          <Select value={filters.status || 'todos'} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="novo">Novo</SelectItem>
              <SelectItem value="contactado">Contactado</SelectItem>
              <SelectItem value="qualificado">Qualificado</SelectItem>
              <SelectItem value="reuniao_agendada">Reunião Agendada</SelectItem>
              <SelectItem value="ganho">Ganho</SelectItem>
              <SelectItem value="perdido">Perdido</SelectItem>
            </SelectContent>
          </Select>

          {/* Setor */}
          <Select value={filters.setor || 'todos'} onValueChange={(value) => handleFilterChange('setor', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Setor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="tecnologia">Tecnologia</SelectItem>
              <SelectItem value="saude">Saúde</SelectItem>
              <SelectItem value="educacao">Educação</SelectItem>
              <SelectItem value="financeiro">Financeiro</SelectItem>
              <SelectItem value="varejo">Varejo</SelectItem>
              <SelectItem value="industria">Indústria</SelectItem>
              <SelectItem value="servicos">Serviços</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>

          {/* Tamanho da Empresa */}
          <Select value={filters.tamanho_empresa || 'todos'} onValueChange={(value) => handleFilterChange('tamanho_empresa', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Tamanho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="micro">Micro</SelectItem>
              <SelectItem value="pequena">Pequena</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="grande">Grande</SelectItem>
            </SelectContent>
          </Select>

          {/* Urgência */}
          <Select value={filters.urgencia || 'todas'} onValueChange={(value) => handleFilterChange('urgencia', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Urgência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
            </SelectContent>
          </Select>

          {/* Fonte */}
          <Select value={filters.fonte_lead || 'todas'} onValueChange={(value) => handleFilterChange('fonte_lead', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Fonte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="redes_sociais">Redes Sociais</SelectItem>
              <SelectItem value="indicacao">Indicação</SelectItem>
              <SelectItem value="evento">Evento</SelectItem>
              <SelectItem value="publicidade">Publicidade</SelectItem>
              <SelectItem value="email_marketing">Email Marketing</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">Filtros ativos:</span>
            {activeFilters.map((filterKey) => (
              <Badge key={filterKey} variant="secondary" className="flex items-center gap-1">
                {getFilterLabel(filterKey)}: {getFilterValue(filterKey)}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-500"
                  onClick={() => clearFilter(filterKey)}
                />
              </Badge>
            ))}
            <Button size="sm" variant="ghost" onClick={clearAllFilters}>
              Limpar tudo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
