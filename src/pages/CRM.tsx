
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, FileText, LayoutGrid, Columns3 } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';
import { LeadCard } from '@/components/crm/LeadCard';
import { LeadModal } from '@/components/crm/LeadModal';
import { LeadFilters } from '@/components/crm/LeadFilters';
import { LeadStats } from '@/components/crm/LeadStats';
import { LeadPipeline } from '@/components/crm/LeadPipeline';
import { Lead } from '@/types/lead';
import { useNavigate } from 'react-router-dom';

type ViewMode = 'grid' | 'pipeline';

const CRM = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [urgenciaFilter, setUrgenciaFilter] = useState('todos');
  const [tamanhoFilter, setTamanhoFilter] = useState('todos');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

  const { data: leads = [], isLoading } = useLeads();

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.empresa_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contato_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || lead.status === statusFilter;
    const matchesUrgencia = urgenciaFilter === 'todos' || lead.urgencia === urgenciaFilter;
    const matchesTamanho = tamanhoFilter === 'todos' || lead.tamanho_empresa === tamanhoFilter;
    
    return matchesSearch && matchesStatus && matchesUrgencia && matchesTamanho;
  });

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCreateNewLead = () => {
    navigate('/novo-lead');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('todos');
    setUrgenciaFilter('todos');
    setTamanhoFilter('todos');
  };

  const handleCall = (lead: Lead) => {
    window.open(`tel:${lead.telefone}`, '_self');
  };

  const handleEmail = (lead: Lead) => {
    window.open(`mailto:${lead.email}`, '_blank');
  };

  const handleWhatsApp = (lead: Lead) => {
    const message = encodeURIComponent(`Olá ${lead.contato_nome}, tudo bem? Sou da equipe comercial e gostaria de conversar sobre as necessidades da ${lead.empresa_nome}.`);
    const phone = lead.telefone.replace(/\D/g, '');
    window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
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
          <h1 className="text-3xl font-bold text-gray-900">CRM - Leads Externos</h1>
          <p className="text-gray-600 mt-1">Gerencie seus leads e pipeline comercial</p>
        </div>
        <div className="flex gap-2">
          {/* Toggle de visualização */}
          <div className="flex rounded-lg border p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="px-3"
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'pipeline' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('pipeline')}
              className="px-3"
            >
              <Columns3 className="h-4 w-4 mr-2" />
              Pipeline
            </Button>
          </div>
          
          <Button 
            onClick={handleCreateNewLead}
            className="bg-petrol hover:bg-petrol/90 text-white"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Stats */}
      <LeadStats />

      {/* Filters - só mostra no modo grid ou quando há filtros ativos */}
      {(viewMode === 'grid' || searchTerm || statusFilter !== 'todos' || urgenciaFilter !== 'todos' || tamanhoFilter !== 'todos') && (
        <LeadFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          urgenciaFilter={urgenciaFilter}
          setUrgenciaFilter={setUrgenciaFilter}
          tamanhoFilter={tamanhoFilter}
          setTamanhoFilter={setTamanhoFilter}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Conteúdo baseado no modo de visualização */}
      {viewMode === 'pipeline' ? (
        <LeadPipeline
          leads={filteredLeads}
          onEdit={handleEditLead}
          onView={handleViewLead}
          onCall={handleCall}
          onEmail={handleEmail}
          onWhatsApp={handleWhatsApp}
        />
      ) : (
        <>
          {/* Grid View */}
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onEdit={handleEditLead}
                onView={handleViewLead}
                onCall={handleCall}
                onEmail={handleEmail}
                onWhatsApp={handleWhatsApp}
              />
            ))}
          </div>

          {filteredLeads.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum lead encontrado</h3>
                <p className="text-gray-600 mb-6">
                  {leads.length === 0 
                    ? "Você ainda não tem leads cadastrados. Crie seu primeiro lead para começar."
                    : "Não há leads que correspondam aos filtros selecionados."
                  }
                </p>
                <div className="flex justify-center gap-4">
                  {leads.length === 0 ? (
                    <Button onClick={handleCreateNewLead} className="bg-petrol hover:bg-petrol/90 text-white">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Criar Primeiro Lead
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={handleClearFilters}>
                      Limpar Filtros
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Lead Modal */}
      <LeadModal
        lead={selectedLead}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode={modalMode}
      />
    </div>
  );
};

export default CRM;
