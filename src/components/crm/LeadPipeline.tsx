
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lead } from '@/types/lead';
import { 
  getLeadStatusColor, 
  getLeadStatusLabel, 
  formatCurrency,
  getLeadQualificationLevel
} from '@/utils/leadHelpers';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { PipelineColumn } from './PipelineColumn';
import { PipelineCard } from './PipelineCard';
import { useUpdateLead } from '@/hooks/useLeads';

interface LeadPipelineProps {
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onViewLead: (lead: Lead) => void;
  onCall?: (lead: Lead) => void;
  onEmail?: (lead: Lead) => void;
  onWhatsApp?: (lead: Lead) => void;
}

const PIPELINE_COLUMNS = [
  { id: 'novo', title: 'Novos', status: 'novo' as const },
  { id: 'contactado', title: 'Contactados', status: 'contactado' as const },
  { id: 'qualificado', title: 'Qualificados', status: 'qualificado' as const },
  { id: 'reuniao_agendada', title: 'Reunião Agendada', status: 'reuniao_agendada' as const },
  { id: 'proposta_enviada', title: 'Proposta Enviada', status: 'proposta_enviada' as const },
  { id: 'ganho', title: 'Ganhos', status: 'ganho' as const },
  { id: 'perdido', title: 'Perdidos', status: 'perdido' as const }
];

export function LeadPipeline({ 
  leads, 
  onEditLead, 
  onViewLead, 
  onCall, 
  onEmail, 
  onWhatsApp 
}: LeadPipelineProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const updateLead = useUpdateLead();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getLeadsByStatus = (status: Lead['status']) => {
    return leads.filter(lead => lead.status === status);
  };

  const getTotalValue = (status: Lead['status']) => {
    return getLeadsByStatus(status).reduce((sum, lead) => sum + (lead.potencial_receita || 0), 0);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const leadId = active.id as string;
    const newStatus = over.id as Lead['status'];
    
    const lead = leads.find(l => l.id === leadId);
    if (lead && lead.status !== newStatus) {
      updateLead.mutate({ id: leadId, status: newStatus });
    }
    
    setActiveId(null);
  };

  const activeLead = activeId ? leads.find(lead => lead.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
        {PIPELINE_COLUMNS.map((column) => {
          const columnLeads = getLeadsByStatus(column.status);
          const totalValue = getTotalValue(column.status);
          
          return (
            <PipelineColumn
              key={column.id}
              id={column.status}
              title={column.title}
              count={columnLeads.length}
              totalValue={totalValue}
              status={column.status}
            >
              {columnLeads.map((lead) => (
                <PipelineCard
                  key={lead.id}
                  lead={lead}
                  onEdit={onEditLead}
                  onView={onViewLead}
                  onCall={onCall}
                  onEmail={onEmail}
                  onWhatsApp={onWhatsApp}
                />
              ))}
            </PipelineColumn>
          );
        })}
      </div>
      
      <DragOverlay>
        {activeLead ? (
          <PipelineCard
            lead={activeLead}
            onEdit={onEditLead}
            onView={onViewLead}
            onCall={onCall}
            onEmail={onEmail}
            onWhatsApp={onWhatsApp}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
