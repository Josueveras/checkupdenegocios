
interface ProposalLoadingStateProps {
  isNewProposal: boolean;
}

export const ProposalLoadingState = ({ isNewProposal }: ProposalLoadingStateProps) => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petrol mx-auto mb-4"></div>
        <p>{isNewProposal ? 'Carregando dados do plano...' : 'Carregando proposta...'}</p>
      </div>
    </div>
  );
};
