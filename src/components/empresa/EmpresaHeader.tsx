
import { Building2 } from 'lucide-react';
import { BackButton } from '@/components/ui/back-button';

interface EmpresaHeaderProps {
  empresaNome: string;
}

export const EmpresaHeader = ({ empresaNome }: EmpresaHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Building2 className="h-8 w-8 text-petrol" />
          🏢 Empresa: {empresaNome}
        </h1>
        <p className="text-gray-600 mt-1">
          Acompanhe a jornada real do projeto com dados comparativos, evolução mensal e sinais estratégicos de valor.
        </p>
      </div>
      <BackButton fallbackRoute="/acompanhamento" />
    </div>
  );
};
