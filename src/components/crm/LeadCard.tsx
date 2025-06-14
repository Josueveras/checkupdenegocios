
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lead } from '@/types/lead';
import { 
  getLeadStatusColor, 
  getLeadStatusLabel, 
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
  Calendar,
  Building,
  User,
  Star
} from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onView: (lead: Lead) => void;
  onCall?: (lead: Lead) => void;
  onEmail?: (lead: Lead) => void;
  onWhatsApp?: (lead: Lead) => void;
}

export function LeadCard({ 
  lead, 
  onEdit, 
  onView, 
  onCall, 
  onEmail, 
  onWhatsApp 
}: LeadCardProps) {
  const statusColor = getLeadStatusColor(lead.status);
  const statusLabel = getLeadStatusLabel(lead.status);
  const urgenciaColor = getUrgenciaColor(lead.urgencia);
  const qualificationLevel = getLeadQualificationLevel(lead.score_qualificacao);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Building className="h-4 w-4 text-gray-500" />
              <h3 className="font-semibold text-lg">{lead.empresa_nome}</h3>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-4 w-4" />
              <span>{lead.contato_nome}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={statusColor}>
              {statusLabel}
            </Badge>
            <div className="flex items-center gap-1">
              <Star className={`h-4 w-4 ${qualificationLevel.color}`} />
              <span className={`text-sm font-medium ${qualificationLevel.color}`}>
                {qualificationLevel.level}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Informações básicas */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Setor:</span>
              <p className="font-medium">{lead.setor}</p>
            </div>
            <div>
              <span className="text-gray-500">Tamanho:</span>
              <p className="font-medium capitalize">{lead.tamanho_empresa}</p>
            </div>
            <div>
              <span className="text-gray-500">Urgência:</span>
              <p className={`font-medium capitalize ${urgenciaColor}`}>
                {lead.urgencia}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Receita Potencial:</span>
              <p className="font-medium text-green-600">
                {formatCurrency(lead.potencial_receita)}
              </p>
            </div>
          </div>

          {/* Contato */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{lead.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{lead.telefone}</span>
          </div>

          {/* Data da última interação */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Última interação: {formatDate(lead.data_ultima_interacao)}</span>
          </div>

          {/* Ações */}
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" onClick={() => onView(lead)}>
              <Eye className="h-4 w-4 mr-1" />
              Ver
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(lead)}>
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
            {onCall && (
              <Button variant="outline" size="sm" onClick={() => onCall(lead)}>
                <Phone className="h-4 w-4 mr-1" />
                Ligar
              </Button>
            )}
            {onEmail && (
              <Button variant="outline" size="sm" onClick={() => onEmail(lead)}>
                <Mail className="h-4 w-4 mr-1" />
                Email
              </Button>
            )}
            {onWhatsApp && (
              <Button variant="outline" size="sm" onClick={() => onWhatsApp(lead)}>
                <MessageCircle className="h-4 w-4 mr-1" />
                WhatsApp
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
