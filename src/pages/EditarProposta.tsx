
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProposalEdit } from '@/hooks/useProposalEdit';
import { useProposalForm } from '@/hooks/useProposalForm';
import { useProposalMutations } from '@/hooks/useProposalMutations';
import { EditProposalHeader } from '@/components/proposta/EditProposalHeader';
import { CompanyInfo } from '@/components/proposta/CompanyInfo';
import { ProposalDataForm } from '@/components/proposta/ProposalDataForm';
import { EmpresaSelector } from '@/components/proposta/EmpresaSelector';
import { ProposalLoadingState } from '@/components/proposta/ProposalLoadingState';
import { ProposalNotFoundState } from '@/components/proposta/ProposalNotFoundState';

const EditarProposta = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const proposalId = searchParams.get('id');
  const tipo = searchParams.get('tipo');
  const planoId = searchParams.get('planoId');

  const isNewProposal = tipo === 'plano' && planoId;

  const { data: proposalData, isLoading } = useProposalEdit(
    isNewProposal ? null : proposalId, 
    isNewProposal ? planoId : null
  );

  // Safely extract proposta and plano data
  const proposta = proposalData?.type === 'existing' ? proposalData.data : null;
  const plano = proposalData?.type === 'plan' ? proposalData.data : null;

  const { formData, updateFormData, validateForm } = useProposalForm(proposta, plano);
  const { handleSave, isSaving } = useProposalMutations(proposalId, isNewProposal);

  const handleCancel = () => {
    navigate('/propostas');
  };

  const onSave = () => {
    handleSave(formData, validateForm);
  };

  if (isLoading) {
    return <ProposalLoadingState isNewProposal={isNewProposal} />;
  }

  if (!proposalData) {
    return <ProposalNotFoundState isNewProposal={isNewProposal} />;
  }

  // Safely access empresa and plano name with proper type checking
  const empresa = proposta && 'diagnosticos' in proposta ? proposta.diagnosticos?.empresas : null;
  const empresaNome = isNewProposal && plano && 'nome' in plano ? plano.nome : empresa?.nome;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <EditProposalHeader
        empresaNome={empresaNome}
        onCancel={handleCancel}
        onSave={onSave}
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
