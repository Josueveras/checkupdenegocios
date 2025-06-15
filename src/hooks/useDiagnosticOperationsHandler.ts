
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
  const { generatePDF } = useDiagnosticPDF();
  const { shareWhatsApp } = useDiagnosticSharing();

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
    generatePDF({
      companyData,
      results,
      diagnosticData
    });
  };

  const handleShareWhatsApp = () => {
    shareWhatsApp({
      companyData,
      results
    });
  };

  return {
    handleSaveDiagnostic,
    handleGenerateProposal,
    handleDownloadPDF,
    handleShareWhatsApp,
    isSaving
  };
};
