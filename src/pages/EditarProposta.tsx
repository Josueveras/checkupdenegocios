
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { useProposalEdit } from '@/hooks/useProposalEdit';
import { useProposalForm } from '@/hooks/useProposalForm';
import { supabase } from '@/integrations/supabase/client';
import { EditProposalHeader } from '@/components/proposta/EditProposalHeader';
import { CompanyInfo } from '@/components/proposta/CompanyInfo';
import { ProposalDataForm } from '@/components/proposta/ProposalDataForm';

const EditarProposta = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const proposalId = searchParams.get('id');
  const queryClient = useQueryClient();

  const { data: proposta, isLoading } = useProposalEdit(proposalId);
  const { formData, updateFormData, validateForm } = useProposalForm(proposta);

  const updateProposalMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
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
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
      queryClient.invalidateQueries({ queryKey: ['proposal', proposalId] });
      toast({
        title: "Proposta atualizada",
        description: "A proposta foi atualizada com sucesso."
      });
      navigate('/propostas');
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

  const handleSave = () => {
    if (!validateForm()) return;
    updateProposalMutation.mutate(formData);
  };

  const handleCancel = () => {
    navigate('/propostas');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petrol mx-auto mb-4"></div>
          <p>Carregando proposta...</p>
        </div>
      </div>
    );
  }

  if (!proposta) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Proposta não encontrada.</p>
        <button 
          onClick={() => navigate('/propostas')} 
          className="bg-petrol hover:bg-petrol/90 text-white px-4 py-2 rounded"
        >
          Voltar às Propostas
        </button>
      </div>
    );
  }

  const empresa = proposta.diagnosticos?.empresas;

  return (
    <div className="space-y-6 animate-fade-in">
      <EditProposalHeader
        empresaNome={empresa?.nome}
        onCancel={handleCancel}
        onSave={handleSave}
        isSaving={updateProposalMutation.isPending}
      />

      {empresa && <CompanyInfo empresa={empresa} />}

      <ProposalDataForm
        formData={formData}
        onChange={updateFormData}
      />
    </div>
  );
};

export default EditarProposta;
