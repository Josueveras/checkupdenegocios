
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Metricas = () => {
  const monthlyData = [
    { month: 'Set', diagnosticos: 8, scoreMedia: 65 },
    { month: 'Out', diagnosticos: 12, scoreMedia: 68 },
    { month: 'Nov', diagnosticos: 15, scoreMedia: 71 },
    { month: 'Dez', diagnosticos: 18, scoreMedia: 73 },
    { month: 'Jan', diagnosticos: 22, scoreMedia: 75 }
  ];

  const maturityData = [
    { nivel: 'Iniciante', quantidade: 8, cor: '#EF4444' },
    { nivel: 'Emergente', quantidade: 15, cor: '#F97316' },
    { nivel: 'Intermediário', quantidade: 12, cor: '#EAB308' },
    { nivel: 'Avançado', quantidade: 7, cor: '#22C55E' }
  ];

  const categoryData = [
    { categoria: 'Marketing', media: 68 },
    { categoria: 'Vendas', media: 72 },
    { categoria: 'Estratégia', media: 65 },
    { categoria: 'Gestão', media: 71 },
    { categoria: 'Tecnologia', media: 58 }
  ];

  const totalDiagnostics = monthlyData.reduce((sum, item) => sum + item.diagnosticos, 0);
  const avgScore = Math.round(monthlyData.reduce((sum, item) => sum + item.scoreMedia, 0) / monthlyData.length);
  const avgMaturity = Math.round(categoryData.reduce((sum, item) => sum + item.media, 0) / categoryData.length);
  const totalEmpresas = maturityData.reduce((sum, item) => sum + item.quantidade, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Métricas e Análises</h1>
        <p className="text-gray-600 mt-1">Acompanhe o desempenho e evolução dos seus diagnósticos</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-petrol">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Diagnósticos
            </CardTitle>
            <div className="text-2xl">📊</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalDiagnostics}</div>
            <p className="text-xs text-green-600 mt-1">
              +18% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-light">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Score Médio
            </CardTitle>
            <div className="text-2xl">📈</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{avgScore}%</div>
            <p className="text-xs text-green-600 mt-1">
              +5% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-mustard">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Empresas Avaliadas
            </CardTitle>
            <div className="text-2xl">🏢</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalEmpresas}</div>
            <p className="text-xs text-green-600 mt-1">
              +12% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Maturidade Média
            </CardTitle>
            <div className="text-2xl">⭐</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{avgMaturity}%</div>
            <p className="text-xs text-green-600 mt-1">
              +3% vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly Evolution */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal</CardTitle>
            <CardDescription>
              Diagnósticos realizados por mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="diagnosticos" fill="#0F3244" name="Diagnósticos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Score Evolution */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução do Score Médio</CardTitle>
            <CardDescription>
              Score médio dos diagnósticos por mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Score Médio']} />
                <Line 
                  type="monotone" 
                  dataKey="scoreMedia" 
                  stroke="#FBB03B" 
                  strokeWidth={3}
                  dot={{ fill: '#FBB03B', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Maturity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Nível de Maturidade</CardTitle>
            <CardDescription>
              Classificação das empresas diagnosticadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={maturityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="quantidade"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {maturityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-3">
                {maturityData.map((item) => (
                  <div key={item.nivel} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.cor }}
                      ></div>
                      <span className="text-sm font-medium">{item.nivel}</span>
                    </div>
                    <Badge variant="outline">{item.quantidade} empresas</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance por Categoria</CardTitle>
            <CardDescription>
              Scores médios em cada área avaliada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="categoria" type="category" width={80} />
                <Tooltip formatter={(value) => [`${value}%`, 'Score Médio']} />
                <Bar dataKey="media" fill="#3C9CD6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              📈 Principais Sucessos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-green-700">
              <strong>Crescimento consistente:</strong> 18% mais diagnósticos vs mês anterior
            </div>
            <div className="text-sm text-green-700">
              <strong>Melhoria na qualidade:</strong> Score médio subiu 5%
            </div>
            <div className="text-sm text-green-700">
              <strong>Diversidade de níveis:</strong> 67% das empresas são Intermediárias ou Avançadas
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              ⚠️ Pontos de Atenção
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-yellow-700">
              <strong>Tecnologia em baixa:</strong> Score médio de apenas 58%
            </div>
            <div className="text-sm text-yellow-700">
              <strong>Muitas empresas iniciantes:</strong> 19% ainda no nível básico
            </div>
            <div className="text-sm text-yellow-700">
              <strong>Variação sazonal:</strong> Dezembro teve ligeira queda
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              💡 Recomendações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-blue-700">
              <strong>Foco em Tecnologia:</strong> Criar perguntas específicas sobre transformação digital
            </div>
            <div className="text-sm text-blue-700">
              <strong>Nurturing de iniciantes:</strong> Desenvolver jornada específica para nível básico
            </div>
            <div className="text-sm text-blue-700">
              <strong>Planejamento sazonal:</strong> Antecipar campanhas para períodos de menor movimento
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Metricas;
