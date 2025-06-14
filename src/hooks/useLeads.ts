
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Lead, LeadActivity } from '@/types/lead';
import { useToast } from '@/hooks/use-toast';

// Chave para o localStorage
const LEADS_STORAGE_KEY = 'crm-leads';
const ACTIVITIES_STORAGE_KEY = 'crm-activities';

// Mock data inicial (usado apenas se não houver dados no localStorage)
const initialMockLeads: Lead[] = [
  {
    id: '1',
    empresa_nome: 'TechCorp Solutions',
    contato_nome: 'João Silva',
    email: 'joao@techcorp.com',
    telefone: '(11) 99999-9999',
    setor: 'Tecnologia',
    tamanho_empresa: 'media',
    fonte_lead: 'Site',
    status: 'novo',
    score_qualificacao: 8,
    potencial_receita: 50000,
    observacoes: 'Empresa em crescimento, interessada em soluções de automação',
    data_criacao: new Date().toISOString(),
    data_ultima_interacao: new Date().toISOString(),
    responsavel: 'Sistema',
    urgencia: 'alta',
    necessidades: 'Automatizar processos internos e melhorar eficiência operacional',
    orcamento_disponivel: 30000
  },
  {
    id: '2',
    empresa_nome: 'Varejo Plus',
    contato_nome: 'Maria Santos',
    email: 'maria@varejoplus.com',
    telefone: '(11) 88888-8888',
    setor: 'Varejo',
    tamanho_empresa: 'pequena',
    fonte_lead: 'LinkedIn',
    status: 'contactado',
    score_qualificacao: 6,
    potencial_receita: 25000,
    observacoes: 'Primeira conversa foi positiva, aguardando retorno',
    data_criacao: new Date(Date.now() - 86400000).toISOString(),
    data_ultima_interacao: new Date().toISOString(),
    responsavel: 'Sistema',
    urgencia: 'media',
    necessidades: 'Melhorar gestão de estoque e vendas online',
    orcamento_disponivel: 15000
  }
];

const initialMockActivities: LeadActivity[] = [
  {
    id: '1',
    lead_id: '1',
    tipo: 'email',
    descricao: 'Primeiro contato enviado',
    data: new Date().toISOString(),
    usuario: 'Sistema'
  }
];

// Funções utilitárias para localStorage
const getStoredLeads = (): Lead[] => {
  try {
    const stored = localStorage.getItem(LEADS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Se não houver dados armazenados, usar dados iniciais e salvar
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(initialMockLeads));
    return initialMockLeads;
  } catch (error) {
    console.error('Erro ao carregar leads do localStorage:', error);
    return initialMockLeads;
  }
};

const saveLeads = (leads: Lead[]) => {
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  } catch (error) {
    console.error('Erro ao salvar leads no localStorage:', error);
  }
};

const getStoredActivities = (): LeadActivity[] => {
  try {
    const stored = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(initialMockActivities));
    return initialMockActivities;
  } catch (error) {
    console.error('Erro ao carregar atividades do localStorage:', error);
    return initialMockActivities;
  }
};

const saveActivities = (activities: LeadActivity[]) => {
  try {
    localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities));
  } catch (error) {
    console.error('Erro ao salvar atividades no localStorage:', error);
  }
};

export const useLeads = () => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      return getStoredLeads();
    }
  });
};

export const useLeadById = (id: string) => {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const leads = getStoredLeads();
      const lead = leads.find(l => l.id === id);
      if (!lead) throw new Error('Lead não encontrado');
      return lead;
    },
    enabled: !!id
  });
};

export const useLeadActivities = (leadId: string) => {
  return useQuery({
    queryKey: ['lead-activities', leadId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const activities = getStoredActivities();
      return activities.filter(a => a.lead_id === leadId);
    },
    enabled: !!leadId
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (lead: Omit<Lead, 'id' | 'data_criacao' | 'data_ultima_interacao'>) => {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const leads = getStoredLeads();
      const newId = (Math.max(...leads.map(l => parseInt(l.id)), 0) + 1).toString();
      
      const newLead: Lead = {
        ...lead,
        id: newId,
        data_criacao: new Date().toISOString(),
        data_ultima_interacao: new Date().toISOString()
      };
      
      const updatedLeads = [...leads, newLead];
      saveLeads(updatedLeads);
      
      return newLead;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: "Lead criado com sucesso!",
        description: "O novo lead foi adicionado ao sistema.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar lead",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
      console.error('Erro ao criar lead:', error);
    }
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Lead> & { id: string }) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const leads = getStoredLeads();
      const index = leads.findIndex(l => l.id === id);
      if (index === -1) throw new Error('Lead não encontrado');
      
      const updatedLead = {
        ...leads[index],
        ...updates,
        data_ultima_interacao: new Date().toISOString()
      };
      
      leads[index] = updatedLead;
      saveLeads(leads);
      
      return updatedLead;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: "Lead atualizado!",
        description: "As informações foram salvas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar lead",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const leads = getStoredLeads();
      const index = leads.findIndex(l => l.id === id);
      if (index === -1) throw new Error('Lead não encontrado');
      
      const updatedLeads = leads.filter(l => l.id !== id);
      saveLeads(updatedLeads);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: "Lead removido",
        description: "O lead foi removido do sistema.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao remover lead",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  });
};
