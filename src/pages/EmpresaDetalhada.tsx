
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/components/ui/back-button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  ArrowLeft, 
  Building2, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  BarChart3, 
  LineChart, 
  Calendar,
  Target,
  Award,
  FileText,
  BarChart,
  TrendingUp,
  Settings
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart as RechartsLineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const EmpresaDetalhada = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Buscar dados da empresa
  const { data: empresaSelecionada, isLoading: loadingEmpresa } = useQuery({
    queryKey: ['empresa', id],
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

  // Buscar check-ups da empresa
  const { data: checkupsEmpresa, isLoading: loadingCheckups } = useQuery({
    queryKey: ['checkups-empresa', id],
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
      return format(dateObj, 'MMM/yyyy', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  const formatDateFull = (date: string | Date) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  // Funções de cálculo para os cards
  const calcularVariacao = (checkups: any[], campo: string) => {
    if (!checkups || checkups.length < 2) return 0;
    const primeiro = checkups[0][campo] || 0;
    const ultimo = checkups[checkups.length - 1][campo] || 0;
    if (primeiro === 0) return 0;
    return Math.round(((ultimo - primeiro) / primeiro) * 100);
  };

  const calcularMedia = (checkups: any[], campo: string) => {
    if (!checkups || checkups.length === 0) return 0;
    const valores = checkups.filter(c => c[campo]).map(c => Number(c[campo]));
    if (valores.length === 0) return 0;
    return Number((valores.reduce((sum, val) => sum + val, 0) / valores.length).toFixed(2));
  };

  const calcularSomaAcoes = (checkups: any[]) => {
    if (!checkups) return 0;
    
    return checkups.reduce((total, checkup) => {
      if (!checkup.acoes) return total;
      
      let parsedAcoes = checkup.acoes;
      if (typeof checkup.acoes === 'string') {
        try {
          parsedAcoes = JSON.parse(checkup.acoes);
        } catch {
          return total;
        }
      }
      
      if (!Array.isArray(parsedAcoes)) return total;
      
      return total + parsedAcoes.filter(acao => {
        return acao && 
               typeof acao === 'object' && 
               acao !== null && 
               'status' in acao && 
               acao.status === 'concluido';
      }).length;
    }, 0);
  };

  const getAcoesCount = (acoes: any) => {
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
    
    return parsedAcoes.filter(acao => {
      return acao && 
             typeof acao === 'object' && 
             acao !== null && 
             'status' in acao && 
             acao.status === 'concluido';
    }).length;
  };

  // Preparar dados para gráficos
  const dadosGraficoScore = checkupsEmpresa?.map(checkup => ({
    mes: formatDate(checkup.mes),
    score: checkup.score_geral
  })) || [];

  const dadosGraficoFaturamento = checkupsEmpresa?.map(checkup => ({
    mes: formatDate(checkup.mes),
    faturamento: checkup.faturamento || 0
  })) || [];

  // Dados para resumo estratégico (último check-up)
  const ultimoCheckup = checkupsEmpresa?.[checkupsEmpresa.length - 1];

  if (loadingEmpresa || loadingCheckups) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petrol mx-auto mb-4"></div>
          <p>Carregando dados da empresa...</p>
        </div>
      </div>
    );
  }

  if (!empresaSelecionada) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Empresa não encontrada</h2>
        <BackButton fallbackRoute="/acompanhamento" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Building2 className="h-8 w-8 text-petrol" />
            🏢 Empresa: {empresaSelecionada.nome}
          </h1>
          <p className="text-gray-600 mt-1">
            Acompanhe todos os dados de evolução do projeto deste cliente de forma centralizada.
          </p>
        </div>
        <BackButton fallbackRoute="/acompanhamento" />
      </div>

      {/* Cards de Métricas - 4 colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-petrol">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Check-ups</p>
                <p className="text-2xl font-bold text-petrol">{checkupsEmpresa?.length || 0}</p>
                <p className="text-xs text-gray-500">Check-ups realizados</p>
              </div>
              <FileText className="h-8 w-8 text-petrol" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-400">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Crescimento do Score</p>
                <p className="text-2xl font-bold text-blue-600">
                  {calcularVariacao(checkupsEmpresa || [], 'score_geral')}%
                </p>
                <p className="text-xs text-gray-500">Desde o primeiro check-up</p>
              </div>
              <BarChart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ROI Médio</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {calcularMedia(checkupsEmpresa || [], 'roi')}x
                </p>
                <p className="text-xs text-gray-500">Retorno sobre investimento</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ações Concluídas</p>
                <p className="text-2xl font-bold text-green-600">
                  {calcularSomaAcoes(checkupsEmpresa || [])}
                </p>
                <p className="text-xs text-gray-500">Ações estratégicas finalizadas</p>
              </div>
              <Settings className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolução do Score Geral */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-petrol" />
              Evolução do Score Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ score: { label: "Score", color: "#0F3244" } }} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={dadosGraficoScore}>
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

        {/* Faturamento Mensal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-petrol" />
              Faturamento Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ faturamento: { label: "Faturamento", color: "#3C9CD6" } }} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={dadosGraficoFaturamento}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="faturamento" fill="var(--color-faturamento)" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Histórico de Check-ups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-petrol" />
            Histórico de Check-ups
          </CardTitle>
          <CardDescription>
            Todos os check-ups registrados para esta empresa em formato tabular.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mês</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>ROI</TableHead>
                <TableHead>Faturamento</TableHead>
                <TableHead>Destaque</TableHead>
                <TableHead>Ações</TableHead>
                <TableHead>Observações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkupsEmpresa && checkupsEmpresa.length > 0 ? (
                checkupsEmpresa.map((checkup) => (
                  <TableRow key={checkup.id}>
                    <TableCell className="font-medium">
                      {formatDateFull(checkup.mes)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{checkup.score_geral}%</Badge>
                    </TableCell>
                    <TableCell>
                      {checkup.roi ? `${checkup.roi}x` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {checkup.faturamento ? formatCurrency(Number(checkup.faturamento)) : 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {checkup.destaque || 'Não informado'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getAcoesCount(checkup.acoes)} concluídas
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {checkup.observacoes || 'Nenhuma observação'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Nenhum check-up registrado para esta empresa.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Resumo Estratégico */}
      {ultimoCheckup && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-petrol" />
              🔎 Resumo Estratégico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Pontos Fortes Desenvolvidos</h4>
                <p className="text-sm text-gray-700">
                  {ultimoCheckup.pontos_fortes_desenvolvidos || 'Não informado'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Gargalos Atuais</h4>
                <p className="text-sm text-gray-700">
                  {ultimoCheckup.gargalos_atuais || 'Não informado'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Estratégias Validadas</h4>
                <p className="text-sm text-gray-700">
                  {ultimoCheckup.estrategias_validadas || 'Não informado'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Projeto virou um case?
                </h4>
                <div className="flex items-center gap-2">
                  <Badge variant={ultimoCheckup.virou_case ? "default" : "secondary"}>
                    {ultimoCheckup.virou_case ? "Sim" : "Não"}
                  </Badge>
                </div>
                {ultimoCheckup.virou_case && ultimoCheckup.destaque_case && (
                  <div className="mt-3">
                    <h5 className="font-medium text-sm mb-1">Destaques do Case:</h5>
                    <p className="text-sm text-gray-700">
                      {ultimoCheckup.destaque_case}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botão Voltar */}
      <div className="flex justify-center">
        <Button 
          onClick={() => navigate('/acompanhamento')} 
          className="bg-petrol hover:bg-petrol/90 text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Acompanhamento
        </Button>
      </div>
    </div>
  );
};

export default EmpresaDetalhada;
