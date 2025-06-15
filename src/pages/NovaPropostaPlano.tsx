
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { usePlanos } from '@/hooks/usePlanos';

const NovaPropostaPlano = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const { data: planos = [], isLoading } = usePlanos();

  const INITIAL_TASKS_LIMIT = 3;

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const toggleCardExpansion = (planId: string) => {
    const newExpandedCards = new Set(expandedCards);
    if (expandedCards.has(planId)) {
      newExpandedCards.delete(planId);
    } else {
      newExpandedCards.add(planId);
    }
    setExpandedCards(newExpandedCards);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petrol mx-auto mb-4"></div>
          <p>Carregando planos...</p>
        </div>
      </div>
    );
  }

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
        {planos.map((plano) => {
          const isExpanded = expandedCards.has(plano.id!);
          const hasMoreTasks = plano.tarefas.length > INITIAL_TASKS_LIMIT;
          const visibleTasks = isExpanded ? plano.tarefas : plano.tarefas.slice(0, INITIAL_TASKS_LIMIT);

          return (
            <Card 
              key={plano.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedPlan === plano.id ? 'ring-2 ring-petrol border-petrol' : ''
              }`}
              onClick={() => handleSelectPlan(plano.id!)}
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
                <p className="text-gray-600">{plano.objetivo}</p>
                <Badge variant="outline">{plano.categoria}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-2xl font-bold text-petrol">
                    {plano.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">Tarefas incluídas:</p>
                    <ul className="space-y-1">
                      {visibleTasks.map((tarefa, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-petrol rounded-full mr-2 flex-shrink-0" />
                          {tarefa}
                        </li>
                      ))}
                    </ul>
                    {hasMoreTasks && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCardExpansion(plano.id!);
                        }}
                        className="p-0 h-auto text-petrol hover:text-petrol/80 flex items-center gap-1"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Ver menos
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Ver mais ({plano.tarefas.length - INITIAL_TASKS_LIMIT} tarefas)
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {planos.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum plano disponível</h3>
            <p className="text-gray-600 mb-6">
              Não há planos ativos cadastrados no sistema. Cadastre planos na página de Planos para poder criar propostas baseadas em planos.
            </p>
            <Button onClick={() => navigate('/planos')} variant="outline">
              Ir para Planos
            </Button>
          </CardContent>
        </Card>
      )}

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
