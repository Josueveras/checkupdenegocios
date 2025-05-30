import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSaveEmpresa, useSaveDiagnostico, useSaveRespostas } from '@/hooks/useSupabase';
import { CompanyDataStep } from '@/components/diagnostic-steps/CompanyDataStep';
import { DiagnosticQuestionsStep } from '@/components/diagnostic-steps/DiagnosticQuestionsStep';
import { ResultsStep } from '@/components/diagnostic-steps/ResultsStep';
import { FinalizeStep } from '@/components/diagnostic-steps/FinalizeStep';
import { useDiagnosticCalculations } from '@/hooks/useDiagnosticCalculations';
import { useDiagnosticQuestions } from '@/hooks/useDiagnosticQuestions';
import { useDiagnosticEdit } from '@/hooks/useDiagnosticEdit';

const NovoDiagnostico = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditing = !!editId;

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

  const [answers, setAnswers] = useState<{[key: string]: number}>({});
  const [results, setResults] = useState<any>(null);
  const [diagnosticData, setDiagnosticData] = useState({
    planos: '',
    valores: '',
    observacoes: ''
  });

  const saveEmpresaMutation = useSaveEmpresa();
  const saveDiagnosticoMutation = useSaveDiagnostico();
  const saveRespostasMutation = useSaveRespostas();

  const { questions, isLoading: questionsLoading, error: questionsError } = useDiagnosticQuestions();
  const { calculateResults } = useDiagnosticCalculations();
  
  // Hook para buscar dados quando estiver editando
  const { data: editData, isLoading: editLoading } = useDiagnosticEdit(editId);

  // Carregar dados quando estiver editando
  useEffect(() => {
    if (isEditing && editData) {
      const { diagnostic, respostas } = editData;
      const empresa = diagnostic.empresas;

      // Preencher dados da empresa
      setCompanyData({
        clientName: empresa?.cliente_nome || '',
        companyName: empresa?.nome || '',
        email: empresa?.cliente_email || '',
        phone: empresa?.cliente_telefone || '',
        website: empresa?.site_instagram || '',
        sector: empresa?.setor || '',
        employees: empresa?.funcionarios || '',
        revenue: empresa?.faturamento || ''
      });

      // Preencher respostas
      const answersMap: {[key: string]: number} = {};
      respostas.forEach((resposta: any) => {
        answersMap[resposta.pergunta_id] = resposta.score;
      });
      setAnswers(answersMap);

      // Preencher dados do diagnóstico
      setDiagnosticData({
        planos: diagnostic.planos || '',
        valores: diagnostic.valores?.toString() || '',
        observacoes: diagnostic.observacoes || ''
      });

      // Calcular resultados baseado nas respostas
      if (Object.keys(answersMap).length > 0 && questions.length > 0) {
        const calculatedResults = calculateResults(answersMap, questions);
        setResults(calculatedResults);
      }

      toast({
        title: "Dados carregados",
        description: "Os dados do diagnóstico foram carregados para edição."
      });
    }
  }, [editData, isEditing, questions, calculateResults]);

  console.log('Questions loaded:', questions);
  console.log('Current answers:', answers);
  console.log('Questions loading:', questionsLoading);
  console.log('Questions error:', questionsError);

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
      console.log('Calculating results with answers:', answers, 'and questions:', questions);
      const calculatedResults = calculateResults(answers, questions);
      console.log('Calculated results:', calculatedResults);
      setResults(calculatedResults);
    }

    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSaveDiagnostic = async () => {
    try {
      console.log('Starting diagnostic save process...');
      console.log('Company data:', companyData);
      console.log('Diagnostic data:', diagnosticData);
      console.log('Results:', results);
      console.log('Answers:', answers);

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
        // Lógica de atualização (implementar conforme necessário)
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

      console.log('Saving empresa:', empresaData);
      const empresa = await saveEmpresaMutation.mutateAsync(empresaData);
      console.log('Empresa saved:', empresa);

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

      console.log('Saving diagnostico:', diagnosticoData);
      const diagnostico = await saveDiagnosticoMutation.mutateAsync(diagnosticoData);
      console.log('Diagnostico saved:', diagnostico);

      // Salvar respostas - Usar UUID em vez de número
      const respostasData = Object.entries(answers).map(([perguntaId, score]) => {
        const question = questions.find(q => q.id === perguntaId);
        const resposta = question?.options.find(o => o.score === score)?.text || '';
        
        return {
          diagnostico_id: diagnostico.id,
          pergunta_id: perguntaId, // Agora é string UUID
          score: score,
          resposta: resposta
        };
      });

      console.log('Saving respostas:', respostasData);
      if (respostasData.length > 0) {
        await saveRespostasMutation.mutateAsync(respostasData);
        console.log('Respostas saved successfully');
      }

      toast({
        title: "Diagnóstico salvo",
        description: "O diagnóstico foi salvo com sucesso!",
      });

      // Redirecionar para diagnósticos
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

  if (editLoading) {
    return <div className="flex items-center justify-center h-64">Carregando dados para edição...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header com Progress */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Editar Diagnóstico' : 'Novo Diagnóstico'}
        </h1>
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
          isLoading={questionsLoading}
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
            disabled={currentStep === 2 && questionsLoading}
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
