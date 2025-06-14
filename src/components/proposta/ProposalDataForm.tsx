
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
    <Card className="w-full overflow-hidden">
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="truncate text-base sm:text-lg md:text-xl">
          Dados da Proposta
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0 space-y-3 sm:space-y-4">
        <div className="w-full min-w-0">
          <Label htmlFor="objetivo" className="text-xs sm:text-sm">Objetivo *</Label>
          <Textarea
            id="objetivo"
            value={formData.objetivo}
            onChange={(e) => onChange({ objetivo: e.target.value })}
            placeholder="Descreva o objetivo da proposta"
            rows={3}
            className="mt-1 w-full resize-none text-xs sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
          <div className="min-w-0">
            <Label htmlFor="valor" className="text-xs sm:text-sm">Valor (R$) *</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              min="0"
              value={formData.valor}
              onChange={(e) => onChange({ valor: e.target.value })}
              placeholder="0.00"
              className="mt-1 w-full h-8 sm:h-10 text-xs sm:text-sm"
            />
          </div>
          <div className="min-w-0">
            <Label htmlFor="prazo" className="text-xs sm:text-sm">Prazo</Label>
            <Input
              id="prazo"
              value={formData.prazo}
              onChange={(e) => onChange({ prazo: e.target.value })}
              placeholder="Ex: 3 meses, 6 semanas..."
              className="mt-1 w-full h-8 sm:h-10 text-xs sm:text-sm"
            />
          </div>
        </div>

        <div className="w-full min-w-0">
          <Label htmlFor="status" className="text-xs sm:text-sm">Status</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => onChange({ status: e.target.value })}
            className="flex h-8 sm:h-10 w-full rounded-md border border-input bg-background px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1 min-w-0"
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
