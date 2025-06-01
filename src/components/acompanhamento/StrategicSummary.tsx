
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Brain } from 'lucide-react';

const StrategicSummary = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-petrol" />
          🧠 Resumo Estratégico
        </CardTitle>
        <CardDescription>
          Observações gerais extraídas dos acompanhamentos realizados.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="pontos_fortes">Pontos Fortes Desenvolvidos</Label>
          <Textarea
            id="pontos_fortes"
            rows={4}
            placeholder="Descreva os principais pontos fortes que foram desenvolvidos nos projetos..."
          />
        </div>

        <div>
          <Label htmlFor="gargalos_atuais">Gargalos Atuais</Label>
          <Textarea
            id="gargalos_atuais"
            rows={4}
            placeholder="Identifique os principais gargalos encontrados nos projetos..."
          />
        </div>

        <div>
          <Label htmlFor="estrategias_validadas">Estratégias Validadas</Label>
          <Textarea
            id="estrategias_validadas"
            rows={4}
            placeholder="Liste as estratégias que foram validadas e tiveram sucesso..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="projeto_case" />
            <Label htmlFor="projeto_case">Este projeto virou um case?</Label>
          </div>

          <div>
            <Label htmlFor="destaques_case_resumo">Destaques do Case</Label>
            <Textarea
              id="destaques_case_resumo"
              rows={4}
              placeholder="Se sim, descreva os principais destaques e resultados do case..."
            />
          </div>
        </div>

        <Button className="bg-petrol hover:bg-petrol/90 text-white">
          Salvar Resumo Estratégico
        </Button>
      </CardContent>
    </Card>
  );
};

export default StrategicSummary;
