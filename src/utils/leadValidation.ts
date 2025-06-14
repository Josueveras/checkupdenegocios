
import { z } from 'zod';

export const leadSchema = z.object({
  empresa_nome: z.string().min(2, 'Nome da empresa deve ter pelo menos 2 caracteres'),
  contato_nome: z.string().min(2, 'Nome do contato deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  setor: z.string().min(2, 'Setor é obrigatório'),
  tamanho_empresa: z.enum(['micro', 'pequena', 'media', 'grande']),
  fonte_lead: z.string().min(2, 'Fonte do lead é obrigatória'),
  status: z.enum(['novo', 'contactado', 'qualificado', 'reuniao_agendada', 'proposta_enviada', 'ganho', 'perdido']),
  score_qualificacao: z.number().min(0).max(10),
  potencial_receita: z.number().min(0),
  observacoes: z.string(),
  responsavel: z.string().min(2, 'Responsável é obrigatório'),
  urgencia: z.enum(['baixa', 'media', 'alta']),
  necessidades: z.string().min(10, 'Descreva as necessidades do cliente'),
  orcamento_disponivel: z.number().min(0)
});

export type LeadFormData = z.infer<typeof leadSchema>;
