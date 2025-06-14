
import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lead } from '@/types/lead';
import { PipelineColumn } from './PipelineColumn';
import { PipelineCard } from './PipelineCard';
import { PipelineConfigModal } from './PipelineConfigModal';
import { usePipelineConfig } from '@/hooks/usePipelineConfig';
import { useUpdateLead } from '@/hooks/useLeads';
import { Settings, Plus } from 'lucide-react';

interface PipelineViewProps {
  leads: Lead[];
  onViewLead: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onCall?: (lead: Lead) => void;
  onEmail?: (lead: Lead) => void;
  onWhatsApp?: (lead: Lead) => void;
  onCreateNewLead: () => void;
}

export function PipelineView({
  leads,
  onViewLead,
  onEditLead,
  onCall,
  onEmail,
  onWhatsApp,
  onCreateNewLead
}: PipelineViewProps) {
  const { columns, isLoading } = usePipelineConfig();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const updateLead = useUpdateLead();

  const activeLead = activeId ? leads.find(lead => lead.id === activeId) : null;

  // Agrupar leads por coluna
  const groupedLeads = columns.reduce((acc, column) => {
    acc[column.id] = leads.filter(lead => {
      // Mapear status do lead para coluna
      if (column.id === lead.status) return true;
      
      // Para colunas customizadas, usar mapeamento baseado no nome ou ID
      return false;
    });
    return acc;
  }, {} as Record<string, Lead[]>);

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
    const newColumnId = over.id as string;
    
    const lead = leads.find(l => l.id === leadId);
    const targetColumn = columns.find(c => c.id === newColumnId);
    
    if (lead && targetColumn && lead.status !== newColumnId) {
      // Atualizar status do lead baseado na coluna
      updateLead.mutateAsync({
        id: lead.id,
        status: newColumnId as Lead['status']
      });
    }
    
    setActiveId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petrol mx-auto mb-4"></div>
          <p>Carregando pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header do Pipeline */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Pipeline de Vendas</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsConfigModalOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
          <Button onClick={onCreateNewLead}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Pipeline Kanban */}
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {columns.map((column) => (
              <PipelineColumn
                key={column.id}
                column={column}
                leads={groupedLeads[column.id] || []}
                onViewLead={onViewLead}
                onEditLead={onEditLead}
                onCall={onCall}
                onEmail={onEmail}
                onWhatsApp={onWhatsApp}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeLead ? (
            <div className="rotate-6 opacity-90">
              <PipelineCard
                lead={activeLead}
                onView={() => {}}
                onEdit={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Pipeline vazio */}
      {leads.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Settings className="h-12 w-12 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Pipeline vazio</h3>
              <p className="text-gray-600 mb-6">
                Você ainda não tem leads no pipeline. Crie seu primeiro lead para começar.
              </p>
              <Button onClick={onCreateNewLead}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Lead
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de Configuração */}
      <PipelineConfigModal
        isOpen={isConfigModalOpen}
        onOpenChange={setIsConfigModalOpen}
      />
    </div>
  );
}
