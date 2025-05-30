
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, Download, FileText } from 'lucide-react';

interface DiagnosticData {
  planos: string;
  valores: string;
  observacoes: string;
}

interface FinalizeStepProps {
  diagnosticData: DiagnosticData;
  setDiagnosticData: (data: DiagnosticData) => void;
  onSaveDiagnostic: () => void;
  onDownloadPDF: () => void;
  onGenerateProposal: () => void;
  isSaving: boolean;
}

export const FinalizeStep = ({ 
  diagnosticData, 
  setDiagnosticData, 
  onSaveDiagnostic,
  onDownloadPDF,
  onGenerateProposal,
  isSaving 
}: FinalizeStepProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Finalizar Diagnóstico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="planos">Planos Sugeridos *</Label>
            <Textarea
              id="planos"
              value={diagnosticData.planos}
              onChange={(e) => setDiagnosticData({...diagnosticData, planos: e.target.value})}
              placeholder="Descreva os planos e estratégias recomendadas..."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="valores">Valores (R$) *</Label>
            <Input
              id="valores"
              type="number"
              value={diagnosticData.valores}
              onChange={(e) => setDiagnosticData({...diagnosticData, valores: e.target.value})}
              placeholder="Ex: 15000"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações Personalizadas *</Label>
            <Textarea
              id="observacoes"
              value={diagnosticData.observacoes}
              onChange={(e) => setDiagnosticData({...diagnosticData, observacoes: e.target.value})}
              placeholder="Observações específicas para este cliente..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              onClick={onSaveDiagnostic} 
              className="bg-petrol hover:bg-petrol/90 text-white"
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Salvando...' : 'Concluir Diagnóstico'}
            </Button>
            
            <Button onClick={onDownloadPDF} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Baixar PDF
            </Button>
            
            <Button 
              onClick={onGenerateProposal} 
              variant="outline" 
              className="border-blue-light text-blue-light hover:bg-blue-light hover:text-white"
            >
              <FileText className="mr-2 h-4 w-4" />
              Gerar Proposta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
