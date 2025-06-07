
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDiagnosticos } from '@/hooks/useSupabase';
import { DiagnosticCard } from '@/components/DiagnosticCard';

const Diagnosticos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [scoreFilter, setScoreFilter] = useState('todos');
  
  const { data: diagnosticos = [], isLoading, error } = useDiagnosticos();


  const filteredDiagnostics = diagnosticos.filter(diagnostic => {
    const empresa = diagnostic.empresas;
    const matchesSearch = empresa?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empresa?.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || diagnostic.status === statusFilter;
    const matchesScore = scoreFilter === 'todos' || 
                        (scoreFilter === 'alto' && diagnostic.score_total >= 80) ||
                        (scoreFilter === 'medio' && diagnostic.score_total >= 40 && diagnostic.score_total < 80) ||
                        (scoreFilter === 'baixo' && diagnostic.score_total < 40);
    
    return matchesSearch && matchesStatus && matchesScore;
  });

  const handleViewDiagnostic = (diagnostic: any) => {
    navigate('/diagnostico-view', { state: { diagnostic } });
  };

  const handleEditDiagnostic = (diagnosticId: string) => {
    navigate(`/novo-diagnostico?edit=${diagnosticId}`);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Carregando diagnósticos...</div>;
  }

  if (error) {
    return <div className="text-red-600">Erro ao carregar diagnósticos: {error.message}</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Diagnósticos</h1>
          <p className="text-gray-600 mt-1">Histórico completo de todos os diagnósticos realizados</p>
        </div>
        <Link to="/novo-diagnostico">
          <Button className="bg-petrol hover:bg-petrol/90 text-white">
            <FileText className="mr-2 h-4 w-4" />
            Novo Diagnóstico
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre os diagnósticos por empresa, status ou pontuação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <Input
                placeholder="Empresa ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Score</label>
              <Select value={scoreFilter} onValueChange={setScoreFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="alto">Alto (80%+)</SelectItem>
                  <SelectItem value="medio">Médio (40-79%)</SelectItem>
                  <SelectItem value="baixo">Baixo (&lt;40%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="90d">Últimos 90 dias</SelectItem>
                  <SelectItem value="all">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Mostrando {filteredDiagnostics.length} de {diagnosticos.length} diagnósticos
        </p>
      </div>

      {/* Diagnostics List */}
      <div className="grid gap-6">
        {filteredDiagnostics.map((diagnostic) => (
          <DiagnosticCard
            key={diagnostic.id}
            diagnostic={diagnostic}
            onView={handleViewDiagnostic}
            onEdit={handleEditDiagnostic}
          />
        ))}
      </div>

      {filteredDiagnostics.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum diagnóstico encontrado</h3>
            <p className="text-gray-600 mb-6">
              Não há diagnósticos que correspondam aos filtros selecionados.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('todos');
              setScoreFilter('todos');
            }}>
              Limpar Filtros
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Diagnosticos;
