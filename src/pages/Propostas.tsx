
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { FileText, Download, Edit, Eye, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { usePropostas } from '@/hooks/useSupabase';
import { generateProposalPDF, downloadPDF, getPDFDataURL } from '@/utils/pdfGenerator';
import { sendWhatsAppMessage, createProposalWhatsAppMessage } from '@/utils/whatsappUtils';

const Propostas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedProposta, setSelectedProposta] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: propostas = [], isLoading } = usePropostas();

  const getStatusBadge = (status: string) => {
    const colors = {
      "aprovada": "bg-green-100 text-green-800",
      "enviada": "bg-blue-100 text-blue-800",
      "rascunho": "bg-gray-100 text-gray-800",
      "rejeitada": "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || colors["rascunho"];
  };

  const filteredPropostas = propostas.filter(proposta => {
    const empresa = proposta.diagnosticos?.empresas;
    const matchesSearch = empresa?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empresa?.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || proposta.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDownloadPDF = async (proposta: any) => {
    try {
      const pdf = generateProposalPDF(proposta);
      const empresa = proposta.diagnosticos?.empresas;
      const filename = `Proposta_${empresa?.nome || 'Empresa'}_${new Date(proposta.created_at).toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
      downloadPDF(pdf, filename);
      
      toast({
        title: "PDF baixado",
        description: "A proposta foi baixada com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o PDF da proposta.",
        variant: "destructive"
      });
    }
  };

  const handleSendWhatsApp = async (proposta: any) => {
    try {
      const empresa = proposta.diagnosticos?.empresas;
      
      if (!empresa?.cliente_telefone) {
        toast({
          title: "Telefone não encontrado",
          description: "O número de telefone do cliente não está cadastrado.",
          variant: "destructive"
        });
        return;
      }

      // Gerar PDF e obter URL
      const pdf = generateProposalPDF(proposta);
      const pdfDataUrl = getPDFDataURL(pdf);
      
      // Criar mensagem personalizada
      const message = createProposalWhatsAppMessage(
        empresa.nome || 'Empresa',
        empresa.cliente_nome || 'Cliente',
        proposta.valor || 0
      );
      
      // Adicionar link do PDF à mensagem
      const messageWithPdf = `${message}\n\nPDF da proposta: ${pdfDataUrl}`;
      
      sendWhatsAppMessage(empresa.cliente_telefone, messageWithPdf);
      
      toast({
        title: "WhatsApp aberto",
        description: "A proposta foi preparada para envio via WhatsApp."
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar WhatsApp",
        description: "Não foi possível preparar o envio via WhatsApp.",
        variant: "destructive"
      });
    }
  };

  const handleViewProposta = (proposta: any) => {
    setSelectedProposta(proposta);
    setIsViewDialogOpen(true);
  };

  const handleEditProposta = (proposta: any) => {
    setSelectedProposta(proposta);
    setIsEditDialogOpen(true);
  };

  const handleDeleteProposta = async (propostaId: string) => {
    // TODO: Implementar exclusão no Supabase
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A exclusão de propostas será implementada em breve."
    });
  };

  // Helper function to safely parse and handle acoes_sugeridas
  const getAcoesSugeridas = (acoes: any): string[] => {
    if (!acoes) return [];
    if (typeof acoes === 'string') {
      try {
        const parsed = JSON.parse(acoes);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [acoes];
      }
    }
    if (Array.isArray(acoes)) {
      return acoes;
    }
    return [];
  };

  const totalValue = filteredPropostas.reduce((sum, proposta) => sum + (proposta.valor || 0), 0);
  const approvedValue = filteredPropostas
    .filter(p => p.status === 'aprovada')
    .reduce((sum, proposta) => sum + (proposta.valor || 0), 0);

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-petrol">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Propostas
            </CardTitle>
            <FileText className="h-4 w-4 text-petrol" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{propostas.length}</div>
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
              {propostas.filter(p => p.status === 'aprovada').length}
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
                  <SelectItem value="rascunho">Rascunho</SelectItem>
                  <SelectItem value="enviada">Enviada</SelectItem>
                  <SelectItem value="aprovada">Aprovada</SelectItem>
                  <SelectItem value="rejeitada">Rejeitada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Propostas List */}
      <div className="grid gap-6">
        {filteredPropostas.map((proposta) => {
          const empresa = proposta.diagnosticos?.empresas;
          const acoesSugeridas = getAcoesSugeridas(proposta.acoes_sugeridas);
          
          return (
            <Card key={proposta.id} className="hover:shadow-md transition-shadow relative">
              {/* Ícone de Editar no canto superior direito */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10"
                onClick={() => handleEditProposta(proposta)}
              >
                <Edit className="h-4 w-4" />
              </Button>

              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pr-12">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-xl text-gray-900">{empresa?.nome || 'Empresa não informada'}</h3>
                      <Badge className={getStatusBadge(proposta.status)}>
                        {proposta.status?.charAt(0).toUpperCase() + proposta.status?.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-gray-600"><strong>Cliente:</strong> {empresa?.cliente_nome || 'N/A'}</p>
                    <p className="text-gray-600"><strong>Data:</strong> {new Date(proposta.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {(proposta.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Objetivo</h5>
                  <p className="text-gray-700">{proposta.objetivo || 'Objetivo não definido'}</p>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Ações Sugeridas</h5>
                  <ul className="space-y-1">
                    {acoesSugeridas.length > 0 ? acoesSugeridas.map((acao: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-petrol rounded-full"></div>
                        <span className="text-gray-700">{acao}</span>
                      </li>
                    )) : <li className="text-gray-500">Nenhuma ação definida</li>}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadPDF(proposta)}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Baixar PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSendWhatsApp(proposta)}
                    className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                  >
                    📤 Enviar WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleViewProposta(proposta)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Visualizar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir esta proposta? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteProposta(proposta.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
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

      {/* Dialog para Visualizar Proposta */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualizar Proposta</DialogTitle>
            <DialogDescription>
              Detalhes completos da proposta comercial
            </DialogDescription>
          </DialogHeader>
          {selectedProposta && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900">Empresa</h5>
                  <p className="text-gray-700">{selectedProposta.diagnosticos?.empresas?.nome || 'N/A'}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Cliente</h5>
                  <p className="text-gray-700">{selectedProposta.diagnosticos?.empresas?.cliente_nome || 'N/A'}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">E-mail</h5>
                  <p className="text-gray-700">{selectedProposta.diagnosticos?.empresas?.cliente_email || 'N/A'}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Telefone</h5>
                  <p className="text-gray-700">{selectedProposta.diagnosticos?.empresas?.cliente_telefone || 'N/A'}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Valor</h5>
                  <p className="text-gray-700 font-semibold text-green-600">
                    {(selectedProposta.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Status</h5>
                  <Badge className={getStatusBadge(selectedProposta.status)}>
                    {selectedProposta.status?.charAt(0).toUpperCase() + selectedProposta.status?.slice(1)}
                  </Badge>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Prazo</h5>
                  <p className="text-gray-700">{selectedProposta.prazo || 'A definir'}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Data de Criação</h5>
                  <p className="text-gray-700">{new Date(selectedProposta.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Objetivo</h5>
                <p className="text-gray-700">{selectedProposta.objetivo || 'Objetivo não definido'}</p>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Ações Sugeridas</h5>
                <ul className="space-y-2">
                  {getAcoesSugeridas(selectedProposta.acoes_sugeridas).map((acao: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-petrol rounded-full mt-2"></div>
                      <span className="text-gray-700">{acao}</span>
                    </li>
                  ))}
                  {getAcoesSugeridas(selectedProposta.acoes_sugeridas).length === 0 && (
                    <li className="text-gray-500">Nenhuma ação definida</li>
                  )}
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fechar
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              handleEditProposta(selectedProposta);
            }}>
              Editar Proposta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
