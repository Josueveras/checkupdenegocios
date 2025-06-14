
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Question } from '@/types/question';
import { validateQuestionData } from '@/utils/questionValidation';

export const useQuestionSave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (question: Question) => {
      validateQuestionData(question);
      
      const perguntaData = {
        pergunta: question.question.trim(),
        categoria: question.category || 'Geral',
        opcoes: question.options.map(opt => ({
          texto: opt.text.trim(),
          score: typeof opt.score === 'number' ? opt.score : 0
        })),
        obrigatoria: Boolean(question.required),
        ativa: true,
        tipo: 'multipla_escolha'
      };

      try {
        if (question.id) {
          const { data, error } = await supabase
            .from('perguntas')
            .update(perguntaData)
            .eq('id', question.id)
            .select()
            .single();
          
          if (error) throw error;
          return data;
        } else {
          const { data, error } = await supabase
            .from('perguntas')
            .insert(perguntaData)
            .select()
            .single();
          
          if (error) throw error;
          return data;
        }
      } catch (error) {
        console.error('Save operation failed:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perguntas'] });
    },
    onError: (error) => {
      console.error('Save mutation failed:', error);
    }
  });
};
