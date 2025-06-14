
import { z } from 'zod';

export const leadSchema = z.object({
  empresa_nome: z.string().optional(),
  contato_nome: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  setor: z.string().optional(),
  tamanho_empresa: z.enum(['micro', 'pequena', 'media', 'grande']).optional(),
  fonte_lead: z.string().optional(),
  status: z.enum(['novo', 'contactado', 'qualificado', 'reuniao_agendada', 'proposta_enviada', 'ganho', 'perdido']).optional(),
  score_qualificacao: z.number().min(0).max(10).optional(),
  potencial_receita: z.number().min(0).optional(),
  observacoes: z.string().optional(),
  responsavel: z.string().optional(),
  urgencia: z.enum(['baixa', 'media', 'alta']).optional(),
  necessidades: z.string().optional(),
  orcamento_disponivel: z.number().min(0).optional(),
  custom_fields: z.record(z.any()).optional()
});

export type LeadFormData = z.infer<typeof leadSchema>;

export const dynamicFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  label: z.string(),
  type: z.enum(['text', 'email', 'tel', 'number', 'textarea', 'select', 'checkbox']),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
  order: z.number()
});

export type DynamicField = z.infer<typeof dynamicFieldSchema>;

export const formConfigSchema = z.object({
  fields: z.array(dynamicFieldSchema),
  name: z.string(),
  id: z.string()
});

export type FormConfig = z.infer<typeof formConfigSchema>;
