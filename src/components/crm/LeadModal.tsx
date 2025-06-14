
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUpdateLead, useDeleteLead } from '@/hooks/useLeads';
import { Lead } from '@/types/lead';
import { leadSchema, LeadFormData } from '@/utils/leadValidation';
import { 
  getLeadStatusColor, 
  getLeadStatusLabel, 
  formatCurrency,
  getLeadQualificationLevel,
  calculateLeadScore
} from '@/utils/leadHelpers';
import { Save, Trash, Star, Calendar, User, Building } from 'lucide-react';

interface LeadModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'view' | 'edit';
}

export function LeadModal({ lead, isOpen, onOpenChange, mode: initialMode }: LeadModalProps) {
  const [mode, setMode] = useState(initialMode);
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: lead ? {
      empresa_nome: lead.empresa_nome,
      contato_nome: lead.contato_nome,
      email: lead.email,
      telefone: lead.telefone,
      setor: lead.setor,
      tamanho_empresa: lead.tamanho_empresa,
      fonte_lead: lead.fonte_lead,
      status: lead.status,
      score_qualificacao: lead.score_qualificacao,
      potencial_receita: lead.potencial_receita,
      observacoes: lead.observacoes,
      responsavel: lead.responsavel,
      urgencia: lead.urgencia,
      necessidades: lead.necessidades,
      orcamento_disponivel: lead.orcamento_disponivel
    } : undefined
  });

  if (!lead) return null;

  const statusColor = getLeadStatusColor(lead.status);
  const statusLabel = getLeadStatusLabel(lead.status);
  const qualificationLevel = getLeadQualificationLevel(lead.score_qualificacao);

  const onSubmit = async (data: LeadFormData) => {
    const score = calculateLeadScore(data);
    
    try {
      await updateLead.mutateAsync({
        id: lead.id,
        ...data,
        score_qualificacao: score
      });
      setMode('view');
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este lead?')) {
      try {
        await deleteLead.mutateAsync(lead.id);
        onOpenChange(false);
      } catch (error) {
        console.error('Erro ao excluir lead:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building className="h-5 w-5" />
              {lead.empresa_nome}
            </div>
            <div className="flex items-center gap-2">
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
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            {mode === 'view' ? (
              <div className="space-y-6">
                {/* Informações básicas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Contato</label>
                    <p className="font-medium">{lead.contato_nome}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">{lead.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Telefone</label>
                    <p className="font-medium">{lead.telefone}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Setor</label>
                    <p className="font-medium">{lead.setor}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Tamanho</label>
                    <p className="font-medium capitalize">{lead.tamanho_empresa}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Fonte</label>
                    <p className="font-medium">{lead.fonte_lead}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Urgência</label>
                    <p className="font-medium capitalize">{lead.urgencia}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Score</label>
                    <p className="font-medium">{lead.score_qualificacao}/10</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Receita Potencial</label>
                    <p className="font-medium text-green-600">
                      {formatCurrency(lead.potencial_receita)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Orçamento Disponível</label>
                    <p className="font-medium">
                      {formatCurrency(lead.orcamento_disponivel)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Necessidades</label>
                  <p className="font-medium mt-1">{lead.necessidades}</p>
                </div>

                {lead.observacoes && (
                  <div>
                    <label className="text-sm text-gray-500">Observações</label>
                    <p className="font-medium mt-1">{lead.observacoes}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500 pt-4 border-t">
                  <Calendar className="h-4 w-4" />
                  <span>Criado em: {formatDate(lead.data_criacao)}</span>
                  <span>•</span>
                  <span>Última interação: {formatDate(lead.data_ultima_interacao)}</span>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => setMode('edit')}>
                    Editar
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    <Trash className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Formulário de edição - similar ao LeadCapture mas com campos preenchidos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="empresa_nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Empresa</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contato_nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Contato</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
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
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="novo">Novo</SelectItem>
                              <SelectItem value="contactado">Contactado</SelectItem>
                              <SelectItem value="qualificado">Qualificado</SelectItem>
                              <SelectItem value="reuniao_agendada">Reunião Agendada</SelectItem>
                              <SelectItem value="proposta_enviada">Proposta Enviada</SelectItem>
                              <SelectItem value="ganho">Ganho</SelectItem>
                              <SelectItem value="perdido">Perdido</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="urgencia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Urgência</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
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

                  <div className="flex gap-2">
                    <Button type="submit" disabled={updateLead.isPending}>
                      {updateLead.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar
                        </>
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setMode('view')}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-8 w-8 mx-auto mb-2" />
              <p>Histórico de atividades será implementado em breve</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
