
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Award } from 'lucide-react';

interface UltimoCheckup {
  pontos_fortes_desenvolvidos?: string;
  gargalos_atuais?: string;
  estrategias_validadas?: string;
  virou_case?: boolean;
  destaque_case?: string;
}

interface EmpresaStrategicSummaryProps {
  ultimoCheckup: UltimoCheckup;
}

export const EmpresaStrategicSummary = ({ ultimoCheckup }: EmpresaStrategicSummaryProps) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Target className="h-4 w-4 sm:h-5 sm:w-5 text-petrol flex-shrink-0" />
          📌 Resumo Estratégico
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h4 className="font-semibold mb-2 text-sm sm:text-base">Pontos Fortes Desenvolvidos</h4>
            <p className="text-xs sm:text-sm text-gray-700">
              {ultimoCheckup.pontos_fortes_desenvolvidos || 'Não informado'}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-sm sm:text-base">Gargalos Atuais</h4>
            <p className="text-xs sm:text-sm text-gray-700">
              {ultimoCheckup.gargalos_atuais || 'Não informado'}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-sm sm:text-base">Estratégias Validadas</h4>
            <p className="text-xs sm:text-sm text-gray-700">
              {ultimoCheckup.estrategias_validadas || 'Não informado'}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
              <Award className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              Projeto virou um case?
            </h4>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={ultimoCheckup.virou_case ? "default" : "secondary"} className="text-xs">
                {ultimoCheckup.virou_case ? "Sim" : "Não"}
              </Badge>
            </div>
            {ultimoCheckup.virou_case && ultimoCheckup.destaque_case && (
              <div>
                <h5 className="font-medium text-xs sm:text-sm mb-1">Destaques do Case:</h5>
                <p className="text-xs sm:text-sm text-gray-700">
                  {ultimoCheckup.destaque_case}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
