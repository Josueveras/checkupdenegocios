
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProposalFormData {
  objetivo: string;
  valor: string;
  prazo: string;
  status: string;
  acoes_sugeridas: string[];
}

interface ProposalDataFormProps {
  formData: ProposalFormData;
  onChange: (data: Partial<ProposalFormData>) => void;
}

export const ProposalDataForm = ({ formData, onChange }: ProposalDataFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados da Proposta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="objetivo">Objetivo *</Label>
          <Textarea
            id="objetivo"
            value={formData.objetivo}
            onChange={(e) => onChange({ objetivo: e.target.value })}
            placeholder="Descreva o objetivo da proposta"
            rows={3}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="valor">Valor (R$) *</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              min="0"
              value={formData.valor}
              onChange={(e) => onChange({ valor: e.target.value })}
              placeholder="0.00"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="prazo">Prazo</Label>
            <Input
              id="prazo"
              value={formData.prazo}
              onChange={(e) => onChange({ prazo: e.target.value })}
              placeholder="Ex: 3 meses, 6 semanas..."
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => onChange({ status: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
          >
            <option value="rascunho">Rascunho</option>
            <option value="enviada">Enviada</option>
            <option value="aprovada">Aprovada</option>
            <option value="rejeitada">Rejeitada</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
};
