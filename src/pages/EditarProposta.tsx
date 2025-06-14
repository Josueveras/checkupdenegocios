
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { useProposalEdit } from '@/hooks/useProposalEdit';
import { useProposalForm } from '@/hooks/useProposalForm';
import { supabase } from '@/integrations/supabase/client';
import { EditProposalHeader } from '@/components/proposta/EditProposalHeader';
import { CompanyInfo } from '@/components/proposta/CompanyInfo';
import { ProposalDataForm } from '@/components/proposta/ProposalDataForm';
import { EmpresaSelector } from '@/components/proposta/EmpresaSelector';

const EditarProposta = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const proposalId = searchParams.get('id');
  const tipo = searchParams.get('tipo');
  const planoId = searchParams.get('planoId');
  const queryClient = useQueryClient();

  const isNewProposal = tipo === 'plano' && planoId;

  const { data: proposalData, isLoading } = useProposalEdit(
    isNewProposal ? null : proposalId, 
    isNewProposal ? planoId : null
  );

  // Safely extract proposta and plano data
  const proposta = proposalData?.type === 'existing' ? proposalData.data : null;
  const plano = proposalData?.type === 'plan' ? proposalData.data : null;

  const { formData, updateFormData, validateForm } = useProposalForm(proposta, plano);

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

  const createProposalMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!data.empresa_id) {
        throw new Error('Empresa deve ser selecionada');
      }

      // Primeiro criar um diagnóstico básico para a empresa
      const { data: diagnostico, error: diagError } = await supabase
        .from('diagnosticos')
        .insert({
          empresa_id: data.empresa_id,
          status: 'concluido',
          nivel: 'medio' // Changed from nivel_maturidade to nivel
        })
        .select()
        .single();

      if (diagError) throw diagError;

      // Depois criar a proposta
      const { error } = await supabase
        .from('propostas')
        .insert({
          diagnostico_id: diagnostico.id,
          objetivo: data.objetivo,
          valor: data.valor ? parseFloat(data.valor) : null,
          prazo: data.prazo,
          status: data.status,
          acoes_sugeridas: data.acoes_sugeridas
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
      toast({
        title: "Proposta criada",
        description: "A proposta foi criada com sucesso."
      });
      navigate('/propostas');
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

  const handleSave = () => {
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

  const handleCancel = () => {
    navigate('/propostas');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petrol mx-auto mb-4"></div>
          <p>{isNewProposal ? 'Carregando dados do plano...' : 'Carregando proposta...'}</p>
        </div>
      </div>
    );
  }

  if (!proposalData) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            {isNewProposal ? 'Plano não encontrado.' : 'Proposta não encontrada.'}
          </p>
          <button 
            onClick={() => navigate('/propostas')} 
            className="bg-petrol hover:bg-petrol/90 text-white px-4 py-2 rounded"
          >
            Voltar às Propostas
          </button>
        </div>
      </div>
    );
  }

  // Safely access empresa and plano name
  const empresa = proposta?.diagnosticos?.empresas;
  const empresaNome = isNewProposal ? plano?.nome : empresa?.nome;
  const isSaving = updateProposalMutation.isPending || createProposalMutation.isPending;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <EditProposalHeader
        empresaNome={empresaNome}
        onCancel={handleCancel}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {empresa && <CompanyInfo empresa={empresa} />}

      {isNewProposal && (
        <EmpresaSelector
          selectedEmpresaId={formData.empresa_id || ''}
          onChange={(empresaId) => updateFormData({ empresa_id: empresaId })}
        />
      )}

      <ProposalDataForm
        formData={formData}
        onChange={updateFormData}
      />
    </div>
  );
};

export default EditarProposta;
