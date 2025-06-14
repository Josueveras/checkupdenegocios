
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PipelineColumn as PipelineColumnType } from '@/types/pipeline';
import { Lead } from '@/types/lead';
import { PipelineCard } from './PipelineCard';
import { formatCurrency } from '@/utils/leadHelpers';
import { Settings } from 'lucide-react';

interface PipelineColumnProps {
  column: PipelineColumnType;
  leads: Lead[];
  onViewLead: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onCall?: (lead: Lead) => void;
  onEmail?: (lead: Lead) => void;
  onWhatsApp?: (lead: Lead) => void;
  onConfigureColumn?: (column: PipelineColumnType) => void;
}

export function PipelineColumn({
  column,
  leads,
  onViewLead,
  onEditLead,
  onCall,
  onEmail,
  onWhatsApp,
  onConfigureColumn
}: PipelineColumnProps) {
  const {
    isOver,
    setNodeRef,
  } = useDroppable({
    id: column.id,
  });

  const totalValue = leads.reduce((sum, lead) => sum + (lead.potencial_receita || 0), 0);
  const count = leads.length;

  return (
    <div className="flex-shrink-0 w-80">
      <Card className={`h-full ${isOver ? 'ring-2 ring-petrol ring-opacity-50' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={column.color}>
                {column.name}
              </Badge>
              {onConfigureColumn && (
                <button
                  onClick={() => onConfigureColumn(column)}
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                  title="Configurar coluna"
                >
                  <Settings className="h-3 w-3 text-gray-500" />
                </button>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{count} leads</div>
              {totalValue > 0 && (
                <div className="text-xs text-green-600 font-medium">
                  {formatCurrency(totalValue)}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div
            ref={setNodeRef}
            className="min-h-[200px] max-h-[600px] overflow-y-auto space-y-2"
          >
            <SortableContext
              items={leads.map(lead => lead.id)}
              strategy={verticalListSortingStrategy}
            >
              {leads.map((lead) => (
                <div key={lead.id} className="pipeline-card-container">
                  <PipelineCard
                    lead={lead}
                    onView={onViewLead}
                    onEdit={onEditLead}
                    onCall={onCall}
                    onEmail={onEmail}
                    onWhatsApp={onWhatsApp}
                  />
                </div>
              ))}
            </SortableContext>
            
            {leads.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <div className="text-sm">Nenhum lead nesta etapa</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
