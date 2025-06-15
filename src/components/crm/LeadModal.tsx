
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLeads } from '@/hooks/useLeads';
import { toast } from '@/hooks/use-toast';
import { Lead } from '@/types/lead';
import { leadSchema } from '@/utils/leadValidation';

interface LeadModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  mode: 'view' | 'edit';
}

export const LeadModal = ({ lead, isOpen, onClose, mode }: LeadModalProps) => {
  const { updateLead, createLead } = useLeads();
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  
  const [formData, setFormData] = useState({
    empresa_nome: '',
    contato_nome: '',
    email: '',
    telefone: '',
    setor: '',
    tamanho_empresa: 'pequena' as const,
    fonte_lead: '',
    status: 'novo' as const,
    score_qualificacao: 0,
    potencial_receita: 0,
    observacoes: '',
    urgencia: 'media' as const,
    necessidades: '',
    orcamento_disponivel: 0,
    custom_fields: {} as Record<string, any>
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        empresa_nome: lead.empresa_nome || '',
        contato_nome: lead.contato_nome || '',
        email: lead.email || '',
        telefone: lead.telefone || '',
        setor: lead.setor || '',
        tamanho_empresa: lead.tamanho_empresa || 'pequena',
        fonte_lead: lead.fonte_lead || '',
        status: lead.status || 'novo',
        score_qualificacao: lead.score_qualificacao || 0,
        potencial_receita: lead.potencial_receita || 0,
        observacoes: lead.observacoes || '',
        urgencia: lead.urgencia || 'media',
        necessidades: lead.necessidades || '',
        orcamento_disponivel: lead.orcamento_disponivel || 0,
        custom_fields: lead.custom_fields || {}
      });
    } else {
      // Reset form for new lead
      setFormData({
        empresa_nome: '',
        contato_nome: '',
        email: '',
        telefone: '',
        setor: '',
        tamanho_empresa: 'pequena',
        fonte_lead: '',
        status: 'novo',
        score_qualificacao: 0,
        potencial_receita: 0,
        observacoes: '',
        urgencia: 'media',
        necessidades: '',
        orcamento_disponivel: 0,
        custom_fields: {}
      });
    }
    setIsEditing(mode === 'edit');
  }, [lead, mode]);

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('custom_')) {
      setFormData(prev => ({
        ...prev,
        custom_fields: {
          ...prev.custom_fields,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = leadSchema.parse(formData);
      
      if (lead) {
        await updateLead.mutateAsync({ ...validatedData, id: lead.id });
        toast({
          title: "Lead atualizado",
          description: "As informações do lead foram atualizadas com sucesso."
        });
      } else {
        await createLead.mutateAsync(validatedData);
        toast({
          title: "Lead criado",
          description: "O novo lead foi criado com sucesso."
        });
      }
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar lead",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'novo': 'bg-blue-100 text-blue-800',
      'contactado': 'bg-yellow-100 text-yellow-800',
      'qualificado': 'bg-green-100 text-green-800',
      'reuniao_agendada': 'bg-purple-100 text-purple-800',
      'ganho': 'bg-emerald-100 text-emerald-800',
      'perdido': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'novo': 'Novo',
      'contactado': 'Contactado',
      'qualificado': 'Qualificado',
      'reuniao_agendada': 'Reunião Agendada',
      'ganho': 'Ganho',
      'perdido': 'Perdido'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {lead ? (isEditing ? 'Editar Lead' : 'Detalhes do Lead') : 'Novo Lead'}
          </DialogTitle>
          <DialogDescription>
            {lead 
              ? (isEditing ? 'Edite as informações do lead' : 'Visualize as informações do lead')
              : 'Preencha as informações do novo lead'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="empresa_nome">Nome da Empresa *</Label>
              {isEditing ? (
                <Input
                  id="empresa_nome"
                  value={formData.empresa_nome}
                  onChange={(e) => handleInputChange('empresa_nome', e.target.value)}
                  required
                />
              ) : (
                <p className="text-sm p-2 bg-gray-50 rounded">{formData.empresa_nome || 'N/A'}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contato_nome">Nome do Contato *</Label>
              {isEditing ? (
                <Input
                  id="contato_nome"
                  value={formData.contato_nome}
                  onChange={(e) => handleInputChange('contato_nome', e.target.value)}
                  required
                />
              ) : (
                <p className="text-sm p-2 bg-gray-50 rounded">{formData.contato_nome || 'N/A'}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              ) : (
                <p className="text-sm p-2 bg-gray-50 rounded">{formData.email || 'N/A'}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              {isEditing ? (
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                />
              ) : (
                <p className="text-sm p-2 bg-gray-50 rounded">{formData.telefone || 'N/A'}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="setor">Setor</Label>
              {isEditing ? (
                <Input
                  id="setor"
                  value={formData.setor}
                  onChange={(e) => handleInputChange('setor', e.target.value)}
                />
              ) : (
                <p className="text-sm p-2 bg-gray-50 rounded">{formData.setor || 'N/A'}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tamanho_empresa">Tamanho da Empresa</Label>
              {isEditing ? (
                <Select value={formData.tamanho_empresa} onValueChange={(value: any) => handleInputChange('tamanho_empresa', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="micro">Micro</SelectItem>
                    <SelectItem value="pequena">Pequena</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="grande">Grande</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm p-2 bg-gray-50 rounded">{formData.tamanho_empresa || 'N/A'}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fonte_lead">Fonte do Lead</Label>
              {isEditing ? (
                <Input
                  id="fonte_lead"  
                  value={formData.fonte_lead}
                  onChange={(e) => handleInputChange('fonte_lead', e.target.value)}
                />
              ) : (
                <p className="text-sm p-2 bg-gray-50 rounded">{formData.fonte_lead || 'N/A'}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              {isEditing ? (
                <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="novo">Novo</SelectItem>
                    <SelectItem value="contactado">Contactado</SelectItem>
                    <SelectItem value="qualificado">Qualificado</SelectItem>
                    <SelectItem value="reuniao_agendada">Reunião Agendada</SelectItem>
                    <SelectItem value="ganho">Ganho</SelectItem>
                    <SelectItem value="perdido">Perdido</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(formData.status)}`}>
                  {getStatusLabel(formData.status)}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="score_qualificacao">Score de Qualificação (0-100)</Label>
              {isEditing ? (
                <Input
                  id="score_qualificacao"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.score_qualificacao}
                  onChange={(e) => handleInputChange('score_qualificacao', parseInt(e.target.value) || 0)}
                />
              ) : (
                <p className="text-sm p-2 bg-gray-50 rounded">{formData.score_qualificacao || 0}%</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="potencial_receita">Potencial de Receita (R$)</Label>
              {isEditing ? (
                <Input
                  id="potencial_receita"
                  type="number"
                  min="0"
                  value={formData.potencial_receita}
                  onChange={(e) => handleInputChange('potencial_receita', parseFloat(e.target.value) || 0)}
                />
              ) : (
                <p className="text-sm p-2 bg-gray-50 rounded">
                  R$ {formData.potencial_receita?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="urgencia">Urgência</Label>
              {isEditing ? (
                <Select value={formData.urgencia} onValueChange={(value: any) => handleInputChange('urgencia', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm p-2 bg-gray-50 rounded">{formData.urgencia || 'N/A'}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="necessidades">Necessidades</Label>
            {isEditing ? (
              <Textarea
                id="necessidades"
                value={formData.necessidades}
                onChange={(e) => handleInputChange('necessidades', e.target.value)}
                placeholder="Descreva as necessidades do cliente..."
              />
            ) : (
              <p className="text-sm p-2 bg-gray-50 rounded min-h-[60px]">{formData.necessidades || 'N/A'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="orcamento_disponivel">Orçamento Disponível (R$)</Label>
            {isEditing ? (
              <Input
                id="orcamento_disponivel"
                type="number"
                min="0"
                value={formData.orcamento_disponivel}
                onChange={(e) => handleInputChange('orcamento_disponivel', parseFloat(e.target.value) || 0)}
              />
            ) : (
              <p className="text-sm p-2 bg-gray-50 rounded">
                R$ {formData.orcamento_disponivel?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            {isEditing ? (
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                placeholder="Observações adicionais..."
              />
            ) : (
              <p className="text-sm p-2 bg-gray-50 rounded min-h-[60px]">{formData.observacoes || 'N/A'}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            {isEditing ? (
              <>
                <Button type="submit" disabled={updateLead.isPending || createLead.isPending}>
                  {(updateLead.isPending || createLead.isPending) ? 'Salvando...' : 'Salvar'}
                </Button>
                {lead && (
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                )}
              </>
            ) : (
              lead && (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Editar
                </Button>
              )
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
