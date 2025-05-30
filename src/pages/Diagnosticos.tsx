
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Calendar, Settings, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useDiagnosticos } from '@/hooks/useSupabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { generateDiagnosticPDF, downloadPDF, getPDFDataURL } from '@/utils/pdfGenerator';
import { scheduleGoogleCalendarEvent } from '@/utils/calendarUtils';
import { sendWhatsAppMessage } from '@/utils/whatsappUtils';
import { EditDiagnosticButton } from '@/components/EditDiagnosticButton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Diagnosticos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [scoreFilter, setScoreFilter] = useState('todos');
  
  const { data: diagnosticos = [], isLoading, error } = useDiagnosticos();
  const queryClient = useQueryClient();

  console.log('Diagnósticos do Supabase:', diagnosticos);

  const deleteDiagnostic = useMutation({
    mutationFn: async (id: string) => {
      // Primeiro deletar respostas relacionadas
      const { error: respostasError } = await supabase
        .from('respostas')
        .delete()
        .eq('diagnostico_id', id);
      
      if (respostasError) throw respostasError;

      // Depois deletar o diagnóstico
      const { error } = await supabase
        .from('diagnosticos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnosticos'] });
      toast({
        title: "Diagnóstico excluído",
        description: "O diagnóstico foi excluído com sucesso."
      });
    },
    onError: (error) => {
      console.error('Erro ao excluir diagnóstico:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o diagnóstico.",
        variant: "destructive"
      });
    }
  });

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
    return status === "concluido" 
      ? "bg-blue-100 text-blue-800" 
      : "bg-gray-100 text-gray-800";
  };

  const filteredDiagnostics = diagnosticos.filter(diagnostic => {
    const empresa = diagnostic.empresas;
    const matchesSearch = empresa?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empresa?.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || diagnostic.status === statusFilter;
    const matchesScore = scoreFilter === 'todos' || 
                        (scoreFilter === 'alto' && diagnostic.score_total >= 80) ||
                        (scoreFilter === 'medio' && diagnostic.score_total >= 40 && diagnostic.score_total < 80) ||
                        (scoreFilter === 'baixo' && diagnostic.score_total < 40);
    
    return matchesSearch && matchesStatus && matchesScore;
  });

  const handleGenerateAndDownloadPDF = async (diagnostic: any) => {
    try {
      const doc = generateDiagnosticPDF(diagnostic);
      const filename = `diagnostico-${diagnostic.empresas?.nome || 'empresa'}-${new Date().toISOString().split('T')[0]}.pdf`;
      downloadPDF(doc, filename);
      
      // Salvar URL do PDF no banco (simulado)
      const pdfDataURL = getPDFDataURL(doc);
      
      toast({
        title: "PDF gerado",
        description: "O PDF foi gerado e baixado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF.",
        variant: "destructive"
      });
    }
  };

  const handleSendWhatsApp = async (diagnostic: any) => {
    try {
      const empresa = diagnostic.empresas;
      if (!empresa?.cliente_telefone) {
        toast({
          title: "Telefone não disponível",
          description: "Número de WhatsApp não cadastrado para este cliente.",
          variant: "destructive"
        });
        return;
      }

      // Gerar PDF primeiro
      const doc = generateDiagnosticPDF(diagnostic);
      const pdfDataURL = getPDFDataURL(doc);
      
      const message = `Olá ${empresa.cliente_nome}, segue seu diagnóstico empresarial. Score: ${diagnostic.score_total}%. PDF: ${pdfDataURL}`;
      
      sendWhatsAppMessage(empresa.cliente_telefone, message);
      
      toast({
        title: "WhatsApp aberto",
        description: `Mensagem preparada para ${empresa.nome}`
      });
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      toast({
        title: "Erro",
        description: "Não foi possível abrir o WhatsApp.",
        variant: "destructive"
      });
    }
  };

  const handleScheduleCalendar = (diagnostic: any) => {
    try {
      const empresa = diagnostic.empresas;
      const title = `Apresentação Diagnóstico - ${empresa?.nome || 'Empresa'}`;
      const description = `Reunião para apresentar os resultados do diagnóstico empresarial para ${empresa?.nome} com ${empresa?.cliente_nome}.`;
      
      scheduleGoogleCalendarEvent(title, description, empresa?.cliente_email);
      
      toast({
        title: "Agenda aberta",
        description: "Evento criado no Google Calendar"
      });
    } catch (error) {
      console.error('Erro ao agendar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o evento na agenda.",
        variant: "destructive"
      });
    }
  };

  const handleViewDiagnostic = (diagnosticId: string) => {
    // Navegar para uma página de visualização detalhada
    window.open(`/diagnostico/${diagnosticId}`, '_blank');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Carregando diagnósticos...</div>;
  }

  if (error) {
    return <div className="text-red-600">Erro ao carregar diagnósticos: {error.message}</div>;
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
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
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
          Mostrando {filteredDiagnostics.length} de {diagnosticos.length} diagnósticos
        </p>
      </div>

      {/* Diagnostics List */}
      <div className="grid gap-4">
        {filteredDiagnostics.map((diagnostic) => (
          <Card key={diagnostic.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Company Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="font-semibold text-lg text-gray-900">{diagnostic.empresas?.nome || 'Empresa não informada'}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getStatusBadge(diagnostic.status)}>
                        {diagnostic.status === 'concluido' ? 'Concluído' : 'Pendente'}
                      </Badge>
                      <Badge className={getLevelBadge(diagnostic.nivel)}>
                        {diagnostic.nivel}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                    <p><strong>Cliente:</strong> {diagnostic.empresas?.cliente_nome || 'N/A'}</p>
                    <p><strong>Data:</strong> {new Date(diagnostic.created_at).toLocaleDateString('pt-BR')}</p>
                    <p><strong>E-mail:</strong> {diagnostic.empresas?.cliente_email || 'N/A'}</p>
                    <p><strong>WhatsApp:</strong> {diagnostic.empresas?.cliente_telefone || 'N/A'}</p>
                  </div>
                </div>

                {/* Score */}
                <div className="text-center">
                  <div className={`text-3xl font-bold p-4 rounded-lg ${getScoreColor(diagnostic.score_total)}`}>
                    {diagnostic.score_total}%
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 min-w-fit">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGenerateAndDownloadPDF(diagnostic)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Baixar PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendWhatsApp(diagnostic)}
                      className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                    >
                      📤 WhatsApp
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleScheduleCalendar(diagnostic)}
                      className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                      <Calendar className="h-4 w-4" />
                      Agendar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDiagnostic(diagnostic.id)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Ver
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <EditDiagnosticButton 
                      diagnosticId={diagnostic.id} 
                      size="sm"
                      variant="outline" 
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este diagnóstico? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteDiagnostic.mutate(diagnostic.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum diagnóstico encontrado</h3>
            <p className="text-gray-600 mb-6">
              Não há diagnósticos que correspondam aos filtros selecionados.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('todos');
              setScoreFilter('todos');
            }}>
              Limpar Filtros
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Diagnosticos;
