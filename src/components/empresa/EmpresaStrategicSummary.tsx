
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-petrol" />
          📌 Resumo Estratégico
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Pontos Fortes Desenvolvidos</h4>
            <p className="text-sm text-gray-700">
              {ultimoCheckup.pontos_fortes_desenvolvidos || 'Não informado'}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Gargalos Atuais</h4>
            <p className="text-sm text-gray-700">
              {ultimoCheckup.gargalos_atuais || 'Não informado'}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Estratégias Validadas</h4>
            <p className="text-sm text-gray-700">
              {ultimoCheckup.estrategias_validadas || 'Não informado'}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Projeto virou um case?
            </h4>
            <div className="flex items-center gap-2">
              <Badge variant={ultimoCheckup.virou_case ? "default" : "secondary"}>
                {ultimoCheckup.virou_case ? "Sim" : "Não"}
              </Badge>
            </div>
            {ultimoCheckup.virou_case && ultimoCheckup.destaque_case && (
              <div className="mt-3">
                <h5 className="font-medium text-sm mb-1">Destaques do Case:</h5>
                <p className="text-sm text-gray-700">
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
