
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, RefreshCw, BarChart, Download, Plus, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface DiagnosticoItem {
  id: string;
  empresa_nome: string;
  score_total: number;
  nivel: string;
  status: string;
  created_at: string;
  pdf_url?: string;
}

export default function Diagnosticos() {
  const navigate = useNavigate();
  const [diagnosticos, setDiagnosticos] = useState<DiagnosticoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    empresa: '',
    status: '',
    nivel: '',
    dataInicio: '',
    dataFim: ''
  });

  useEffect(() => {
    carregarDiagnosticos();
  }, []);

  const carregarDiagnosticos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('diagnosticos')
        .select(`
          id,
          score_total,
          nivel,
          status,
          created_at,
          pdf_url,
          empresas (nome)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const diagnosticosFormatados = data?.map(d => ({
        id: d.id,
        empresa_nome: (d.empresas as any)?.nome || 'N/A',
        score_total: d.score_total,
        nivel: d.nivel,
        status: d.status,
        created_at: d.created_at,
        pdf_url: d.pdf_url
      })) || [];

      setDiagnosticos(diagnosticosFormatados);
    } catch (error) {
      console.error('Erro ao carregar diagnósticos:', error);
      toast.error('Erro ao carregar diagnósticos');
    } finally {
      setLoading(false);
    }
  };

  const diagnosticosFiltrados = diagnosticos.filter(diag => {
    const matchEmpresa = !filtros.empresa || 
      diag.empresa_nome.toLowerCase().includes(filtros.empresa.toLowerCase());
    const matchStatus = !filtros.status || diag.status === filtros.status;
    const matchNivel = !filtros.nivel || diag.nivel === filtros.nivel;
    
    let matchData = true;
    if (filtros.dataInicio || filtros.dataFim) {
      const diagData = new Date(diag.created_at);
      if (filtros.dataInicio) {
        matchData = matchData && diagData >= new Date(filtros.dataInicio);
      }
      if (filtros.dataFim) {
        matchData = matchData && diagData <= new Date(filtros.dataFim);
      }
    }

    return matchEmpresa && matchStatus && matchNivel && matchData;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'concluido': 'bg-green-100 text-green-800',
      'pendente': 'bg-yellow-100 text-yellow-800',
      'em_andamento': 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getNivelColor = (nivel: string) => {
    const colors = {
      'Iniciante': 'text-red-600',
      'Emergente': 'text-orange-600',
      'Intermediário': 'text-blue-600',
      'Avançado': 'text-green-600'
    };
    return colors[nivel as keyof typeof colors] || 'text-gray-600';
  };

  const handleVer = (id: string) => {
    navigate(`/diagnosticos/${id}`);
  };

  const handleEditar = (id: string) => {
    navigate(`/diagnosticos/${id}/editar`);
  };

  const handleRefazer = (id: string) => {
    navigate(`/novo-diagnostico?refazer=${id}`);
  };

  const handleComparar = (id: string) => {
    navigate(`/acompanhamento?diagnostico=${id}`);
  };

  const limparFiltros = () => {
    setFiltros({
      empresa: '',
      status: '',
      nivel: '',
      dataInicio: '',
      dataFim: ''
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0F3244]">Diagnósticos</h1>
          <p className="text-gray-600">Gerencie todos os diagnósticos realizados</p>
        </div>
        <Button 
          onClick={() => navigate('/novo-diagnostico')}
          className="bg-[#3C9CD6] hover:bg-[#3C9CD6]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Diagnóstico
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Buscar por empresa..."
                value={filtros.empresa}
                onChange={(e) => setFiltros(prev => ({ ...prev, empresa: e.target.value }))}
                className="w-full"
              />
            </div>
            <Select value={filtros.status} onValueChange={(value) => setFiltros(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtros.nivel} onValueChange={(value) => setFiltros(prev => ({ ...prev, nivel: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="Iniciante">Iniciante</SelectItem>
                <SelectItem value="Emergente">Emergente</SelectItem>
                <SelectItem value="Intermediário">Intermediário</SelectItem>
                <SelectItem value="Avançado">Avançado</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={filtros.dataInicio}
              onChange={(e) => setFiltros(prev => ({ ...prev, dataInicio: e.target.value }))}
              placeholder="Data início"
            />
            <Input
              type="date"
              value={filtros.dataFim}
              onChange={(e) => setFiltros(prev => ({ ...prev, dataFim: e.target.value }))}
              placeholder="Data fim"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={limparFiltros}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Diagnósticos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Diagnósticos ({diagnosticosFiltrados.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {diagnosticosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                {diagnosticos.length === 0 
                  ? 'Nenhum diagnóstico encontrado' 
                  : 'Nenhum diagnóstico corresponde aos filtros aplicados'
                }
              </p>
              <Button 
                onClick={() => navigate('/novo-diagnostico')}
                className="bg-[#3C9CD6] hover:bg-[#3C9CD6]/90"
              >
                Criar Primeiro Diagnóstico
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-gray-700">Empresa</th>
                    <th className="text-left p-3 font-medium text-gray-700">Score</th>
                    <th className="text-left p-3 font-medium text-gray-700">Nível</th>
                    <th className="text-left p-3 font-medium text-gray-700">Status</th>
                    <th className="text-left p-3 font-medium text-gray-700">Data</th>
                    <th className="text-left p-3 font-medium text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnosticosFiltrados.map((diagnostico) => (
                    <tr key={diagnostico.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{diagnostico.empresa_nome}</td>
                      <td className="p-3">
                        <span className="font-semibold text-[#0F3244]">
                          {diagnostico.score_total}%
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`font-medium ${getNivelColor(diagnostico.nivel)}`}>
                          {diagnostico.nivel}
                        </span>
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusColor(diagnostico.status)}>
                          {diagnostico.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-3 text-gray-600">
                        {new Date(diagnostico.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVer(diagnostico.id)}
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditar(diagnostico.id)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRefazer(diagnostico.id)}
                            title="Refazer"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleComparar(diagnostico.id)}
                            title="Comparar"
                          >
                            <BarChart className="h-4 w-4" />
                          </Button>
                          {diagnostico.pdf_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(diagnostico.pdf_url, '_blank')}
                              title="Baixar PDF"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
