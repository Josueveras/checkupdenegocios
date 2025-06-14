
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
    <div className="w-full overflow-hidden">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col gap-2 min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl xl:text-3xl font-bold text-gray-900 truncate">
            Editar Proposta
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base truncate">
            {empresaNome || 'Empresa não informada'}
          </p>
        </div>
        
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="bg-petrol hover:bg-petrol/90 text-white flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none text-xs sm:text-sm"
          >
            <Save className="h-3 w-3 sm:h-4 sm:w-4" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>
    </div>
  );
};
