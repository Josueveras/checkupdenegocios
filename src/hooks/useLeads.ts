
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Lead, LeadActivity } from '@/types/lead';
import { useToast } from '@/hooks/use-toast';

// Mock data temporário até configurar Supabase
const mockLeads: Lead[] = [
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

const mockActivities: LeadActivity[] = [
  {
    id: '1',
    lead_id: '1',
    tipo: 'email',
    descricao: 'Primeiro contato enviado',
    data: new Date().toISOString(),
    usuario: 'Sistema'
  }
];

export const useLeads = () => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockLeads;
    }
  });
};

export const useLeadById = (id: string) => {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const lead = mockLeads.find(l => l.id === id);
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
      return mockActivities.filter(a => a.lead_id === leadId);
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
      
      const newLead: Lead = {
        ...lead,
        id: (mockLeads.length + 1).toString(),
        data_criacao: new Date().toISOString(),
        data_ultima_interacao: new Date().toISOString()
      };
      
      mockLeads.push(newLead);
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
      
      const index = mockLeads.findIndex(l => l.id === id);
      if (index === -1) throw new Error('Lead não encontrado');
      
      mockLeads[index] = {
        ...mockLeads[index],
        ...updates,
        data_ultima_interacao: new Date().toISOString()
      };
      
      return mockLeads[index];
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
      
      const index = mockLeads.findIndex(l => l.id === id);
      if (index === -1) throw new Error('Lead não encontrado');
      
      mockLeads.splice(index, 1);
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
