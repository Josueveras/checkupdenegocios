
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
      console.log('🔍 DEBUG: Validando perguntas obrigatórias...');
      console.log('📝 Total de perguntas:', questions.length);
      console.log('📋 Respostas atuais:', answers);
      
      // Validar perguntas obrigatórias
      const requiredQuestions = questions.filter(q => {
        console.log(`❓ Pergunta ${q.id}: required=${q.required}, obrigatoria=${q.obrigatoria}`);
        return q.required === true || q.obrigatoria === true;
      });
      
      console.log('⚠️ Perguntas obrigatórias encontradas:', requiredQuestions.length);
      
      for (const question of requiredQuestions) {
        const hasAnswer = question.id in answers;
        const answerValue = answers[question.id];
        
        console.log(`🔎 Verificando pergunta ${question.id}:`, {
          hasAnswer,
          answerValue,
          isValid: hasAnswer && answerValue !== undefined && answerValue !== null
        });
        
        if (!hasAnswer || answerValue === undefined || answerValue === null) {
          console.log('❌ Pergunta obrigatória não respondida:', question.question);
          toast({
            title: "Pergunta obrigatória",
            description: `Por favor, responda: ${question.question}`,
            variant: "destructive"
          });
          return;
        }
      }
      
      console.log('✅ Todas as perguntas obrigatórias foram respondidas');
      
      // Calcular resultados
      onCalculateResults();
    }

    setCurrentStep(prev => Math.min(prev + 1, 3)); // Máximo 3 etapas agora
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
