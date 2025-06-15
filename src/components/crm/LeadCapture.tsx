
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateLead } from '@/hooks/useLeads';
import { toast } from '@/hooks/use-toast';
import { leadSchema } from '@/utils/leadValidation';
import { DynamicFormRenderer } from './DynamicFormRenderer';
import { useFormConfig } from '@/hooks/useFormConfig';

interface LeadCaptureProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export const LeadCapture = ({ onClose, onSuccess }: LeadCaptureProps) => {
  const createLead = useCreateLead();
  const { config: formConfig } = useFormConfig();
  const [selectedConfig, setSelectedConfig] = useState<string>('');
  
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
      
      await createLead.mutateAsync(validatedData);
      
      toast({
        title: "Lead criado com sucesso",
        description: "O lead foi adicionado ao sistema."
      });
      
      // Reset form
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
      
      onSuccess?.();
      onClose?.();
    } catch (error: any) {
      toast({
        title: "Erro ao criar lead",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Capturar Novo Lead</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Standard Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="empresa_nome">Nome da Empresa *</Label>
              <Input
                id="empresa_nome"
                value={formData.empresa_nome}
                onChange={(e) => handleInputChange('empresa_nome', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contato_nome">Nome do Contato *</Label>
              <Input
                id="contato_nome"
                value={formData.contato_nome}
                onChange={(e) => handleInputChange('contato_nome', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="setor">Setor</Label>
              <Input
                id="setor"
                value={formData.setor}
                onChange={(e) => handleInputChange('setor', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tamanho_empresa">Tamanho da Empresa</Label>
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fonte_lead">Fonte do Lead</Label>
              <Input
                id="fonte_lead"
                value={formData.fonte_lead}
                onChange={(e) => handleInputChange('fonte_lead', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="score_qualificacao">Score de Qualificação (0-100)</Label>
              <Input
                id="score_qualificacao"
                type="number"
                min="0"
                max="100"
                value={formData.score_qualificacao}
                onChange={(e) => handleInputChange('score_qualificacao', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="potencial_receita">Potencial de Receita (R$)</Label>
              <Input
                id="potencial_receita"
                type="number"
                min="0"
                value={formData.potencial_receita}
                onChange={(e) => handleInputChange('potencial_receita', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="urgencia">Urgência</Label>
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
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="necessidades">Necessidades</Label>
            <Textarea
              id="necessidades"
              value={formData.necessidades}
              onChange={(e) => handleInputChange('necessidades', e.target.value)}
              placeholder="Descreva as necessidades do cliente..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="orcamento_disponivel">Orçamento Disponível (R$)</Label>
            <Input
              id="orcamento_disponivel"
              type="number"
              min="0"
              value={formData.orcamento_disponivel}
              onChange={(e) => handleInputChange('orcamento_disponivel', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              placeholder="Observações adicionais..."
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={createLead.isPending}>
              {createLead.isPending ? 'Salvando...' : 'Salvar Lead'}
            </Button>
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
