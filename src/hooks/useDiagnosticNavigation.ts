
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface NavigationProps {
  companyData: any;
  questions: any[];
  answers: {[key: string]: number};
  questionsLoading: boolean;
  onCalculateResults: () => any;
}

export const useDiagnosticNavigation = ({
  companyData,
  questions,
  answers,
  questionsLoading,
  onCalculateResults
}: NavigationProps) => {
  const [currentStep, setCurrentStep] = useState(1);

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
      onCalculateResults();
    }

    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return {
    currentStep,
    handleNext,
    handleBack
  };
};
