
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowUp, ArrowDown, TrendingUp, FileText, Calendar, Building2, CheckCircle, Clock, AlertCircle, Users, BarChart3, LineChart, Target, Download, MessageCircle, ArrowLeft, Plus } from 'lucide-react';
import { BackButton } from '@/components/ui/back-button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart as RechartsLineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const EvolucaoCliente = () => {
  const { id } = useParams<{ id: string }>();
  const [filters, setFilters] = useState({
    mes: '',
    scoreMinimo: '',
    faturamentoMinimo: '',
    roiMinimo: '',
    palavraChave: ''
  });

  // Buscar dados da empresa
  const { data: empresa, isLoading: loadingEmpresa } = useQuery({
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

  // Buscar acompanhamentos da empresa
  const { data: acompanhamentos, isLoading: loadingAcompanhamentos } = useQuery({
    queryKey: ['acompanhamentos-empresa', id],
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

  // Buscar diagnóstico inicial
  const { data: diagnosticoInicial } = useQuery({
    queryKey: ['diagnostico-inicial', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('diagnosticos')
        .select('*')
        .eq('empresa_id', id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();
      
      if (error) return null;
      return data;
    },
    enabled: !!id
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'MMMM/yyyy', { locale: ptBR });
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

  const getVariacaoScore = (atual: number, anterior: number) => {
    const variacao = atual - anterior;
    return {
      valor: variacao,
      tipo: variacao > 0 ? 'positiva' : variacao < 0 ? 'negativa' : 'neutra',
      icone: variacao > 0 ? ArrowUp : variacao < 0 ? ArrowDown : null
    };
  };

  // Filtrar acompanhamentos
  const acompanhamentosFiltrados = acompanhamentos?.filter(acomp => {
    if (filters.mes && !formatDate(acomp.mes).toLowerCase().includes(filters.mes.toLowerCase())) return false;
    if (filters.scoreMinimo && acomp.score_geral < parseInt(filters.scoreMinimo)) return false;
    if (filters.faturamentoMinimo && (!acomp.faturamento || acomp.faturamento < parseFloat(filters.faturamentoMinimo))) return false;
    if (filters.roiMinimo && (!acomp.roi || acomp.roi < parseFloat(filters.roiMinimo))) return false;
    if (filters.palavraChave) {
      const palavra = filters.palavraChave.toLowerCase();
      const destaque = acomp.destaque?.toLowerCase() || '';
      const observacoes = acomp.observacoes?.toLowerCase() || '';
      if (!destaque.includes(palavra) && !observacoes.includes(palavra)) return false;
    }
    return true;
  }) || [];

  // Preparar dados para gráficos
  const dadosGrafico = acompanhamentos?.map(acomp => ({
    mes: formatDate(acomp.mes),
    score: acomp.score_geral,
    faturamento: acomp.faturamento || 0,
    roi: acomp.roi || 0
  })) || [];

  const clearFilters = () => {
    setFilters({
      mes: '',
      scoreMinimo: '',
      faturamentoMinimo: '',
      roiMinimo: '',
      palavraChave: ''
    });
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Evolução do Cliente</h1>
          <p className="text-gray-600 mt-1">Acompanhamento detalhado da evolução empresarial</p>
        </div>
        <BackButton fallbackRoute="/acompanhamento" />
      </div>

      {/* Bloco de Identificação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-petrol" />
            {empresa.nome}
          </CardTitle>
          <CardDescription>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Ativo
              </Badge>
              <span className="text-sm text-gray-600">
                Data de entrada: {format(new Date(empresa.created_at), 'dd/MM/yyyy', { locale: ptBR })}
              </span>
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
              Ver Diagnóstico Inicial
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Gerar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos de Evolução */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Geral */}
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

      {/* Painel de Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-petrol" />
            Filtros de Acompanhamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="mes">Mês de Referência</Label>
              <Input
                id="mes"
                placeholder="Ex: janeiro/2024"
                value={filters.mes}
                onChange={(e) => setFilters(prev => ({ ...prev, mes: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="score">Score Mínimo</Label>
              <Input
                id="score"
                type="number"
                placeholder="Ex: 70"
                value={filters.scoreMinimo}
                onChange={(e) => setFilters(prev => ({ ...prev, scoreMinimo: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="faturamento">Faturamento Mín.</Label>
              <Input
                id="faturamento"
                type="number"
                placeholder="Ex: 50000"
                value={filters.faturamentoMinimo}
                onChange={(e) => setFilters(prev => ({ ...prev, faturamentoMinimo: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="roi">ROI Mínimo</Label>
              <Input
                id="roi"
                type="number"
                step="0.1"
                placeholder="Ex: 1.5"
                value={filters.roiMinimo}
                onChange={(e) => setFilters(prev => ({ ...prev, roiMinimo: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="palavra">Palavra-chave</Label>
              <Input
                id="palavra"
                placeholder="Buscar..."
                value={filters.palavraChave}
                onChange={(e) => setFilters(prev => ({ ...prev, palavraChave: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Boards de Evolução Mensal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-petrol" />
            Evolução Mensal - Cards Visuais
          </CardTitle>
          <CardDescription>
            Acompanhamentos mensais organizados cronologicamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {acompanhamentosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {acompanhamentosFiltrados.map((acomp, index) => {
                const anterior = index > 0 ? acompanhamentosFiltrados[index - 1] : null;
                const variacao = anterior ? getVariacaoScore(acomp.score_geral, anterior.score_geral) : null;

                return (
                  <Card key={acomp.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Header do Card */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{formatDate(acomp.mes)}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-2xl font-bold text-petrol">{acomp.score_geral}%</span>
                              {variacao && variacao.icone && (
                                <div className={`flex items-center gap-1 text-sm ${
                                  variacao.tipo === 'positiva' ? 'text-green-600' : 
                                  variacao.tipo === 'negativa' ? 'text-red-600' : 'text-gray-600'
                                }`}>
                                  <variacao.icone className="h-4 w-4" />
                                  <span>{Math.abs(variacao.valor)}%</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Métricas */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Faturamento:</span>
                            <div className="font-semibold">
                              {acomp.faturamento ? formatCurrency(acomp.faturamento) : 'N/A'}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">ROI:</span>
                            <div className="font-semibold">{acomp.roi || 'N/A'}x</div>
                          </div>
                        </div>

                        {/* Destaque */}
                        {acomp.destaque && (
                          <div>
                            <span className="text-gray-600 text-sm">Destaque do Mês:</span>
                            <p className="text-sm mt-1 line-clamp-3">{acomp.destaque}</p>
                          </div>
                        )}

                        {/* Ações */}
                        <div>
                          <span className="text-gray-600 text-sm">Ações Concluídas:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="font-semibold">{getAcoesConcluidasCount(acomp.acoes)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhum acompanhamento encontrado com os filtros aplicados
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Recomendações e Ações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-petrol" />
            Recomendações e Ações
          </CardTitle>
        </CardHeader>
        <CardContent>
          {acompanhamentos && acompanhamentos.length > 0 ? (
            <div className="space-y-4">
              {acompanhamentos.slice(-3).map((acomp) => (
                <div key={acomp.id} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{formatDate(acomp.mes)}</h4>
                  {acomp.recomendacoes && (
                    <div className="mb-3">
                      <span className="text-sm text-gray-600">Recomendações:</span>
                      <p className="text-sm mt-1">{acomp.recomendacoes}</p>
                    </div>
                  )}
                  {acomp.acoes && (
                    <div>
                      <span className="text-sm text-gray-600">Ações do Mês:</span>
                      <div className="mt-2 space-y-2">
                        {JSON.parse(acomp.acoes).map((acao: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {acao.status === 'concluido' ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : acao.status === 'em_andamento' ? (
                              <Clock className="h-4 w-4 text-yellow-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span>{acao.descricao || acao.titulo}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">Nenhuma recomendação ou ação registrada</p>
          )}
        </CardContent>
      </Card>

      {/* Resumo Estratégico */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-petrol" />
            Resumo Estratégico da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          {acompanhamentos && acompanhamentos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Pontos Fortes Desenvolvidos</h4>
                <p className="text-sm text-gray-700">
                  {acompanhamentos[acompanhamentos.length - 1]?.pontos_fortes_desenvolvidos || 'Não informado'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Gargalos Atuais</h4>
                <p className="text-sm text-gray-700">
                  {acompanhamentos[acompanhamentos.length - 1]?.gargalos_atuais || 'Não informado'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Estratégias Validadas</h4>
                <p className="text-sm text-gray-700">
                  {acompanhamentos[acompanhamentos.length - 1]?.estrategias_validadas || 'Não informado'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Este projeto virou um case?</h4>
                <div className="flex items-center gap-2">
                  <Badge variant={acompanhamentos[acompanhamentos.length - 1]?.virou_case ? "default" : "secondary"}>
                    {acompanhamentos[acompanhamentos.length - 1]?.virou_case ? "Sim" : "Não"}
                  </Badge>
                </div>
                {acompanhamentos[acompanhamentos.length - 1]?.destaque_case && (
                  <p className="text-sm text-gray-700 mt-2">
                    {acompanhamentos[acompanhamentos.length - 1]?.destaque_case}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">Nenhum dado estratégico disponível</p>
          )}
        </CardContent>
      </Card>

      {/* Botões Finais */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button className="bg-petrol hover:bg-petrol/90 text-white">
          <Download className="mr-2 h-4 w-4" />
          Gerar Relatório PDF
        </Button>
        <Button variant="outline">
          <MessageCircle className="mr-2 h-4 w-4" />
          Enviar por WhatsApp
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar à Lista de Clientes
        </Button>
      </div>
    </div>
  );
};

export default EvolucaoCliente;
