
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

  console.log('🔍 DEBUG: Dados brutos do Supabase:', perguntasSupabase);

  // Transformar dados do Supabase para o formato esperado
  const questions: Question[] = perguntasSupabase?.map((pergunta: any) => {
    console.log('🔄 Processando pergunta:', {
      id: pergunta.id,
      pergunta: pergunta.pergunta,
      categoria: pergunta.categoria,
      obrigatoria: pergunta.obrigatoria,
      opcoes: pergunta.opcoes
    });
    
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

    const processedQuestion = {
      id: pergunta.id,
      question: pergunta.pergunta,
      category: pergunta.categoria,
      options: options,
      required: pergunta.obrigatoria === true || pergunta.obrigatoria === 1 // Garantir conversão correta
    };

    console.log('✅ Pergunta processada:', processedQuestion);
    return processedQuestion;
  }) || [];

  console.log('📊 Total de perguntas processadas:', questions.length);
  console.log('⚠️ Perguntas obrigatórias:', questions.filter(q => q.required).length);

  return { 
    questions, 
    isLoading, 
    error 
  };
};
