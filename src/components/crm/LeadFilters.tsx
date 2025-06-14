
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { Lead } from '@/types/lead';

interface LeadFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  urgenciaFilter: string;
  setUrgenciaFilter: (urgencia: string) => void;
  tamanhoFilter: string;
  setTamanhoFilter: (tamanho: string) => void;
  onClearFilters: () => void;
}

export function LeadFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  urgenciaFilter,
  setUrgenciaFilter,
  tamanhoFilter,
  setTamanhoFilter,
  onClearFilters
}: LeadFiltersProps) {
  const hasActiveFilters = searchTerm || statusFilter !== 'todos' || urgenciaFilter !== 'todos' || tamanhoFilter !== 'todos';

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar por empresa ou contato..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2 overflow-x-auto">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[140px] min-w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos Status</SelectItem>
            <SelectItem value="novo">Novo</SelectItem>
            <SelectItem value="contactado">Contactado</SelectItem>
            <SelectItem value="qualificado">Qualificado</SelectItem>
            <SelectItem value="reuniao_agendada">Reunião Agendada</SelectItem>
            <SelectItem value="proposta_enviada">Proposta Enviada</SelectItem>
            <SelectItem value="ganho">Ganho</SelectItem>
            <SelectItem value="perdido">Perdido</SelectItem>
          </SelectContent>
        </Select>

        <Select value={urgenciaFilter} onValueChange={setUrgenciaFilter}>
          <SelectTrigger className="w-full sm:w-[120px] min-w-[120px]">
            <SelectValue placeholder="Urgência" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>

        <Select value={tamanhoFilter} onValueChange={setTamanhoFilter}>
          <SelectTrigger className="w-full sm:w-[120px] min-w-[120px]">
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

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters} className="min-w-[80px]">
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
}
