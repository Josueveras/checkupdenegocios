
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, BarChart, ArrowUp, ArrowDown, Minus } from 'lucide-react';

const Acompanhamento = () => {
  const [selectedCompany, setSelectedCompany] = useState('tech-solutions');

  const companies = [
    { id: 'tech-solutions', name: 'Tech Solutions LTDA' },
    { id: 'marketing-pro', name: 'Marketing Digital Pro' },
    { id: 'consultoria', name: 'Consultoria Business' }
  ];

  const timelineData = [
    {
      id: 1,
      date: '2024-01-15',
      type: 'Diagnóstico Inicial',
      score: 78,
      level: 'Intermediário',
      categories: {
        Marketing: 85,
        Vendas: 70,
        Estratégia: 80
      }
    },
    {
      id: 2,
      date: '2023-12-15',
      type: 'Diagnóstico',
      score: 65,
      level: 'Emergente',
      categories: {
        Marketing: 70,
        Vendas: 60,
        Estratégia: 65
      }
    },
    {
      id: 3,
      date: '2023-11-15',
      type: 'Diagnóstico',
      score: 52,
      level: 'Emergente',
      categories: {
        Marketing: 55,
        Vendas: 50,
        Estratégia: 50
      }
    }
  ];

  const getScoreVariation = (current: number, previous: number) => {
    const diff = current - previous;
    if (diff > 0) return { icon: ArrowUp, color: 'text-green-600', value: `+${diff}%` };
    if (diff < 0) return { icon: ArrowDown, color: 'text-red-600', value: `${diff}%` };
    return { icon: Minus, color: 'text-gray-600', value: '0%' };
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

  const latestDiagnostic = timelineData[0];
  const previousDiagnostic = timelineData[1];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Acompanhamento</h1>
          <p className="text-gray-600 mt-1">Monitore a evolução das empresas ao longo do tempo</p>
        </div>
      </div>

      {/* Company Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Empresa</CardTitle>
          <CardDescription>
            Escolha a empresa para visualizar seu histórico de evolução
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Selecione uma empresa" />
            </SelectTrigger>
            <SelectContent>
              {companies.map(company => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Evolution Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-petrol" />
              Evolução Geral
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-petrol mb-2">
                {latestDiagnostic.score}%
              </div>
              <Badge className={getLevelBadge(latestDiagnostic.level)}>
                {latestDiagnostic.level}
              </Badge>
            </div>

            {previousDiagnostic && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Variação desde último diagnóstico:</span>
                  {(() => {
                    const variation = getScoreVariation(latestDiagnostic.score, previousDiagnostic.score);
                    return (
                      <div className={`flex items-center gap-1 ${variation.color}`}>
                        <variation.icon className="h-4 w-4" />
                        <span className="font-medium">{variation.value}</span>
                      </div>
                    );
                  })()}
                </div>
                <Progress 
                  value={latestDiagnostic.score} 
                  className="h-3"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(latestDiagnostic.categories).map(([category, score]) => {
              const previousScore = previousDiagnostic?.categories[category as keyof typeof previousDiagnostic.categories] || 0;
              const variation = getScoreVariation(score, previousScore);
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{score}%</span>
                      <div className={`flex items-center gap-1 ${variation.color}`}>
                        <variation.icon className="h-3 w-3" />
                        <span className="text-xs">{variation.value}</span>
                      </div>
                    </div>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-petrol" />
            Linha do Tempo
          </CardTitle>
          <CardDescription>
            Histórico completo de diagnósticos realizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {timelineData.map((item, index) => (
              <div key={item.id} className="relative">
                {/* Timeline Line */}
                {index < timelineData.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                )}
                
                <div className="flex gap-4">
                  {/* Timeline Dot */}
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-petrol text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Calendar className="h-5 w-5" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <Card className={index === 0 ? 'border-petrol border-2' : ''}>
                      <CardContent className="p-4">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold">{item.type}</h4>
                              <Badge className={getLevelBadge(item.level)}>
                                {item.level}
                              </Badge>
                              {index === 0 && (
                                <Badge className="bg-blue-100 text-blue-800">
                                  Mais Recente
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {new Date(item.date).toLocaleDateString('pt-BR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-petrol">
                                {item.score}%
                              </div>
                              <p className="text-xs text-gray-600">Score Geral</p>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 text-center">
                              {Object.entries(item.categories).map(([category, score]) => (
                                <div key={category} className="space-y-1">
                                  <div className="text-sm font-medium">{score}%</div>
                                  <p className="text-xs text-gray-600">{category}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparison and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Comparativo Detalhado</CardTitle>
            <CardDescription>
              Última evolução registrada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {previousDiagnostic && (
              <>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-600">
                      {previousDiagnostic.score}%
                    </div>
                    <p className="text-xs text-gray-500">Anterior</p>
                    <p className="text-xs text-gray-500">
                      {new Date(previousDiagnostic.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-petrol">
                      {latestDiagnostic.score}%
                    </div>
                    <p className="text-xs text-gray-500">Atual</p>
                    <p className="text-xs text-gray-500">
                      {new Date(latestDiagnostic.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h5 className="font-medium">Evolução por Área:</h5>
                  {Object.entries(latestDiagnostic.categories).map(([category, currentScore]) => {
                    const previousScore = previousDiagnostic.categories[category as keyof typeof previousDiagnostic.categories];
                    const variation = getScoreVariation(currentScore, previousScore);
                    
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm">{category}</span>
                        <div className={`flex items-center gap-2 ${variation.color}`}>
                          <span className="text-sm font-medium">
                            {previousScore}% → {currentScore}%
                          </span>
                          <variation.icon className="h-4 w-4" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Disponíveis</CardTitle>
            <CardDescription>
              Próximos passos para esta empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-petrol hover:bg-petrol/90">
              📊 Novo Diagnóstico
            </Button>
            <Button variant="outline" className="w-full">
              📄 Baixar Comparativo PDF
            </Button>
            <Button variant="outline" className="w-full">
              📤 Enviar Evolução por WhatsApp
            </Button>
            <Button variant="outline" className="w-full">
              📅 Agendar Reunião de Follow-up
            </Button>
            <Button variant="outline" className="w-full">
              📋 Gerar Nova Proposta
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Acompanhamento;
