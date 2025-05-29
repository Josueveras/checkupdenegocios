
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Download, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const NovoDiagnostico = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Etapa 1 - Dados da Empresa
    clientName: '',
    companyName: '',
    email: '',
    whatsapp: '',
    website: '',
    annualRevenue: '',
    employees: '',
    sector: '',
    // Etapa 2 - Respostas
    answers: {} as Record<string, number>,
    // Etapa 3 - Resultado
    totalScore: 0,
    level: '',
    categoryScores: {} as Record<string, number>
  });

  const mockQuestions = [
    {
      id: 1,
      category: "Marketing",
      question: "Sua empresa possui uma estratégia de marketing digital estruturada?",
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
      category: "Vendas",
      question: "Como é o processo de vendas da sua empresa?",
      options: [
        { text: "Não temos processo estruturado", score: 0 },
        { text: "Processo básico e informal", score: 1 },
        { text: "Processo definido com algumas ferramentas", score: 2 },
        { text: "Processo otimizado com CRM e automações", score: 3 }
      ],
      required: true
    },
    {
      id: 3,
      category: "Estratégia",
      question: "Sua empresa possui planejamento estratégico definido?",
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
      category: "Marketing",
      question: "Como vocês medem os resultados das ações de marketing?",
      options: [
        { text: "Não medimos resultados", score: 0 },
        { text: "Medimos alguns indicadores básicos", score: 1 },
        { text: "Acompanhamos principais métricas", score: 2 },
        { text: "Monitoramento completo com dashboards", score: 3 }
      ],
      required: false
    }
  ];

  const calculateResults = () => {
    const categories = ['Marketing', 'Vendas', 'Estratégia'];
    const categoryScores: Record<string, number> = {};
    let totalScore = 0;
    let totalQuestions = 0;

    categories.forEach(category => {
      const categoryQuestions = mockQuestions.filter(q => q.category === category);
      const categoryAnswers = categoryQuestions.map(q => formData.answers[q.id] || 0);
      const categorySum = categoryAnswers.reduce((sum, score) => sum + score, 0);
      const categoryMax = categoryQuestions.length * 3;
      const categoryPercentage = categoryMax > 0 ? (categorySum / categoryMax) * 100 : 0;
      
      categoryScores[category] = Math.round(categoryPercentage);
      totalScore += categorySum;
      totalQuestions += categoryQuestions.length;
    });

    const totalPercentage = totalQuestions > 0 ? (totalScore / (totalQuestions * 3)) * 100 : 0;
    
    let level = '';
    if (totalPercentage >= 80) level = 'Avançado';
    else if (totalPercentage >= 60) level = 'Intermediário';
    else if (totalPercentage >= 40) level = 'Emergente';
    else level = 'Iniciante';

    setFormData(prev => ({
      ...prev,
      totalScore: Math.round(totalPercentage),
      level,
      categoryScores
    }));
  };

  const handleNext = () => {
    if (currentStep === 2) {
      calculateResults();
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    toast({
      title: "Diagnóstico salvo com sucesso!",
      description: "O diagnóstico foi processado e está disponível na sua lista."
    });
    // Aqui integraria com o Supabase para salvar
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      "Avançado": "bg-green-100 text-green-800",
      "Intermediário": "bg-yellow-100 text-yellow-800",
      "Emergente": "bg-orange-100 text-orange-800",
      "Iniciante": "bg-red-100 text-red-800"
    };
    return colors[level as keyof typeof colors] || colors["Iniciante"];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Novo Diagnóstico</h1>
        <p className="text-gray-600">Avalie a maturidade empresarial em 3 etapas simples</p>
        
        {/* Progress */}
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Etapa {currentStep} de 3</span>
            <span>{Math.round((currentStep / 3) * 100)}%</span>
          </div>
          <Progress value={(currentStep / 3) * 100} className="h-2" />
        </div>
      </div>

      {/* Etapa 1 - Dados da Empresa */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-petrol" />
              Dados da Empresa
            </CardTitle>
            <CardDescription>
              Informações básicas sobre a empresa e cliente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nome do Cliente *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                  placeholder="Digite o nome do cliente"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Digite o nome da empresa"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@empresa.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp *</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Site ou Instagram</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="www.empresa.com ou @instagram"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sector">Setor de Atuação</Label>
                <Input
                  id="sector"
                  value={formData.sector}
                  onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
                  placeholder="Ex: Tecnologia, Consultoria, Varejo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="annualRevenue">Faturamento Anual</Label>
                <Select value={formData.annualRevenue} onValueChange={(value) => setFormData(prev => ({ ...prev, annualRevenue: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a faixa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-100k">Até R$ 100 mil</SelectItem>
                    <SelectItem value="100k-500k">R$ 100 mil - R$ 500 mil</SelectItem>
                    <SelectItem value="500k-1m">R$ 500 mil - R$ 1 milhão</SelectItem>
                    <SelectItem value="1m-5m">R$ 1 milhão - R$ 5 milhões</SelectItem>
                    <SelectItem value="5m+">Acima de R$ 5 milhões</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employees">Número de Funcionários</Label>
                <Select value={formData.employees} onValueChange={(value) => setFormData(prev => ({ ...prev, employees: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a quantidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1 a 5 funcionários</SelectItem>
                    <SelectItem value="6-20">6 a 20 funcionários</SelectItem>
                    <SelectItem value="21-50">21 a 50 funcionários</SelectItem>
                    <SelectItem value="51-100">51 a 100 funcionários</SelectItem>
                    <SelectItem value="100+">Mais de 100 funcionários</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Etapa 2 - Perguntas */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-petrol" />
              Questionário de Diagnóstico
            </CardTitle>
            <CardDescription>
              Responda as perguntas para avaliar a maturidade da empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {mockQuestions.map((question, index) => (
              <div key={question.id} className="space-y-4 p-6 border rounded-lg">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">
                    {question.category}
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {index + 1}. {question.question}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </h4>
                    <RadioGroup
                      value={formData.answers[question.id]?.toString()}
                      onValueChange={(value) => 
                        setFormData(prev => ({
                          ...prev,
                          answers: { ...prev.answers, [question.id]: parseInt(value) }
                        }))
                      }
                      className="mt-4 space-y-3"
                    >
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={option.score.toString()} 
                            id={`q${question.id}_o${optionIndex}`}
                          />
                          <Label 
                            htmlFor={`q${question.id}_o${optionIndex}`}
                            className="flex-1 cursor-pointer hover:text-petrol"
                          >
                            {option.text}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Etapa 3 - Resultado */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <FileText className="h-6 w-6 text-petrol" />
                Resultado do Diagnóstico
              </CardTitle>
              <CardDescription>
                Análise completa da maturidade empresarial de {formData.companyName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score Total */}
              <div className="text-center space-y-4">
                <div className={`text-6xl font-bold ${getScoreColor(formData.totalScore)}`}>
                  {formData.totalScore}%
                </div>
                <Badge className={`text-lg px-4 py-2 ${getLevelBadge(formData.level)}`}>
                  Nível: {formData.level}
                </Badge>
              </div>

              {/* Scores por Categoria */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(formData.categoryScores).map(([category, score]) => (
                  <Card key={category} className="text-center">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                        {score}%
                      </div>
                      <Progress value={score} className="mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Análise Detalhada */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-700">Pontos Fortes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Estratégia de marketing estruturada</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Processo de vendas organizado</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-700">Pontos de Atenção</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Planejamento estratégico limitado</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Métricas de marketing insuficientes</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Recomendações */}
              <Card>
                <CardHeader>
                  <CardTitle>Recomendações</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">1</div>
                      <div>
                        <h5 className="font-medium">Implementar sistema de métricas</h5>
                        <p className="text-sm text-gray-600">Configure dashboards para acompanhar KPIs de marketing e vendas</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">2</div>
                      <div>
                        <h5 className="font-medium">Estruturar planejamento estratégico</h5>
                        <p className="text-sm text-gray-600">Defina missão, visão, valores e metas de curto e longo prazo</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">3</div>
                      <div>
                        <h5 className="font-medium">Automatizar processos comerciais</h5>
                        <p className="text-sm text-gray-600">Implemente CRM e automações para otimizar o funil de vendas</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Ações */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-petrol hover:bg-petrol/90">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar PDF Completo
                </Button>
                <Button variant="outline" className="border-mustard text-mustard hover:bg-mustard hover:text-white">
                  <FileText className="mr-2 h-4 w-4" />
                  Gerar Proposta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        {currentStep < 3 ? (
          <Button
            onClick={handleNext}
            className="bg-petrol hover:bg-petrol/90 flex items-center gap-2"
            disabled={currentStep === 1 && (!formData.clientName || !formData.companyName || !formData.email || !formData.whatsapp)}
          >
            Próximo
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            Salvar Diagnóstico
            <FileText className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default NovoDiagnostico;
