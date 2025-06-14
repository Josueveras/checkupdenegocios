
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useCreateLead } from '@/hooks/useLeads';
import { useFormConfig } from '@/hooks/useFormConfig';
import { leadSchema, LeadFormData } from '@/utils/leadValidation';
import { calculateLeadScore } from '@/utils/leadHelpers';
import { DynamicFormRenderer } from './DynamicFormRenderer';
import { UserPlus, Save } from 'lucide-react';

interface LeadCaptureProps {
  onSuccess?: () => void;
}

export function LeadCapture({ onSuccess }: LeadCaptureProps) {
  const createLead = useCreateLead();
  const { config, loading } = useFormConfig();
  
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      status: 'novo',
      responsavel: 'Sistema',
      urgencia: 'media',
      tamanho_empresa: 'pequena',
      score_qualificacao: 0,
      potencial_receita: 0,
      orcamento_disponivel: 0,
      custom_fields: {}
    }
  });

  const onSubmit = async (data: LeadFormData) => {
    // Calcular score automaticamente
    const score = calculateLeadScore(data);
    
    const leadData = {
      ...data,
      score_qualificacao: score
    };

    try {
      await createLead.mutateAsync(leadData);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao criar lead:', error);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-petrol mx-auto mb-4"></div>
          <p>Carregando formulário...</p>
        </CardContent>
      </Card>
    );
  }

  if (!config) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <p>Erro ao carregar configuração do formulário.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Novo Lead
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DynamicFormRenderer fields={config.fields} form={form} />

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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
