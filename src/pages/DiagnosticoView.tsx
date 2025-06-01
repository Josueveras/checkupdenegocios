
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Edit, Calendar } from 'lucide-react';
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
      <div className="text-center py-12">
        <p className="text-gray-600">Diagnóstico não encontrado.</p>
        <Button onClick={() => navigate('/diagnosticos')} className="mt-4">
          Voltar aos Diagnósticos
        </Button>
      </div>
    );
  }

  const empresa = diagnostic.empresas;

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
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    if (score >= 40) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/diagnosticos')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Diagnóstico</h1>
            <p className="text-gray-600">{empresa?.nome || 'Empresa não informada'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleGenerateAndDownloadPDF(diagnostic)}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Baixar PDF
          </Button>
          <Button
            onClick={() => navigate(`/novo-diagnostico?edit=${diagnostic.id}`)}
            className="bg-petrol hover:bg-petrol/90 text-white flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>

      {/* Informações da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Nome da Empresa</p>
              <p className="text-lg">{empresa?.nome || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Cliente</p>
              <p className="text-lg">{empresa?.cliente_nome || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">E-mail</p>
              <p className="text-lg">{empresa?.cliente_email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Telefone</p>
              <p className="text-lg">{empresa?.cliente_telefone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Data do Diagnóstico</p>
              <p className="text-lg">{new Date(diagnostic.created_at).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <Badge className={diagnostic.status === 'concluido' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                {diagnostic.status === 'concluido' ? 'Concluído' : 'Pendente'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados do Diagnóstico */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Geral */}
        <Card>
          <CardHeader>
            <CardTitle>Score Geral</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className={`text-6xl font-bold p-6 rounded-lg ${getScoreColor(diagnostic.score_total)}`}>
              {diagnostic.score_total}%
            </div>
            <div className="mt-4">
              <Badge className={`${getLevelBadge(diagnostic.nivel)} text-lg px-4 py-2`}>
                {diagnostic.nivel}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Scores por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Scores por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Marketing</span>
                <div className={`px-3 py-1 rounded-lg ${getScoreColor(diagnostic.score_marketing)}`}>
                  {diagnostic.score_marketing}%
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Vendas</span>
                <div className={`px-3 py-1 rounded-lg ${getScoreColor(diagnostic.score_vendas)}`}>
                  {diagnostic.score_vendas}%
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Estratégia</span>
                <div className={`px-3 py-1 rounded-lg ${getScoreColor(diagnostic.score_estrategia)}`}>
                  {diagnostic.score_estrategia}%
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Gestão</span>
                <div className={`px-3 py-1 rounded-lg ${getScoreColor(diagnostic.score_gestao)}`}>
                  {diagnostic.score_gestao}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pontos Fortes e de Atenção */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pontos Fortes */}
        {diagnostic.pontos_fortes && diagnostic.pontos_fortes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Pontos Fortes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {diagnostic.pontos_fortes.map((ponto: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {ponto}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Pontos de Atenção */}
        {diagnostic.pontos_atencao && diagnostic.pontos_atencao.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">Pontos de Atenção</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {diagnostic.pontos_atencao.map((ponto: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    {ponto}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recomendações */}
      {diagnostic.recomendacoes && (
        <Card>
          <CardHeader>
            <CardTitle>Recomendações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(diagnostic.recomendacoes).map(([categoria, recomendacoes]: [string, any]) => (
                <div key={categoria}>
                  <h4 className="font-semibold text-lg mb-3 text-petrol">{categoria}</h4>
                  <ul className="space-y-2">
                    {recomendacoes.map((recomendacao: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                        <span className="text-sm">{recomendacao}</span>
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
          <CardTitle>Ações</CardTitle>
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
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
            <Button
              onClick={() => navigate('/propostas')}
              variant="outline"
            >
              Gerar Proposta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosticoView;
