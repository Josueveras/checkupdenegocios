
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';

const Planos = () => {
  const plans = [
    {
      name: "Starter",
      price: "R$ 97",
      period: "/mês",
      description: "Ideal para agências iniciantes",
      popular: false,
      features: [
        "Até 20 diagnósticos/mês",
        "3 templates de perguntas",
        "Relatórios em PDF",
        "WhatsApp básico",
        "Suporte por email",
        "1 usuário"
      ],
      limitations: [
        "Marca CheckUp nos PDFs",
        "Sem personalização avançada",
        "Sem integrações premium"
      ]
    },
    {
      name: "Professional",
      price: "R$ 197",
      period: "/mês",
      description: "Para agências em crescimento",
      popular: true,
      features: [
        "Até 100 diagnósticos/mês",
        "Templates ilimitados",
        "Relatórios personalizados",
        "WhatsApp Business API",
        "Calendly integrado",
        "Comparativos automáticos",
        "Suporte prioritário",
        "Até 3 usuários",
        "Analytics avançado"
      ],
      limitations: [
        "Marca CheckUp removível",
        "Personalização básica"
      ]
    },
    {
      name: "Agency",
      price: "R$ 397",
      period: "/mês",
      description: "Solução completa para grandes agências",
      popular: false,
      features: [
        "Diagnósticos ilimitados",
        "White label completo",
        "Domínio personalizado",
        "API completa",
        "Integrações CRM",
        "Zapier/Make",
        "Múltiplas marcas",
        "Usuários ilimitados",
        "Gerente dedicado",
        "Treinamento personalizado",
        "SLA 99.9%"
      ],
      limitations: []
    }
  ];

  const addons = [
    {
      name: "Diagnósticos Extras",
      description: "Pacotes adicionais de diagnósticos",
      options: [
        { quantity: "50 diagnósticos", price: "R$ 47" },
        { quantity: "100 diagnósticos", price: "R$ 87" },
        { quantity: "200 diagnósticos", price: "R$ 147" }
      ]
    },
    {
      name: "Setup e Treinamento",
      description: "Configuração completa + treinamento da equipe",
      options: [
        { quantity: "Setup básico", price: "R$ 297" },
        { quantity: "Setup + 2h treinamento", price: "R$ 497" },
        { quantity: "Setup + treinamento completo", price: "R$ 797" }
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Planos e Preços</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Escolha o plano ideal para sua agência e comece a gerar diagnósticos profissionais hoje mesmo
        </p>
      </div>

      {/* Current Plan Status */}
      <Card className="bg-gradient-petrol text-white">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Plano Atual: Professional</h3>
              <p className="text-blue-100">
                Renovação automática em 23 dias • 47 de 100 diagnósticos utilizados este mês
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white text-petrol border-white hover:bg-gray-100">
                Gerenciar Assinatura
              </Button>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                Histórico de Pagamentos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <Card 
            key={plan.name} 
            className={`relative ${plan.popular ? 'border-petrol border-2 shadow-lg scale-105' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-petrol text-white px-4 py-1 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Mais Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-base">{plan.description}</CardDescription>
              <div className="pt-4">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h5 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">
                  Funcionalidades Incluídas
                </h5>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              {plan.limitations.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <h5 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">
                    Limitações
                  </h5>
                  {plan.limitations.map((limitation, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 mt-0.5 flex-shrink-0 text-gray-400">•</div>
                      <span className="text-sm text-gray-600">{limitation}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="pt-6">
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-petrol hover:bg-petrol/90 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {plan.name === "Professional" ? "Plano Atual" : 
                   index > 1 ? "Fazer Upgrade" : "Fazer Downgrade"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add-ons */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complementos Disponíveis</h2>
          <p className="text-gray-600">Potencialize ainda mais sua operação com nossos add-ons</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {addons.map((addon) => (
            <Card key={addon.name}>
              <CardHeader>
                <CardTitle className="text-xl">{addon.name}</CardTitle>
                <CardDescription>{addon.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {addon.options.map((option, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{option.quantity}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-petrol">{option.price}</span>
                      <Button size="sm" variant="outline">
                        Adicionar
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Perguntas Frequentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold mb-2">Posso mudar de plano a qualquer momento?</h5>
                <p className="text-sm text-gray-600">
                  Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                  As mudanças são aplicadas no próximo ciclo de cobrança.
                </p>
              </div>
              <div>
                <h5 className="font-semibold mb-2">Os diagnósticos não utilizados acumulam?</h5>
                <p className="text-sm text-gray-600">
                  Não, os diagnósticos são renovados mensalmente e não acumulam. 
                  Recomendamos monitorar seu uso pelos relatórios.
                </p>
              </div>
              <div>
                <h5 className="font-semibold mb-2">Há desconto para pagamento anual?</h5>
                <p className="text-sm text-gray-600">
                  Sim! Oferecemos 2 meses grátis para assinaturas anuais. 
                  Entre em contato para mais detalhes.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold mb-2">Posso cancelar a qualquer momento?</h5>
                <p className="text-sm text-gray-600">
                  Sim, sem fidelidade! Você pode cancelar a qualquer momento e 
                  continuar usando até o final do período pago.
                </p>
              </div>
              <div>
                <h5 className="font-semibold mb-2">Como funciona o suporte?</h5>
                <p className="text-sm text-gray-600">
                  Todos os planos incluem suporte. Professional e Agency têm 
                  prioridade e SLA diferenciado.
                </p>
              </div>
              <div>
                <h5 className="font-semibold mb-2">Há período de teste?</h5>
                <p className="text-sm text-gray-600">
                  Sim! Oferecemos 14 dias grátis para testar todas as funcionalidades 
                  do plano Professional.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="bg-gradient-petrol text-white text-center">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold mb-4">
            Precisa de um plano personalizado?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Para agências com necessidades específicas, criamos soluções sob medida. 
            Fale com nossa equipe comercial e descubra como podemos ajudar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="bg-white text-petrol border-white hover:bg-gray-100">
              📞 Falar com Vendas
            </Button>
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              📧 Solicitar Proposta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Planos;
