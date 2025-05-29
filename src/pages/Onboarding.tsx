
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Calendar } from 'lucide-react';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      id: 1,
      title: "Boas-vindas ao CheckUp de Negócios",
      description: "Conheça a plataforma e suas funcionalidades",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-petrol rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-white">🚀</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bem-vindo ao CheckUp de Negócios!
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Você está prestes a descobrir uma ferramenta poderosa para realizar diagnósticos empresariais 
              completos e gerar propostas comerciais automáticas que vão transformar sua agência.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="font-semibold mb-2">Diagnósticos Inteligentes</h4>
                <p className="text-sm text-gray-600">
                  Avalie empresas em 3 etapas simples com perguntas personalizáveis
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📄</span>
                </div>
                <h4 className="font-semibold mb-2">Relatórios Automáticos</h4>
                <p className="text-sm text-gray-600">
                  Gere PDFs profissionais e propostas comerciais instantaneamente
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📈</span>
                </div>
                <h4 className="font-semibold mb-2">Acompanhamento</h4>
                <p className="text-sm text-gray-600">
                  Monitore a evolução dos clientes com comparativos mensais
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Preparação da Agência",
      description: "Configure sua agência para começar",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚙️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Configuração Inicial
            </h2>
            <p className="text-gray-600">
              Vamos configurar sua agência para maximizar os resultados
            </p>
          </div>

          <div className="grid gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Circle className="h-5 w-5" />
                  1. Personalize suas Perguntas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Adapte o questionário para o perfil dos seus clientes. Você pode criar perguntas 
                  específicas por setor ou necessidade.
                </p>
                <Button variant="outline" size="sm">
                  Ir para Editor de Perguntas
                </Button>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Circle className="h-5 w-5" />
                  2. Configure suas Integrações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Conecte o Calendly para agendamentos e configure o WhatsApp Business 
                  para envio automático de relatórios.
                </p>
                <Button variant="outline" size="sm">
                  Configurar Integrações
                </Button>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Circle className="h-5 w-5" />
                  3. Personalize sua Marca
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Adicione sua logo, cores da marca e personalize os templates 
                  de relatórios com sua identidade visual.
                </p>
                <Button variant="outline" size="sm">
                  Personalizar Marca
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Reunião de Alinhamento",
      description: "Entenda o processo completo",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Estratégia de Abordagem
            </h2>
            <p className="text-gray-600">
              Aprenda as melhores práticas para aplicar os diagnósticos
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>📋 Processo Recomendado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">1</div>
                  <div>
                    <h5 className="font-medium">Primeiro Contato</h5>
                    <p className="text-sm text-gray-600">
                      Apresente o diagnóstico como uma análise gratuita para identificar oportunidades
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                  <div>
                    <h5 className="font-medium">Aplicação do Diagnóstico</h5>
                    <p className="text-sm text-gray-600">
                      Realize o diagnóstico presencialmente ou via videochamada para maior engajamento
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                  <div>
                    <h5 className="font-medium">Apresentação dos Resultados</h5>
                    <p className="text-sm text-gray-600">
                      Apresente o relatório destacando pontos fortes e oportunidades de melhoria
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">4</div>
                  <div>
                    <h5 className="font-medium">Proposta Comercial</h5>
                    <p className="text-sm text-gray-600">
                      Use os insights do diagnóstico para criar uma proposta personalizada
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-800">💡 Dicas de Ouro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <p className="text-sm text-yellow-700">
                    <strong>Foque na dor:</strong> Destaque os pontos críticos encontrados no diagnóstico
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <p className="text-sm text-yellow-700">
                    <strong>Mostre o ROI:</strong> Quantifique o impacto financeiro das melhorias propostas
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <p className="text-sm text-yellow-700">
                    <strong>Crie urgência:</strong> Demonstre o custo de não agir rapidamente
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Diagnóstico Inicial",
      description: "Faça seu primeiro diagnóstico",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-petrol rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Mãos à Obra!
            </h2>
            <p className="text-gray-600">
              Hora de aplicar seu primeiro diagnóstico na prática
            </p>
          </div>

          <Card className="border-2 border-dashed border-petrol">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-petrol/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Pronto para o Primeiro Diagnóstico?
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Escolha uma empresa para aplicar seu primeiro diagnóstico. Pode ser um cliente atual 
                  ou um prospect que você quer impressionar.
                </p>
                <div className="pt-4">
                  <Button className="bg-petrol hover:bg-petrol/90 text-white">
                    Criar Diagnóstico de Teste
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📝 Checklist Pré-Diagnóstico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Perguntas personalizadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Template de marca configurado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Circle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Primeiro diagnóstico realizado</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">⏱️ Tempo Estimado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-bold text-petrol">15-30 min</div>
                <p className="text-sm text-gray-600">
                  Tempo médio para completar um diagnóstico completo, incluindo 
                  a apresentação dos resultados.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Execução e Acompanhamento",
      description: "Implemente e monitore resultados",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Parabéns! Você está pronto!
            </h2>
            <p className="text-gray-600">
              Agora é hora de escalar seus resultados e acompanhar o progresso
            </p>
          </div>

          <div className="grid gap-6">
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  🎉 Setup Completo!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700">
                  Sua plataforma está configurada e você já sabe como usar. 
                  Agora é hora de colocar em prática com seus clientes!
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>📊 Próximos Passos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium">1</div>
                    <div>
                      <h5 className="font-medium">Aplique 3 diagnósticos</h5>
                      <p className="text-xs text-gray-600">Teste com diferentes tipos de empresa</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium">2</div>
                    <div>
                      <h5 className="font-medium">Ajuste as perguntas</h5>
                      <p className="text-xs text-gray-600">Refine baseado no feedback</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium">3</div>
                    <div>
                      <h5 className="font-medium">Monitore métricas</h5>
                      <p className="text-xs text-gray-600">Acompanhe taxa de conversão</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🎯 Metas Sugeridas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Primeiros 7 dias</span>
                      <span className="font-medium">3 diagnósticos</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Primeiro mês</span>
                      <span className="font-medium">15 diagnósticos</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taxa de conversão</span>
                      <span className="font-medium">≥ 60%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-dashed border-petrol">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Precisa de Ajuda?
                </h3>
                <p className="text-gray-600 mb-4">
                  Nossa equipe está disponível para te apoiar em cada etapa
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline">
                    📞 Agendar Mentoria
                  </Button>
                  <Button variant="outline">
                    💬 Suporte WhatsApp
                  </Button>
                  <Button variant="outline">
                    📚 Base de Conhecimento
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps.find(step => step.id === currentStep);
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Onboarding</h1>
        <p className="text-gray-600">Configure sua agência em 5 etapas simples</p>
        
        {/* Progress */}
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Etapa {currentStep} de {steps.length}</span>
            <span>{Math.round(progress)}% concluído</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
      </div>

      {/* Steps Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`flex-1 p-4 rounded-lg border-2 transition-all text-left ${
                  currentStep === step.id
                    ? 'border-petrol bg-petrol/5'
                    : completedSteps.includes(step.id)
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {completedSteps.includes(step.id) ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : currentStep === step.id ? (
                    <div className="w-5 h-5 bg-petrol rounded-full"></div>
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                  <Badge 
                    variant="outline" 
                    className={
                      currentStep === step.id ? 'border-petrol text-petrol' :
                      completedSteps.includes(step.id) ? 'border-green-500 text-green-700' :
                      'border-gray-300'
                    }
                  >
                    {index + 1}
                  </Badge>
                </div>
                <h4 className={`font-medium mb-1 ${
                  currentStep === step.id ? 'text-petrol' :
                  completedSteps.includes(step.id) ? 'text-green-700' :
                  'text-gray-700'
                }`}>
                  {step.title}
                </h4>
                <p className="text-sm text-gray-600">{step.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      {currentStepData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStepData.content}
          </CardContent>
        </Card>
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
          Anterior
        </Button>

        {currentStep < steps.length ? (
          <Button
            onClick={handleNext}
            className="bg-petrol hover:bg-petrol/90 flex items-center gap-2"
          >
            Próximo
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            Finalizar Onboarding
            <CheckCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
