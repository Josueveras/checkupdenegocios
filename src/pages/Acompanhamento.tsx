import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Building2 } from 'lucide-react';
import { useEmpresasConsolidadas } from '@/hooks/useEmpresasConsolidadas';
import AcompanhamentoFilters from '@/components/acompanhamento/AcompanhamentoFilters';
import EmpresaConsolidadaCard from '@/components/acompanhamento/EmpresaConsolidadaCard';
import { toast } from '@/hooks/use-toast';

const Acompanhamento = () => {
  const navigate = useNavigate();
  const {
    empresas,
    allEmpresas,
    empresasComAcompanhamentos,
    isLoading,
    filters,
    setFilters,
    applyFilters,
    clearFilters
  } = useEmpresasConsolidadas();

  const handleNovoCheckup = () => {
    navigate('/checkup/novo'); // Sem parâmetros
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Em desenvolvimento",
      description: "Edição de empresa será implementada em breve.",
    });
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Em desenvolvimento",
      description: "Exclusão de empresa será implementada em breve.",
    });
  };

  const handleGeneratePDF = (id: string) => {
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
          <p>Carregando empresas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Acompanhamentos</h1>
          <p className="text-gray-600 mt-1">Evolução consolidada dos clientes com check-ups mensais</p>
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
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        empresasComAcompanhamentos={empresasComAcompanhamentos || []}
      />

      {/* Contador de resultados */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Mostrando {empresas?.length || 0} de {allEmpresas?.length || 0} empresas com check-ups
        </p>
      </div>

      {/* Lista de empresas */}
      <div className="space-y-6">
        {empresas && empresas.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {empresas.map((empresa) => (
              <EmpresaConsolidadaCard
                key={empresa.id}
                empresa={empresa}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onGeneratePDF={handleGeneratePDF}
              />
            ))}
          </div>
        ) : allEmpresas && allEmpresas.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma empresa com check-ups registrados
              </h3>
              <p className="text-gray-600 mb-6">
                ⚠️ Nenhuma empresa com check-ups registrados no momento.
              </p>
              <Button onClick={handleNovoCheckup} className="bg-petrol hover:bg-petrol/90 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Novo Check-up
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma empresa encontrada
              </h3>
              <p className="text-gray-600 mb-6">
                Nenhuma empresa encontrada para os filtros selecionados.
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
