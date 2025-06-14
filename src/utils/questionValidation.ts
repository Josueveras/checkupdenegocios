
import { OptionData } from '@/types/question';

// Função para validar e limpar opções
export const validateAndCleanOptions = (opcoes: any[]): Array<{ text: string; score: number }> => {
  if (!Array.isArray(opcoes)) {
    console.warn('Options is not an array, using default options');
    return getDefaultOptions();
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
    return getDefaultOptions();
  }

  return cleanedOptions;
};

const getDefaultOptions = (): Array<{ text: string; score: number }> => {
  return [
    { text: 'Não existe', score: 0 },
    { text: 'Existe, mas precisa melhorar', score: 1 },
    { text: 'Existe e está funcionando bem', score: 2 }
  ];
};

export const validateQuestionData = (question: any) => {
  // Validação rigorosa
  if (!question.question?.trim()) {
    throw new Error('Pergunta não pode estar vazia');
  }
  
  if (!question.options || question.options.length < 2) {
    throw new Error('É necessário ter pelo menos 2 opções');
  }
  
  if (question.options.some((opt: any) => !opt.text?.trim())) {
    throw new Error('Todas as opções devem ter texto');
  }
};
