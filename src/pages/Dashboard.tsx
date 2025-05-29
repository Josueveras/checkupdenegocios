
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, FileText, Calendar, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const recentDiagnostics = [
    {
      id: 1,
      company: "Tech Solutions LTDA",
      client: "João Silva",
      score: 78,
      level: "Intermediário",
      date: "2024-01-15",
      status: "Concluído"
    },
    {
      id: 2,
      company: "Marketing Digital Pro",
      client: "Maria Santos",
      score: 45,
      level: "Emergente",
      date: "2024-01-14",
      status: "Pendente"
    },
    {
      id: 3,
      company: "Inovação & Estratégia",
      client: "Pedro Costa",
      score: 92,
      level: "Avançado",
      date: "2024-01-13",
      status: "Concluído"
    }
  ];

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
            <div className="text-2xl font-bold text-gray-900">127</div>
            <p className="text-xs text-green-600 mt-1">
              +12% desde o mês passado
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
            <div className="text-2xl font-bold text-gray-900">68%</div>
            <p className="text-xs text-green-600 mt-1">
              +5% desde o mês passado
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
            <div className="text-2xl font-bold text-gray-900">89</div>
            <p className="text-xs text-green-600 mt-1">
              +18% desde o mês passado
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
            <div className="text-2xl font-bold text-gray-900">70%</div>
            <p className="text-xs text-green-600 mt-1">
              +8% desde o mês passado
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
            {recentDiagnostics.map((diagnostic) => (
              <div key={diagnostic.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{diagnostic.company}</h4>
                  <p className="text-sm text-gray-600">{diagnostic.client}</p>
                  <p className="text-xs text-gray-500 mt-1">{diagnostic.date}</p>
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
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Avançado</span>
                  <span>23%</span>
                </div>
                <Progress value={23} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Intermediário</span>
                  <span>35%</span>
                </div>
                <Progress value={35} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Emergente</span>
                  <span>28%</span>
                </div>
                <Progress value={28} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Iniciante</span>
                  <span>14%</span>
                </div>
                <Progress value={14} className="h-2" />
              </div>
            </div>
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
