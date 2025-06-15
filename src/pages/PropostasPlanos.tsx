
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FileText, ChevronDown } from 'lucide-react';
import { usePropostasPlanos } from '@/hooks/usePropostasPlanos';
import { ProposalCard } from '@/components/ProposalCard';
import { ProposalViewModal } from '@/components/ProposalViewModal';
import { ProposalFilters } from '@/components/ProposalFilters';
import { ProposalStats } from '@/components/ProposalStats';
import { useNavigate } from 'react-router-dom';

const PropostasPlanos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedProposta, setSelectedProposta] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { data: propostas = [], isLoading } = usePropostasPlanos();

  const filteredPropostas = propostas.filter(proposta => {
    // A empresa vem diretamente da proposta (propriedade empresas adicionada no hook)
    const empresa = (proposta as any).empresas;
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
    navigate(`/editar-proposta?id=${proposta.id}`);
  };

  const handleCreatePlanBasedProposal = () => {
    navigate('/nova-proposta-plano');
  };

  const handleCreateCustomProposal = () => {
    navigate('/nova-proposta-personalizada');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petrol mx-auto mb-4"></div>
          <p>Carregando propostas de planos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl lg:text-3xl font-bold text-gray-900">Propostas de Planos</h1>
            <p className="text-gray-600 mt-1 text-sm lg:text-base">Gerencie suas propostas baseadas em planos comerciais</p>
          </div>
          <div className="flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-petrol hover:bg-petrol/90 text-white w-full sm:w-auto">
                  <FileText className="mr-2 h-4 w-4" />
                  Nova Proposta
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleCreatePlanBasedProposal}>
                  <FileText className="mr-2 h-4 w-4" />
                  Gerar baseada em plano
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCreateCustomProposal}>
                  <FileText className="mr-2 h-4 w-4" />
                  Criar proposta personalizada
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 lg:px-8">
        <ProposalStats propostas={propostas} />
      </div>

      {/* Filters */}
      <div className="px-4 lg:px-8">
        <ProposalFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </div>

      {/* Proposals List */}
      <div className="px-4 lg:px-8">
        <div className="space-y-6">
          {filteredPropostas.map((proposta) => (
            <ProposalCard
              key={proposta.id}
              proposta={proposta}
              onEdit={handleEditProposta}
              onView={handleViewProposta}
            />
          ))}
        </div>
      </div>

      {filteredPropostas.length === 0 && (
        <div className="px-4 lg:px-8">
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma proposta de plano encontrada</h3>
              <p className="text-gray-600 mb-6">
                {propostas.length === 0 
                  ? "Você ainda não tem propostas de planos criadas. Crie uma proposta baseada em plano."
                  : "Não há propostas que correspondam aos filtros selecionados."
                }
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                {propostas.length === 0 ? (
                  <Button onClick={handleCreatePlanBasedProposal} className="bg-petrol hover:bg-petrol/90 text-white">
                    <FileText className="mr-2 h-4 w-4" />
                    Criar Primeira Proposta de Plano
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('todos');
                  }}>
                    Limpar Filtros
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Proposal Modal */}
      <ProposalViewModal
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        proposta={selectedProposta}
        onEdit={handleEditProposta}
      />
    </div>
  );
};

export default PropostasPlanos;
