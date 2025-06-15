
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, X } from 'lucide-react';

interface EditProposalHeaderProps {
  empresaNome?: string;
  onCancel: () => void;
  onSave: () => void;
  isSaving: boolean;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const EditProposalHeader = ({ 
  empresaNome, 
  onCancel, 
  onSave, 
  isSaving,
  onBack,
  showBackButton = false
}: EditProposalHeaderProps) => {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col gap-3">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
            Editar Proposta
          </h1>
          <p className="text-gray-600 text-sm truncate">
            {empresaNome || 'Empresa não informada'}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          {showBackButton && onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              disabled={isSaving}
              className="w-full sm:w-auto text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            className="w-full sm:w-auto text-sm"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="w-full sm:w-auto bg-petrol hover:bg-petrol/90 text-white text-sm"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>
    </div>
  );
};
