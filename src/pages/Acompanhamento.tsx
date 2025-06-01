
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, TrendingUp } from 'lucide-react';
import { useAcompanhamentosWithFilters } from '@/hooks/useAcompanhamentosWithFilters';
import AcompanhamentoCard from '@/components/acompanhamento/AcompanhamentoCard';
import AcompanhamentoFilters from '@/components/acompanhamento/AcompanhamentoFilters';
import { toast } from '@/hooks/use-toast';

const Acompanhamento = () => {
  const navigate = useNavigate();
  const {
    acompanhamentos,
    allAcompanhamentos,
    isLoading,
    error,
    filters,
    setFilters,
    clearFilters
  } = useAcompanhamentosWithFilters();

  const handleNovoCheckup = () => {
    // TODO: Implementar modal para novo check-up
    toast({
      title: "Em desenvolvimento",
      description: "Modal de novo check-up será implementado em breve.",
    });
  };

  const handleEdit = (id: string) => {
    // TODO: Implementar edição
    toast({
      title: "Em desenvolvimento",
      description: "Edição de acompanhamento será implementada em breve.",
    });
  };

  const handleDelete = (id: string) => {
    // TODO: Implementar exclusão
    toast({
      title: "Em desenvolvimento",
      description: "Exclusão de acompanhamento será implementada em breve.",
    });
  };

  const handleGeneratePDF = (id: string) => {
    // TODO: Implementar geração de PDF
    toast({
      title: "Em desenvolvimento",
      description: "Geração de PDF será implementada em breve.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petrol mx-auto mb-4"></div>
          <p>Carregando acompanhamentos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar dados</h2>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Acompanhamentos</h1>
          <p className="text-gray-600 mt-1">Histórico dos check-ups mensais e evolução dos clientes</p>
        </div>
        <Button onClick={handleNovoCheckup} className="bg-petrol hover:bg-petrol/90 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Novo Check-up Mensal
        </Button>
      </div>

      {/* Filtros */}
      <AcompanhamentoFilters
        filters={filters}
        setFilters={setFilters}
        clearFilters={clearFilters}
      />

      {/* Contador de resultados */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Mostrando {acompanhamentos.length} de {allAcompanhamentos.length} acompanhamentos
        </p>
      </div>

      {/* Lista de acompanhamentos */}
      <div className="space-y-6">
        {acompanhamentos.length > 0 ? (
          acompanhamentos.map((acompanhamento) => (
            <AcompanhamentoCard
              key={acompanhamento.id}
              acompanhamento={acompanhamento}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onGeneratePDF={handleGeneratePDF}
            />
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum acompanhamento encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                Nenhum acompanhamento encontrado para os filtros selecionados.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                <Button variant="outline" onClick={clearFilters}>
                  Limpar Filtros
                </Button>
                <Button onClick={handleNovoCheckup} className="bg-petrol hover:bg-petrol/90 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Check-up
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Acompanhamento;
