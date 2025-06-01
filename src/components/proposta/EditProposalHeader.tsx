
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';

interface EditProposalHeaderProps {
  empresaNome?: string;
  onCancel: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export const EditProposalHeader = ({ 
  empresaNome, 
  onCancel, 
  onSave, 
  isSaving 
}: EditProposalHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Proposta</h1>
          <p className="text-gray-600">{empresaNome || 'Empresa não informada'}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancelar
        </Button>
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="bg-petrol hover:bg-petrol/90 text-white flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </div>
  );
};
