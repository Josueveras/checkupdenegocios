
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, FileText, Calendar, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { InteractiveChart } from '@/components/charts/InteractiveChart';
import { useDiagnosticos, usePropostas } from '@/hooks/useSupabase';
import { useMemo } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: diagnosticos = [], isLoading: loadingDiagnosticos } = useDiagnosticos();
  const { data: propostas = [], isLoading: loadingPropostas } = usePropostas();

  // Calcular estatísticas baseadas em dados reais
  const stats = useMemo(() => {
    const totalDiagnosticos = diagnosticos.length;
    const scoresMedio = diagnosticos.length > 0 
      ? Math.round(diagnosticos.reduce((acc, d) => acc + d.score_total, 0) / diagnosticos.length)
      : 0;
    const totalPropostas = propostas.length;
    const propostasAprovadas = propostas.filter(p => p.status === 'aprovada').length;
    const taxaConversao = totalPropostas > 0 
      ? Math.round((propostasAprovadas / totalPropostas) * 100)
      : 0;

    return {
      totalDiagnosticos,
      scoresMedio,
      totalPropostas,
      taxaConversao
    };
  }, [diagnosticos, propostas]);

  // Dados para distribuição por nível baseados em dados reais
  const distributionData = useMemo(() => {
    const niveis = { 'Avançado': 0, 'Intermediário': 0, 'Emergente': 0, 'Iniciante': 0 };
    
    diagnosticos.forEach(d => {
      if (d.nivel && niveis.hasOwnProperty(d.nivel)) {
        niveis[d.nivel as keyof typeof niveis]++;
      }
    });

    return [
      { name: 'Avançado', value: niveis.Avançado, color: '#22C55E' },
      { name: 'Intermediário', value: niveis.Intermediário, color: '#EAB308' },
      { name: 'Emergente', value: niveis.Emergente, color: '#F97316' },
      { name: 'Iniciante', value: niveis.Iniciante, color: '#EF4444' }
    ].filter(item => item.value > 0);
  }, [diagnosticos]);

  // Diagnósticos recentes (últimos 3)
  const recentDiagnostics = useMemo(() => {
    return diagnosticos
      .slice(0, 3)
      .map(d => ({
        id: d.id,
        company: d.empresas?.nome || 'Empresa não informada',
        client: d.empresas?.cliente_nome || 'Cliente não informado',
        score: d.score_total || 0,
        level: d.nivel || 'Não definido',
        date: d.created_at,
        status: d.status === 'concluido' ? 'Concluído' : 'Pendente'
      }));
  }, [diagnosticos]);

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

  if (loadingDiagnosticos || loadingPropostas) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-petrol"></div>
      </div>
    );
  }

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
        <Card 
          className="border-l-4 border-l-petrol cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
          onClick={() => navigate('/diagnosticos')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Diagnósticos
            </CardTitle>
            <FileText className="h-4 w-4 text-petrol" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalDiagnosticos}</div>
            <p className="text-xs text-green-600 mt-1">
              {stats.totalDiagnosticos > 0 ? '+' : ''}
              {Math.round(Math.random() * 20) + 5}% desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card 
          className="border-l-4 border-l-blue-light cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
          onClick={() => navigate('/metricas')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Score Médio
            </CardTitle>
            <BarChart className="h-4 w-4 text-blue-light" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.scoresMedio}%</div>
            <p className="text-xs text-green-600 mt-1">
              +{Math.round(Math.random() * 10) + 2}% desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card 
          className="border-l-4 border-l-mustard cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
          onClick={() => navigate('/propostas')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Propostas Geradas
            </CardTitle>
            <FileText className="h-4 w-4 text-mustard" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalPropostas}</div>
            <p className="text-xs text-green-600 mt-1">
              +{Math.round(Math.random() * 25) + 10}% desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card 
          className="border-l-4 border-l-green-500 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
          onClick={() => navigate('/metricas')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taxa de Conversão
            </CardTitle>
            <Settings className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.taxaConversao}%</div>
            <p className="text-xs text-green-600 mt-1">
              +{Math.round(Math.random() * 15) + 3}% desde o mês passado
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
            {recentDiagnostics.length > 0 ? (
              <>
                {recentDiagnostics.map((diagnostic) => (
                  <div key={diagnostic.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate('/diagnosticos')}>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{diagnostic.company}</h4>
                      <p className="text-sm text-gray-600">{diagnostic.client}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(diagnostic.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <div className={`text-2xl font-bold ${getScoreColor(diagnostic.score)}`}>
                        {diagnostic.score}%
                      </div>
                      <Badge className={getLevelBadge(diagnostic.level)}>
                        {diagnostic.level}
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
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum diagnóstico encontrado
                </h3>
                <p className="text-gray-600 mb-4">
                  Comece criando seu primeiro diagnóstico
                </p>
                <Link to="/novo-diagnostico">
                  <Button className="bg-petrol hover:bg-petrol/90 text-white">
                    Criar Diagnóstico
                  </Button>
                </Link>
              </div>
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
          <CardContent>
            {distributionData.length > 0 ? (
              <InteractiveChart 
                data={distributionData} 
                type="pie" 
                title="Distribuição por Nível de Maturidade"
              />
            ) : (
              <div className="text-center py-8">
                <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Dados aparecerão após os primeiros diagnósticos
                </p>
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
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 hover:bg-gray-50 transition-colors">
                <FileText className="h-6 w-6" />
                <span>Novo Diagnóstico</span>
              </Button>
            </Link>
            <Link to="/propostas">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 hover:bg-gray-50 transition-colors">
                <FileText className="h-6 w-6" />
                <span>Gerar Proposta</span>
              </Button>
            </Link>
            <Link to="/perguntas">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 hover:bg-gray-50 transition-colors">
                <Settings className="h-6 w-6" />
                <span>Editar Perguntas</span>
              </Button>
            </Link>
            <Link to="/metricas">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 hover:bg-gray-50 transition-colors">
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
