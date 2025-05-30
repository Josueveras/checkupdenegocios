
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useDiagnosticSave } from '@/hooks/useDiagnosticSave';
import { detectBot } from '@/utils/botProtection';

interface OperationsProps {
  companyData: any;
  diagnosticData: any;
  results: any;
  answers: {[key: string]: number};
  questions: any[];
  isEditing: boolean;
}

export const useDiagnosticOperationsHandler = ({
  companyData,
  diagnosticData,
  results,
  answers,
  questions,
  isEditing
}: OperationsProps) => {
  const navigate = useNavigate();
  const { saveDiagnostic, isSaving } = useDiagnosticSave();

  const handleSaveDiagnostic = async () => {
    await saveDiagnostic({
      companyData,
      diagnosticData,
      results,
      answers,
      questions,
      isEditing,
      onSuccess: () => navigate('/diagnosticos')
    });
  };

  const handleGenerateProposal = () => {
    // Verificar proteção anti-bot
    const formElement = document.querySelector('form') || document.body;
    if (detectBot(formElement)) {
      toast({
        title: "Ação bloqueada",
        description: "Possível atividade de bot detectada.",
        variant: "destructive"
      });
      return;
    }

    if (!diagnosticData.planos || !diagnosticData.valores || !diagnosticData.observacoes) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha planos, valores e observações antes de gerar proposta.",
        variant: "destructive"
      });
      return;
    }

    navigate('/propostas', { 
      state: { 
        companyData, 
        results, 
        diagnosticData 
      } 
    });
  };

  const handleDownloadPDF = () => {
    // Verificar proteção anti-bot
    const formElement = document.querySelector('form') || document.body;
    if (detectBot(formElement)) {
      toast({
        title: "Ação bloqueada",
        description: "Possível atividade de bot detectada.",
        variant: "destructive"
      });
      return;
    }

    try {
      const htmlContent = `
        <html>
          <head>
            <title>Diagnóstico Empresarial - ${companyData.companyName}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .score { font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; }
              .category { margin: 15px 0; }
              .recommendations { margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Relatório de Diagnóstico Empresarial</h1>
              <h2>${companyData.companyName}</h2>
              <p>Cliente: ${companyData.clientName}</p>
              <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div class="score">
              Score Geral: ${results?.overallScore}% - Nível ${results?.level}
            </div>
            
            <h3>Scores por Categoria:</h3>
            ${Object.entries(results?.categoryScores || {}).map(([category, score]) => 
              `<div class="category"><strong>${category}:</strong> ${score}%</div>`
            ).join('')}
            
            <div class="recommendations">
              <h3>Recomendações:</h3>
              ${Object.entries(results?.recommendations || {}).map(([category, recs]) => 
                `<div><strong>${category}:</strong><ul>${(recs as string[]).map(rec => `<li>${rec}</li>`).join('')}</ul></div>`
              ).join('')}
            </div>
            
            <div>
              <h3>Planos Sugeridos:</h3>
              <p>${diagnosticData.planos}</p>
              
              <h3>Valores:</h3>
              <p>R$ ${diagnosticData.valores}</p>
              
              <h3>Observações:</h3>
              <p>${diagnosticData.observacoes}</p>
            </div>
          </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `diagnostico-${companyData.companyName.replace(/\s+/g, '-').toLowerCase()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "PDF gerado",
        description: "O arquivo foi baixado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro ao gerar o PDF.",
        variant: "destructive"
      });
    }
  };

  return {
    handleSaveDiagnostic,
    handleGenerateProposal,
    handleDownloadPDF,
    isSaving
  };
};
