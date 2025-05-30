
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EditDiagnosticButtonProps {
  diagnosticId: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export const EditDiagnosticButton = ({ 
  diagnosticId, 
  size = 'default',
  variant = 'outline' 
}: EditDiagnosticButtonProps) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/novo-diagnostico?edit=${diagnosticId}`);
  };

  return (
    <Button
      onClick={handleEdit}
      size={size}
      variant={variant}
      className="flex items-center gap-2"
    >
      <Edit className="h-4 w-4" />
      Editar
    </Button>
  );
};
