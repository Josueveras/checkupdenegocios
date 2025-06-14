
export interface Lead {
  id: string;
  empresa_nome: string;
  contato_nome: string;
  email: string;
  telefone: string;
  setor: string;
  tamanho_empresa: 'micro' | 'pequena' | 'media' | 'grande';
  fonte_lead: string;
  status: 'novo' | 'contactado' | 'qualificado' | 'reuniao_agendada' | 'proposta_enviada' | 'ganho' | 'perdido';
  score_qualificacao: number;
  potencial_receita: number;
  observacoes: string;
  data_criacao: string;
  data_ultima_interacao: string;
  responsavel: string;
  urgencia: 'baixa' | 'media' | 'alta';
  necessidades: string;
  orcamento_disponivel: number;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  tipo: 'email' | 'telefone' | 'whatsapp' | 'reuniao' | 'proposta' | 'observacao';
  descricao: string;
  data: string;
  usuario: string;
}

export interface LeadStats {
  total_leads: number;
  leads_novos: number;
  leads_qualificados: number;
  leads_convertidos: number;
  taxa_conversao: number;
  receita_potencial: number;
  ticket_medio: number;
}
