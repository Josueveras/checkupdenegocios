
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Download, Edit, Calendar, TrendingUp, Target, AlertCircle, Lightbulb } from 'lucide-react';
import { useDiagnosticOperations } from '@/hooks/useDiagnosticOperations';
import { ShareButton } from '@/components/ShareButton';
import { toast } from '@/hooks/use-toast';

const DiagnosticoView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { diagnostic } = location.state || {};
  const { handleGenerateAndDownloadPDF, handleSendWhatsApp, generatePDFForSharing, handleScheduleCalendar } = useDiagnosticOperations();
  const [pdfData, setPdfData] = useState<{ blob: Blob; url?: string } | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (!diagnostic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="text-center max-w-md">
          <CardContent className="py-12">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-6">Diagnóstico não encontrado.</p>
            <Button onClick={() => navigate('/diagnosticos')} className="bg-petrol hover:bg-petrol/90">
              Voltar aos Diagnósticos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const empresa = diagnostic.empresas;

  // Função para extrair scores dinâmicos
  const getDynamicCategoryScores = () => {
    const scores: {[key: string]: number} = {};
    
    // Primeiro, tentar usar scores_por_categoria se existir
    if (diagnostic.scores_por_categoria && typeof diagnostic.scores_por_categoria === 'object') {
      return diagnostic.scores_por_categoria;
    }
    
    // Fallback para as categorias hardcoded
    if (diagnostic.score_marketing !== undefined) scores['Marketing'] = diagnostic.score_marketing;
    if (diagnostic.score_vendas !== undefined) scores['Vendas'] = diagnostic.score_vendas;
    if (diagnostic.score_estrategia !== undefined) scores['Estratégia'] = diagnostic.score_estrategia;
    if (diagnostic.score_gestao !== undefined) scores['Gestão'] = diagnostic.score_gestao;
    
    return scores;
  };

  const categoryScores = getDynamicCategoryScores();

  const handlePrepareShare = async () => {
    if (pdfData) return pdfData;

    setIsGeneratingPDF(true);
    try {
      const result = await generatePDFForSharing(diagnostic);
      setPdfData(result);
      return result;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF para compartilhamento",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-green-600";
    if (score >= 60) return "from-yellow-500 to-yellow-600";
    if (score >= 40) return "from-orange-500 to-orange-600";
    return "from-red-500 to-red-600";
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return "text-green-700";
    if (score >= 60) return "text-yellow-700";
    if (score >= 40) return "text-orange-700";
    return "text-red-700";
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      "Avançado": "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg",
      "Intermediário": "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg",
      "Emergente": "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg",
      "Iniciante": "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
    };
    return colors[level as keyof typeof colors] || colors["Iniciante"];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header com Gradiente */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-petrol via-blue-600 to-petrol p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/diagnosticos')}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">Diagnóstico Empresarial</h1>
                  <p className="text-xl text-white/90">{empresa?.nome || 'Empresa não informada'}</p>
                  <p className="text-white/80">{new Date(diagnostic.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  onClick={() => handleGenerateAndDownloadPDF(diagnostic)}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button
                  onClick={() => navigate(`/novo-diagnostico?edit=${diagnostic.id}`)}
                  className="bg-white text-petrol hover:bg-white/90 font-medium"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Score Geral - Destaque */}
        <Card className="relative overflow-hidden border-0 shadow-2xl">
          <div className={`absolute inset-0 bg-gradient-to-br ${getScoreColor(diagnostic.score_total)} opacity-5`}></div>
          <CardContent className="relative p-8 text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className={`w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br ${getScoreColor(diagnostic.score_total)} flex items-center justify-center shadow-2xl`}>
                  <div className="text-center text-white">
                    <div className="text-3xl lg:text-4xl font-bold">{diagnostic.score_total}%</div>
                    <div className="text-sm lg:text-base opacity-90">Score Geral</div>
                  </div>
                </div>
                <TrendingUp className="absolute -top-2 -right-2 h-8 w-8 text-gray-600" />
              </div>
              <div className="text-center">
                <Badge className={`${getLevelBadge(diagnostic.nivel)} text-lg px-6 py-2 mb-4`}>
                  {diagnostic.nivel}
                </Badge>
                <p className="text-gray-600 max-w-lg">
                  Sua empresa está no nível <strong>{diagnostic.nivel}</strong> de maturidade empresarial.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações da Empresa */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Target className="h-5 w-5" />
              Informações da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: "Nome da Empresa", value: empresa?.nome },
                { label: "Cliente", value: empresa?.cliente_nome },
                { label: "E-mail", value: empresa?.cliente_email },
                { label: "Telefone", value: empresa?.cliente_telefone },
                { label: "Setor", value: empresa?.setor },
                { label: "Status", value: diagnostic.status === 'concluido' ? 'Concluído' : 'Pendente' }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{item.label}</p>
                  <p className="text-lg font-medium text-gray-900 break-words">{item.value || 'N/A'}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scores por Categoria - Dinâmico */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <TrendingUp className="h-5 w-5" />
              Scores por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(categoryScores).map(([category, score]) => (
                <div key={category} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">{category}</span>
                    <div className={`px-4 py-2 rounded-full font-bold ${getScoreTextColor(score)} bg-white shadow-md border-2`}>
                      {score}%
                    </div>
                  </div>
                  <div className="relative">
                    <Progress value={score} className="h-3 bg-gray-200" />
                    <div 
                      className={`absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r ${getScoreColor(score)} transition-all duration-500`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pontos Fortes e de Atenção */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {diagnostic.pontos_fortes && diagnostic.pontos_fortes.length > 0 && (
            <Card className="shadow-xl border-0 border-l-4 border-l-green-500">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Pontos Fortes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {diagnostic.pontos_fortes.map((ponto: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{ponto}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {diagnostic.pontos_atencao && diagnostic.pontos_atencao.length > 0 && (
            <Card className="shadow-xl border-0 border-l-4 border-l-orange-500">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                <CardTitle className="text-orange-700 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Pontos de Atenção
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {diagnostic.pontos_atencao.map((ponto: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{ponto}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recomendações */}
        {diagnostic.recomendacoes && Object.keys(diagnostic.recomendacoes).length > 0 && (
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Lightbulb className="h-5 w-5" />
                Recomendações Estratégicas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Object.entries(diagnostic.recomendacoes).map(([categoria, recomendacoes]: [string, any]) => (
                  <div key={categoria} className="space-y-4">
                    <h4 className="font-bold text-xl text-petrol border-b border-gray-200 pb-2">
                      {categoria}
                    </h4>
                    <ul className="space-y-3">
                      {recomendacoes.map((recomendacao: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 leading-relaxed">{recomendacao}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Observações */}
        {diagnostic.observacoes && (
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed">{diagnostic.observacoes}</p>
            </CardContent>
          </Card>
        )}

        {/* Ações */}
        <Card className="shadow-xl border-0 bg-gradient-to-r from-gray-50 to-gray-100">
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              {pdfData ? (
                <ShareButton
                  pdfBlob={pdfData.blob}
                  fileName={`diagnostico-${empresa?.nome || 'empresa'}-${new Date().toISOString().split('T')[0]}.pdf`}
                  companyName={empresa?.nome || 'Empresa'}
                  pdfUrl={pdfData.url}
                />
              ) : (
                <Button
                  onClick={handlePrepareShare}
                  disabled={isGeneratingPDF}
                  variant="outline"
                  className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  {isGeneratingPDF ? 'Preparando...' : '📤 Compartilhar PDF'}
                </Button>
              )}
              <Button
                onClick={() => handleScheduleCalendar(diagnostic)}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Agendar Reunião
              </Button>
              <Button
                onClick={() => handleGenerateAndDownloadPDF(diagnostic)}
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Espaçamento para o menu mobile */}
        <div className="h-20 md:h-0"></div>
      </div>
    </div>
  );
};

export default DiagnosticoView;
