
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CurrencyInput } from '@/components/ui/currency-input';

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
    <Card className="overflow-hidden">
      <CardHeader className="p-2 sm:p-3">
        <CardTitle className="text-sm sm:text-base truncate">
          Dados da Proposta
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-3 pt-0 space-y-3">
        <div className="min-w-0">
          <Label htmlFor="objetivo" className="text-sm">Objetivo *</Label>
          <Textarea
            id="objetivo"
            value={formData.objetivo}
            onChange={(e) => onChange({ objetivo: e.target.value })}
            placeholder="Descreva o objetivo da proposta"
            rows={3}
            className="mt-1 w-full resize-none text-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="min-w-0">
            <Label htmlFor="valor" className="text-sm">Valor (R$) *</Label>
            <CurrencyInput
              id="valor"
              value={formData.valor}
              onChange={(value) => onChange({ valor: value })}
              placeholder="0,00"
              className="mt-1 w-full h-10 text-sm"
            />
          </div>
          <div className="min-w-0">
            <Label htmlFor="prazo" className="text-sm">Prazo</Label>
            <Input
              id="prazo"
              value={formData.prazo}
              onChange={(e) => onChange({ prazo: e.target.value })}
              placeholder="Ex: 3 meses, 6 semanas..."
              className="mt-1 w-full h-10 text-sm"
            />
          </div>
        </div>

        <div className="min-w-0">
          <Label htmlFor="status" className="text-sm">Status</Label>
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
