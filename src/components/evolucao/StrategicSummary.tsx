
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

interface StrategicSummaryProps {
  acompanhamentos: any[];
}

export const StrategicSummary = ({ acompanhamentos }: StrategicSummaryProps) => {
  const ultimoAcompanhamento = acompanhamentos && acompanhamentos.length > 0 
    ? acompanhamentos[acompanhamentos.length - 1] 
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-petrol" />
          Resumo Estratégico da Empresa
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ultimoAcompanhamento ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Pontos Fortes Desenvolvidos</h4>
              <p className="text-sm text-gray-700">
                {ultimoAcompanhamento.pontos_fortes_desenvolvidos || 'Não informado'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Gargalos Atuais</h4>
              <p className="text-sm text-gray-700">
                {ultimoAcompanhamento.gargalos_atuais || 'Não informado'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Estratégias Validadas</h4>
              <p className="text-sm text-gray-700">
                {ultimoAcompanhamento.estrategias_validadas || 'Não informado'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Este projeto virou um case?</h4>
              <div className="flex items-center gap-2">
                <Badge variant={ultimoAcompanhamento.virou_case ? "default" : "secondary"}>
                  {ultimoAcompanhamento.virou_case ? "Sim" : "Não"}
                </Badge>
              </div>
              {ultimoAcompanhamento.destaque_case && (
                <p className="text-sm text-gray-700 mt-2">
                  {ultimoAcompanhamento.destaque_case}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Nenhum dado estratégico disponível</p>
        )}
      </CardContent>
    </Card>
  );
};
