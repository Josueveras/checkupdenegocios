
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, Download, FileText } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { ShareButton } from '@/components/ShareButton';
import { useDiagnosticOperations } from '@/hooks/useDiagnosticOperations';
import { toast } from '@/hooks/use-toast';

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
  companyData?: any;
  results?: any;
}

export const FinalizeStep = ({ 
  diagnosticData, 
  setDiagnosticData, 
  onSaveDiagnostic,
  onDownloadPDF,
  onGenerateProposal,
  isSaving,
  companyData,
  results
}: FinalizeStepProps) => {
  const [pdfData, setPdfData] = useState<{ blob: Blob; url?: string } | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { generatePDFForSharing } = useDiagnosticOperations();

  // Debounce para campos de texto
  const debouncedUpdate = useDebounce((field: string, value: string) => {
    setDiagnosticData({...diagnosticData, [field]: value});
  }, 300);

  const handleInputChange = (field: string, value: string) => {
    debouncedUpdate(field, value);
  };

  const handlePrepareShare = async () => {
    if (pdfData) return pdfData;

    if (!companyData || !results) {
      toast({
        title: "Dados incompletos",
        description: "Complete o diagnóstico antes de compartilhar",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingPDF(true);
    try {
      // Criar um objeto diagnóstico temporário para gerar o PDF
      const tempDiagnostic = {
        empresas: {
          nome: companyData.companyName,
          cliente_nome: companyData.clientName,
          cliente_email: companyData.clientEmail,
          cliente_telefone: companyData.clientPhone
        },
        score_total: results.overallScore,
        score_marketing: results.categoryScores?.Marketing || 0,
        score_vendas: results.categoryScores?.Vendas || 0,
        score_estrategia: results.categoryScores?.Estratégia || 0,
        score_gestao: results.categoryScores?.Gestão || 0,
        nivel: results.level,
        pontos_fortes: results.strengths || [],
        pontos_atencao: results.improvements || [],
        recomendacoes: results.recommendations || {},
        observacoes: diagnosticData.observacoes,
        created_at: new Date().toISOString()
      };

      const result = await generatePDFForSharing(tempDiagnostic);
      setPdfData(result);
      return result;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF para compartilhamento",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsGeneratingPDF(false);
    }
  };

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
          {/* Campo honeypot invisível para proteção anti-bot */}
          <input
            type="text"
            name="website_url"
            autoComplete="off"
            style={{ display: 'none' }}
            tabIndex={-1}
          />
          
          <div className="space-y-2">
            <Label htmlFor="planos">Planos Sugeridos *</Label>
            <Textarea
              id="planos"
              defaultValue={diagnosticData.planos}
              onChange={(e) => handleInputChange('planos', e.target.value)}
              placeholder="Descreva os planos e estratégias recomendadas..."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="valores">Valores (R$) *</Label>
            <Input
              id="valores"
              type="number"
              defaultValue={diagnosticData.valores}
              onChange={(e) => handleInputChange('valores', e.target.value)}
              placeholder="Ex: 15000"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações Personalizadas *</Label>
            <Textarea
              id="observacoes"
              defaultValue={diagnosticData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
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

            {pdfData ? (
              <ShareButton
                pdfBlob={pdfData.blob}
                fileName={`diagnostico-${companyData?.companyName || 'empresa'}-${new Date().toISOString().split('T')[0]}.pdf`}
                companyName={companyData?.companyName || 'Empresa'}
                pdfUrl={pdfData.url}
              />
            ) : (
              <Button
                onClick={handlePrepareShare}
                disabled={isGeneratingPDF}
                variant="outline"
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                {isGeneratingPDF ? 'Preparando...' : '📤 Compartilhar PDF'}
              </Button>
            )}
            
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
