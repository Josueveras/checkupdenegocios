

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
      if (score < 70) { // Mudado de 40 para 70 para incluir mais categorias
        let categoryRecommendations: string[] = [];
        
        // Recomendações específicas para categorias conhecidas
        switch (category.toLowerCase()) {
          case "marketing":
            if (score < 40) {
              categoryRecommendations = [
                "Desenvolver estratégia de marketing digital",
                "Implementar presença nas redes sociais",
                "Criar conteúdo relevante para o público-alvo"
              ];
            } else {
              categoryRecommendations = [
                "Otimizar campanhas de marketing existentes",
                "Implementar métricas de performance",
                "Diversificar canais de comunicação"
              ];
            }
            break;
          case "vendas":
            if (score < 40) {
              categoryRecommendations = [
                "Estruturar processo de vendas",
                "Implementar CRM para gestão de leads",
                "Treinar equipe comercial"
              ];
            } else {
              categoryRecommendations = [
                "Otimizar funil de vendas",
                "Implementar automação de vendas",
                "Melhorar follow-up com clientes"
              ];
            }
            break;
          case "estratégia":
            if (score < 40) {
              categoryRecommendations = [
                "Elaborar planejamento estratégico",
                "Definir metas e indicadores",
                "Realizar análise de mercado"
              ];
            } else {
              categoryRecommendations = [
                "Revisar e ajustar estratégias existentes",
                "Implementar análise de concorrência",
                "Desenvolver cenários futuros"
              ];
            }
            break;
          case "gestão":
            if (score < 40) {
              categoryRecommendations = [
                "Implementar indicadores de desempenho",
                "Criar rotinas de monitoramento",
                "Estabelecer processos organizacionais"
              ];
            } else {
              categoryRecommendations = [
                "Otimizar processos existentes",
                "Implementar gestão por resultados",
                "Desenvolver liderança da equipe"
              ];
            }
            break;
          case "tecnologia":
            if (score < 40) {
              categoryRecommendations = [
                "Implementar ferramentas digitais básicas",
                "Automatizar processos repetitivos",
                "Investir em segurança da informação"
              ];
            } else {
              categoryRecommendations = [
                "Otimizar infraestrutura tecnológica",
                "Implementar soluções de business intelligence",
                "Avaliar novas tecnologias emergentes"
              ];
            }
            break;
          case "financeiro":
            if (score < 40) {
              categoryRecommendations = [
                "Organizar controle financeiro",
                "Implementar fluxo de caixa",
                "Definir orçamento e metas financeiras"
              ];
            } else {
              categoryRecommendations = [
                "Otimizar gestão de custos",
                "Implementar análise de rentabilidade",
                "Desenvolver planejamento financeiro estratégico"
              ];
            }
            break;
          case "recursos humanos":
            if (score < 40) {
              categoryRecommendations = [
                "Estruturar processos de RH",
                "Implementar plano de cargos e salários",
                "Criar programa de treinamento"
              ];
            } else {
              categoryRecommendations = [
                "Desenvolver programa de retenção de talentos",
                "Implementar avaliação de desempenho",
                "Criar cultura organizacional forte"
              ];
            }
            break;
          default:
            // Recomendações genéricas para categorias não mapeadas
            if (score < 40) {
              categoryRecommendations = [
                `Desenvolver estratégia específica para ${category}`,
                `Implementar processos estruturados em ${category}`,
                `Definir indicadores de performance para ${category}`,
                `Buscar capacitação na área de ${category}`
              ];
            } else {
              categoryRecommendations = [
                `Otimizar processos existentes em ${category}`,
                `Implementar melhorias contínuas em ${category}`,
                `Desenvolver expertise avançada em ${category}`,
                `Buscar inovações na área de ${category}`
              ];
            }
            break;
        }
        
        recommendations[category] = categoryRecommendations;
      }
    });

    return recommendations;
  };

  return { calculateResults };
};

