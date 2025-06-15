
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProposalFormData {
  objetivo: string;
  valor: string;
  prazo: string;
  status: string;
  acoes_sugeridas: string[];
  empresa_id?: string;
}

type ProposalType = 'diagnostico' | 'plano';

export const useProposalMutations = (
  proposalId: string | null, 
  isNewProposal: boolean,
  proposalType: ProposalType = 'diagnostico'
) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const updateProposalMutation = useMutation({
    mutationFn: async (data: ProposalFormData) => {
      if (!proposalId) throw new Error('ID da proposta não encontrado');
      
      const { error } = await supabase
        .from('propostas')
        .update({
          objetivo: data.objetivo,
          valor: data.valor ? parseFloat(data.valor) : null,
          prazo: data.prazo,
          status: data.status,
          acoes_sugeridas: data.acoes_sugeridas
        })
        .eq('id', proposalId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidar ambas as queries sempre para garantir sincronização
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
      queryClient.invalidateQueries({ queryKey: ['propostas-planos'] });
      queryClient.invalidateQueries({ queryKey: ['proposal', proposalId] });
      
      toast({
        title: "Proposta atualizada",
        description: "A proposta foi atualizada com sucesso."
      });
      
      // Navegar para a página correta baseado no tipo
      const targetRoute = proposalType === 'plano' ? '/propostas-planos' : '/propostas';
      navigate(targetRoute);
    },
    onError: (error) => {
      console.error('Erro ao atualizar proposta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a proposta.",
        variant: "destructive"
      });
    }
  });

  const createProposalMutation = useMutation({
    mutationFn: async (data: ProposalFormData) => {
      if (!data.empresa_id) {
        throw new Error('Empresa deve ser selecionada');
      }

      // Criar proposta diretamente associada à empresa, sem diagnóstico
      const { error } = await supabase
        .from('propostas')
        .insert({
          empresa_id: data.empresa_id,
          diagnostico_id: null,
          objetivo: data.objetivo,
          valor: data.valor ? parseFloat(data.valor) : null,
          prazo: data.prazo,
          status: data.status,
          acoes_sugeridas: data.acoes_sugeridas
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidar ambas as queries sempre para garantir sincronização
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
      queryClient.invalidateQueries({ queryKey: ['propostas-planos'] });
      
      toast({
        title: "Proposta criada",
        description: "A proposta foi criada com sucesso."
      });
      
      // Navegar para a página correta baseado no tipo
      const targetRoute = proposalType === 'plano' ? '/propostas-planos' : '/propostas';
      navigate(targetRoute);
    },
    onError: (error) => {
      console.error('Erro ao criar proposta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a proposta.",
        variant: "destructive"
      });
    }
  });

  const handleSave = (formData: ProposalFormData, validateForm: () => boolean) => {
    if (!validateForm()) return;
    
    if (isNewProposal) {
      if (!formData.empresa_id) {
        toast({
          title: "Empresa obrigatória",
          description: "Selecione uma empresa para continuar.",
          variant: "destructive"
        });
        return;
      }
      createProposalMutation.mutate(formData);
    } else {
      updateProposalMutation.mutate(formData);
    }
  };

  const isSaving = updateProposalMutation.isPending || createProposalMutation.isPending;

  return {
    handleSave,
    isSaving
  };
};
