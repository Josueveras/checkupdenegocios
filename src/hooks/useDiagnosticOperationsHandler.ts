
import { useDiagnosticSave } from '@/hooks/useDiagnosticSave';
import { useDiagnosticPDF } from '@/hooks/useDiagnosticPDF';
import { useDiagnosticSharing } from '@/hooks/useDiagnosticSharing';
import { useNavigate } from 'react-router-dom';

interface DiagnosticOperationsHandlerProps {
  companyData: any;
  diagnosticData: any;
  results: any;
  answers: {[key: string]: number};
  questions: any[];
  isEditing: boolean;
  editId?: string;
}

export const useDiagnosticOperationsHandler = ({
  companyData,
  diagnosticData,
  results,
  answers,
  questions,
  isEditing,
  editId
}: DiagnosticOperationsHandlerProps) => {
  const navigate = useNavigate();
  const { saveDiagnostic, isSaving } = useDiagnosticSave(editId);
  const { handleGenerateAndDownloadPDF } = useDiagnosticPDF();
  const { handleSendWhatsApp } = useDiagnosticSharing();

  const handleSaveDiagnostic = async () => {
    await saveDiagnostic({
      companyData,
      diagnosticData,
      results,
      answers,
      questions,
      isEditing,
      editId,
      onSuccess: () => {
        navigate('/diagnosticos');
      }
    });
  };

  const handleGenerateProposal = () => {
    // Implementar geração de proposta
    console.log('Gerando proposta...');
  };

  const handleDownloadPDF = () => {
    // Create a temporary diagnostic object for PDF generation
    const tempDiagnostic = {
      empresas: {
        nome: companyData.companyName,
        cliente_nome: companyData.clientName,
        cliente_email: companyData.email,
        cliente_telefone: companyData.phone
      },
      score_total: results.overallScore,
      score_marketing: results.categoryScores?.Marketing || 0,
      score_vendas: results.categoryScores?.Vendas || 0,
      score_estrategia: results.categoryScores?.Estratégia || 0,
      score_gestao: results.categoryScores?.Gestão || 0,
      nivel: results.level,
      pontos_fortes: results.strongPoints,
      pontos_atencao: results.attentionPoints,
      recomendacoes: results.recommendations,
      observacoes: diagnosticData.observacoes,
      created_at: new Date().toISOString()
    };

    handleGenerateAndDownloadPDF(tempDiagnostic);
  };

  const handleShareWhatsApp = () => {
    // Create a temporary diagnostic object for WhatsApp sharing
    const tempDiagnostic = {
      empresas: {
        nome: companyData.companyName,
        cliente_nome: companyData.clientName,
        cliente_telefone: companyData.phone
      },
      score_total: results.overallScore,
      nivel: results.level
    };

    handleSendWhatsApp(tempDiagnostic);
  };

  return {
    handleSaveDiagnostic,
    handleGenerateProposal,
    handleDownloadPDF,
    handleShareWhatsApp,
    isSaving
  };
};
