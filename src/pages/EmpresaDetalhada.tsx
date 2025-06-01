
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/components/ui/back-button';
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
  Award
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart as RechartsLineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

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
    
    return parsedAcoes.filter(acao => {
      return acao && 
             typeof acao === 'object' && 
             acao !== null && 
             'status' in acao && 
             acao.status === 'concluido';
    }).length;
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

  const getAcoesList = (acoes: any) => {
    if (!acoes) return [];
    
    let parsedAcoes = acoes;
    if (typeof acoes === 'string') {
      try {
        parsedAcoes = JSON.parse(acoes);
      } catch {
        return [];
      }
    }
    
    if (!Array.isArray(parsedAcoes)) return [];
    
    return parsedAcoes.filter(acao => acao && typeof acao === 'object' && acao !== null);
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
            Empresa: {empresaSelecionada.nome}
          </h1>
          <p className="text-gray-600 mt-1">
            Acompanhe os dados evolutivos de forma individual. Tudo o que foi registrado ao longo do projeto está aqui.
          </p>
        </div>
        <BackButton fallbackRoute="/acompanhamento" />
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

        {/* Faturamento por Mês */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-petrol" />
              Faturamento por Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ faturamento: { label: "Faturamento", color: "#3C9CD6" } }} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosGraficoFaturamento}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="faturamento" fill="var(--color-faturamento)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detalhes dos Check-ups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-petrol" />
            Detalhes dos Check-ups
          </CardTitle>
          <CardDescription>
            Cada entrada registrada mensalmente com dados estratégicos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {checkupsEmpresa && checkupsEmpresa.length > 0 ? (
              checkupsEmpresa.map((checkup, index) => (
                <div key={checkup.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Mês de Referência</span>
                      <p className="text-lg font-semibold text-petrol">{formatDate(checkup.mes)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Score Geral</span>
                      <p className="text-lg font-semibold">{checkup.score_geral}%</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">ROI Estimado</span>
                      <p className="text-lg font-semibold">{checkup.roi ? `${checkup.roi}x` : 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Faturamento</span>
                      <p className="text-lg font-semibold">
                        {checkup.faturamento ? formatCurrency(Number(checkup.faturamento)) : 'N/A'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-sm font-medium text-gray-600">Destaque do Mês</span>
                      <p className="text-sm mt-1">{checkup.destaque || 'Nenhum destaque registrado'}</p>
                    </div>
                  </div>

                  {/* Ações do Mês */}
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-600 mb-2 block">Ações do Mês</span>
                    <div className="space-y-2">
                      {getAcoesList(checkup.acoes).map((acao, acaoIndex) => (
                        <div key={acaoIndex} className="flex items-center gap-2 text-sm">
                          {getStatusIcon(acao.status)}
                          <span className={acao.status === 'concluido' ? 'text-green-700' : 'text-gray-700'}>
                            {acao.descricao || 'Ação sem descrição'}
                          </span>
                          <Badge variant={acao.status === 'concluido' ? 'default' : 'secondary'}>
                            {acao.status === 'concluido' ? 'Concluído' : 
                             acao.status === 'em_andamento' ? 'Em Andamento' : 'Pendente'}
                          </Badge>
                        </div>
                      ))}
                      {getAcoesList(checkup.acoes).length === 0 && (
                        <p className="text-sm text-gray-500">Nenhuma ação registrada para este mês</p>
                      )}
                    </div>
                  </div>

                  {/* Observações do Consultor */}
                  <div>
                    <span className="text-sm font-medium text-gray-600">Observações do Consultor</span>
                    <p className="text-sm mt-1 text-gray-700">
                      {checkup.observacoes || 'Nenhuma observação registrada'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum check-up registrado para esta empresa.</p>
              </div>
            )}
          </div>
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
