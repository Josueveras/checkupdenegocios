
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
    <div className="w-full">
      <div className="flex flex-col gap-2">
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 truncate">
            Editar Proposta
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm truncate">
            {empresaNome || 'Empresa não informada'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            size="sm"
            className="text-xs"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Cancelar
          </Button>
          <Button
            onClick={onSave}
            disabled={isSaving}
            size="sm"
            className="bg-petrol hover:bg-petrol/90 text-white text-xs"
          >
            <Save className="h-3 w-3 mr-1" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>
    </div>
  );
};
