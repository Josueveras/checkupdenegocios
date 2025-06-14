
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lead } from '@/types/lead';
import { 
  getUrgenciaColor,
  formatCurrency,
  getLeadQualificationLevel
} from '@/utils/leadHelpers';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Edit, 
  Eye, 
  Building,
  User,
  Star,
  GripVertical
} from 'lucide-react';

interface PipelineCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onView: (lead: Lead) => void;
  onCall?: (lead: Lead) => void;
  onEmail?: (lead: Lead) => void;
  onWhatsApp?: (lead: Lead) => void;
  isDragging?: boolean;
}

export function PipelineCard({ 
  lead, 
  onEdit, 
  onView, 
  onCall, 
  onEmail, 
  onWhatsApp,
  isDragging = false
}: PipelineCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: lead.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const urgenciaColor = getUrgenciaColor(lead.urgencia);
  const qualificationLevel = getLeadQualificationLevel(lead.score_qualificacao);

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-50' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header com drag handle */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Building className="h-3 w-3 text-gray-500 flex-shrink-0" />
                <h3 className="font-semibold text-sm truncate">{lead.empresa_nome}</h3>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-3 w-3 flex-shrink-0" />
                <span className="text-xs truncate">{lead.contato_nome}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 ml-2">
              <GripVertical className="h-4 w-4 text-gray-400" />
              <div className="flex items-center gap-1">
                <Star className={`h-3 w-3 ${qualificationLevel.color}`} />
                <span className={`text-xs font-medium ${qualificationLevel.color}`}>
                  {qualificationLevel.level}
                </span>
              </div>
            </div>
          </div>

          {/* Informações principais */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Setor:</span>
              <span className="font-medium truncate ml-2">{lead.setor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Urgência:</span>
              <span className={`font-medium capitalize ${urgenciaColor}`}>
                {lead.urgencia}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Receita:</span>
              <span className="font-medium text-green-600">
                {formatCurrency(lead.potencial_receita)}
              </span>
            </div>
          </div>

          {/* Ações compactas */}
          <div className="flex flex-wrap gap-1 pt-2 border-t">
            <Button variant="outline" size="sm" onClick={() => onView(lead)} className="h-7 px-2 text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Ver
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(lead)} className="h-7 px-2 text-xs">
              <Edit className="h-3 w-3 mr-1" />
              Editar
            </Button>
            {onCall && (
              <Button variant="outline" size="sm" onClick={() => onCall(lead)} className="h-7 px-2 text-xs">
                <Phone className="h-3 w-3" />
              </Button>
            )}
            {onEmail && (
              <Button variant="outline" size="sm" onClick={() => onEmail(lead)} className="h-7 px-2 text-xs">
                <Mail className="h-3 w-3" />
              </Button>
            )}
            {onWhatsApp && (
              <Button variant="outline" size="sm" onClick={() => onWhatsApp(lead)} className="h-7 px-2 text-xs">
                <MessageCircle className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
