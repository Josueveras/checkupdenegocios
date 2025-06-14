
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateLead } from '@/hooks/useLeads';
import { leadSchema, LeadFormData } from '@/utils/leadValidation';
import { calculateLeadScore } from '@/utils/leadHelpers';
import { UserPlus, Save } from 'lucide-react';

interface LeadCaptureProps {
  onSuccess?: () => void;
}

export function LeadCapture({ onSuccess }: LeadCaptureProps) {
  const createLead = useCreateLead();
  
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      empresa_nome: '',
      contato_nome: '',
      email: '',
      telefone: '',
      setor: '',
      tamanho_empresa: 'pequena',
      fonte_lead: 'Site',
      status: 'novo',
      score_qualificacao: 0,
      potencial_receita: 0,
      observacoes: '',
      responsavel: 'Sistema',
      urgencia: 'media',
      necessidades: '',
      orcamento_disponivel: 0
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Novo Lead
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações da Empresa */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações da Empresa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="empresa_nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Empresa *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Empresa ABC Ltda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="setor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Setor *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Tecnologia, Varejo..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tamanho_empresa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tamanho da Empresa *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tamanho" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="micro">Micro (até 9 funcionários)</SelectItem>
                          <SelectItem value="pequena">Pequena (10-49 funcionários)</SelectItem>
                          <SelectItem value="media">Média (50-249 funcionários)</SelectItem>
                          <SelectItem value="grande">Grande (250+ funcionários)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fonte_lead"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fonte do Lead *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Site, Indicação, LinkedIn..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Informações de Contato */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações de Contato</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contato_nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Contato *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: João Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contato@empresa.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone *</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="urgencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgência *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a urgência" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="baixa">Baixa</SelectItem>
                          <SelectItem value="media">Média</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Qualificação */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Qualificação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="potencial_receita"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receita Potencial (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="orcamento_disponivel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orçamento Disponível (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="necessidades"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Necessidades do Cliente *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva as principais necessidades e desafios do cliente..."
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações Adicionais</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Informações extras sobre o lead..."
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
