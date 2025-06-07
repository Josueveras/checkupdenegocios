
import { BackButton } from '@/components/ui/back-button';

interface EmpresaHeaderProps {
  empresaNome: string;
}

export const EmpresaHeader = ({ empresaNome }: EmpresaHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            🏢 Empresa: {empresaNome}
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Acompanhe a jornada real do projeto com dados comparativos, evolução mensal e sinais estratégicos de valor.
          </p>
        </div>
        <div className="ml-4">
          <BackButton fallbackRoute="/acompanhamento" />
        </div>
      </div>
    </div>
  );
};
