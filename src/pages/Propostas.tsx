import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { generateProposalPDF, downloadPDF } from '@/utils/pdfGenerator';
import { scheduleProposalMeeting } from '@/utils/calendarUtils';

const Propostas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; proposalId?: number }>({ open: false });

  const mockProposals = [
    {
      id: 1,
      diagnosticId: 1,
      company: "Tech Solutions LTDA",
      client: "João Silva",
      objective: "Implementar estratégia de marketing digital completa",
      actions: [
        "Criação de site responsivo",
        "Configuração do Google Ads",
        "Gestão de redes sociais",
        "Implementação de CRM"
      ],
      value: 15000,
      status: "Enviada",
      date: "2024-01-15",
      pdfUrl: "https://example.com/proposal1.pdf"
    },
    {
      id: 2,
      diagnosticId: 2,
      company: "Marketing Digital Pro",
      client: "Maria Santos",
      objective: "Otimização do processo de vendas",
      actions: [
        "Treinamento da equipe comercial",
        "Implementação de automações",
        "Criação de landing pages",
        "Setup de funil de vendas"
      ],
      value: 8500,
      status: "Aprovada",
      date: "2024-01-14",
      pdfUrl: "https://example.com/proposal2.pdf"
    },
    {
      id: 3,
      diagnosticId: 4,
      company: "Consultoria Business",
      client: "Ana Lima",
      objective: "Estruturação completa da área comercial",
      actions: [
        "Definição de processo de vendas",
        "Treinamento de equipe",
        "Implementação de métricas",
        "Criação de materiais comerciais"
      ],
      value: 12000,
      status: "Rascunho",
      date: "2024-01-12",
      pdfUrl: ""
    }
  ];

  const getStatusBadge = (status: string) => {
    const colors = {
      "Aprovada": "bg-green-100 text-green-800",
      "Enviada": "bg-blue-100 text-blue-800",
      "Rascunho": "bg-gray-100 text-gray-800",
      "Rejeitada": "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || colors["Rascunho"];
  };

  const filteredProposals = mockProposals.filter(proposal => {
    const matchesSearch = proposal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || proposal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDownloadPDF = (proposal: any) => {
    if (!proposal.pdfUrl && proposal.status === 'Rascunho') {
      toast({
        title: "PDF não disponível",
        description: "A proposta ainda não foi finalizada.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate PDF if not exists
      if (!proposal.pdfUrl) {
        const doc = generateProposalPDF({
          diagnosticos: {
            empresas: {
              nome: proposal.company,
              cliente_nome: proposal.client,
              cliente_email: `${proposal.client.toLowerCase().replace(' ', '.')}@${proposal.company.toLowerCase().replace(/\s+/g, '')}.com`
            }
          },
          created_at: proposal.date,
          valor: proposal.value,
          prazo: '30 dias',
          objetivo: proposal.objective,
          acoes_sugeridas: proposal.actions
        });
        
        downloadPDF(doc, `proposta-${proposal.company.toLowerCase().replace(/\s+/g, '-')}.pdf`);
        
        toast({
          title: "PDF gerado",
          description: `Proposta de ${proposal.company} baixada com sucesso!`
        });
      } else {
        window.open(proposal.pdfUrl, '_blank');
        toast({
          title: "PDF baixado",
          description: `Proposta de ${proposal.company} baixada com sucesso!`
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  };

  const handleSendWhatsApp = (proposal: any) => {
    if (proposal.status === 'Rascunho') {
      toast({
        title: "Proposta não finalizada",
        description: "Complete a proposta antes de enviá-la.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const message = `Olá! 👋\n\nSegue a proposta comercial personalizada para ${proposal.company}.\n\n💼 Valor: ${proposal.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n🎯 Objetivo: ${proposal.objective}\n\nClique aqui para visualizar: ${proposal.pdfUrl || 'Link será enviado em breve'}\n\nEstamos à disposição para esclarecimentos!`;
      
      const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "WhatsApp enviado",
        description: `Proposta preparada para envio para ${proposal.company}`
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar WhatsApp",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  };

  const handleScheduleMeeting = (proposal: any) => {
    try {
      scheduleProposalMeeting(proposal.company, proposal.client);
      
      toast({
        title: "Reunião agendada",
        description: `Calendário aberto para reunião comercial com ${proposal.company}`
      });
    } catch (error) {
      toast({
        title: "Erro ao agendar",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProposal = (proposalId: number) => {
    setDeleteDialog({ open: true, proposalId });
  };

  const confirmDelete = () => {
    toast({
      title: "Proposta excluída",
      description: "A proposta foi removida com sucesso.",
      variant: "destructive"
    });
    setDeleteDialog({ open: false });
  };

  const handleSendProposal = (proposal: any) => {
    if (proposal.status === 'Rascunho') {
      // Update status to "Enviada"
      toast({
        title: "Proposta enviada",
        description: `Proposta de ${proposal.company} enviada com sucesso!`
      });
    }
  };

  const totalValue = filteredProposals.reduce((sum, proposal) => sum + proposal.value, 0);
  const approvedValue = filteredProposals
    .filter(p => p.status === 'Aprovada')
    .reduce((sum, proposal) => sum + proposal.value, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Propostas Comerciais</h1>
          <p className="text-gray-600 mt-1">Gerencie suas propostas baseados nos diagnósticos</p>
        </div>
        <Button className="bg-petrol hover:bg-petrol/90 text-white">
          <FileText className="mr-2 h-4 w-4" />
          Nova Proposta
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-petrol">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Propostas
            </CardTitle>
            <FileText className="h-4 w-4 text-petrol" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{mockProposals.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Aprovadas
            </CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {mockProposals.filter(p => p.status === 'Aprovada').length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-mustard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Valor Total
            </CardTitle>
            <FileText className="h-4 w-4 text-mustard" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-light">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Valor Aprovado
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-light" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {approvedValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre as propostas por empresa ou status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <Input
                placeholder="Empresa ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Rascunho">Rascunho</SelectItem>
                  <SelectItem value="Enviada">Enviada</SelectItem>
                  <SelectItem value="Aprovada">Aprovada</SelectItem>
                  <SelectItem value="Rejeitada">Rejeitada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposals List */}
      <div className="grid gap-6">
        {filteredProposals.map((proposal) => (
          <Card key={proposal.id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.01]">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-xl text-gray-900">{proposal.company}</h3>
                    <Badge className={getStatusBadge(proposal.status)}>
                      {proposal.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600"><strong>Cliente:</strong> {proposal.client}</p>
                  <p className="text-gray-600"><strong>Data:</strong> {new Date(proposal.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {proposal.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Objetivo</h5>
                <p className="text-gray-700">{proposal.objective}</p>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Ações Sugeridas</h5>
                <ul className="space-y-1">
                  {proposal.actions.map((action, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-petrol rounded-full"></div>
                      <span className="text-gray-700">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleDownloadPDF(proposal)}
                  className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Baixar PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSendWhatsApp(proposal)}
                  className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-50 hover:border-green-700 transition-colors"
                >
                  📤 Enviar WhatsApp
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleScheduleMeeting(proposal)}
                  className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50 hover:border-blue-700 transition-colors"
                >
                  📅 Agendar Reunião
                </Button>
                <Button
                  onClick={() => handleSendProposal(proposal)}
                  className="flex items-center gap-2 bg-petrol hover:bg-petrol/90 text-white transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  {proposal.status === 'Rascunho' ? 'Enviar Proposta' : 'Reenviar'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDeleteProposal(proposal.id)}
                  className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50 hover:border-red-700 transition-colors"
                >
                  🗑️ Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProposals.length === 0 && (
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta proposta? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false })}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Propostas;
