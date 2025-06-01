
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DiagnosticTimelineProps {
  selectedCompany: string;
  setSelectedCompany: (value: string) => void;
  selectedDiagnostics: string[];
  setSelectedDiagnostics: (value: string[]) => void;
}

const DiagnosticTimeline = ({ 
  selectedCompany, 
  setSelectedCompany, 
  selectedDiagnostics, 
  setSelectedDiagnostics 
}: DiagnosticTimelineProps) => {
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

export default DiagnosticTimeline;
