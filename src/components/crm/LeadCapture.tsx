
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCreateLead } from '@/hooks/useLeads';
import { useFormConfig } from '@/hooks/useFormConfig';
import { DynamicFormRenderer } from './DynamicFormRenderer';
import { LeadFormData } from '@/utils/leadValidation';
import { calculateLeadScore } from '@/utils/leadHelpers';
import { UserPlus, Save } from 'lucide-react';

interface LeadCaptureProps {
  onSuccess?: () => void;
}

export function LeadCapture({ onSuccess }: LeadCaptureProps) {
  const createLead = useCreateLead();
  const { config } = useFormConfig();

  const onSubmit = async (data: LeadFormData) => {
    // Calcular score automaticamente
    const score = calculateLeadScore(data);
    
    const leadData = {
      empresa_nome: data.empresa_nome,
      contato_nome: data.contato_nome,
      email: data.email,
      telefone: data.telefone,
      setor: data.setor,
      tamanho_empresa: data.tamanho_empresa,
      fonte_lead: data.fonte_lead,
      status: data.status || 'novo',
      score_qualificacao: score,
      potencial_receita: data.potencial_receita || 0,
      observacoes: data.observacoes,
      responsavel: data.responsavel || 'Sistema',
      urgencia: data.urgencia || 'media',
      necessidades: data.necessidades,
      orcamento_disponivel: data.orcamento_disponivel || 0,
      custom_fields: data.custom_fields || {}
    };

    try {
      await createLead.mutateAsync(leadData);
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao criar lead:', error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Novo Lead
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DynamicFormRenderer
          fields={config.fields}
          onSubmit={onSubmit}
        >
          {(form) => (
            <Button 
              type="submit" 
              className="w-full"
              disabled={createLead.isPending}
            >
              {createLead.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Criar Lead
                </>
              )}
            </Button>
          )}
        </DynamicFormRenderer>
      </CardContent>
    </Card>
  );
}
