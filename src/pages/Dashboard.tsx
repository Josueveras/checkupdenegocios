
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, FileText, Calendar, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDiagnosticos, usePropostas } from '@/hooks/useSupabase';

const Dashboard = () => {
  const { data: diagnosticos = [] } = useDiagnosticos();
  const { data: propostas = [] } = usePropostas();

  // Calcular estatísticas reais
  const totalDiagnosticos = diagnosticos.length;
  const scoreMedia = diagnosticos.length > 0 
    ? Math.round(diagnosticos.reduce((sum, diag) => sum + diag.score_total, 0) / diagnosticos.length)
    : 0;
  const totalPropostas = propostas.length;
  const propostasAprovadas = propostas.filter(p => p.status === 'aprovada').length;
  const taxaConversao = totalPropostas > 0 ? Math.round((propostasAprovadas / totalPropostas) * 100) : 0;

  // Últimos 3 diagnósticos
  const recentDiagnostics = diagnosticos
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  // Distribuição por nível
  const distribuicaoNivel = {
    'Avançado': diagnosticos.filter(d => d.score_total >= 80).length,
    'Intermediário': diagnosticos.filter(d => d.score_total >= 60 && d.score_total < 80).length,
    'Emergente': diagnosticos.filter(d => d.score_total >= 40 && d.score_total < 60).length,
    'Iniciante': diagnosticos.filter(d => d.score_total < 40).length,
  };

  const totalParaDistribuicao = Object.values(distribuicaoNivel).reduce((sum, count) => sum + count, 0);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral dos seus diagnósticos e métricas</p>
        </div>
        <Link to="/novo-diagnostico">
          <Button className="bg-petrol hover:bg-petrol/90 text-white">
            <FileText className="mr-2 h-4 w-4" />
            Novo Diagnóstico
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-petrol">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Diagnósticos
            </CardTitle>
            <FileText className="h-4 w-4 text-petrol" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalDiagnosticos}</div>
            <p className="text-xs text-gray-500 mt-1">
              {totalDiagnosticos === 0 ? 'Nenhum diagnóstico realizado' : 'Diagnósticos realizados'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-light">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Score Médio
            </CardTitle>
            <BarChart className="h-4 w-4 text-blue-light" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{scoreMedia}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {totalDiagnosticos === 0 ? 'Sem dados disponíveis' : 'Score médio geral'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-mustard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Propostas Geradas
            </CardTitle>
            <FileText className="h-4 w-4 text-mustard" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalPropostas}</div>
            <p className="text-xs text-gray-500 mt-1">
              {totalPropostas === 0 ? 'Nenhuma proposta gerada' : 'Propostas comerciais'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taxa de Conversão
            </CardTitle>
            <Settings className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{taxaConversao}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {totalPropostas === 0 ? 'Sem dados disponíveis' : `${propostasAprovadas} de ${totalPropostas} aprovadas`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-petrol" />
              Diagnósticos Recentes
            </CardTitle>
            <CardDescription>
              Últimos diagnósticos realizados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentDiagnostics.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum diagnóstico realizado ainda</p>
                <Link to="/novo-diagnostico">
                  <Button className="mt-4 bg-petrol hover:bg-petrol/90">
                    Criar Primeiro Diagnóstico
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {recentDiagnostics.map((diagnostic) => (
                  <div key={diagnostic.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{diagnostic.empresas?.nome || 'Empresa'}</h4>
                      <p className="text-sm text-gray-600">{diagnostic.empresas?.cliente_nome || 'Cliente'}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(diagnostic.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="text-right space-y-2">
                      <div className={`text-2xl font-bold ${getScoreColor(diagnostic.score_total)}`}>
                        {diagnostic.score_total}%
                      </div>
                      <Badge className={getLevelBadge(diagnostic.nivel)}>
                        {diagnostic.nivel}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Link to="/diagnosticos">
                  <Button variant="outline" className="w-full mt-4">
                    Ver Todos os Diagnósticos
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-petrol" />
              Distribuição por Nível
            </CardTitle>
            <CardDescription>
              Classificação das empresas diagnosticadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {totalParaDistribuicao === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Sem dados para exibir</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Avançado</span>
                    <span>{Math.round((distribuicaoNivel.Avançado / totalParaDistribuicao) * 100)}%</span>
                  </div>
                  <Progress value={(distribuicaoNivel.Avançado / totalParaDistribuicao) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Intermediário</span>
                    <span>{Math.round((distribuicaoNivel.Intermediário / totalParaDistribuicao) * 100)}%</span>
                  </div>
                  <Progress value={(distribuicaoNivel.Intermediário / totalParaDistribuicao) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Emergente</span>
                    <span>{Math.round((distribuicaoNivel.Emergente / totalParaDistribuicao) * 100)}%</span>
                  </div>
                  <Progress value={(distribuicaoNivel.Emergente / totalParaDistribuicao) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Iniciante</span>
                    <span>{Math.round((distribuicaoNivel.Iniciante / totalParaDistribuicao) * 100)}%</span>
                  </div>
                  <Progress value={(distribuicaoNivel.Iniciante / totalParaDistribuicao) * 100} className="h-2" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesso rápido às principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/novo-diagnostico">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span>Novo Diagnóstico</span>
              </Button>
            </Link>
            <Link to="/propostas">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span>Gerar Proposta</span>
              </Button>
            </Link>
            <Link to="/perguntas">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Settings className="h-6 w-6" />
                <span>Editar Perguntas</span>
              </Button>
            </Link>
            <Link to="/metricas">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <BarChart className="h-6 w-6" />
                <span>Ver Métricas</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
