
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, TrendingUp, Send, Clock, ExternalLink, MessageCircle, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DashboardStats {
  totalDiagnosticos: number;
  mediaMaturidade: number;
  propostasEnviadas: number;
  propostasPendentes: number;
}

interface DiagnosticoCompleto {
  id: string;
  empresa_nome: string;
  score_total: number;
  nivel: string;
  status: string;
  created_at: string;
  pdf_url?: string;
  empresa_whatsapp?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalDiagnosticos: 0,
    mediaMaturidade: 0,
    propostasEnviadas: 0,
    propostasPendentes: 0
  });
  const [ultimosDiagnosticos, setUltimosDiagnosticos] = useState<DiagnosticoCompleto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Carregar estatísticas
      const [diagnosticosRes, propostasRes] = await Promise.all([
        supabase.from('diagnosticos').select('score_total'),
        supabase.from('propostas').select('status')
      ]);

      const diagnosticos = diagnosticosRes.data || [];
      const propostas = propostasRes.data || [];

      const totalDiagnosticos = diagnosticos.length;
      const mediaMaturidade = totalDiagnosticos > 0 
        ? Math.round(diagnosticos.reduce((acc, d) => acc + d.score_total, 0) / totalDiagnosticos)
        : 0;
      const propostasEnviadas = propostas.filter(p => p.status === 'enviada').length;
      const propostasPendentes = propostas.filter(p => p.status === 'pendente' || p.status === 'rascunho').length;

      setStats({
        totalDiagnosticos,
        mediaMaturidade,
        propostasEnviadas,
        propostasPendentes
      });

      // Carregar últimos diagnósticos
      const { data: ultimosDiag } = await supabase
        .from('diagnosticos')
        .select(`
          id,
          score_total,
          nivel,
          status,
          created_at,
          pdf_url,
          empresas (nome, whatsapp)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (ultimosDiag) {
        const diagnosticosFormatados = ultimosDiag.map(d => ({
          id: d.id,
          empresa_nome: (d.empresas as any)?.nome || 'N/A',
          score_total: d.score_total,
          nivel: d.nivel,
          status: d.status,
          created_at: d.created_at,
          pdf_url: d.pdf_url,
          empresa_whatsapp: (d.empresas as any)?.whatsapp
        }));
        setUltimosDiagnosticos(diagnosticosFormatados);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppSend = (whatsapp: string, pdfUrl?: string) => {
    if (!whatsapp) {
      toast.error('WhatsApp não cadastrado para esta empresa');
      return;
    }
    
    const cleanPhone = whatsapp.replace(/\D/g, '');
    const message = pdfUrl 
      ? `Olá, segue seu diagnóstico: ${pdfUrl}`
      : 'Olá, seu diagnóstico foi finalizado!';
    
    const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSchedule = () => {
    // Template básico do Google Calendar
    const title = 'Reunião - Apresentação de Diagnóstico';
    const details = 'Reunião para apresentar os resultados do diagnóstico empresarial';
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    startDate.setHours(14, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(15, 0, 0, 0);
    
    const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(details)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'concluido': 'bg-green-100 text-green-800',
      'pendente': 'bg-yellow-100 text-yellow-800',
      'em_andamento': 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getNivelColor = (nivel: string) => {
    const colors = {
      'Iniciante': 'text-red-600',
      'Emergente': 'text-orange-600',
      'Intermediário': 'text-blue-600',
      'Avançado': 'text-green-600'
    };
    return colors[nivel as keyof typeof colors] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0F3244]">Dashboard</h1>
          <p className="text-gray-600">Visão geral dos seus diagnósticos e métricas</p>
        </div>
        <Button 
          onClick={() => navigate('/novo-diagnostico')}
          className="bg-[#3C9CD6] hover:bg-[#3C9CD6]/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Diagnóstico
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/diagnosticos')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Diagnósticos</CardTitle>
            <FileText className="h-4 w-4 text-[#3C9CD6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0F3244]">{stats.totalDiagnosticos}</div>
            <p className="text-xs text-gray-600">Diagnósticos realizados</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/metricas')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média de Maturidade</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#FBB03B]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0F3244]">{stats.mediaMaturidade}%</div>
            <p className="text-xs text-gray-600">Score médio das empresas</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/propostas')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propostas Enviadas</CardTitle>
            <Send className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0F3244]">{stats.propostasEnviadas}</div>
            <p className="text-xs text-gray-600">Propostas já enviadas</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/propostas')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0F3244]">{stats.propostasPendentes}</div>
            <p className="text-xs text-gray-600">Aguardando envio</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Últimos Diagnósticos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0F3244]">Últimos Diagnósticos</CardTitle>
        </CardHeader>
        <CardContent>
          {ultimosDiagnosticos.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum diagnóstico encontrado</p>
              <Button 
                onClick={() => navigate('/novo-diagnostico')}
                className="mt-4 bg-[#3C9CD6] hover:bg-[#3C9CD6]/90"
              >
                Criar Primeiro Diagnóstico
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-gray-700">Empresa</th>
                    <th className="text-left p-3 font-medium text-gray-700">Score</th>
                    <th className="text-left p-3 font-medium text-gray-700">Nível</th>
                    <th className="text-left p-3 font-medium text-gray-700">Status</th>
                    <th className="text-left p-3 font-medium text-gray-700">Data</th>
                    <th className="text-left p-3 font-medium text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ultimosDiagnosticos.map((diagnostico) => (
                    <tr key={diagnostico.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{diagnostico.empresa_nome}</td>
                      <td className="p-3">
                        <span className="font-semibold text-[#0F3244]">
                          {diagnostico.score_total}%
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`font-medium ${getNivelColor(diagnostico.nivel)}`}>
                          {diagnostico.nivel}
                        </span>
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusColor(diagnostico.status)}>
                          {diagnostico.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-3 text-gray-600">
                        {new Date(diagnostico.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          {diagnostico.pdf_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(diagnostico.pdf_url, '_blank')}
                              title="Ver PDF"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleWhatsAppSend(diagnostico.empresa_whatsapp || '', diagnostico.pdf_url)}
                            title="Enviar WhatsApp"
                            className="text-green-600 hover:text-green-700"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleSchedule}
                            title="Agendar"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botão Flutuante */}
      <Button
        onClick={() => navigate('/novo-diagnostico')}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#FBB03B] hover:bg-[#FBB03B]/90 shadow-lg"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
