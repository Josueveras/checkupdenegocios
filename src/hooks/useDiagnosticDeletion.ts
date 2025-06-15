
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useDiagnosticDeletion = () => {
  const queryClient = useQueryClient();

  const checkRelatedProposals = async (diagnosticId: string) => {
    const { data, error } = await supabase
      .from('propostas')
      .select('id, objetivo')
      .eq('diagnostico_id', diagnosticId);
    
    if (error) throw error;
    return data;
  };

  const deleteDiagnosticWithProposalCheck = async (id: string, forceDelete: boolean = false) => {
    // Verificar se existem propostas relacionadas
    const relatedProposals = await checkRelatedProposals(id);
    
    if (relatedProposals.length > 0 && !forceDelete) {
      // Retornar informação sobre propostas para o usuário decidir
      return {
        hasProposals: true,
        proposalCount: relatedProposals.length,
        proposals: relatedProposals
      };
    }

    // Se não há propostas ou usuário confirmou, prosseguir com exclusão
    // Primeiro deletar respostas relacionadas
    const { error: respostasError } = await supabase
      .from('respostas')
      .delete()
      .eq('diagnostico_id', id);
    
    if (respostasError) throw respostasError;

    // Depois deletar o diagnóstico
    const { error } = await supabase
      .from('diagnosticos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;

    return { hasProposals: false, deleted: true };
  };

  const deleteDiagnostic = useMutation({
    mutationFn: async ({ id, forceDelete = false }: { id: string; forceDelete?: boolean }) => {
      return await deleteDiagnosticWithProposalCheck(id, forceDelete);
    },
    onSuccess: (result, variables) => {
      if (result.hasProposals) {
        // Mostrar dialog de confirmação
        const proposalCount = result.proposalCount;
        const message = proposalCount === 1 
          ? `Este diagnóstico possui 1 proposta relacionada. Deseja mesmo excluir apenas o diagnóstico? A proposta permanecerá no sistema.`
          : `Este diagnóstico possui ${proposalCount} propostas relacionadas. Deseja mesmo excluir apenas o diagnóstico? As propostas permanecerão no sistema.`;
        
        if (window.confirm(message)) {
          // Usuário confirmou, deletar forçadamente
          deleteDiagnostic.mutate({ id: variables.id, forceDelete: true });
        }
        return;
      }

      if (result.deleted) {
        queryClient.invalidateQueries({ queryKey: ['diagnosticos'] });
        toast({
          title: "Diagnóstico excluído",
          description: "O diagnóstico foi excluído com sucesso. As propostas relacionadas foram mantidas."
        });
      }
    },
    onError: (error) => {
      console.error('Erro ao excluir diagnóstico:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o diagnóstico.",
        variant: "destructive"
      });
    }
  });

  return {
    deleteDiagnostic
  };
};
