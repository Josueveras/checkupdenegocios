
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';
import { LeadCard } from '@/components/crm/LeadCard';
import { LeadModal } from '@/components/crm/LeadModal';
import { LeadFilters } from '@/components/crm/LeadFilters';
import { LeadStats } from '@/components/crm/LeadStats';
import { Lead } from '@/types/lead';
import { useNavigate } from 'react-router-dom';
import { FormBuilder } from '@/components/crm/FormBuilder';

const CRM = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    setor: '',
    tamanho_empresa: '',
    urgencia: '',
    fonte_lead: ''
  });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

  const { data: leads = [], isLoading } = useLeads();

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      (lead.empresa_nome?.toLowerCase() || '').includes(filters.search.toLowerCase()) ||
      (lead.contato_nome?.toLowerCase() || '').includes(filters.search.toLowerCase()) ||
      (lead.email?.toLowerCase() || '').includes(filters.search.toLowerCase());
    
    const matchesStatus = filters.status === '' || lead.status === filters.status;
    const matchesUrgencia = filters.urgencia === '' || lead.urgencia === filters.urgencia;
    const matchesTamanho = filters.tamanho_empresa === '' || lead.tamanho_empresa === filters.tamanho_empresa;
    const matchesSetor = filters.setor === '' || (lead.setor?.toLowerCase() || '').includes(filters.setor.toLowerCase());
    const matchesFonte = filters.fonte_lead === '' || (lead.fonte_lead?.toLowerCase() || '').includes(filters.fonte_lead.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesUrgencia && matchesTamanho && matchesSetor && matchesFonte;
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

  const handleCall = (lead: Lead) => {
    if (lead.telefone) {
      window.open(`tel:${lead.telefone}`, '_self');
    }
  };

  const handleEmail = (lead: Lead) => {
    if (lead.email) {
      window.open(`mailto:${lead.email}`, '_blank');
    }
  };

  const handleWhatsApp = (lead: Lead) => {
    if (lead.telefone && lead.contato_nome && lead.empresa_nome) {
      const message = encodeURIComponent(`Olá ${lead.contato_nome}, tudo bem? Sou da equipe comercial e gostaria de conversar sobre as necessidades da ${lead.empresa_nome}.`);
      const phone = lead.telefone.replace(/\D/g, '');
      window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
    }
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
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM - Leads Externos</h1>
          <p className="text-gray-600 mt-1">Gerencie seus leads e pipeline comercial</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <FormBuilder />
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

      {/* Filters */}
      <LeadFilters 
        onFiltersChange={setFilters}
        totalLeads={leads.length}
        filteredLeads={filteredLeads.length}
      />

      {/* Grid View */}
      <div className="grid gap-6 lg:grid-cols-2">
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
                <Button variant="outline" onClick={() => setFilters({ search: '', status: '', setor: '', tamanho_empresa: '', urgencia: '', fonte_lead: '' })}>
                  Limpar Filtros
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lead Modal */}
      <LeadModal
        lead={selectedLead}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
      />
    </div>
  );
};

export default CRM;
