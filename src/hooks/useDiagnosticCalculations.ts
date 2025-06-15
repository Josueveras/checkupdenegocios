

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

export const useDiagnosticCalculations = () => {
  const calculateResults = (answers: {[key: string]: number}, questions: Question[]) => {
    // Extrair categorias dinamicamente das perguntas
    const categories = [...new Set(questions.map(q => q.category))];
    const categoryScores: {[key: string]: {total: number, max: number}} = {};
    
    // Inicializar categorias baseadas nas perguntas carregadas
    categories.forEach(cat => {
      categoryScores[cat] = { total: 0, max: 0 };
    });

    // Calcular scores por categoria
    questions.forEach(question => {
      // Garantir que a categoria existe no categoryScores
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = { total: 0, max: 0 };
      }
      
      const answer = answers[question.id];
      if (answer !== undefined) {
        categoryScores[question.category].total += answer;
      }
      categoryScores[question.category].max += 3; // Pontuação máxima por pergunta
    });

    // Calcular percentuais
    const categoryPercentages: {[key: string]: number} = {};
    let totalScore = 0;
    let totalMax = 0;

    Object.entries(categoryScores).forEach(([category, scores]) => {
      const percentage = scores.max > 0 ? Math.round((scores.total / scores.max) * 100) : 0;
      categoryPercentages[category] = percentage;
      totalScore += scores.total;
      totalMax += scores.max;
    });

    const overallScore = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

    // Determinar nível
    let level = "Iniciante";
    if (overallScore >= 80) level = "Avançado";
    else if (overallScore >= 60) level = "Intermediário";
    else if (overallScore >= 40) level = "Emergente";

    // Identificar pontos fortes e de atenção
    const strongPoints = Object.entries(categoryPercentages)
      .filter(([_, score]) => score >= 80)
      .map(([category]) => category);

    const attentionPoints = Object.entries(categoryPercentages)
      .filter(([_, score]) => score <= 40)
      .map(([category]) => category);

    return {
      overallScore,
      level,
      categoryScores: categoryPercentages,
      strongPoints,
      attentionPoints,
      recommendations: generateRecommendations(categoryPercentages)
    };
  };

  const generateRecommendations = (scores: {[key: string]: number}) => {
    const recommendations: {[key: string]: string[]} = {};
    
    Object.entries(scores).forEach(([category, score]) => {
      if (score < 40) {
        // Recomendações específicas para categorias conhecidas
        switch (category.toLowerCase()) {
          case "marketing":
            recommendations[category] = [
              "Desenvolver estratégia de marketing digital",
              "Implementar presença nas redes sociais",
              "Criar conteúdo relevante para o público-alvo"
            ];
            break;
          case "vendas":
            recommendations[category] = [
              "Estruturar processo de vendas",
              "Implementar CRM para gestão de leads",
              "Treinar equipe comercial"
            ];
            break;
          case "estratégia":
            recommendations[category] = [
              "Elaborar planejamento estratégico",
              "Definir metas e indicadores",
              "Realizar análise de mercado"
            ];
            break;
          case "gestão":
            recommendations[category] = [
              "Implementar indicadores de desempenho",
              "Criar rotinas de monitoramento",
              "Estabelecer processos organizacionais"
            ];
            break;
          case "tecnologia":
            recommendations[category] = [
              "Implementar ferramentas digitais básicas",
              "Automatizar processos repetitivos",
              "Investir em segurança da informação"
            ];
            break;
          case "financeiro":
            recommendations[category] = [
              "Organizar controle financeiro",
              "Implementar fluxo de caixa",
              "Definir orçamento e metas financeiras"
            ];
            break;
          case "recursos humanos":
            recommendations[category] = [
              "Estruturar processos de RH",
              "Implementar plano de cargos e salários",
              "Criar programa de treinamento"
            ];
            break;
          default:
            // Recomendações genéricas para categorias não mapeadas
            recommendations[category] = [
              `Desenvolver estratégia específica para ${category}`,
              `Implementar processos estruturados em ${category}`,
              `Definir indicadores de performance para ${category}`,
              `Buscar capacitação na área de ${category}`
            ];
            break;
        }
      }
    });

    return recommendations;
  };

  return { calculateResults };
};

