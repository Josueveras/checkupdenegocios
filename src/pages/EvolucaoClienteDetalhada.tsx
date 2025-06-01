
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { BackButton } from '@/components/ui/back-button';
import { 
  ArrowLeft, 
  FileText, 
  MessageCircle, 
  TrendingUp, 
  Building2, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  BarChart3, 
  LineChart, 
  Download,
  Plus,
  Calendar,
  Users,
  Target,
  Award
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart as RechartsLineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const EvolucaoClienteDetalhada = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

  // Buscar dados da empresa
  const { data: empresa, isLoading: loadingEmpresa } = useQuery({
    queryKey: ['empresa-detalhada', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  // Buscar acompanhamentos da empresa
  const { data: acompanhamentos, isLoading: loadingAcompanhamentos } = useQuery({
    queryKey: ['acompanhamentos-detalhados', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('acompanhamentos')
        .select('*')
        .eq('empresa_id', id)
        .order('mes', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!id
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string | Date) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'MMMM/yyyy', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  const getAcoesConcluidasCount = (acoes: any) => {
    if (!acoes) return 0;
    
    let parsedAcoes = acoes;
    if (typeof acoes === 'string') {
      try {
        parsedAcoes = JSON.parse(acoes);
      } catch {
        return 0;
      }
    }
    
    if (!Array.isArray(parsedAcoes)) return 0;
    
    return parsedAcoes.filter(acao => acao && acao.status === 'concluido').length;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluido':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'em_andamento':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'pendente':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  // Calcular indicadores
  const indicadores = acompanhamentos ? {
    scoreMedio: Math.round(acompanhamentos.reduce((acc, acomp) => acc + acomp.score_geral, 0) / acompanhamentos.length) || 0,
    roiMedio: (acompanhamentos.reduce((acc, acomp) => acc + (acomp.roi || 0), 0) / acompanhamentos.length).toFixed(1),
    faturamentoMedio: acompanhamentos.reduce((acc, acomp) => acc + (acomp.faturamento || 0), 0) / acompanhamentos.length,
    totalCheckups: acompanhamentos.length,
    totalAcoesConcluidas: acompanhamentos.reduce((acc, acomp) => acc + getAcoesConcluidasCount(acomp.acoes), 0)
  } : null;

  // Preparar dados para gráficos
  const dadosGrafico = acompanhamentos?.map(acomp => ({
    mes: formatDate(acomp.mes),
    score: acomp.score_geral,
    faturamento: acomp.faturamento || 0,
    roi: acomp.roi || 0,
    id: acomp.id
  })) || [];

  // Preparar dados para radar (score por categoria)
  const dadosRadar = acompanhamentos?.length > 0 ? (() => {
    const ultimoAcomp = acompanhamentos[acompanhamentos.length - 1];
    const scorePorCategoria = ultimoAcomp.score_por_categoria;
    
    if (!scorePorCategoria) return [];
    
    let parsed = scorePorCategoria;
    if (typeof scorePorCategoria === 'string') {
      try {
        parsed = JSON.parse(scorePorCategoria);
      } catch {
        return [];
      }
    }
    
    return Object.entries(parsed).map(([categoria, score]) => ({
      categoria: categoria.replace('_', ' ').toUpperCase(),
      score: score as number
    }));
  })() : [];

  const handleMonthSelection = (monthId: string) => {
    setSelectedMonths(prev => 
      prev.includes(monthId) 
        ? prev.filter(id => id !== monthId)
        : prev.length < 2 ? [...prev, monthId] : [prev[1], monthId]
    );
  };

  const compareMonths = () => {
    if (selectedMonths.length === 2) {
      // Implementar comparação entre meses
      console.log('Comparando meses:', selectedMonths);
    }
  };

  if (loadingEmpresa || loadingAcompanhamentos) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petrol mx-auto mb-4"></div>
          <p>Carregando evolução do cliente...</p>
        </div>
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Cliente não encontrado</h2>
        <BackButton fallbackRoute="/acompanhamento" />
      </div>
    );
  }

  const ultimoAcompanhamento = acompanhamentos?.[acompanhamentos.length - 1];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Evolução do Cliente</h1>
          <p className="text-gray-600 mt-1">Análise completa da jornada empresarial</p>
        </div>
        <BackButton fallbackRoute="/acompanhamento" />
      </div>

      {/* Informações da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-petrol" />
            {empresa.nome}
          </CardTitle>
          <CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div>
                <span className="text-sm text-gray-600">E-mail:</span>
                <p className="font-medium">{empresa.cliente_email || 'Não informado'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Telefone:</span>
                <p className="font-medium">{empresa.cliente_telefone || 'Não informado'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Data de entrada:</span>
                <p className="font-medium">{format(new Date(empresa.created_at), 'dd/MM/yyyy', { locale: ptBR })}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status:</span>
                <Badge className="bg-green-100 text-green-800 ml-2">Ativo</Badge>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-petrol hover:bg-petrol/90 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Novo Check-up
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Gerar Relatório
            </Button>
            <Button variant="outline" onClick={() => navigate('/acompanhamento')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Indicadores Visuais */}
      {indicadores && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-petrol mb-2">{indicadores.scoreMedio}%</div>
              <p className="text-gray-600 text-sm">Score Médio Geral</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">{indicadores.roiMedio}x</div>
              <p className="text-gray-600 text-sm">ROI Médio</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-xl font-bold text-blue-600 mb-2">
                {formatCurrency(indicadores.faturamentoMedio)}
              </div>
              <p className="text-gray-600 text-sm">Faturamento Médio</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">{indicadores.totalCheckups}</div>
              <p className="text-gray-600 text-sm">Check-ups Realizados</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">{indicadores.totalAcoesConcluidas}</div>
              <p className="text-gray-600 text-sm">Ações Concluídas</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Geral por Mês */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-petrol" />
              Score Geral por Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ score: { label: "Score", color: "#0F3244" } }} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={dadosGrafico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="score" stroke="var(--color-score)" strokeWidth={2} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* ROI e Faturamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-petrol" />
              ROI e Faturamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ 
              faturamento: { label: "Faturamento", color: "#3C9CD6" },
              roi: { label: "ROI", color: "#0F3244" }
            }} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosGrafico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="faturamento" fill="var(--color-faturamento)" />
                  <Bar dataKey="roi" fill="var(--color-roi)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Score por Categoria - Radar */}
      {dadosRadar.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-petrol" />
              Score por Categoria (Último Mês)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ score: { label: "Score", color: "#0F3244" } }} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={dadosRadar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="categoria" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar dataKey="score" stroke="var(--color-score)" fill="var(--color-score)" fillOpacity={0.3} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Linha do Tempo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-petrol" />
            Linha do Tempo - Check-ups Mensais
          </CardTitle>
          <CardDescription>
            Selecione até 2 meses para comparação
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedMonths.length === 2 && (
            <div className="mb-4">
              <Button onClick={compareMonths} className="bg-petrol hover:bg-petrol/90 text-white">
                Comparar Meses Selecionados
              </Button>
            </div>
          )}
          
          <div className="space-y-4">
            {acompanhamentos?.map((acomp, index) => (
              <div key={acomp.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={selectedMonths.includes(acomp.id)}
                      onCheckedChange={() => handleMonthSelection(acomp.id)}
                      disabled={!selectedMonths.includes(acomp.id) && selectedMonths.length >= 2}
                    />
                    <div>
                      <h4 className="font-semibold text-lg">{formatDate(acomp.mes)}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600">Score: <span className="font-semibold text-petrol">{acomp.score_geral}%</span></span>
                        <span className="text-sm text-gray-600">ROI: <span className="font-semibold">{acomp.roi || 'N/A'}x</span></span>
                        <span className="text-sm text-gray-600">Ações: <span className="font-semibold">{getAcoesConcluidasCount(acomp.acoes)}</span></span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {acomp.destaque && (
                  <div className="mt-3">
                    <span className="text-sm text-gray-600">Destaque:</span>
                    <p className="text-sm mt-1">{acomp.destaque}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumo Estratégico */}
      {ultimoAcompanhamento && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-petrol" />
              Resumo Estratégico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Pontos Fortes Desenvolvidos</h4>
                <p className="text-sm text-gray-700">
                  {ultimoAcompanhamento.pontos_fortes_desenvolvidos || 'Não informado'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Gargalos Atuais</h4>
                <p className="text-sm text-gray-700">
                  {ultimoAcompanhamento.gargalos_atuais || 'Não informado'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Estratégias Validadas</h4>
                <p className="text-sm text-gray-700">
                  {ultimoAcompanhamento.estrategias_validadas || 'Não informado'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Este projeto virou um case?
                </h4>
                <div className="flex items-center gap-2">
                  <Badge variant={ultimoAcompanhamento.virou_case ? "default" : "secondary"}>
                    {ultimoAcompanhamento.virou_case ? "Sim" : "Não"}
                  </Badge>
                </div>
                {ultimoAcompanhamento.virou_case && ultimoAcompanhamento.destaque_case && (
                  <p className="text-sm text-gray-700 mt-2">
                    {ultimoAcompanhamento.destaque_case}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botões Finais */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button className="bg-petrol hover:bg-petrol/90 text-white">
          <Download className="mr-2 h-4 w-4" />
          Baixar PDF
        </Button>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Editar
        </Button>
        <Button variant="outline" onClick={() => navigate('/acompanhamento')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar à lista de clientes
        </Button>
      </div>
    </div>
  );
};

export default EvolucaoClienteDetalhada;
