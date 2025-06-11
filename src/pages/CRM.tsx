
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText } from 'lucide-react';
import { useCRM } from '@/hooks/useSupabase';
import { ProposalCard } from '@/components/ProposalCard';
import { ProposalViewModal } from '@/components/ProposalViewModal';
import { ProposalFilters } from '@/components/ProposalFilters';
import { ProposalStats } from '@/components/ProposalStats';
import { useNavigate } from 'react-router-dom';

const CRM = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedCRM, setSelectedCRM] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { data: CRM = [], isLoading } = useCRM();

  const filteredCRM = CRM.filter(CRM => {
    const empresa = CRM.diagnosticos?.empresas;
    const matchesSearch = empresa?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empresa?.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || CRM.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewCRM = (CRM: any) => {
    setSelectedCRM(CRM);
    setIsViewDialogOpen(true);
  };

  const handleEditCRM = (CRM: any) => {
    navigate(`/editar-CRM?id=${CRM.id}`);
  };

  const handleCreateNewProposal = () => {
    navigate('/novo-diagnostico');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petrol mx-auto mb-4"></div>
          <p>Carregando CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM Comerciais</h1>
          <p className="text-gray-600 mt-1">Gerencie suas CRM baseadas nos diagnósticos</p>
        </div>
        <Button 
          onClick={handleCreateNewProposal}
          className="bg-petrol hover:bg-petrol/90 text-white"
        >
          <FileText className="mr-2 h-4 w-4" />
          Novo Lead
        </Button>
      </div>

      {/* Stats */}
      <ProposalStats CRM={CRM} />

      {/* Filters */}
      <ProposalFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Proposals List */}
      <div className="grid gap-6">
        {filteredCRM.map((CRM) => (
          <ProposalCard
            key={CRM.id}
            CRM={CRM}
            onEdit={handleEditCRM}
            onView={handleViewCRM}
          />
        ))}
      </div>

      {filteredCRM.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma CRM encontrada</h3>
            <p className="text-gray-600 mb-6">
              {CRM.length === 0 
                ? "Você ainda não tem CRM criadas. Crie um diagnóstico para gerar sua primeira proposta."
                : "Não há CRM que correspondam aos filtros selecionados."
              }
            </p>
            <div className="flex justify-center gap-4">
              {CRM.length === 0 ? (
                <Button onClick={handleCreateNewProposal} className="bg-petrol hover:bg-petrol/90 text-white">
                  <FileText className="mr-2 h-4 w-4" />
                  Criar Primeiro Lead
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
      )}

      {/* View Proposal Modal */}
      <ProposalViewModal
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        CRM={selectedCRM}
        onEdit={handleEditCRM}
      />
    </div>
  );
};

export default CRM;
