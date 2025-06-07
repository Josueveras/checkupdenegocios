
import { Building2 } from 'lucide-react';
import { BackButton } from '@/components/ui/back-button';

interface EmpresaHeaderProps {
  empresaNome: string;
}

export const EmpresaHeader = ({ empresaNome }: EmpresaHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="h-6 w-6 md:h-8 md:w-8 text-petrol flex-shrink-0" />
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 truncate">
            🏢 Empresa: {empresaNome}
          </h1>
        </div>
        <p className="text-sm md:text-base text-gray-600">
          Acompanhe a jornada real do projeto com dados comparativos, evolução mensal e sinais estratégicos de valor.
        </p>
      </div>
      <div className="flex-shrink-0">
        <BackButton fallbackRoute="/acompanhamento" />
      </div>
    </div>
  );
};
