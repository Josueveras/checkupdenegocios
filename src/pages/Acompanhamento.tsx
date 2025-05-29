
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, Calendar, BarChart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Acompanhamento = () => {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedDiagnostics, setSelectedDiagnostics] = useState<string[]>([]);

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

      {/* Company Selection */}
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
