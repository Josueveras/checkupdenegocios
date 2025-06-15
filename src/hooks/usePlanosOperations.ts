
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Plan } from '@/types/plan';

export const useCreatePlano = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (plano: Omit<Plan, 'id'>) => {
      const planToSave = {
        ...plano,
        tarefas: plano.servicos,
        ativo: true
      };
      delete (planToSave as any).servicos;
      
      const { data, error } = await supabase
        .from('planos')
        .insert([planToSave])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planos'] });
      toast({ title: "Plano criado com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro ao criar plano" });
    }
  });
};

export const useUpdatePlano = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (plano: Plan) => {
      const planToSave = {
        ...plano,
        tarefas: plano.servicos
      };
      delete (planToSave as any).servicos;
      
      const { data, error } = await supabase
        .from('planos')
        .update(planToSave)
        .eq('id', plano.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planos'] });
      toast({ title: "Plano atualizado com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar plano" });
    }
  });
};

export const useDeletePlano = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('planos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planos'] });
      toast({ title: "Plano excluído com sucesso" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir plano" });
    }
  });
};
