
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDebugPerguntas = () => {
  // Query para analisar dados corrompidos
  const analyzeData = useQuery({
    queryKey: ['debug-perguntas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('perguntas')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Debug: Error fetching questions:', error);
        throw error;
      }

      console.log('=== DEBUG: Raw database data ===');
      console.log('Total questions:', data?.length || 0);
      
      const analysis = data?.map((pergunta, index) => {
        console.log(`\n--- Question ${index + 1} (ID: ${pergunta.id}) ---`);
        console.log('Pergunta:', pergunta.pergunta);
        console.log('Categoria:', pergunta.categoria);
        console.log('Raw opcoes type:', typeof pergunta.opcoes);
        console.log('Raw opcoes value:', pergunta.opcoes);
        
        let processedOptions = [];
        let hasErrors = false;
        let errorDetails = [];

        if (pergunta.opcoes) {
          if (Array.isArray(pergunta.opcoes)) {
            processedOptions = pergunta.opcoes.map((opt, optIndex) => {
              console.log(`  Option ${optIndex + 1}:`, opt);
              
              // Verificar se é um objeto válido
              if (typeof opt === 'object' && opt !== null) {
                const hasTexto = 'texto' in opt;
                const hasText = 'text' in opt;
                const hasScore = 'score' in opt;
                
                if (!hasTexto && !hasText) {
                  hasErrors = true;
                  errorDetails.push(`Option ${optIndex + 1}: Missing text/texto field`);
                }
                
                if (!hasScore || typeof opt.score !== 'number') {
                  hasErrors = true;
                  errorDetails.push(`Option ${optIndex + 1}: Invalid or missing score`);
                }
                
                return {
                  text: opt.texto || opt.text || '',
                  score: typeof opt.score === 'number' ? opt.score : 0,
                  originalFormat: opt
                };
              } else {
                hasErrors = true;
                errorDetails.push(`Option ${optIndex + 1}: Not an object (${typeof opt})`);
                return {
                  text: String(opt) || '',
                  score: 0,
                  originalFormat: opt
                };
              }
            });
          } else {
            hasErrors = true;
            errorDetails.push('Options is not an array');
          }
        } else {
          hasErrors = true;
          errorDetails.push('Options field is null/undefined');
        }

        return {
          id: pergunta.id,
          pergunta: pergunta.pergunta,
          categoria: pergunta.categoria,
          originalOpcoes: pergunta.opcoes,
          processedOptions,
          hasErrors,
          errorDetails,
          totalOptions: processedOptions.length
        };
      }) || [];

      console.log('\n=== DEBUG: Analysis Summary ===');
      const corruptedQuestions = analysis.filter(q => q.hasErrors);
      console.log('Total corrupted questions:', corruptedQuestions.length);
      
      corruptedQuestions.forEach(q => {
        console.log(`\nCorrupted Question ID ${q.id}:`);
        q.errorDetails.forEach(error => console.log(`  - ${error}`));
      });

      return {
        totalQuestions: data?.length || 0,
        analysis,
        corruptedQuestions,
        summary: {
          totalCorrupted: corruptedQuestions.length,
          totalValid: analysis.length - corruptedQuestions.length
        }
      };
    },
    enabled: false // Only run when manually triggered
  });

  // Mutation para limpar dados corrompidos
  const cleanCorruptedData = useMutation({
    mutationFn: async () => {
      console.log('=== DEBUG: Starting data cleanup ===');
      
      const { data: questions, error: fetchError } = await supabase
        .from('perguntas')
        .select('*');
      
      if (fetchError) throw fetchError;

      const cleanupPromises = questions?.map(async (pergunta) => {
        let needsUpdate = false;
        let cleanedOptions = [];

        if (pergunta.opcoes && Array.isArray(pergunta.opcoes)) {
          cleanedOptions = pergunta.opcoes
            .filter(opt => {
              // Remove opções inválidas como "s", "ddd", etc.
              if (typeof opt === 'string' && opt.length <= 3) {
                console.log(`Removing invalid option "${opt}" from question ${pergunta.id}`);
                needsUpdate = true;
                return false;
              }
              return true;
            })
            .map(opt => {
              if (typeof opt === 'object' && opt !== null) {
                // Padronizar formato para 'texto' e 'score'
                const standardized = {
                  texto: opt.texto || opt.text || '',
                  score: typeof opt.score === 'number' ? opt.score : 0
                };
                
                if (JSON.stringify(opt) !== JSON.stringify(standardized)) {
                  console.log(`Standardizing option format for question ${pergunta.id}`);
                  needsUpdate = true;
                }
                
                return standardized;
              }
              return opt;
            });
        } else {
          // Se não tem opções válidas, criar opções padrão
          cleanedOptions = [
            { texto: 'Não existe', score: 0 },
            { texto: 'Existe, mas precisa melhorar', score: 1 },
            { texto: 'Existe e está funcionando bem', score: 2 }
          ];
          needsUpdate = true;
          console.log(`Adding default options to question ${pergunta.id}`);
        }

        if (needsUpdate) {
          console.log(`Updating question ${pergunta.id} with cleaned options:`, cleanedOptions);
          
          const { error: updateError } = await supabase
            .from('perguntas')
            .update({ opcoes: cleanedOptions })
            .eq('id', pergunta.id);
          
          if (updateError) {
            console.error(`Error updating question ${pergunta.id}:`, updateError);
            throw updateError;
          }
          
          return { id: pergunta.id, updated: true, newOptions: cleanedOptions };
        }
        
        return { id: pergunta.id, updated: false };
      }) || [];

      const results = await Promise.all(cleanupPromises);
      const updatedCount = results.filter(r => r.updated).length;
      
      console.log(`=== DEBUG: Cleanup completed. Updated ${updatedCount} questions ===`);
      return { updatedCount, results };
    }
  });

  // Mutation para testar persistência
  const testPersistence = useMutation({
    mutationFn: async (testData: { question: string; options: Array<{text: string; score: number}> }) => {
      console.log('=== DEBUG: Testing data persistence ===');
      console.log('Test data:', testData);
      
      // Criar pergunta de teste
      const perguntaData = {
        pergunta: testData.question,
        categoria: 'Debug',
        opcoes: testData.options.map(opt => ({
          texto: opt.text,
          score: opt.score
        })),
        obrigatoria: false,
        ativa: true,
        tipo: 'multipla_escolha'
      };

      console.log('Inserting test question:', perguntaData);
      
      const { data: inserted, error: insertError } = await supabase
        .from('perguntas')
        .insert(perguntaData)
        .select()
        .single();
      
      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }
      
      console.log('Inserted successfully:', inserted);
      
      // Aguardar um pouco e verificar se os dados persistiram
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data: retrieved, error: retrieveError } = await supabase
        .from('perguntas')
        .select('*')
        .eq('id', inserted.id)
        .single();
      
      if (retrieveError) {
        console.error('Retrieve error:', retrieveError);
        throw retrieveError;
      }
      
      console.log('Retrieved data:', retrieved);
      
      // Comparar dados
      const optionsMatch = JSON.stringify(inserted.opcoes) === JSON.stringify(retrieved.opcoes);
      console.log('Options match:', optionsMatch);
      
      if (!optionsMatch) {
        console.error('Data mismatch!');
        console.error('Inserted:', inserted.opcoes);
        console.error('Retrieved:', retrieved.opcoes);
      }
      
      // Limpar dados de teste
      await supabase.from('perguntas').delete().eq('id', inserted.id);
      console.log('Test question deleted');
      
      return {
        success: optionsMatch,
        inserted: inserted.opcoes,
        retrieved: retrieved.opcoes
      };
    }
  });

  return {
    analyzeData,
    cleanCorruptedData,
    testPersistence,
    runAnalysis: () => analyzeData.refetch(),
    isAnalyzing: analyzeData.isFetching,
    isCleaning: cleanCorruptedData.isPending,
    isTesting: testPersistence.isPending
  };
};
