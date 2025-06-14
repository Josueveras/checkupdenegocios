
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

interface OptionData {
  texto?: string;
  text?: string;
  score?: number;
}

// Função para validar e limpar opções
const validateAndCleanOptions = (opcoes: any[]): Array<{ text: string; score: number }> => {
  if (!Array.isArray(opcoes)) {
    console.warn('Options is not an array, using default options');
    return [
      { text: 'Não existe', score: 0 },
      { text: 'Existe, mas precisa melhorar', score: 1 },
      { text: 'Existe e está funcionando bem', score: 2 }
    ];
  }

  const cleanedOptions = opcoes
    .filter((opt: any) => {
      // Remove opções inválidas como strings muito curtas
      if (typeof opt === 'string' && opt.length <= 3) {
        return false;
      }
      return opt && (typeof opt === 'object' || typeof opt === 'string');
    })
    .map((opt: any) => {
      const optData = opt as OptionData;
      if (typeof optData === 'object' && optData !== null) {
        return {
          text: optData.texto || optData.text || '',
          score: typeof optData.score === 'number' ? optData.score : 0
        };
      } else {
        return {
          text: String(opt) || '',
          score: 0
        };
      }
    })
    .filter(opt => opt.text.trim().length > 0); // Remove opções vazias

  // Se não temos opções válidas, usar padrão
  if (cleanedOptions.length === 0) {
    return [
      { text: 'Não existe', score: 0 },
      { text: 'Existe, mas precisa melhorar', score: 1 },
      { text: 'Existe e está funcionando bem', score: 2 }
    ];
  }

  return cleanedOptions;
};

export const usePerguntasManager = () => {
  const queryClient = useQueryClient();
  const { data: questions, isLoading, error } = usePerguntas();

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

  const saveQuestion = useMutation({
    mutationFn: async (question: Question) => {
      // Validação rigorosa
      if (!question.question?.trim()) {
        throw new Error('Pergunta não pode estar vazia');
      }
      
      if (!question.options || question.options.length < 2) {
        throw new Error('É necessário ter pelo menos 2 opções');
      }
      
      if (question.options.some(opt => !opt.text?.trim())) {
        throw new Error('Todas as opções devem ter texto');
      }
      
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
