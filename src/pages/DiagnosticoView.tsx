
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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

  // Função para extrair scores dinâmicos com type safety
  const getDynamicCategoryScores = (): {[key: string]: number} => {
    const scores: {[key: string]: number} = {};
    
    // Primeiro, tentar usar scores_por_categoria se existir
    if (diagnostic.scores_por_categoria && typeof diagnostic.scores_por_categoria === 'object') {
      const dynamicScores = diagnostic.scores_por_categoria;
      
      // Garantir que todos os valores são números
      Object.entries(dynamicScores).forEach(([key, value]) => {
        if (typeof value === 'number') {
          scores[key] = value;
        } else if (typeof value === 'string' && !isNaN(parseFloat(value))) {
          scores[key] = parseFloat(value);
        }
      });
      
      // Se encontrou scores válidos, retornar
      if (Object.keys(scores).length > 0) {
        return scores;
      }
    }
    
    // Fallback para as categorias hardcoded
    if (typeof diagnostic.score_marketing === 'number') scores['Marketing'] = diagnostic.score_marketing;
    if (typeof diagnostic.score_vendas === 'number') scores['Vendas'] = diagnostic.score_vendas;
    if (typeof diagnostic.score_estrategia === 'number') scores['Estratégia'] = diagnostic.score_estrategia;
    if (typeof diagnostic.score_gestao === 'number') scores['Gestão'] = diagnostic.score_gestao;
    
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
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";
    if (score >= 40) return "bg-orange-50 border-orange-200";
    return "bg-red-50 border-red-200";
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      "Avançado": "bg-green-100 text-green-800 border-green-300",
      "Intermediário": "bg-yellow-100 text-yellow-800 border-yellow-300",
      "Emergente": "bg-orange-100 text-orange-800 border-orange-300",
      "Iniciante": "bg-red-100 text-red-800 border-red-300"
    };
    return colors[level as keyof typeof colors] || colors["Iniciante"];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="bg-petrol text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/diagnosticos')}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <div>
                  <CardTitle className="text-2xl font-bold">Diagnóstico Empresarial</CardTitle>
                  <p className="text-lg text-white/90 mt-1">{empresa?.nome || 'Empresa não informada'}</p>
                  <p className="text-white/80">{new Date(diagnostic.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={() => handleGenerateAndDownloadPDF(diagnostic)}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button
                  onClick={() => navigate(`/novo-diagnostico?edit=${diagnostic.id}`)}
                  className="bg-white text-petrol hover:bg-white/90"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Score Geral */}
        <Card className={getScoreBg(diagnostic.score_total)} >
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor(diagnostic.score_total)} mb-2`}>
                  {diagnostic.score_total}%
                </div>
                <div className="text-xl text-gray-600 mb-4">Score Geral</div>
                <Badge className={`${getLevelBadge(diagnostic.nivel)} text-base px-4 py-2 border`}>
                  {diagnostic.nivel}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações da Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Informações da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Nome da Empresa", value: empresa?.nome },
                { label: "Cliente", value: empresa?.cliente_nome },
                { label: "E-mail", value: empresa?.cliente_email },
                { label: "Telefone", value: empresa?.cliente_telefone },
                { label: "Setor", value: empresa?.setor },
                { label: "Status", value: diagnostic.status === 'concluido' ? 'Concluído' : 'Pendente' }
              ].map((item, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">{item.label}</p>
                  <p className="text-base text-gray-900 break-words">{item.value || 'N/A'}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scores por Categoria - Dinâmico */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Scores por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Object.entries(categoryScores).map(([category, score]) => (
                <div key={category} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{category}</span>
                    <div className={`px-3 py-1 rounded-full font-bold ${getScoreColor(score)} ${getScoreBg(score)} border`}>
                      {score}%
                    </div>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pontos Fortes e de Atenção */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {diagnostic.pontos_fortes && diagnostic.pontos_fortes.length > 0 && (
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Pontos Fortes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {diagnostic.pontos_fortes.map((ponto: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{ponto}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {diagnostic.pontos_atencao && diagnostic.pontos_atencao.length > 0 && (
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-orange-700 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Pontos de Atenção
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {diagnostic.pontos_atencao.map((ponto: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Recomendações Estratégicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(diagnostic.recomendacoes).map(([categoria, recomendacoes]: [string, any]) => (
                  <div key={categoria} className="space-y-3">
                    <h4 className="font-bold text-lg text-petrol border-b border-gray-200 pb-2">
                      {categoria}
                    </h4>
                    <ul className="space-y-2">
                      {recomendacoes.map((recomendacao: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{recomendacao}</span>
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
          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{diagnostic.observacoes}</p>
            </CardContent>
          </Card>
        )}

        {/* Ações */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
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
