
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

  console.log('Raw questions data from Supabase:', questions);

  // Transformar dados do Supabase para o formato da UI
  const formattedQuestions = questions?.map((pergunta: any) => {
    console.log('Processing question:', pergunta.id, 'with opcoes:', pergunta.opcoes);
    
    let processedOptions: Array<{ text: string; score: number }> = [];
    
    if (pergunta.opcoes && Array.isArray(pergunta.opcoes)) {
      processedOptions = pergunta.opcoes.map((opt: any) => ({
        text: opt.texto || opt.text || '',
        score: typeof opt.score === 'number' ? opt.score : 0
      }));
    }
    
    console.log('Processed options for question', pergunta.id, ':', processedOptions);
    
    return {
      id: pergunta.id,
      question: pergunta.pergunta,
      category: pergunta.categoria,
      options: processedOptions,
      required: pergunta.obrigatoria || false
    };
  }) || [];

  console.log('Final formatted questions:', formattedQuestions);

  const saveQuestion = useMutation({
    mutationFn: async (question: Question) => {
      console.log('Saving question:', question);
      
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

      console.log('Data being sent to Supabase:', perguntaData);

      if (question.id) {
        // Atualizar pergunta existente
        const { data, error } = await supabase
          .from('perguntas')
          .update(perguntaData)
          .eq('id', question.id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating question:', error);
          throw error;
        }
        
        console.log('Question updated successfully:', data);
        return data;
      } else {
        // Criar nova pergunta
        const { data, error } = await supabase
          .from('perguntas')
          .insert(perguntaData)
          .select()
          .single();
        
        if (error) {
          console.error('Error creating question:', error);
          throw error;
        }
        
        console.log('Question created successfully:', data);
        return data;
      }
    },
    onSuccess: (data) => {
      console.log('Mutation successful, invalidating queries...');
      queryClient.invalidateQueries({ queryKey: ['perguntas'] });
    },
    onError: (error) => {
      console.error('Mutation failed:', error);
    }
  });

  const deleteQuestion = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting question with id:', id);
      
      const { error } = await supabase
        .from('perguntas')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting question:', error);
        throw error;
      }
      
      console.log('Question deleted successfully');
    },
    onSuccess: () => {
      console.log('Delete successful, invalidating queries...');
      queryClient.invalidateQueries({ queryKey: ['perguntas'] });
    },
    onError: (error) => {
      console.error('Delete failed:', error);
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
