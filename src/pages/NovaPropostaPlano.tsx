
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// Mock data dos planos - você pode substituir por dados reais da página Planos
const planos = [
  {
    id: 1,
    nome: 'Plano Essencial',
    descricao: 'Ideal para pequenas empresas que estão começando',
    valor: 2500,
    servicos: ['Diagnóstico inicial', 'Relatório básico', 'Consultoria 2h']
  },
  {
    id: 2,
    nome: 'Plano Profissional',
    descricao: 'Para empresas que querem crescimento estruturado',
    valor: 5000,
    servicos: ['Diagnóstico completo', 'Plano estratégico', 'Consultoria 8h', 'Follow-up mensal']
  },
  {
    id: 3,
    nome: 'Plano Premium',
    descricao: 'Solução completa para empresas em expansão',
    valor: 8500,
    servicos: ['Diagnóstico avançado', 'Plano estratégico completo', 'Consultoria 16h', 'Follow-up quinzenal', 'Implementação assistida']
  }
];

const NovaPropostaPlano = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const handleSelectPlan = (planId: number) => {
    setSelectedPlan(planId);
  };

  const handleContinue = () => {
    if (!selectedPlan) {
      toast({
        title: "Selecione um plano",
        description: "Por favor, selecione um plano para continuar.",
        variant: "destructive"
      });
      return;
    }

    const plan = planos.find(p => p.id === selectedPlan);
    navigate(`/editar-proposta?tipo=plano&planoId=${selectedPlan}`, {
      state: { planData: plan }
    });
  };

  const handleBack = () => {
    navigate('/propostas');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nova Proposta - Baseada em Plano</h1>
          <p className="text-gray-600 mt-1">Selecione um plano existente para gerar a proposta</p>
        </div>
      </div>

      {/* Planos Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {planos.map((plano) => (
          <Card 
            key={plano.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedPlan === plano.id ? 'ring-2 ring-petrol border-petrol' : ''
            }`}
            onClick={() => handleSelectPlan(plano.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{plano.nome}</CardTitle>
                {selectedPlan === plano.id && (
                  <div className="w-6 h-6 bg-petrol rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <p className="text-gray-600">{plano.descricao}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-2xl font-bold text-petrol">
                  {plano.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">Serviços inclusos:</p>
                  <ul className="space-y-1">
                    {plano.servicos.map((servico, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <div className="w-1.5 h-1.5 bg-petrol rounded-full mr-2" />
                        {servico}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <Button 
          onClick={handleContinue}
          disabled={!selectedPlan}
          className="bg-petrol hover:bg-petrol/90 text-white"
        >
          <FileText className="mr-2 h-4 w-4" />
          Continuar com Plano Selecionado
        </Button>
      </div>
    </div>
  );
};

export default NovaPropostaPlano;
