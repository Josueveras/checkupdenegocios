
import { useNavigate } from 'react-router-dom';

interface ProposalNotFoundStateProps {
  isNewProposal: boolean;
}

export const ProposalNotFoundState = ({ isNewProposal }: ProposalNotFoundStateProps) => {
  const navigate = useNavigate();

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
};
