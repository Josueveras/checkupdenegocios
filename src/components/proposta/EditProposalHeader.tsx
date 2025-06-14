
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 min-w-0">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="flex items-center gap-2 flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </div>
          <div className="min-w-0">
            <h1 className="text-xl lg:text-3xl font-bold text-gray-900 truncate">Editar Proposta</h1>
            <p className="text-gray-600 text-sm lg:text-base truncate">{empresaNome || 'Empresa não informada'}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 sm:flex-none"
          >
            Cancelar
          </Button>
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="bg-petrol hover:bg-petrol/90 text-white flex items-center gap-2 flex-1 sm:flex-none"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>
    </div>
  );
};
