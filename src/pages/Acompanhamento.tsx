
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, TrendingUp, Building2 } from 'lucide-react';
import { useAcompanhamentosGrouped } from '@/hooks/useAcompanhamentosGrouped';
import AcompanhamentoFilters from '@/components/acompanhamento/AcompanhamentoFilters';
import EmpresaGroup from '@/components/acompanhamento/EmpresaGroup';
import { toast } from '@/hooks/use-toast';

const Acompanhamento = () => {
  const navigate = useNavigate();
  const {
    groupedData,
    isLoading,
    error,
    filters,
    setFilters,
    clearFilters,
    totalEmpresas,
    totalAcompanhamentos
  } = useAcompanhamentosGrouped();

  const handleNovoCheckup = (empresaId?: string) => {
    // TODO: Implementar modal para novo check-up
    toast({
      title: "Em desenvolvimento",
      description: `Modal de novo check-up ${empresaId ? 'para esta empresa' : ''} será implementado em breve.`,
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
        <Button onClick={() => handleNovoCheckup()} className="bg-petrol hover:bg-petrol/90 text-white">
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

      {/* Resumo dos resultados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-petrol" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalEmpresas}</p>
                <p className="text-sm text-gray-600">Empresas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalAcompanhamentos}</p>
                <p className="text-sm text-gray-600">Check-ups Filtrados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {groupedData.length > 0 
                    ? Math.round(groupedData.reduce((sum, group) => sum + group.scoreMediaGeral, 0) / groupedData.length)
                    : 0}%
                </p>
                <p className="text-sm text-gray-600">Score Médio Geral</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de empresas agrupadas */}
      <div className="space-y-4">
        {groupedData.length > 0 ? (
          groupedData.map((group, index) => (
            <EmpresaGroup
              key={group.empresa.id}
              empresa={group.empresa}
              acompanhamentos={group.acompanhamentos}
              totalCheckups={group.totalCheckups}
              scoreMediaGeral={group.scoreMediaGeral}
              status={group.status}
              defaultOpen={groupedData.length === 1} // Abrir por padrão se for apenas uma empresa
              onNovoCheckup={handleNovoCheckup}
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
                <Button onClick={() => handleNovoCheckup()} className="bg-petrol hover:bg-petrol/90 text-white">
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
