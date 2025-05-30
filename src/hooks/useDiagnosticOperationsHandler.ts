
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useSaveEmpresa, useSaveDiagnostico, useSaveRespostas } from '@/hooks/useSupabase';

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
  const saveEmpresaMutation = useSaveEmpresa();
  const saveDiagnosticoMutation = useSaveDiagnostico();
  const saveRespostasMutation = useSaveRespostas();

  const handleSaveDiagnostic = async () => {
    try {
      console.log('Starting diagnostic save process...');

      // Validar campos obrigatórios
      if (!diagnosticData.planos || !diagnosticData.valores || !diagnosticData.observacoes) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha planos, valores e observações antes de salvar.",
          variant: "destructive"
        });
        return;
      }

      if (isEditing) {
        toast({
          title: "Atualização em desenvolvimento",
          description: "A funcionalidade de atualização será implementada em breve.",
        });
        return;
      }

      // Salvar empresa primeiro
      const empresaData = {
        nome: companyData.companyName,
        cliente_nome: companyData.clientName,
        cliente_email: companyData.email,
        cliente_telefone: companyData.phone,
        site_instagram: companyData.website,
        setor: companyData.sector,
        funcionarios: companyData.employees,
        faturamento: companyData.revenue
      };

      const empresa = await saveEmpresaMutation.mutateAsync(empresaData);

      // Preparar dados do diagnóstico
      const diagnosticoData = {
        empresa_id: empresa.id,
        score_total: results.overallScore,
        score_marketing: results.categoryScores.Marketing || 0,
        score_vendas: results.categoryScores.Vendas || 0,
        score_estrategia: results.categoryScores.Estratégia || 0,
        score_gestao: results.categoryScores.Gestão || 0,
        nivel: results.level,
        pontos_fortes: results.strongPoints,
        pontos_atencao: results.attentionPoints,
        recomendacoes: results.recommendations,
        planos: diagnosticData.planos,
        valores: parseFloat(diagnosticData.valores),
        observacoes: diagnosticData.observacoes,
        status: 'concluido'
      };

      const diagnostico = await saveDiagnosticoMutation.mutateAsync(diagnosticoData);

      // Salvar respostas
      const respostasData = Object.entries(answers).map(([perguntaId, score]) => {
        const question = questions.find(q => q.id === perguntaId);
        const resposta = question?.options.find(o => o.score === score)?.text || '';
        
        return {
          diagnostico_id: diagnostico.id,
          pergunta_id: perguntaId,
          score: score,
          resposta: resposta
        };
      });

      if (respostasData.length > 0) {
        await saveRespostasMutation.mutateAsync(respostasData);
      }

      toast({
        title: "Diagnóstico salvo",
        description: "O diagnóstico foi salvo com sucesso!",
      });

      navigate('/diagnosticos');

    } catch (error) {
      console.error('Erro detalhado ao salvar diagnóstico:', error);
      toast({
        title: "Erro ao salvar",
        description: `Ocorreu um erro ao salvar o diagnóstico: ${error.message || 'Erro desconhecido'}`,
        variant: "destructive"
      });
    }
  };

  const handleGenerateProposal = () => {
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
  };

  const isSaving = saveEmpresaMutation.isPending || saveDiagnosticoMutation.isPending;

  return {
    handleSaveDiagnostic,
    handleGenerateProposal,
    handleDownloadPDF,
    isSaving
  };
};
