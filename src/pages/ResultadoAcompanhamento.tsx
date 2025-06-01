
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/components/ui/back-button';
import { ArrowLeft, FileText, MessageCircle, TrendingUp, TrendingDown, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ResultadoAcompanhamento = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: acompanhamento, isLoading, error } = useQuery({
    queryKey: ['acompanhamento', id],
    queryFn: async () => {
      if (!id) throw new Error('ID não fornecido');
      
      const { data, error } = await supabase
        .from('acompanhamentos')
        .select(`
          *,
          empresas(nome)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'MMMM/yyyy', { locale: ptBR });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluido':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'em_andamento':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'pendente':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'bg-green-100 text-green-800';
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-800';
      case 'pendente':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const parseAcoes = (acoes: any) => {
    if (!acoes) return [];
    
    if (typeof acoes === 'string') {
      try {
        return JSON.parse(acoes);
      } catch {
        return [];
      }
    }
    
    if (Array.isArray(acoes)) return acoes;
    return [];
  };

  const parseScorePorCategoria = (score: any) => {
    if (!score) return {};
    
    if (typeof score === 'string') {
      try {
        return JSON.parse(score);
      } catch {
        return {};
      }
    }
    
    return score;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in px-4 pb-10">
        <div className="flex items-center gap-4">
          <BackButton fallbackRoute="/acompanhamento" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Carregando...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error || !acompanhamento) {
    return (
      <div className="space-y-6 animate-fade-in px-4 pb-10">
        <div className="flex items-center gap-4">
          <BackButton fallbackRoute="/acompanhamento" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Erro</h1>
            <p className="text-gray-600">Acompanhamento não encontrado</p>
          </div>
        </div>
      </div>
    );
  }

  const acoes = parseAcoes(acompanhamento.acoes);
  const scorePorCategoria = parseScorePorCategoria(acompanhamento.score_por_categoria);

  return (
    <div className="space-y-6 animate-fade-in px-4 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BackButton fallbackRoute="/acompanhamento" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resultado do Acompanhamento</h1>
          <p className="text-gray-600">
            {acompanhamento.empresas?.nome} - {formatDate(acompanhamento.mes)}
          </p>
        </div>
      </div>

      {/* Score Geral, ROI, Faturamento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-petrol mb-2">{acompanhamento.score_geral}%</div>
              <p className="text-gray-600">Score Geral</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {acompanhamento.roi ? `${acompanhamento.roi}x` : 'N/A'}
              </div>
              <p className="text-gray-600">ROI</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {acompanhamento.faturamento ? formatCurrency(acompanhamento.faturamento) : 'N/A'}
              </div>
              <p className="text-gray-600">Faturamento</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Destaque do Mês */}
      {acompanhamento.destaque && (
        <Card>
          <CardHeader>
            <CardTitle>🌟 Destaque do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{acompanhamento.destaque}</p>
          </CardContent>
        </Card>
      )}

      {/* Score por Categoria */}
      {Object.keys(scorePorCategoria).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Score por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(scorePorCategoria).map(([categoria, score]) => (
                <div key={categoria} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-petrol mb-1">{score as number}%</div>
                  <p className="text-sm text-gray-600 capitalize">{categoria.replace('_', ' ')}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ações do Mês */}
      {acoes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>✅ Ações do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {acoes.map((acao: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(acao.status)}
                    <span className="font-medium">{acao.titulo || acao.nome || `Ação ${index + 1}`}</span>
                  </div>
                  <Badge className={getStatusColor(acao.status)}>
                    {acao.status === 'concluido' ? 'Concluída' : 
                     acao.status === 'em_andamento' ? 'Em Andamento' : 'Pendente'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recomendações */}
      {acompanhamento.recomendacoes && (
        <Card>
          <CardHeader>
            <CardTitle>💡 Recomendações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{acompanhamento.recomendacoes}</p>
          </CardContent>
        </Card>
      )}

      {/* Resumo Estratégico */}
      <Card>
        <CardHeader>
          <CardTitle>🧠 Resumo Estratégico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {acompanhamento.pontos_fortes_desenvolvidos && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Pontos Fortes Desenvolvidos</h4>
              <p className="text-gray-700">{acompanhamento.pontos_fortes_desenvolvidos}</p>
            </div>
          )}
          
          {acompanhamento.gargalos_atuais && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Gargalos Atuais</h4>
              <p className="text-gray-700">{acompanhamento.gargalos_atuais}</p>
            </div>
          )}
          
          {acompanhamento.estrategias_validadas && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Estratégias Validadas</h4>
              <p className="text-gray-700">{acompanhamento.estrategias_validadas}</p>
            </div>
          )}
          
          {acompanhamento.virou_case && acompanhamento.destaque_case && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">🏆 Case de Sucesso</h4>
              <p className="text-gray-700">{acompanhamento.destaque_case}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Observações */}
      {acompanhamento.observacoes && (
        <Card>
          <CardHeader>
            <CardTitle>📝 Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{acompanhamento.observacoes}</p>
          </CardContent>
        </Card>
      )}

      {/* Botões de Ação */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button className="bg-petrol hover:bg-petrol/90 text-white">
          <FileText className="mr-2 h-4 w-4" />
          📄 Gerar PDF
        </Button>
        
        <Button variant="outline">
          <MessageCircle className="mr-2 h-4 w-4" />
          📤 Enviar por WhatsApp
        </Button>
        
        <Button variant="outline" onClick={() => navigate('/acompanhamento')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          🔙 Voltar ao Acompanhamento
        </Button>
      </div>
    </div>
  );
};

export default ResultadoAcompanhamento;
