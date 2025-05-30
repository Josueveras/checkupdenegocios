
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { CompanyDataStep } from '@/components/diagnostic-steps/CompanyDataStep';
import { DiagnosticQuestionsStep } from '@/components/diagnostic-steps/DiagnosticQuestionsStep';
import { ResultsStep } from '@/components/diagnostic-steps/ResultsStep';
import { FinalizeStep } from '@/components/diagnostic-steps/FinalizeStep';
import { useDiagnosticData } from '@/hooks/useDiagnosticData';
import { useDiagnosticNavigation } from '@/hooks/useDiagnosticNavigation';
import { useDiagnosticOperationsHandler } from '@/hooks/useDiagnosticOperationsHandler';

const NovoDiagnostico = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const {
    companyData,
    setCompanyData,
    answers,
    setAnswers,
    results,
    setResults,
    diagnosticData,
    setDiagnosticData,
    questions,
    questionsLoading,
    questionsError,
    editLoading,
    isEditing,
    calculateResultsFromAnswers
  } = useDiagnosticData(editId);

  const {
    currentStep,
    handleNext,
    handleBack
  } = useDiagnosticNavigation({
    companyData,
    questions,
    answers,
    questionsLoading,
    onCalculateResults: () => {
      const calculatedResults = calculateResultsFromAnswers();
      if (calculatedResults) {
        setResults(calculatedResults);
      }
    }
  });

  const {
    handleSaveDiagnostic,
    handleGenerateProposal,
    handleDownloadPDF,
    isSaving
  } = useDiagnosticOperationsHandler({
    companyData,
    diagnosticData,
    results,
    answers,
    questions,
    isEditing
  });

  console.log('Questions loaded:', questions);
  console.log('Current answers:', answers);
  console.log('Questions loading:', questionsLoading);
  console.log('Questions error:', questionsError);

  if (editLoading) {
    return <div className="flex items-center justify-center h-64">Carregando dados para edição...</div>;
  }

  if (questionsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar perguntas: {questionsError.message}</p>
          <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
        </div>
      </div>
    );
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
          isSaving={isSaving}
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
