
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText } from 'lucide-react';
import { usePropostas } from '@/hooks/useSupabase';
import { ProposalCard } from '@/components/ProposalCard';
import { ProposalViewModal } from '@/components/ProposalViewModal';
import { ProposalFilters } from '@/components/ProposalFilters';
import { ProposalStats } from '@/components/ProposalStats';

const Propostas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedProposta, setSelectedProposta] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: propostas = [], isLoading } = usePropostas();

  const filteredPropostas = propostas.filter(proposta => {
    const empresa = proposta.diagnosticos?.empresas;
    const matchesSearch = empresa?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empresa?.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || proposta.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewProposta = (proposta: any) => {
    setSelectedProposta(proposta);
    setIsViewDialogOpen(true);
  };

  const handleEditProposta = (proposta: any) => {
    setSelectedProposta(proposta);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Carregando propostas...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Propostas Comerciais</h1>
          <p className="text-gray-600 mt-1">Gerencie suas propostas baseadas nos diagnósticos</p>
        </div>
        <Button className="bg-petrol hover:bg-petrol/90 text-white">
          <FileText className="mr-2 h-4 w-4" />
          Nova Proposta
        </Button>
      </div>

      {/* Stats */}
      <ProposalStats propostas={propostas} />

      {/* Filters */}
      <ProposalFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Propostas List */}
      <div className="grid gap-6">
        {filteredPropostas.map((proposta) => (
          <ProposalCard
            key={proposta.id}
            proposta={proposta}
            onEdit={handleEditProposta}
            onView={handleViewProposta}
          />
        ))}
      </div>

      {filteredPropostas.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma proposta encontrada</h3>
            <p className="text-gray-600 mb-6">
              Não há propostas que correspondam aos filtros selecionados.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('todos');
            }}>
              Limpar Filtros
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal para Visualizar Proposta */}
      <ProposalViewModal
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        proposta={selectedProposta}
        onEdit={handleEditProposta}
      />

      {/* Dialog para Editar Proposta */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Proposta</DialogTitle>
            <DialogDescription>
              Funcionalidade de edição em desenvolvimento
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-gray-600">A funcionalidade de edição de propostas será implementada em breve.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Propostas;
