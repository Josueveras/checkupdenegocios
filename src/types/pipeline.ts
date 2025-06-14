
export interface PipelineColumn {
  id: string;
  name: string;
  color: string;
  order: number;
  type: 'normal' | 'ganho' | 'perdido';
}

export interface PipelineConfig {
  columns: PipelineColumn[];
  lastUpdated: string;
}

export interface PipelineStats {
  [columnId: string]: {
    count: number;
    totalValue: number;
  };
}

// Configuração padrão baseada nos status existentes
export const DEFAULT_PIPELINE_CONFIG: PipelineConfig = {
  columns: [
    {
      id: 'novo',
      name: 'Novo',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      order: 0,
      type: 'normal'
    },
    {
      id: 'contactado',
      name: 'Contactado',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      order: 1,
      type: 'normal'
    },
    {
      id: 'qualificado',
      name: 'Qualificado',
      color: 'bg-green-100 text-green-800 border-green-200',
      order: 2,
      type: 'normal'
    },
    {
      id: 'reuniao_agendada',
      name: 'Reunião Agendada',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      order: 3,
      type: 'normal'
    },
    {
      id: 'proposta_enviada',
      name: 'Proposta Enviada',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      order: 4,
      type: 'normal'
    },
    {
      id: 'ganho',
      name: 'Ganho',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      order: 5,
      type: 'ganho'
    },
    {
      id: 'perdido',
      name: 'Perdido',
      color: 'bg-red-100 text-red-800 border-red-200',
      order: 6,
      type: 'perdido'
    }
  ],
  lastUpdated: new Date().toISOString()
};
