
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const proposalId = searchParams.get('id');
  const tipo = searchParams.get('tipo');
  const planoId = searchParams.get('planoId');

  const isNewProposal = tipo === 'plano' && !!planoId;

  // Detectar origem da navegação
  const fromRoute = location.state?.from || '/propostas';
  const isFromPlanPage = fromRoute.includes('/nova-proposta-plano') || 
                        document.referrer.includes('/nova-proposta-plano');
  
  const shouldShowBackButton = isFromPlanPage;
  const cancelRoute = isFromPlanPage ? '/nova-proposta-plano' : '/propostas';

  const { data: proposalData, isLoading } = useProposalEdit(
    isNewProposal ? null : proposalId, 
    isNewProposal ? planoId : null
  );

  const proposta = proposalData?.type === 'existing' ? proposalData.data : null;
  const plano = proposalData?.type === 'plan' ? proposalData.data : null;

  const { formData, updateFormData, validateForm } = useProposalForm(proposta, plano);
  const { handleSave, isSaving } = useProposalMutations(proposalId, isNewProposal);

  const handleCancel = () => {
    navigate(cancelRoute);
  };

  const handleBack = () => {
    navigate(-1);
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

  const empresa = proposta && 'diagnosticos' in proposta ? proposta.diagnosticos?.empresas : null;
  const empresaNome = isNewProposal && plano && 'nome' in plano ? plano.nome : empresa?.nome;

  return (
    <div className="w-full min-h-screen overflow-hidden">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-3 lg:py-6 space-y-2 sm:space-y-3 lg:space-y-6 overflow-hidden">
        <EditProposalHeader
          empresaNome={empresaNome}
          onCancel={handleCancel}
          onSave={onSave}
          isSaving={isSaving}
          onBack={handleBack}
          showBackButton={shouldShowBackButton}
        />

        <div className="space-y-2 sm:space-y-3 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 overflow-hidden">
          <div className="space-y-2 sm:space-y-3">
            {empresa && (
              <CompanyInfo empresa={empresa} />
            )}

            {isNewProposal && (
              <EmpresaSelector
                selectedEmpresaId={formData.empresa_id || ''}
                onChange={(empresaId) => updateFormData({ empresa_id: empresaId })}
              />
            )}
          </div>

          <div className="space-y-2 sm:space-y-3">
            <ProposalDataForm
              formData={formData}
              onChange={updateFormData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarProposta;
