
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useSaveEmpresa, useSaveDiagnostico, useSaveRespostas } from '@/hooks/useSupabase';
import { CompanyDataStep } from '@/components/diagnostic-steps/CompanyDataStep';
import { DiagnosticQuestionsStep } from '@/components/diagnostic-steps/DiagnosticQuestionsStep';
import { ResultsStep } from '@/components/diagnostic-steps/ResultsStep';
import { FinalizeStep } from '@/components/diagnostic-steps/FinalizeStep';
import { useDiagnosticCalculations } from '@/hooks/useDiagnosticCalculations';
import { useDiagnosticQuestions } from '@/hooks/useDiagnosticQuestions';

const NovoDiagnostico = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [companyData, setCompanyData] = useState({
    clientName: '',
    companyName: '',
    email: '',
    phone: '',
    website: '',
    sector: '',
    employees: '',
    revenue: ''
  });

  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [results, setResults] = useState<any>(null);
  const [diagnosticData, setDiagnosticData] = useState({
    planos: '',
    valores: '',
    observacoes: ''
  });

  const saveEmpresaMutation = useSaveEmpresa();
  const saveDiagnosticoMutation = useSaveDiagnostico();
  const saveRespostasMutation = useSaveRespostas();

  const { questions } = useDiagnosticQuestions();
  const { calculateResults } = useDiagnosticCalculations();

  const handleNext = () => {
    if (currentStep === 1) {
      // Validar dados da empresa
      if (!companyData.clientName || !companyData.companyName || !companyData.email) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha nome do cliente, empresa e e-mail.",
          variant: "destructive"
        });
        return;
      }
    }

    if (currentStep === 2) {
      // Validar perguntas obrigatórias
      const requiredQuestions = questions.filter(q => q.required);
      for (const question of requiredQuestions) {
        if (!(question.id in answers)) {
          toast({
            title: "Pergunta obrigatória",
            description: `Por favor, responda: ${question.question}`,
            variant: "destructive"
          });
          return;
        }
      }
      
      // Calcular resultados
      const calculatedResults = calculateResults(answers, questions);
      setResults(calculatedResults);
    }

    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSaveDiagnostic = async () => {
    try {
      // Validar campos obrigatórios
      if (!diagnosticData.planos || !diagnosticData.valores || !diagnosticData.observacoes) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha planos, valores e observações antes de salvar.",
          variant: "destructive"
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
      const respostasData = Object.entries(answers).map(([perguntaId, score]) => ({
        diagnostico_id: diagnostico.id,
        pergunta_id: perguntaId,
        score: score,
        resposta: questions.find(q => q.id === parseInt(perguntaId))?.options.find(o => o.score === score)?.text
      }));

      if (respostasData.length > 0) {
        await saveRespostasMutation.mutateAsync(respostasData);
      }

      toast({
        title: "Diagnóstico salvo",
        description: "O diagnóstico foi salvo com sucesso!",
      });

      // Redirecionar para diagnósticos
      navigate('/diagnosticos');

    } catch (error) {
      console.error('Erro ao salvar diagnóstico:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o diagnóstico.",
        variant: "destructive"
      });
    }
  };

  const handleGenerateProposal = () => {
    // Validar se os campos obrigatórios estão preenchidos
    if (!diagnosticData.planos || !diagnosticData.valores || !diagnosticData.observacoes) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha planos, valores e observações antes de gerar proposta.",
        variant: "destructive"
      });
      return;
    }

    // Navegar para propostas com dados do diagnóstico
    navigate('/propostas', { 
      state: { 
        companyData, 
        results, 
        diagnosticData 
      } 
    });
  };

  const handleDownloadPDF = () => {
    // Criar conteúdo HTML para o PDF
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

    // Criar blob e fazer download
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header com Progress */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Novo Diagnóstico</h1>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Etapa {currentStep} de 4</span>
            <span>{Math.round((currentStep / 4) * 100)}% Concluído</span>
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-2" />
        </div>
        <div className="flex gap-4 text-sm">
          <span className={currentStep === 1 ? "text-petrol font-medium" : "text-gray-500"}>
            1. Dados da Empresa
          </span>
          <span className={currentStep === 2 ? "text-petrol font-medium" : "text-gray-500"}>
            2. Perguntas
          </span>
          <span className={currentStep === 3 ? "text-petrol font-medium" : "text-gray-500"}>
            3. Resultado
          </span>
          <span className={currentStep === 4 ? "text-petrol font-medium" : "text-gray-500"}>
            4. Finalizar
          </span>
        </div>
      </div>

      {/* Conteúdo da Etapa */}
      {currentStep === 1 && (
        <CompanyDataStep 
          companyData={companyData} 
          setCompanyData={setCompanyData} 
        />
      )}
      {currentStep === 2 && (
        <DiagnosticQuestionsStep 
          questions={questions}
          answers={answers}
          setAnswers={setAnswers}
        />
      )}
      {currentStep === 3 && results && (
        <ResultsStep results={results} />
      )}
      {currentStep === 4 && (
        <FinalizeStep
          diagnosticData={diagnosticData}
          setDiagnosticData={setDiagnosticData}
          onSaveDiagnostic={handleSaveDiagnostic}
          onDownloadPDF={handleDownloadPDF}
          onGenerateProposal={handleGenerateProposal}
          isSaving={saveEmpresaMutation.isPending || saveDiagnosticoMutation.isPending}
        />
      )}

      {/* Navegação */}
      {currentStep < 4 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button
            onClick={handleNext}
            className="bg-petrol hover:bg-petrol/90 text-white"
          >
            {currentStep === 3 ? "Finalizar" : "Próximo"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default NovoDiagnostico;
