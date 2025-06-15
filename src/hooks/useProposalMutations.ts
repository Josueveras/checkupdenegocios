
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
  diagnostico_id?: string;
  plano_id?: string;
}

type ProposalType = 'diagnostico' | 'plano';

export const useProposalMutations = (
  proposalId: string | null, 
  isNewProposal: boolean,
  proposalType: ProposalType = 'diagnostico',
  planoId?: string | null
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
      if (!data.diagnostico_id) {
        throw new Error('Diagnóstico deve ser selecionado');
      }

      // Criar proposta com diagnostico_id obrigatório e plano_id opcional
      const proposalData: any = {
        diagnostico_id: data.diagnostico_id,
        objetivo: data.objetivo,
        valor: data.valor ? parseFloat(data.valor) : null,
        prazo: data.prazo,
        status: data.status,
        acoes_sugeridas: data.acoes_sugeridas
      };

      // Se é proposta de plano, incluir plano_id
      if (proposalType === 'plano' && planoId) {
        proposalData.plano_id = planoId;
      }

      const { error } = await supabase
        .from('propostas')
        .insert(proposalData);
      
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
      if (!formData.diagnostico_id) {
        toast({
          title: "Diagnóstico obrigatório",
          description: "Selecione um diagnóstico para continuar.",
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
