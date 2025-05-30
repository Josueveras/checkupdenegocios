
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { usePerguntas } from './useSupabase';

interface Question {
  id?: string;
  question: string;
  category: string;
  options: Array<{ text: string; score: number }>;
  required: boolean;
}

export const usePerguntasManager = () => {
  const queryClient = useQueryClient();
  const { data: questions, isLoading, error } = usePerguntas();

  // Transformar dados do Supabase para o formato da UI
  const formattedQuestions = questions?.map((pergunta: any, index: number) => ({
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

  const saveQuestion = useMutation({
    mutationFn: async (question: Question) => {
      const perguntaData = {
        pergunta: question.question,
        categoria: question.category,
        opcoes: question.options.map(opt => ({
          texto: opt.text,
          score: opt.score
        })),
        obrigatoria: question.required,
        ativa: true,
        tipo: 'multipla_escolha'
      };

      if (question.id) {
        // Atualizar pergunta existente
        const { data, error } = await supabase
          .from('perguntas')
          .update(perguntaData)
          .eq('id', question.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Criar nova pergunta
        const { data, error } = await supabase
          .from('perguntas')
          .insert(perguntaData)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perguntas'] });
    }
  });

  const deleteQuestion = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('perguntas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perguntas'] });
    }
  });

  return {
    questions: formattedQuestions,
    isLoading,
    error,
    saveQuestion,
    deleteQuestion
  };
};
