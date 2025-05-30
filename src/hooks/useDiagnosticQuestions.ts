
import { usePerguntas } from './useSupabase';

interface Question {
  id: string;
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

  console.log('Raw data from Supabase:', perguntasSupabase);

  // Transformar dados do Supabase para o formato esperado
  const questions: Question[] = perguntasSupabase?.map((pergunta: any) => {
    console.log('Processing pergunta:', pergunta);
    
    let options = [];
    
    // Se existe campo opcoes no Supabase, usar ele
    if (pergunta.opcoes && Array.isArray(pergunta.opcoes)) {
      options = pergunta.opcoes.map((opt: any) => ({
        text: opt.texto || opt.text || '',
        score: opt.score || 0
      }));
    } else {
      // Fallback para opções padrão
      options = [
        { text: "Não temos estratégia definida", score: 0 },
        { text: "Temos algumas ações isoladas", score: 1 },
        { text: "Temos estratégia básica implementada", score: 2 },
        { text: "Temos estratégia completa e bem executada", score: 3 }
      ];
    }

    return {
      id: pergunta.id,
      question: pergunta.pergunta,
      category: pergunta.categoria,
      options: options,
      required: pergunta.obrigatoria || false
    };
  }) || [];

  console.log('Processed questions:', questions);

  return { 
    questions, 
    isLoading, 
    error 
  };
};
