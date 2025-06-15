
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, ChevronRight, Loader2 } from 'lucide-react';
import { usePlanos } from '@/hooks/usePlanos';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '@/components/ui/back-button';

const NovaPropostaPlano = () => {
  const navigate = useNavigate();
  const { data: planos = [], isLoading } = usePlanos();
  const [selectedPlano, setSelectedPlano] = useState<string>('');

  const handleCreateProposal = () => {
    if (selectedPlano) {
      navigate(`/editar-proposta?tipo=plano&planoId=${selectedPlano}`, {
        state: { from: '/nova-proposta-plano' }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-petrol mx-auto mb-4" />
          <p>Carregando planos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Nova Proposta Baseada em Plano</h1>
          <p className="text-gray-600 mt-1">Selecione um plano para criar uma nova proposta</p>
        </div>
      </div>

      {/* Planos List */}
      <div className="space-y-4">
        {planos.map((plano) => (
          <Card
            key={plano.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedPlano === plano.id ? 'ring-2 ring-petrol bg-petrol/5' : ''
            }`}
            onClick={() => setSelectedPlano(plano.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-petrol" />
                  <div>
                    <CardTitle className="text-lg">{plano.nome}</CardTitle>
                    <CardDescription className="mt-1">
                      {plano.objetivo || 'Objetivo não definido'}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  {plano.valor && (
                    <p className="text-lg font-semibold text-petrol">
                      R$ {plano.valor.toLocaleString('pt-BR')}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    {Array.isArray(plano.tarefas) ? plano.tarefas.length : 0} tarefas
                  </p>
                </div>
              </div>
            </CardHeader>
            
            {plano.tarefas && Array.isArray(plano.tarefas) && plano.tarefas.length > 0 && (
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Principais tarefas:</p>
                  <ul className="space-y-1">
                    {plano.tarefas.slice(0, 3).map((tarefa, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <ChevronRight className="h-3 w-3 mt-0.5 text-gray-400 flex-shrink-0" />
                        {String(tarefa)}
                      </li>
                    ))}
                    {plano.tarefas.length > 3 && (
                      <li className="text-sm text-gray-500">
                        E mais {plano.tarefas.length - 3} tarefas...
                      </li>
                    )}
                  </ul>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {planos.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum plano disponível</h3>
            <p className="text-gray-600 mb-6">
              Você precisa criar planos primeiro para poder gerar propostas baseadas neles.
            </p>
            <Button 
              onClick={() => navigate('/planos')}
              className="bg-petrol hover:bg-petrol/90 text-white"
            >
              Gerenciar Planos
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      {selectedPlano && (
        <div className="fixed bottom-6 right-6 md:relative md:bottom-auto md:right-auto md:flex md:justify-end">
          <Button
            onClick={handleCreateProposal}
            className="bg-petrol hover:bg-petrol/90 text-white shadow-lg"
            size="lg"
          >
            Criar Proposta
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default NovaPropostaPlano;
