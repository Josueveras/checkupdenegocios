
import { usePerguntas } from './useSupabase';

interface Question {
  id: number;
  question: string;
  category: string;
  options: Array<{
    text: string;
    score: number;
  }>;
  required: boolean;
}

export const useDiagnosticQuestions = () => {
  const { data: perguntasSupabase, isLoading, error } = usePerguntas();

  // Transformar dados do Supabase para o formato esperado
  const questions: Question[] = perguntasSupabase?.map((pergunta: any) => ({
    id: pergunta.id,
    question: pergunta.pergunta,
    category: pergunta.categoria,
    options: pergunta.opcoes || [
      { text: "Não temos estratégia definida", score: 0 },
      { text: "Temos algumas ações isoladas", score: 1 },
      { text: "Temos estratégia básica implementada", score: 2 },
      { text: "Temos estratégia completa e bem executada", score: 3 }
    ],
    required: pergunta.obrigatoria || false
  })) || [];

  return { 
    questions, 
    isLoading, 
    error 
  };
};
