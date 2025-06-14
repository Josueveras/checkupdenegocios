
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lead } from '@/types/lead';
import { formatCurrency, getUrgenciaColor } from '@/utils/leadHelpers';
import { Building, User, Phone, Mail, MessageCircle } from 'lucide-react';

interface PipelineCardProps {
  lead: Lead;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onCall?: (lead: Lead) => void;
  onEmail?: (lead: Lead) => void;
  onWhatsApp?: (lead: Lead) => void;
}

export function PipelineCard({ 
  lead, 
  onView, 
  onEdit, 
  onCall, 
  onEmail, 
  onWhatsApp 
}: PipelineCardProps) {
  const urgenciaColor = getUrgenciaColor(lead.urgencia);

  return (
    <Card className="cursor-pointer hover:shadow-md transition-all duration-200 mb-3">
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Header com empresa e urgência */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <Building className="h-3 w-3 text-gray-500 flex-shrink-0" />
              <h4 className="font-medium text-sm truncate">{lead.empresa_nome}</h4>
            </div>
            <Badge variant="outline" className={`text-xs ${urgenciaColor} ml-2 flex-shrink-0`}>
              {lead.urgencia}
            </Badge>
          </div>

          {/* Contato */}
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <User className="h-3 w-3" />
            <span className="truncate">{lead.contato_nome}</span>
          </div>

          {/* Valor potencial */}
          <div className="text-xs font-medium text-green-600">
            {formatCurrency(lead.potencial_receita || 0)}
          </div>

          {/* Ações rápidas */}
          <div className="flex gap-1 pt-1 border-t">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(lead);
              }}
              className="flex-1 text-xs py-1 px-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Ver
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(lead);
              }}
              className="flex-1 text-xs py-1 px-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Editar
            </button>
          </div>

          {/* Contatos rápidos */}
          <div className="flex gap-1">
            {onCall && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCall(lead);
                }}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                title="Ligar"
              >
                <Phone className="h-3 w-3 text-gray-500" />
              </button>
            )}
            {onEmail && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEmail(lead);
                }}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                title="Email"
              >
                <Mail className="h-3 w-3 text-gray-500" />
              </button>
            )}
            {onWhatsApp && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onWhatsApp(lead);
                }}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                title="WhatsApp"
              >
                <MessageCircle className="h-3 w-3 text-gray-500" />
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
