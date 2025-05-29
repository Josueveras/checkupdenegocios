
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Calendar, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Diagnosticos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [scoreFilter, setScoreFilter] = useState('todos');

  const mockDiagnostics = [
    {
      id: 1,
      company: "Tech Solutions LTDA",
      client: "João Silva",
      email: "joao@techsolutions.com",
      phone: "11999999999",
      score: 78,
      level: "Intermediário",
      date: "2024-01-15",
      status: "Concluído",
      pdfUrl: "https://example.com/diagnostic1.pdf",
      calendarUrl: "https://calendly.com/agencia"
    },
    {
      id: 2,
      company: "Marketing Digital Pro",
      client: "Maria Santos",
      email: "maria@marketingpro.com",
      phone: "11888888888",
      score: 45,
      level: "Emergente",
      date: "2024-01-14",
      status: "Pendente",
      pdfUrl: "",
      calendarUrl: "https://calendly.com/agencia"
    },
    {
      id: 3,
      company: "Inovação & Estratégia",
      client: "Pedro Costa",
      email: "pedro@inovacao.com",
      phone: "11777777777",
      score: 92,
      level: "Avançado",
      date: "2024-01-13",
      status: "Concluído",
      pdfUrl: "https://example.com/diagnostic3.pdf",
      calendarUrl: ""
    },
    {
      id: 4,
      company: "Consultoria Business",
      client: "Ana Lima",
      email: "ana@consultoria.com",
      phone: "11666666666",
      score: 28,
      level: "Iniciante",
      date: "2024-01-12",
      status: "Concluído",
      pdfUrl: "https://example.com/diagnostic4.pdf",
      calendarUrl: "https://calendly.com/agencia"
    }
  ];

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
    return status === "Concluído" 
      ? "bg-blue-100 text-blue-800" 
      : "bg-gray-100 text-gray-800";
  };

  const filteredDiagnostics = mockDiagnostics.filter(diagnostic => {
    const matchesSearch = diagnostic.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         diagnostic.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || diagnostic.status === statusFilter;
    const matchesScore = scoreFilter === 'todos' || 
                        (scoreFilter === 'alto' && diagnostic.score >= 80) ||
                        (scoreFilter === 'medio' && diagnostic.score >= 40 && diagnostic.score < 80) ||
                        (scoreFilter === 'baixo' && diagnostic.score < 40);
    
    return matchesSearch && matchesStatus && matchesScore;
  });

  const handleViewPDF = (pdfUrl: string, company: string) => {
    if (!pdfUrl) {
      toast({
        title: "PDF não disponível",
        description: "O PDF ainda não foi gerado para este diagnóstico.",
        variant: "destructive"
      });
      return;
    }
    window.open(pdfUrl, '_blank');
  };

  const handleSendWhatsApp = (phone: string, pdfUrl: string, company: string) => {
    if (!pdfUrl) {
      toast({
        title: "PDF não disponível",
        description: "Não é possível enviar por WhatsApp sem o PDF gerado.",
        variant: "destructive"
      });
      return;
    }
    
    const message = `Olá, segue seu diagnóstico gerado. Clique aqui: ${pdfUrl}`;
    const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp aberto",
      description: `Mensagem preparada para ${company}`
    });
  };

  const handleScheduleMeeting = (calendarUrl: string, company: string) => {
    if (!calendarUrl) {
      toast({
        title: "Link não disponível",
        description: "Nenhum link de agendamento disponível.",
        variant: "destructive"
      });
      return;
    }
    window.open(calendarUrl, '_blank');
  };

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
                  <SelectItem value="baixo">Baixo (<40%)</SelectItem>
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
          Mostrando {filteredDiagnostics.length} de {mockDiagnostics.length} diagnósticos
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
                    <h3 className="font-semibold text-lg text-gray-900">{diagnostic.company}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getStatusBadge(diagnostic.status)}>
                        {diagnostic.status}
                      </Badge>
                      <Badge className={getLevelBadge(diagnostic.level)}>
                        {diagnostic.level}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                    <p><strong>Cliente:</strong> {diagnostic.client}</p>
                    <p><strong>Data:</strong> {new Date(diagnostic.date).toLocaleDateString('pt-BR')}</p>
                    <p><strong>E-mail:</strong> {diagnostic.email}</p>
                    <p><strong>WhatsApp:</strong> {diagnostic.phone}</p>
                  </div>
                </div>

                {/* Score */}
                <div className="text-center">
                  <div className={`text-3xl font-bold p-4 rounded-lg ${getScoreColor(diagnostic.score)}`}>
                    {diagnostic.score}%
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewPDF(diagnostic.pdfUrl, diagnostic.company)}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Ver PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendWhatsApp(diagnostic.phone, diagnostic.pdfUrl, diagnostic.company)}
                    className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                  >
                    📤 WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleScheduleMeeting(diagnostic.calendarUrl, diagnostic.company)}
                    className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                  >
                    <Calendar className="h-4 w-4" />
                    Agendar
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
