import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Minus, Calendar, BarChart, Plus, Eye, Target, Brain } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Acompanhamento = () => {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedDiagnostics, setSelectedDiagnostics] = useState<string[]>([]);
  const [showCheckupForm, setShowCheckupForm] = useState(false);
  
  // Form states
  const [checkupData, setCheckupData] = useState({
    mes_referencia: '',
    nome_empresa: '',
    score_geral: '',
    faturamento_atual: '',
    roi_estimado: '',
    destaque_mes: '',
    recomendacoes: '',
    evolucao_categorias: [{ categoria: '', score_anterior: '', score_atual: '', observacoes: '' }],
    acoes_mes: [{ acao: '', status: 'pendente' }],
    observacoes_consultor: '',
    is_case: false,
    destaques_case: ''
  });

  const mockCompanies = [
    { id: '1', name: 'Tech Solutions LTDA' },
    { id: '2', name: 'Marketing Digital Pro' },
    { id: '3', name: 'Inovação & Estratégia' },
    { id: '4', name: 'Consultoria Business' }
  ];

  const mockDiagnosticHistory = [
    {
      id: '1',
      date: '2024-01-15',
      type: 'Diagnóstico Completo',
      overallScore: 78,
      categoryScores: {
        Marketing: 85,
        Vendas: 70,
        Estratégia: 75,
        Gestão: 82
      }
    },
    {
      id: '2',
      date: '2023-10-20',
      type: 'Diagnóstico Inicial',
      overallScore: 65,
      categoryScores: {
        Marketing: 60,
        Vendas: 55,
        Estratégia: 70,
        Gestão: 75
      }
    },
    {
      id: '3',
      date: '2023-07-10',
      type: 'Avaliação Básica',
      overallScore: 52,
      categoryScores: {
        Marketing: 45,
        Vendas: 50,
        Estratégia: 60,
        Gestão: 55
      }
    }
  ];

  const mockCheckups = [
    {
      id: '1',
      mes_referencia: '2024-01',
      nome_empresa: 'Tech Solutions LTDA',
      score_geral: 85,
      faturamento_atual: 150000,
      roi_estimado: 2.5,
      destaque_mes: 'Implementação do novo CRM aumentou conversão em 30%',
      acoes_concluidas: 8,
      recomendacoes: 'Focar em automação de vendas para o próximo mês'
    },
    {
      id: '2',
      mes_referencia: '2024-02',
      nome_empresa: 'Marketing Digital Pro',
      score_geral: 78,
      faturamento_atual: 95000,
      roi_estimado: 1.8,
      destaque_mes: 'Campanhas de mídia paga geraram 40% mais leads',
      acoes_concluidas: 6,
      recomendacoes: 'Otimizar funil de vendas e melhorar qualificação de leads'
    }
  ];

  const getScoreVariation = (current: number, previous: number) => {
    const diff = current - previous;
    if (diff > 0) return { icon: TrendingUp, color: 'text-green-600', text: `+${diff}%`, bg: 'bg-green-50' };
    if (diff < 0) return { icon: TrendingDown, color: 'text-red-600', text: `${diff}%`, bg: 'bg-red-50' };
    return { icon: Minus, color: 'text-gray-600', text: '0%', bg: 'bg-gray-50' };
  };

  const handleCompareSelected = () => {
    if (selectedDiagnostics.length !== 2) {
      toast({
        title: "Seleção incompleta",
        description: "Selecione exatamente 2 diagnósticos para comparar.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Comparativo gerado",
      description: "PDF de comparação foi gerado com sucesso!"
    });
  };

  const handleSaveCheckup = () => {
    toast({
      title: "Check-up salvo",
      description: "Acompanhamento mensal registrado com sucesso!"
    });
    setShowCheckupForm(false);
    setCheckupData({
      mes_referencia: '',
      nome_empresa: '',
      score_geral: '',
      faturamento_atual: '',
      roi_estimado: '',
      destaque_mes: '',
      recomendacoes: '',
      evolucao_categorias: [{ categoria: '', score_anterior: '', score_atual: '', observacoes: '' }],
      acoes_mes: [{ acao: '', status: 'pendente' }],
      observacoes_consultor: '',
      is_case: false,
      destaques_case: ''
    });
  };

  const addEvolucaoCategoria = () => {
    setCheckupData(prev => ({
      ...prev,
      evolucao_categorias: [...prev.evolucao_categorias, { categoria: '', score_anterior: '', score_atual: '', observacoes: '' }]
    }));
  };

  const addAcaoMes = () => {
    setCheckupData(prev => ({
      ...prev,
      acoes_mes: [...prev.acoes_mes, { acao: '', status: 'pendente' }]
    }));
  };

  const renderTimeline = () => {
    if (!selectedCompany) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-petrol" />
            Linha do Tempo - {mockCompanies.find(c => c.id === selectedCompany)?.name}
          </CardTitle>
          <CardDescription>
            Histórico de diagnósticos realizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockDiagnosticHistory.map((diagnostic, index) => (
              <div key={diagnostic.id} className="relative">
                {/* Timeline line */}
                {index < mockDiagnosticHistory.length - 1 && (
                  <div className="absolute left-4 top-12 w-0.5 h-16 bg-gray-200"></div>
                )}
                
                <div className="flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className="w-8 h-8 rounded-full bg-petrol flex items-center justify-center text-white text-sm font-medium">
                    {index + 1}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{diagnostic.type}</h4>
                        <p className="text-sm text-gray-600">{new Date(diagnostic.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-petrol">{diagnostic.overallScore}%</div>
                        {index > 0 && (
                          <div className="text-sm text-gray-600">
                            vs anterior: {getScoreVariation(diagnostic.overallScore, mockDiagnosticHistory[index - 1].overallScore).text}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Category scores */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      {Object.entries(diagnostic.categoryScores).map(([category, score]) => {
                        const previousScore = index > 0 ? mockDiagnosticHistory[index - 1].categoryScores[category as keyof typeof mockDiagnosticHistory[0]['categoryScores']] : score;
                        const variation = getScoreVariation(score, previousScore);
                        const VariationIcon = variation.icon;
                        
                        return (
                          <div key={category} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{category}</span>
                              <div className={`flex items-center gap-1 px-2 py-1 rounded ${variation.bg}`}>
                                <VariationIcon className={`h-3 w-3 ${variation.color}`} />
                                <span className={`text-xs ${variation.color}`}>{variation.text}</span>
                              </div>
                            </div>
                            <Progress value={score} className="h-2" />
                            <span className="text-xs text-gray-600">{score}%</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Select for comparison */}
                    <div className="mt-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedDiagnostics.includes(diagnostic.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (selectedDiagnostics.length < 2) {
                                setSelectedDiagnostics([...selectedDiagnostics, diagnostic.id]);
                              } else {
                                toast({
                                  title: "Limite atingido",
                                  description: "Você pode selecionar no máximo 2 diagnósticos.",
                                  variant: "destructive"
                                });
                              }
                            } else {
                              setSelectedDiagnostics(selectedDiagnostics.filter(id => id !== diagnostic.id));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-600">Selecionar para comparação</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderComparison = () => {
    if (selectedDiagnostics.length !== 2) return null;

    const diagnostic1 = mockDiagnosticHistory.find(d => d.id === selectedDiagnostics[0]);
    const diagnostic2 = mockDiagnosticHistory.find(d => d.id === selectedDiagnostics[1]);

    if (!diagnostic1 || !diagnostic2) return null;

    // Ensure we're comparing with the newer one first
    const [newer, older] = diagnostic1.date > diagnostic2.date ? [diagnostic1, diagnostic2] : [diagnostic2, diagnostic1];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-petrol" />
            Comparativo Detalhado
          </CardTitle>
          <CardDescription>
            Comparação entre {new Date(older.date).toLocaleDateString('pt-BR')} e {new Date(newer.date).toLocaleDateString('pt-BR')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Score Comparison */}
          <div className="text-center">
            <h4 className="font-medium text-gray-900 mb-4">Score Geral</h4>
            <div className="flex justify-center items-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">{older.overallScore}%</div>
                <div className="text-sm text-gray-500">Anterior</div>
              </div>
              <div className="text-center">
                <div className="text-lg text-gray-400">→</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-petrol">{newer.overallScore}%</div>
                <div className="text-sm text-gray-500">Atual</div>
              </div>
            </div>
            <div className="mt-4">
              {(() => {
                const variation = getScoreVariation(newer.overallScore, older.overallScore);
                const VariationIcon = variation.icon;
                return (
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${variation.bg}`}>
                    <VariationIcon className={`h-5 w-5 ${variation.color}`} />
                    <span className={`font-medium ${variation.color}`}>
                      Variação: {variation.text}
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Category Comparison */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Comparação por Categoria</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(newer.categoryScores).map(category => {
                const olderScore = older.categoryScores[category as keyof typeof older.categoryScores];
                const newerScore = newer.categoryScores[category as keyof typeof newer.categoryScores];
                const variation = getScoreVariation(newerScore, olderScore);
                const VariationIcon = variation.icon;

                return (
                  <div key={category} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">{category}</h5>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded ${variation.bg}`}>
                        <VariationIcon className={`h-3 w-3 ${variation.color}`} />
                        <span className={`text-xs ${variation.color}`}>{variation.text}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Anterior: {olderScore}%</span>
                        <span>Atual: {newerScore}%</span>
                      </div>
                      <div className="relative">
                        <Progress value={Math.max(olderScore, newerScore)} className="h-3" />
                        <div 
                          className="absolute top-0 h-3 bg-gray-300 rounded-full opacity-50"
                          style={{ width: `${Math.min(olderScore, newerScore)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <Button 
              onClick={handleCompareSelected}
              className="bg-petrol hover:bg-petrol/90 text-white"
            >
              📄 Gerar PDF Comparativo
            </Button>
            <Button variant="outline">
              📤 Enviar por WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Acompanhamento</h1>
        <p className="text-gray-600 mt-1">Monitore a evolução das empresas ao longo do tempo</p>
      </div>

      {/* Strategic Monthly Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-petrol" />
            📈 Acompanhamento Estratégico Mensal
          </CardTitle>
          <CardDescription>
            Registre e acompanhe mensalmente a evolução dos projetos dos clientes com base nos diagnósticos e ações implementadas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => setShowCheckupForm(!showCheckupForm)}
            className="bg-petrol hover:bg-petrol/90 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            ➕ Novo Check-up Mensal
          </Button>

          {showCheckupForm && (
            <div className="mt-6 space-y-6 p-6 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold">➕ Novo Check-up Mensal</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mes_referencia">Mês de Referência</Label>
                  <Input
                    id="mes_referencia"
                    type="month"
                    value={checkupData.mes_referencia}
                    onChange={(e) => setCheckupData(prev => ({ ...prev, mes_referencia: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="nome_empresa">Nome da Empresa</Label>
                  <Input
                    id="nome_empresa"
                    value={checkupData.nome_empresa}
                    onChange={(e) => setCheckupData(prev => ({ ...prev, nome_empresa: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="score_geral">Score Geral (%)</Label>
                  <Input
                    id="score_geral"
                    type="number"
                    min="0"
                    max="100"
                    value={checkupData.score_geral}
                    onChange={(e) => setCheckupData(prev => ({ ...prev, score_geral: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="faturamento_atual">Faturamento Atual (R$)</Label>
                  <Input
                    id="faturamento_atual"
                    type="number"
                    value={checkupData.faturamento_atual}
                    onChange={(e) => setCheckupData(prev => ({ ...prev, faturamento_atual: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="roi_estimado">ROI Estimado (ex: 2.5x)</Label>
                  <Input
                    id="roi_estimado"
                    type="number"
                    step="0.1"
                    value={checkupData.roi_estimado}
                    onChange={(e) => setCheckupData(prev => ({ ...prev, roi_estimado: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="destaque_mes">Destaque do Mês</Label>
                  <Input
                    id="destaque_mes"
                    value={checkupData.destaque_mes}
                    onChange={(e) => setCheckupData(prev => ({ ...prev, destaque_mes: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="recomendacoes">Recomendações para o Próximo Ciclo</Label>
                <Textarea
                  id="recomendacoes"
                  rows={4}
                  value={checkupData.recomendacoes}
                  onChange={(e) => setCheckupData(prev => ({ ...prev, recomendacoes: e.target.value }))}
                  placeholder="• Recomendação 1&#10;• Recomendação 2&#10;• Recomendação 3"
                />
              </div>

              {/* Evolução por Categoria */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Evolução por Categoria</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addEvolucaoCategoria}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {checkupData.evolucao_categorias.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded">
                    <div>
                      <Label>Categoria</Label>
                      <Input
                        value={item.categoria}
                        onChange={(e) => {
                          const newItems = [...checkupData.evolucao_categorias];
                          newItems[index].categoria = e.target.value;
                          setCheckupData(prev => ({ ...prev, evolucao_categorias: newItems }));
                        }}
                      />
                    </div>
                    <div>
                      <Label>Score Anterior (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={item.score_anterior}
                        onChange={(e) => {
                          const newItems = [...checkupData.evolucao_categorias];
                          newItems[index].score_anterior = e.target.value;
                          setCheckupData(prev => ({ ...prev, evolucao_categorias: newItems }));
                        }}
                      />
                    </div>
                    <div>
                      <Label>Score Atual (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={item.score_atual}
                        onChange={(e) => {
                          const newItems = [...checkupData.evolucao_categorias];
                          newItems[index].score_atual = e.target.value;
                          setCheckupData(prev => ({ ...prev, evolucao_categorias: newItems }));
                        }}
                      />
                    </div>
                    <div>
                      <Label>Observações</Label>
                      <Input
                        value={item.observacoes}
                        onChange={(e) => {
                          const newItems = [...checkupData.evolucao_categorias];
                          newItems[index].observacoes = e.target.value;
                          setCheckupData(prev => ({ ...prev, evolucao_categorias: newItems }));
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Ações do Mês */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Ações do Mês</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addAcaoMes}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {checkupData.acoes_mes.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded">
                    <div>
                      <Label>Ação</Label>
                      <Input
                        value={item.acao}
                        onChange={(e) => {
                          const newItems = [...checkupData.acoes_mes];
                          newItems[index].acao = e.target.value;
                          setCheckupData(prev => ({ ...prev, acoes_mes: newItems }));
                        }}
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={item.status}
                        onValueChange={(value) => {
                          const newItems = [...checkupData.acoes_mes];
                          newItems[index].status = value;
                          setCheckupData(prev => ({ ...prev, acoes_mes: newItems }));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="em_andamento">Em Andamento</SelectItem>
                          <SelectItem value="concluido">Concluído</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <Label htmlFor="observacoes_consultor">Observações do Consultor</Label>
                <Textarea
                  id="observacoes_consultor"
                  rows={4}
                  value={checkupData.observacoes_consultor}
                  onChange={(e) => setCheckupData(prev => ({ ...prev, observacoes_consultor: e.target.value }))}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_case"
                    checked={checkupData.is_case}
                    onChange={(e) => setCheckupData(prev => ({ ...prev, is_case: e.target.checked }))}
                  />
                  <Label htmlFor="is_case">Este projeto virou um case?</Label>
                </div>

                {checkupData.is_case && (
                  <div>
                    <Label htmlFor="destaques_case">Destaques do Case</Label>
                    <Textarea
                      id="destaques_case"
                      rows={4}
                      value={checkupData.destaques_case}
                      onChange={(e) => setCheckupData(prev => ({ ...prev, destaques_case: e.target.value }))}
                    />
                  </div>
                )}
              </div>

              <Button onClick={handleSaveCheckup} className="bg-petrol hover:bg-petrol/90 text-white">
                Salvar Check-up
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historical Check-ups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-petrol" />
            📆 Histórico de Check-ups
          </CardTitle>
          <CardDescription>
            Cards mensais com os dados principais de cada acompanhamento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockCheckups.map((checkup) => (
              <Card key={checkup.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{checkup.nome_empresa}</h4>
                      <p className="text-sm text-gray-600">{checkup.mes_referencia}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Score Geral:</span>
                        <div className="font-semibold text-petrol">{checkup.score_geral}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Faturamento:</span>
                        <div className="font-semibold">R$ {checkup.faturamento_atual.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">ROI:</span>
                        <div className="font-semibold">{checkup.roi_estimado}x</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Ações:</span>
                        <div className="font-semibold">{checkup.acoes_concluidas} concluídas</div>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-600 text-sm">Destaque:</span>
                      <p className="text-sm mt-1">{checkup.destaque_mes}</p>
                    </div>

                    <div>
                      <span className="text-gray-600 text-sm">Recomendações:</span>
                      <p className="text-sm mt-1">{checkup.recomendacoes}</p>
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Consolidated Evolution Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-petrol" />
            📊 Evolução Consolidada
          </CardTitle>
          <CardDescription>
            Comparativo mês a mês da performance dos projetos acompanhados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Mês</TableHead>
                <TableHead>Score Geral</TableHead>
                <TableHead>Faturamento</TableHead>
                <TableHead>ROI</TableHead>
                <TableHead>Destaque</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCheckups.map((checkup) => (
                <TableRow key={checkup.id}>
                  <TableCell className="font-medium">{checkup.nome_empresa}</TableCell>
                  <TableCell>{checkup.mes_referencia}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-petrol">
                      {checkup.score_geral}%
                    </Badge>
                  </TableCell>
                  <TableCell>R$ {checkup.faturamento_atual.toLocaleString()}</TableCell>
                  <TableCell>{checkup.roi_estimado}x</TableCell>
                  <TableCell className="max-w-xs truncate">{checkup.destaque_mes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Strategic Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-petrol" />
            🧠 Resumo Estratégico
          </CardTitle>
          <CardDescription>
            Observações gerais extraídas dos acompanhamentos realizados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="pontos_fortes">Pontos Fortes Desenvolvidos</Label>
            <Textarea
              id="pontos_fortes"
              rows={4}
              placeholder="Descreva os principais pontos fortes que foram desenvolvidos nos projetos..."
            />
          </div>

          <div>
            <Label htmlFor="gargalos_atuais">Gargalos Atuais</Label>
            <Textarea
              id="gargalos_atuais"
              rows={4}
              placeholder="Identifique os principais gargalos encontrados nos projetos..."
            />
          </div>

          <div>
            <Label htmlFor="estrategias_validadas">Estratégias Validadas</Label>
            <Textarea
              id="estrategias_validadas"
              rows={4}
              placeholder="Liste as estratégias que foram validadas e tiveram sucesso..."
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="projeto_case" />
              <Label htmlFor="projeto_case">Este projeto virou um case?</Label>
            </div>

            <div>
              <Label htmlFor="destaques_case_resumo">Destaques do Case</Label>
              <Textarea
                id="destaques_case_resumo"
                rows={4}
                placeholder="Se sim, descreva os principais destaques e resultados do case..."
              />
            </div>
          </div>

          <Button className="bg-petrol hover:bg-petrol/90 text-white">
            Salvar Resumo Estratégico
          </Button>
        </CardContent>
      </Card>

      {/* Existing diagnostic tracking components */}
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Empresa</CardTitle>
          <CardDescription>
            Escolha uma empresa para visualizar seu histórico de diagnósticos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-full md:w-80">
              <SelectValue placeholder="Selecione uma empresa..." />
            </SelectTrigger>
            <SelectContent>
              {mockCompanies.map(company => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Timeline */}
      {renderTimeline()}

      {/* Comparison */}
      {renderComparison()}

      {/* Action Panel */}
      {selectedDiagnostics.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">
                  {selectedDiagnostics.length} diagnóstico(s) selecionado(s)
                </h4>
                <p className="text-sm text-blue-700">
                  {selectedDiagnostics.length === 2 
                    ? "Clique em 'Comparar' para gerar o relatório" 
                    : "Selecione mais um diagnóstico para comparar"
                  }
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedDiagnostics([])}
                >
                  Limpar Seleção
                </Button>
                <Button
                  onClick={handleCompareSelected}
                  disabled={selectedDiagnostics.length !== 2}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Comparar Selecionados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Acompanhamento;
