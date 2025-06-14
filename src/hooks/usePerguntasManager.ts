
import { usePerguntas } from './useSupabase';
import { useQuestionSave } from './useQuestionSave';
import { useQuestionDelete } from './useQuestionDelete';
import { validateAndCleanOptions } from '@/utils/questionValidation';
import { Question } from '@/types/question';

export const usePerguntasManager = () => {
  const { data: questions, isLoading, error } = usePerguntas();
  const saveQuestion = useQuestionSave();
  const deleteQuestion = useQuestionDelete();

  // Transformar e validar dados do Supabase
  const formattedQuestions = questions?.map((pergunta: any) => {
    const processedOptions = validateAndCleanOptions(pergunta.opcoes || []);
    
    return {
      id: pergunta.id,
      question: pergunta.pergunta || '',
      category: pergunta.categoria || 'Sem categoria',
      options: processedOptions,
      required: pergunta.obrigatoria || false
    };
  }).filter(Boolean) || [];

  return {
    questions: formattedQuestions,
    isLoading,
    error,
    saveQuestion,
    deleteQuestion
  };
};
