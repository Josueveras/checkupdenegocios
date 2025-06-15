
import { z } from 'zod';

export const leadSchema = z.object({
  empresa_nome: z.string().min(1, 'Nome da empresa é obrigatório'),
  contato_nome: z.string().min(1, 'Nome do contato é obrigatório'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().optional(),
  setor: z.string().optional(),
  tamanho_empresa: z.enum(['micro', 'pequena', 'media', 'grande']).optional(),
  fonte_lead: z.string().optional(),
  status: z.enum(['novo', 'contactado', 'qualificado', 'reuniao_agendada', 'ganho', 'perdido']).default('novo'),
  score_qualificacao: z.number().min(0).max(100).optional(),
  potencial_receita: z.number().min(0).optional(),
  observacoes: z.string().optional(),
  urgencia: z.enum(['baixa', 'media', 'alta']).optional(),
  necessidades: z.string().optional(),
  orcamento_disponivel: z.number().min(0).optional(),
  custom_fields: z.record(z.any()).optional()
});

export const leadUpdateSchema = leadSchema.partial().extend({
  id: z.string()
});

export type LeadFormData = z.infer<typeof leadSchema>;
export type LeadUpdateData = z.infer<typeof leadUpdateSchema>;
