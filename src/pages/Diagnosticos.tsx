
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Calendar, Settings, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { generateDiagnosticPDF, downloadPDF } from '@/utils/pdfGenerator';
import { scheduleDiagnosticMeeting } from '@/utils/calendarUtils';
import { sendWhatsAppMessage } from '@/utils/whatsappUtils';
import { useDiagnosticos, useDeleteDiagnostico } from '@/hooks/useSupabase';

const Diagnosticos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [scoreFilter, setScoreFilter] = useState('todos');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; diagnosticId?: string }>({ open: false });

  const { data: diagnostics = [], isLoading } = useDiagnosticos();
  const deleteCompanyMutation = useDeleteDiagnostico();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    if (score >= 40) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      "Avançado": "bg-green-100 text-green-800",
      "Intermediário": "bg-yellow-100 text-yellow-800",
      "Emergente": "bg-orange-100 text-orange-800",
      "Iniciante": "bg-red-100 text-red-800"
    };
    return colors[level as keyof typeof colors] || colors["Iniciante"];
  };

  const getStatusBadge = (status: string) => {
    return status === "concluido" || status === "Concluído"
      ? "bg-blue-100 text-blue-800" 
      : "bg-gray-100 text-gray-800";
  };

  const filteredDiagnostics = diagnostics.filter(diagnostic => {
    const company = diagnostic.empresas?.nome || '';
    const client = diagnostic.empresas?.cliente_nome || '';
    const matchesSearch = company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const status = diagnostic.status === 'concluido' ? 'Concluído' : 'Pendente';
    const matchesStatus = statusFilter === 'todos' || status === statusFilter;
    
    const score = diagnostic.score_total || 0;
    const matchesScore = scoreFilter === 'todos' || 
                        (scoreFilter === 'alto' && score >= 80) ||
                        (scoreFilter === 'medio' && score >= 40 && score < 80) ||
                        (scoreFilter === 'baixo' && score < 40);
    
    return matchesSearch && matchesStatus && matchesScore;
  });

  const handleViewPDF = async (diagnostic: any) => {
    try {
      // Verificar se o diagnóstico está pendente
      if (diagnostic.status === 'pendente') {
        toast({
          title: "PDF não disponível",
          description: "O diagnóstico ainda não foi finalizado.",
          variant: "destructive"
        });
        return;
      }

      // Se já existe um PDF URL, abrir
      if (diagnostic.pdf_url) {
        window.open(diagnostic.pdf_url, '_blank');
        toast({
          title: "PDF aberto",
          description: `Visualizando diagnóstico de ${diagnostic.empresas?.nome}`
        });
        return;
      }

      // Gerar PDF se não existir
      const doc = generateDiagnosticPDF({
        empresa: {
          nome: diagnostic.empresas?.nome || 'Empresa não informada',
          cliente_nome: diagnostic.empresas?.cliente_nome || 'Cliente não informado',
          cliente_email: diagnostic.empresas?.cliente_email || ''
        },
        created_at: diagnostic.created_at,
        score_total: diagnostic.score_total || 0,
        nivel: diagnostic.nivel || 'Não definido',
        score_marketing: diagnostic.score_marketing || 0,
        score_vendas: diagnostic.score_vendas || 0,
        score_estrategia: diagnostic.score_estrategia || 0,
        score_gestao: diagnostic.score_gestao || 0,
        pontos_fortes: diagnostic.pontos_fortes || ['Análise em progresso'],
        pontos_atencao: diagnostic.pontos_atencao || ['Análise em progresso']
      });
      
      const fileName = `diagnostico-${(diagnostic.empresas?.nome || 'empresa').toLowerCase().replace(/\s+/g, '-')}.pdf`;
      downloadPDF(doc, fileName);
      
      toast({
        title: "PDF gerado com sucesso",
        description: `Diagnóstico de ${diagnostic.empresas?.nome} baixado!`
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  };

  const handleSendWhatsApp = (diagnostic: any) => {
    const phone = diagnostic.empresas?.cliente_telefone;
    const clientName = diagnostic.empresas?.cliente_nome || 'Cliente';
    const companyName = diagnostic.empresas?.nome || 'Empresa';
    const score = diagnostic.score_total || 0;
    const level = diagnostic.nivel || 'Não definido';

    if (!phone) {
      toast({
        title: "Telefone não informado",
        description: "Não é possível enviar WhatsApp sem o número de telefone.",
        variant: "destructive"
      });
      return;
    }

    try {
      sendWhatsAppMessage({
        phone,
        clientName,
        companyName,
        score,
        level,
        pdfUrl: diagnostic.pdf_url || ''
      });
      
      toast({
        title: "WhatsApp enviado",
        description: `Mensagem preparada para ${clientName} (${companyName})`
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar WhatsApp",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  };

  const handleScheduleMeeting = (diagnostic: any) => {
    try {
      const companyName = diagnostic.empresas?.nome || 'Empresa';
      const clientName = diagnostic.empresas?.cliente_nome || 'Cliente';
      
      scheduleDiagnosticMeeting(companyName, clientName);
      
      toast({
        title: "Reunião agendada",
        description: `Google Agenda aberto para agendar reunião com ${companyName}`
      });
    } catch (error) {
      toast({
        title: "Erro ao agendar",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDiagnostic = (diagnosticId: string) => {
    setDeleteDialog({ open: true, diagnosticId });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.diagnosticId) return;
    
    try {
      await deleteCompanyMutation.mutateAsync(deleteDialog.diagnosticId);
      toast({
        title: "Diagnóstico excluído",
        description: "O diagnóstico foi removido com sucesso.",
        variant: "destructive"
      });
      setDeleteDialog({ open: false });
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o diagnóstico.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-petrol"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Diagnósticos</h1>
          <p className="text-gray-600 mt-1">Histórico completo de todos os diagnósticos realizados</p>
        </div>
        <Link to="/novo-diagnostico">
          <Button className="bg-petrol hover:bg-petrol/90 text-white">
            <FileText className="mr-2 h-4 w-4" />
            Novo Diagnóstico
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre os diagnósticos por empresa, status ou pontuação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <SelectItem value="Concluído">Concluído</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Score</label>
              <Select value={scoreFilter} onValueChange={setScoreFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="alto">Alto (80%+)</SelectItem>
                  <SelectItem value="medio">Médio (40-79%)</SelectItem>
                  <SelectItem value="baixo">Baixo (&lt;40%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="90d">Últimos 90 dias</SelectItem>
                  <SelectItem value="all">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Mostrando {filteredDiagnostics.length} de {diagnostics.length} diagnósticos
        </p>
      </div>

      {/* Diagnostics List */}
      <div className="grid gap-4">
        {filteredDiagnostics.map((diagnostic) => (
          <Card key={diagnostic.id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.01]">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Company Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {diagnostic.empresas?.nome || 'Empresa não informada'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getStatusBadge(diagnostic.status)}>
                        {diagnostic.status === 'concluido' ? 'Concluído' : 'Pendente'}
                      </Badge>
                      <Badge className={getLevelBadge(diagnostic.nivel || 'Iniciante')}>
                        {diagnostic.nivel || 'Não definido'}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                    <p><strong>Cliente:</strong> {diagnostic.empresas?.cliente_nome || 'Não informado'}</p>
                    <p><strong>Data:</strong> {new Date(diagnostic.created_at).toLocaleDateString('pt-BR')}</p>
                    <p><strong>E-mail:</strong> {diagnostic.empresas?.cliente_email || 'Não informado'}</p>
                    <p><strong>WhatsApp:</strong> {diagnostic.empresas?.cliente_telefone || 'Não informado'}</p>
                  </div>
                </div>

                {/* Score */}
                <div className="text-center">
                  <div className={`text-3xl font-bold p-4 rounded-lg ${getScoreColor(diagnostic.score_total || 0)}`}>
                    {diagnostic.score_total || 0}%
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewPDF(diagnostic)}
                    className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    Ver PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendWhatsApp(diagnostic)}
                    className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-50 hover:border-green-700 transition-colors"
                  >
                    📤 WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleScheduleMeeting(diagnostic)}
                    className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50 hover:border-blue-700 transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    Agendar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteDiagnostic(diagnostic.id)}
                    className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50 hover:border-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDiagnostics.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {diagnostics.length === 0 ? 'Nenhum diagnóstico encontrado' : 'Nenhum resultado encontrado'}
            </h3>
            <p className="text-gray-600 mb-6">
              {diagnostics.length === 0 
                ? 'Comece criando seu primeiro diagnóstico.' 
                : 'Não há diagnósticos que correspondam aos filtros selecionados.'
              }
            </p>
            {diagnostics.length === 0 ? (
              <Link to="/novo-diagnostico">
                <Button className="bg-petrol hover:bg-petrol/90 text-white">
                  Criar Diagnóstico
                </Button>
              </Link>
            ) : (
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setStatusFilter('todos');
                setScoreFilter('todos');
              }}>
                Limpar Filtros
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este diagnóstico? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false })}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteCompanyMutation.isPending}
            >
              {deleteCompanyMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Diagnosticos;
