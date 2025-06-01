
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Eye } from 'lucide-react';

const HistoricalCheckups = () => {
  const mockCheckups = [
    {
      id: '1',
      mes_referencia: '2024-01',
      nome_empresa: 'Tech Solutions LTDA',
      score_geral: 85,
      faturamento_atual: 150000,
      roi_estimado: 2.5,
      destaque_mes: 'Implementação do novo CRM aumentou conversão em 30%',
      acoes_concluidas: 8
    },
    {
      id: '2',
      mes_referencia: '2024-02',
      nome_empresa: 'Marketing Digital Pro',
      score_geral: 78,
      faturamento_atual: 95000,
      roi_estimado: 1.8,
      destaque_mes: 'Campanhas de mídia paga geraram 40% mais leads',
      acoes_concluidas: 6
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-petrol" />
          📆 Check-ups Mensais
        </CardTitle>
        <CardDescription>
          Cards com os dados principais de cada acompanhamento mensal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockCheckups.map((checkup) => (
            <Card key={checkup.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{checkup.nome_empresa}</h4>
                    <p className="text-sm text-gray-600">{checkup.mes_referencia}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Score Geral:</span>
                      <div className="font-semibold text-petrol">{checkup.score_geral}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Faturamento:</span>
                      <div className="font-semibold">R$ {checkup.faturamento_atual.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">ROI:</span>
                      <div className="font-semibold">{checkup.roi_estimado}x</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Ações Concluídas:</span>
                      <div className="font-semibold">{checkup.acoes_concluidas}</div>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-600 text-sm">Destaque do Mês:</span>
                    <p className="text-sm mt-1">{checkup.destaque_mes}</p>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalCheckups;
