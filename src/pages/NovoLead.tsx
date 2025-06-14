
import { LeadCapture } from '@/components/crm/LeadCapture';
import { useNavigate } from 'react-router-dom';

const NovoLead = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/crm');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Novo Lead</h1>
        <p className="text-gray-600">
          Capture e qualifique novos leads externos para seu pipeline comercial
        </p>
      </div>

      <LeadCapture onSuccess={handleSuccess} />
    </div>
  );
};

export default NovoLead;
