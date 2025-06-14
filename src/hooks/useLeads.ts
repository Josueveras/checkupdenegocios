
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Lead, LeadActivity } from '@/types/lead';
import { useToast } from '@/hooks/use-toast';

export const useLeads = () => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('data_criacao', { ascending: false });
      
      if (error) throw error;
      return data as Lead[];
    }
  });
};

export const useLeadById = (id: string) => {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Lead;
    },
    enabled: !!id
  });
};

export const useLeadActivities = (leadId: string) => {
  return useQuery({
    queryKey: ['lead-activities', leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lead_activities')
        .select('*')
        .eq('lead_id', leadId)
        .order('data', { ascending: false });
      
      if (error) throw error;
      return data as LeadActivity[];
    },
    enabled: !!leadId
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (lead: Omit<Lead, 'id' | 'data_criacao' | 'data_ultima_interacao'>) => {
      const { data, error } = await supabase
        .from('leads')
        .insert({
          ...lead,
          data_criacao: new Date().toISOString(),
          data_ultima_interacao: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('leads')
        .update({
          ...updates,
          data_ultima_interacao: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
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
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
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
