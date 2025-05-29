import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ArrowRight, Download, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const NovoDiagnostico = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [companyData, setCompanyData] = useState({
    clientName: '',
    companyName: '',
    email: '',
    phone: '',
    website: '',
    sector: '',
    employees: '',
    revenue: ''
  });

  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [results, setResults] = useState<any>(null);

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

  const sectors = [
    "Tecnologia", "Varejo", "Serviços", "Indústria", "Saúde", 
    "Educação", "Consultoria", "E-commerce", "Construção", "Outro"
  ];

  const employeeRanges = [
    "1-5", "6-10", "11-25", "26-50", "51-100", "101-500", "500+"
  ];

  const revenueRanges = [
    "Até R$ 100k", "R$ 100k - R$ 500k", "R$ 500k - R$ 1M", 
    "R$ 1M - R$ 5M", "R$ 5M - R$ 10M", "Acima de R$ 10M"
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      // Validar dados da empresa
      if (!companyData.clientName || !companyData.companyName || !companyData.email) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha nome do cliente, empresa e e-mail.",
          variant: "destructive"
        });
        return;
      }
    }

    if (currentStep === 2) {
      // Validar perguntas obrigatórias
      const requiredQuestions = mockQuestions.filter(q => q.required);
      for (const question of requiredQuestions) {
        if (!(question.id in answers)) {
          toast({
            title: "Pergunta obrigatória",
            description: `Por favor, responda: ${question.question}`,
            variant: "destructive"
          });
          return;
        }
      }
      
      // Calcular resultados
      calculateResults();
    }

    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const calculateResults = () => {
    const categories = ["Marketing", "Vendas", "Estratégia", "Gestão"];
    const categoryScores: {[key: string]: {total: number, max: number}} = {};
    
    // Inicializar categorias
    categories.forEach(cat => {
      categoryScores[cat] = { total: 0, max: 0 };
    });

    // Calcular scores por categoria
    mockQuestions.forEach(question => {
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

    setResults({
      overallScore,
      level,
      categoryScores: categoryPercentages,
      strongPoints,
      attentionPoints,
      recommendations: generateRecommendations(categoryPercentages)
    });
  };

  const generateRecommendations = (scores: {[key: string]: number}) => {
    const recommendations: {[key: string]: string[]} = {};
    
    Object.entries(scores).forEach(([category, score]) => {
      if (score < 40) {
        switch (category) {
          case "Marketing":
            recommendations[category] = [
              "Desenvolver estratégia de marketing digital",
              "Implementar presença nas redes sociais",
              "Criar conteúdo relevante para o público-alvo"
            ];
            break;
          case "Vendas":
            recommendations[category] = [
              "Estruturar processo de vendas",
              "Implementar CRM para gestão de leads",
              "Treinar equipe comercial"
            ];
            break;
          case "Estratégia":
            recommendations[category] = [
              "Elaborar planejamento estratégico",
              "Definir metas e indicadores",
              "Realizar análise de mercado"
            ];
            break;
          case "Gestão":
            recommendations[category] = [
              "Implementar indicadores de desempenho",
              "Criar rotinas de monitoramento",
              "Estabelecer processos organizacionais"
            ];
            break;
        }
      }
    });

    return recommendations;
  };

  const handleDownloadPDF = () => {
    toast({
      title: "PDF gerado",
      description: "O relatório foi gerado com sucesso!",
    });
  };

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Dados da Empresa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Nome do Cliente *</Label>
            <Input
              id="clientName"
              value={companyData.clientName}
              onChange={(e) => setCompanyData({...companyData, clientName: e.target.value})}
              placeholder="Nome completo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da Empresa *</Label>
            <Input
              id="companyName"
              value={companyData.companyName}
              onChange={(e) => setCompanyData({...companyData, companyName: e.target.value})}
              placeholder="Razão social ou nome fantasia"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={companyData.email}
              onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
              placeholder="contato@empresa.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">WhatsApp</Label>
            <Input
              id="phone"
              value={companyData.phone}
              onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
              placeholder="(11) 99999-9999"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Site ou Instagram</Label>
            <Input
              id="website"
              value={companyData.website}
              onChange={(e) => setCompanyData({...companyData, website: e.target.value})}
              placeholder="www.empresa.com ou @empresa"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sector">Setor de Atuação</Label>
            <Select value={companyData.sector} onValueChange={(value) => setCompanyData({...companyData, sector: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o setor" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map(sector => (
                  <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employees">Número de Funcionários</Label>
            <Select value={companyData.employees} onValueChange={(value) => setCompanyData({...companyData, employees: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o porte" />
              </SelectTrigger>
              <SelectContent>
                {employeeRanges.map(range => (
                  <SelectItem key={range} value={range}>{range}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="revenue">Faturamento Anual</Label>
            <Select value={companyData.revenue} onValueChange={(value) => setCompanyData({...companyData, revenue: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a faixa" />
              </SelectTrigger>
              <SelectContent>
                {revenueRanges.map(range => (
                  <SelectItem key={range} value={range}>{range}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Diagnóstico Empresarial</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {mockQuestions.map((question) => (
          <div key={question.id} className="space-y-3">
            <div className="flex items-start gap-2">
              <h4 className="font-medium text-gray-900">{question.question}</h4>
              {question.required && <span className="text-red-500">*</span>}
            </div>
            <div className="pl-4 border-l-2 border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Categoria: {question.category}</p>
              <RadioGroup
                value={answers[question.id]?.toString() || ""}
                onValueChange={(value) => setAnswers({...answers, [question.id]: parseInt(value)})}
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.score.toString()} id={`q${question.id}_${index}`} />
                    <Label htmlFor={`q${question.id}_${index}`} className="text-sm">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Score Geral */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Resultado do Diagnóstico</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-petrol to-blue-light text-white">
            <div>
              <div className="text-3xl font-bold">{results?.overallScore}%</div>
              <div className="text-sm">{results?.level}</div>
            </div>
          </div>
          <p className="text-gray-600">
            Sua empresa está no nível <strong>{results?.level}</strong> de maturidade empresarial.
          </p>
        </CardContent>
      </Card>

      {/* Scores por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Scores por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {results?.categoryScores && Object.entries(results.categoryScores).map(([category, score]) => (
            <div key={category} className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{category}</span>
                <span className="text-sm text-gray-600">{score as number}%</span>
              </div>
              <Progress value={score as number} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pontos Fortes e de Atenção */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">🎯 Pontos Fortes</CardTitle>
          </CardHeader>
          <CardContent>
            {results?.strongPoints?.length > 0 ? (
              <ul className="space-y-2">
                {results.strongPoints.map((point: string) => (
                  <li key={point} className="text-green-700">✅ {point}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Continue trabalhando para desenvolver pontos fortes.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">⚠️ Pontos de Atenção</CardTitle>
          </CardHeader>
          <CardContent>
            {results?.attentionPoints?.length > 0 ? (
              <ul className="space-y-2">
                {results.attentionPoints.map((point: string) => (
                  <li key={point} className="text-red-700">🔴 {point}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Parabéns! Nenhum ponto crítico identificado.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recomendações */}
      {results?.recommendations && Object.keys(results.recommendations).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>💡 Recomendações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(results.recommendations).map(([category, recs]) => (
              <div key={category}>
                <h5 className="font-medium text-gray-900 mb-2">{category}</h5>
                <ul className="space-y-1 ml-4">
                  {(recs as string[]).map((rec, index) => (
                    <li key={index} className="text-gray-700">• {rec}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleDownloadPDF} className="bg-petrol hover:bg-petrol/90 text-white">
          <Download className="mr-2 h-4 w-4" />
          Baixar PDF
        </Button>
        <Button variant="outline" className="border-blue-light text-blue-light hover:bg-blue-light hover:text-white">
          <FileText className="mr-2 h-4 w-4" />
          Gerar Proposta
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header com Progress */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Novo Diagnóstico</h1>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Etapa {currentStep} de 3</span>
            <span>{Math.round((currentStep / 3) * 100)}% Concluído</span>
          </div>
          <Progress value={(currentStep / 3) * 100} className="h-2" />
        </div>
        <div className="flex gap-4 text-sm">
          <span className={currentStep === 1 ? "text-petrol font-medium" : "text-gray-500"}>
            1. Dados da Empresa
          </span>
          <span className={currentStep === 2 ? "text-petrol font-medium" : "text-gray-500"}>
            2. Perguntas
          </span>
          <span className={currentStep === 3 ? "text-petrol font-medium" : "text-gray-500"}>
            3. Resultado
          </span>
        </div>
      </div>

      {/* Conteúdo da Etapa */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      {/* Navegação */}
      {currentStep < 3 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button
            onClick={handleNext}
            className="bg-petrol hover:bg-petrol/90 text-white"
          >
            {currentStep === 2 ? "Finalizar" : "Próximo"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default NovoDiagnostico;
