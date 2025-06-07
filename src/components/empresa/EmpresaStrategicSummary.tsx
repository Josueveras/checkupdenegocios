
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            📈 Pontos Fortes Desenvolvidos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-green-700">
            {ultimoCheckup.pontos_fortes_desenvolvidos || 'Não informado'}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800 flex items-center gap-2">
            ⚠️ Gargalos Atuais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-yellow-700">
            {ultimoCheckup.gargalos_atuais || 'Não informado'}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            💡 Estratégias Validadas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-blue-700">
            {ultimoCheckup.estrategias_validadas || 'Não informado'}
          </div>
        </CardContent>
      </Card>

      {ultimoCheckup.virou_case && (
        <Card className="lg:col-span-3 bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-800 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Projeto virou um case!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="default">Sim</Badge>
            </div>
            {ultimoCheckup.destaque_case && (
              <div>
                <h5 className="font-medium text-sm mb-1">Destaques do Case:</h5>
                <p className="text-sm text-purple-700">
                  {ultimoCheckup.destaque_case}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
