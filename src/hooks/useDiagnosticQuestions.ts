
export const useDiagnosticQuestions = () => {
  const mockQuestions = [
    {
      id: 1,
      question: "Sua empresa possui uma estratégia de marketing digital estruturada?",
      category: "Marketing",
      options: [
        { text: "Não temos estratégia definida", score: 0 },
        { text: "Temos algumas ações isoladas", score: 1 },
        { text: "Temos estratégia básica implementada", score: 2 },
        { text: "Temos estratégia completa e bem executada", score: 3 }
      ],
      required: true
    },
    {
      id: 2,
      question: "Como é o processo de vendas da sua empresa?",
      category: "Vendas",
      options: [
        { text: "Não temos processo estruturado", score: 0 },
        { text: "Processo básico e informal", score: 1 },
        { text: "Processo definido com algumas ferramentas", score: 2 },
        { text: "Processo otimizado com CRM e automações", score: 3 }
      ],
      required: false
    },
    {
      id: 3,
      question: "Sua empresa possui planejamento estratégico definido?",
      category: "Estratégia",
      options: [
        { text: "Não temos planejamento", score: 0 },
        { text: "Planejamento informal/básico", score: 1 },
        { text: "Planejamento anual estruturado", score: 2 },
        { text: "Planejamento estratégico completo com metas", score: 3 }
      ],
      required: false
    },
    {
      id: 4,
      question: "Como sua empresa monitora e analisa indicadores de desempenho?",
      category: "Gestão",
      options: [
        { text: "Não fazemos monitoramento", score: 0 },
        { text: "Acompanhamos alguns indicadores básicos", score: 1 },
        { text: "Temos dashboards e relatórios regulares", score: 2 },
        { text: "Análise avançada com BI e automações", score: 3 }
      ],
      required: false
    }
  ];

  return { questions: mockQuestions };
};
