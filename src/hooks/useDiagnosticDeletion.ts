
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useDiagnosticDeletion = () => {
  const queryClient = useQueryClient();

  const deleteDiagnosticDirectly = async (id: string) => {
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

    return { deleted: true };
  };

  const deleteDiagnostic = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      return await deleteDiagnosticDirectly(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnosticos'] });
      toast({
        title: "Diagnóstico excluído",
        description: "O diagnóstico foi excluído com sucesso."
      });
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
