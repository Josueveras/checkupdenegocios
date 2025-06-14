
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

  console.log('=== PERGUNTAS MANAGER DEBUG ===');
  console.log('Raw questions data from Supabase:', questions);
  console.log('Questions count:', questions?.length || 0);

  // Transformar dados do Supabase para o formato da UI com melhor tratamento de erros
  const formattedQuestions = questions?.map((pergunta: any, index: number) => {
    console.log(`\n--- Processing Question ${index + 1} ---`);
    console.log('Question ID:', pergunta.id);
    console.log('Question text:', pergunta.pergunta);
    console.log('Category:', pergunta.categoria);
    console.log('Raw opcoes:', pergunta.opcoes);
    console.log('Opcoes type:', typeof pergunta.opcoes);
    console.log('Is opcoes array:', Array.isArray(pergunta.opcoes));
    
    let processedOptions: Array<{ text: string; score: number }> = [];
    
    if (pergunta.opcoes) {
      if (Array.isArray(pergunta.opcoes)) {
        processedOptions = pergunta.opcoes
          .filter((opt: any) => {
            // Filtrar opções inválidas
            if (typeof opt === 'string' && opt.length <= 3) {
              console.warn(`Filtering out invalid option: "${opt}"`);
              return false;
            }
            return opt && (typeof opt === 'object' || typeof opt === 'string');
          })
          .map((opt: any, optIndex: number) => {
            console.log(`  Processing option ${optIndex + 1}:`, opt);
            
            if (typeof opt === 'object' && opt !== null) {
              const text = opt.texto || opt.text || '';
              const score = typeof opt.score === 'number' ? opt.score : 0;
              
              console.log(`    Mapped to: text="${text}", score=${score}`);
              
              return { text, score };
            } else {
              // Fallback para strings ou outros tipos
              console.log(`    Converting non-object option: ${opt}`);
              return {
                text: String(opt) || '',
                score: 0
              };
            }
          });
      } else {
        console.warn(`Question ${pergunta.id}: opcoes is not an array, type: ${typeof pergunta.opcoes}`);
      }
    } else {
      console.warn(`Question ${pergunta.id}: opcoes is null/undefined`);
    }
    
    console.log(`Final processed options for question ${pergunta.id}:`, processedOptions);
    
    // Se não temos opções válidas, não retornar a pergunta (será filtrada)
    if (processedOptions.length === 0) {
      console.error(`Question ${pergunta.id} has no valid options, excluding from list`);
      return null;
    }
    
    const formattedQuestion = {
      id: pergunta.id,
      question: pergunta.pergunta || '',
      category: pergunta.categoria || 'Sem categoria',
      options: processedOptions,
      required: pergunta.obrigatoria || false
    };
    
    console.log(`Final formatted question ${pergunta.id}:`, formattedQuestion);
    return formattedQuestion;
  }).filter(Boolean) || []; // Remove null values

  console.log('\n=== FINAL FORMATTED QUESTIONS ===');
  console.log('Total formatted questions:', formattedQuestions.length);
  formattedQuestions.forEach((q, i) => {
    console.log(`Question ${i + 1}: "${q.question}" with ${q.options.length} options`);
  });

  const saveQuestion = useMutation({
    mutationFn: async (question: Question) => {
      console.log('\n=== SAVE QUESTION DEBUG ===');
      console.log('Input question:', question);
      
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

      console.log('Formatted data for Supabase:', perguntaData);
      console.log('Options being saved:', perguntaData.opcoes);

      try {
        if (question.id) {
          console.log('Updating existing question with ID:', question.id);
          
          const { data, error } = await supabase
            .from('perguntas')
            .update(perguntaData)
            .eq('id', question.id)
            .select()
            .single();
          
          if (error) {
            console.error('Update error:', error);
            throw error;
          }
          
          console.log('Question updated successfully:', data);
          console.log('Updated opcoes:', data.opcoes);
          
          // Verificar se os dados foram salvos corretamente
          const { data: verification, error: verifyError } = await supabase
            .from('perguntas')
            .select('opcoes')
            .eq('id', question.id)
            .single();
          
          if (verifyError) {
            console.warn('Verification error:', verifyError);
          } else {
            console.log('Verification - opcoes in DB:', verification.opcoes);
            const optionsMatch = JSON.stringify(perguntaData.opcoes) === JSON.stringify(verification.opcoes);
            console.log('Options match after update:', optionsMatch);
            
            if (!optionsMatch) {
              console.error('DATA MISMATCH DETECTED!');
              console.error('Expected:', perguntaData.opcoes);
              console.error('Found in DB:', verification.opcoes);
            }
          }
          
          return data;
        } else {
          console.log('Creating new question');
          
          const { data, error } = await supabase
            .from('perguntas')
            .insert(perguntaData)
            .select()
            .single();
          
          if (error) {
            console.error('Insert error:', error);
            throw error;
          }
          
          console.log('Question created successfully:', data);
          console.log('Created opcoes:', data.opcoes);
          
          return data;
        }
      } catch (error) {
        console.error('Save operation failed:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Save mutation successful, invalidating queries...');
      console.log('Saved question data:', data);
      queryClient.invalidateQueries({ queryKey: ['perguntas'] });
    },
    onError: (error) => {
      console.error('Save mutation failed:', error);
    }
  });

  const deleteQuestion = useMutation({
    mutationFn: async (id: string) => {
      console.log('=== DELETE QUESTION DEBUG ===');
      console.log('Deleting question with id:', id);
      
      const { error } = await supabase
        .from('perguntas')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Delete error:', error);
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
