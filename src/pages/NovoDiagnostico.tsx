
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Download, Send, Save, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface EmpresaData {
  nome: string;
  setor: string;
  site_instagram: string;
  funcionarios: string;
  faturamento: string;
  whatsapp: string;
}

interface Pergunta {
  id: string;
  pergunta: string;
  categoria: string;
  tipo: string;
  opcoes: any[];
  obrigatoria: boolean;
}

interface Resposta {
  pergunta_id: string;
  resposta: string;
  score: number;
}

interface ResultadoDiagnostico {
  scoreTotal: number;
  scoreEstrategia: number;
  scoreMarketing: number;
  scoreVendas: number;
  nivel: string;
  pontosFortes: string[];
  pontosAtencao: string[];
  recomendacoes: string[];
}

export default function NovoDiagnostico() {
  const navigate = useNavigate();
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [empresaData, setEmpresaData] = useState<EmpresaData>({
    nome: '',
    setor: '',
    site_instagram: '',
    funcionarios: '',
    faturamento: '',
    whatsapp: ''
  });
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [resultado, setResultado] = useState<ResultadoDiagnostico | null>(null);
  const [loading, setLoading] = useState(false);
  const [diagnosticoId, setDiagnosticoId] = useState<string>('');

  useEffect(() => {
    if (etapaAtual === 2) {
      carregarPerguntas();
    }
  }, [etapaAtual]);

  const carregarPerguntas = async () => {
    try {
      const { data, error } = await supabase
        .from('perguntas')
        .select('*')
        .eq('ativa', true)
        .order('categoria');

      if (error) throw error;
      setPerguntas(data || []);
    } catch (error) {
      console.error('Erro ao carregar perguntas:', error);
      toast.error('Erro ao carregar perguntas');
    }
  };

  const proximaEtapa = async () => {
    if (etapaAtual === 1) {
      if (!empresaData.nome.trim()) {
        toast.error('Nome da empresa é obrigatório');
        return;
      }
      setEtapaAtual(2);
    } else if (etapaAtual === 2) {
      await processarDiagnostico();
    }
  };

  const etapaAnterior = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  const atualizarResposta = (perguntaId: string, resposta: string, score: number) => {
    setRespostas(prev => {
      const novasRespostas = prev.filter(r => r.pergunta_id !== perguntaId);
      return [...novasRespostas, { pergunta_id: perguntaId, resposta, score }];
    });
  };

  const calcularResultado = (): ResultadoDiagnostico => {
    const scoresPorCategoria: Record<string, number[]> = {
      'Estratégia': [],
      'Marketing': [],
      'Vendas': []
    };

    // Agrupar scores por categoria
    respostas.forEach(resposta => {
      const pergunta = perguntas.find(p => p.id === resposta.pergunta_id);
      if (pergunta) {
        scoresPorCategoria[pergunta.categoria]?.push(resposta.score);
      }
    });

    // Calcular médias por categoria
    const scoreEstrategia = scoresPorCategoria['Estratégia'].length > 0
      ? Math.round((scoresPorCategoria['Estratégia'].reduce((a, b) => a + b, 0) / scoresPorCategoria['Estratégia'].length) * 100 / 3)
      : 0;
    
    const scoreMarketing = scoresPorCategoria['Marketing'].length > 0
      ? Math.round((scoresPorCategoria['Marketing'].reduce((a, b) => a + b, 0) / scoresPorCategoria['Marketing'].length) * 100 / 3)
      : 0;
    
    const scoreVendas = scoresPorCategoria['Vendas'].length > 0
      ? Math.round((scoresPorCategoria['Vendas'].reduce((a, b) => a + b, 0) / scoresPorCategoria['Vendas'].length) * 100 / 3)
      : 0;

    const scoreTotal = Math.round((scoreEstrategia + scoreMarketing + scoreVendas) / 3);

    // Determinar nível
    let nivel = 'Iniciante';
    if (scoreTotal >= 75) nivel = 'Avançado';
    else if (scoreTotal >= 50) nivel = 'Intermediário';
    else if (scoreTotal >= 25) nivel = 'Emergente';

    // Gerar pontos fortes, atenção e recomendações baseados nos scores
    const pontosFortes: string[] = [];
    const pontosAtencao: string[] = [];
    const recomendacoes: string[] = [];

    if (scoreEstrategia >= 60) {
      pontosFortes.push('Boa estruturação estratégica');
    } else {
      pontosAtencao.push('Planejamento estratégico necessita melhorias');
      recomendacoes.push('Desenvolver um planejamento estratégico mais robusto');
    }

    if (scoreMarketing >= 60) {
      pontosFortes.push('Marketing digital bem estruturado');
    } else {
      pontosAtencao.push('Estratégia de marketing pode ser aprimorada');
      recomendacoes.push('Investir em marketing digital e presença online');
    }

    if (scoreVendas >= 60) {
      pontosFortes.push('Processo de vendas bem definido');
    } else {
      pontosAtencao.push('Processo comercial precisa de estruturação');
      recomendacoes.push('Implementar CRM e otimizar funil de vendas');
    }

    return {
      scoreTotal,
      scoreEstrategia,
      scoreMarketing,
      scoreVendas,
      nivel,
      pontosFortes,
      pontosAtencao,
      recomendacoes
    };
  };

  const processarDiagnostico = async () => {
    setLoading(true);
    try {
      // 1. Salvar empresa
      const { data: empresaSalva, error: empresaError } = await supabase
        .from('empresas')
        .insert(empresaData)
        .select()
        .single();

      if (empresaError) throw empresaError;

      // 2. Calcular resultado
      const resultadoCalculado = calcularResultado();
      setResultado(resultadoCalculado);

      // 3. Salvar diagnóstico
      const { data: diagnosticoSalvo, error: diagnosticoError } = await supabase
        .from('diagnosticos')
        .insert({
          empresa_id: empresaSalva.id,
          score_total: resultadoCalculado.scoreTotal,
          score_estrategia: resultadoCalculado.scoreEstrategia,
          score_marketing: resultadoCalculado.scoreMarketing,
          score_vendas: resultadoCalculado.scoreVendas,
          nivel: resultadoCalculado.nivel,
          pontos_fortes: resultadoCalculado.pontosFortes,
          pontos_atencao: resultadoCalculado.pontosAtencao,
          recomendacoes: resultadoCalculado.recomendacoes,
          status: 'concluido'
        })
        .select()
        .single();

      if (diagnosticoError) throw diagnosticoError;
      setDiagnosticoId(diagnosticoSalvo.id);

      // 4. Salvar respostas
      const respostasParaSalvar = respostas.map(r => ({
        ...r,
        diagnostico_id: diagnosticoSalvo.id
      }));

      const { error: respostasError } = await supabase
        .from('respostas')
        .insert(respostasParaSalvar);

      if (respostasError) throw respostasError;

      setEtapaAtual(3);
      toast.success('Diagnóstico concluído com sucesso!');

    } catch (error) {
      console.error('Erro ao processar diagnóstico:', error);
      toast.error('Erro ao processar diagnóstico');
    } finally {
      setLoading(false);
    }
  };

  const gerarProposta = () => {
    navigate(`/propostas?diagnostico=${diagnosticoId}`);
  };

  const baixarPDF = () => {
    // Implementação básica - em produção seria gerado um PDF real
    toast.info('Funcionalidade de PDF será implementada');
  };

  const salvarDiagnostico = () => {
    toast.success('Diagnóstico salvo com sucesso!');
    navigate('/diagnosticos');
  };

  const renderEtapa1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#0F3244]">Dados da Empresa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nome">Nome da Empresa *</Label>
            <Input
              id="nome"
              value={empresaData.nome}
              onChange={(e) => setEmpresaData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Ex: Empresa ABC Ltda"
            />
          </div>
          <div>
            <Label htmlFor="setor">Setor</Label>
            <Select value={empresaData.setor} onValueChange={(value) => setEmpresaData(prev => ({ ...prev, setor: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tecnologia">Tecnologia</SelectItem>
                <SelectItem value="varejo">Varejo</SelectItem>
                <SelectItem value="servicos">Serviços</SelectItem>
                <SelectItem value="industria">Indústria</SelectItem>
                <SelectItem value="saude">Saúde</SelectItem>
                <SelectItem value="educacao">Educação</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="site">Site/Instagram</Label>
            <Input
              id="site"
              value={empresaData.site_instagram}
              onChange={(e) => setEmpresaData(prev => ({ ...prev, site_instagram: e.target.value }))}
              placeholder="www.exemplo.com.br"
            />
          </div>
          <div>
            <Label htmlFor="funcionarios">Número de Funcionários</Label>
            <Select value={empresaData.funcionarios} onValueChange={(value) => setEmpresaData(prev => ({ ...prev, funcionarios: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-5">1 a 5</SelectItem>
                <SelectItem value="6-20">6 a 20</SelectItem>
                <SelectItem value="21-50">21 a 50</SelectItem>
                <SelectItem value="51-100">51 a 100</SelectItem>
                <SelectItem value="100+">Mais de 100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="faturamento">Faturamento Anual</Label>
            <Select value={empresaData.faturamento} onValueChange={(value) => setEmpresaData(prev => ({ ...prev, faturamento: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ate-100k">Até R$ 100 mil</SelectItem>
                <SelectItem value="100k-500k">R$ 100 mil a R$ 500 mil</SelectItem>
                <SelectItem value="500k-1m">R$ 500 mil a R$ 1 milhão</SelectItem>
                <SelectItem value="1m-5m">R$ 1 a R$ 5 milhões</SelectItem>
                <SelectItem value="5m+">Acima de R$ 5 milhões</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              value={empresaData.whatsapp}
              onChange={(e) => setEmpresaData(prev => ({ ...prev, whatsapp: e.target.value }))}
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderEtapa2 = () => {
    const categorias = ['Estratégia', 'Marketing', 'Vendas'];
    
    return (
      <div className="space-y-6">
        {categorias.map(categoria => {
          const perguntasCategoria = perguntas.filter(p => p.categoria === categoria);
          
          return (
            <Card key={categoria}>
              <CardHeader>
                <CardTitle className="text-[#0F3244]">{categoria}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {perguntasCategoria.map(pergunta => (
                  <div key={pergunta.id} className="space-y-3">
                    <Label className="text-base font-medium">
                      {pergunta.pergunta}
                      {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    
                    {pergunta.tipo === 'multipla_escolha' ? (
                      <RadioGroup
                        value={respostas.find(r => r.pergunta_id === pergunta.id)?.resposta || ''}
                        onValueChange={(value) => {
                          const opcao = pergunta.opcoes.find(o => o.texto === value);
                          if (opcao) {
                            atualizarResposta(pergunta.id, value, opcao.score);
                          }
                        }}
                      >
                        {pergunta.opcoes.map((opcao, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem value={opcao.texto} id={`${pergunta.id}-${index}`} />
                            <Label htmlFor={`${pergunta.id}-${index}`} className="font-normal">
                              {opcao.texto}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <Textarea
                        value={respostas.find(r => r.pergunta_id === pergunta.id)?.resposta || ''}
                        onChange={(e) => atualizarResposta(pergunta.id, e.target.value, 0)}
                        placeholder="Digite sua resposta..."
                        rows={3}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderEtapa3 = () => {
    if (!resultado) return null;

    const scoresPorCategoria = {
      'Estratégia': resultado.scoreEstrategia,
      'Marketing': resultado.scoreMarketing,
      'Vendas': resultado.scoreVendas
    };

    const getNivelColor = (nivel: string) => {
      const colors = {
        'Iniciante': 'bg-red-100 text-red-800',
        'Emergente': 'bg-orange-100 text-orange-800',
        'Intermediário': 'bg-blue-100 text-blue-800',
        'Avançado': 'bg-green-100 text-green-800'
      };
      return colors[nivel as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    return (
      <div className="space-y-6">
        {/* Score Total */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#0F3244]">Resultado do Diagnóstico</CardTitle>
            <div className="text-4xl font-bold text-[#3C9CD6] mt-4">
              {resultado.scoreTotal}%
            </div>
            <Badge className={`mx-auto mt-2 ${getNivelColor(resultado.nivel)}`}>
              Nível {resultado.nivel}
            </Badge>
          </CardHeader>
        </Card>

        {/* Scores por Área */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#0F3244]">Score por Área</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(scoresPorCategoria).map(([category, score]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{category}</span>
                  <span className="text-sm text-gray-600">{score}%</span>
                </div>
                <Progress value={score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pontos Fortes */}
        {resultado.pontosFortes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700">Pontos Fortes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {resultado.pontosFortes.map((ponto, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {ponto}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Pontos de Atenção */}
        {resultado.pontosAtencao.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-700">Pontos de Atenção</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {resultado.pontosAtencao.map((ponto, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-orange-500 mr-2">⚠</span>
                    {ponto}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Recomendações */}
        {resultado.recomendacoes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-[#0F3244]">Recomendações</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {resultado.recomendacoes.map((recomendacao, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#3C9CD6] mr-2">→</span>
                    {recomendacao}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Ações */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={baixarPDF} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </Button>
              <Button onClick={gerarProposta} className="bg-[#FBB03B] hover:bg-[#FBB03B]/90">
                <Send className="h-4 w-4 mr-2" />
                Gerar Proposta
              </Button>
              <Button onClick={salvarDiagnostico} className="bg-[#3C9CD6] hover:bg-[#3C9CD6]/90">
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F3244] mb-2">Novo Diagnóstico</h1>
        
        {/* Progress */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1">
            <Progress value={(etapaAtual / 3) * 100} className="h-2" />
          </div>
          <span className="text-sm text-gray-600">
            Etapa {etapaAtual} de 3
          </span>
        </div>

        {/* Etapas */}
        <div className="flex justify-between text-sm">
          <span className={etapaAtual >= 1 ? 'text-[#3C9CD6] font-medium' : 'text-gray-400'}>
            1. Dados da Empresa
          </span>
          <span className={etapaAtual >= 2 ? 'text-[#3C9CD6] font-medium' : 'text-gray-400'}>
            2. Perguntas
          </span>
          <span className={etapaAtual >= 3 ? 'text-[#3C9CD6] font-medium' : 'text-gray-400'}>
            3. Resultado
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      {etapaAtual === 1 && renderEtapa1()}
      {etapaAtual === 2 && renderEtapa2()}
      {etapaAtual === 3 && renderEtapa3()}

      {/* Navegação */}
      {etapaAtual < 3 && (
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={etapaAnterior}
            disabled={etapaAtual === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          <Button
            onClick={proximaEtapa}
            disabled={loading}
            className="bg-[#3C9CD6] hover:bg-[#3C9CD6]/90"
          >
            {loading ? 'Processando...' : (
              <>
                {etapaAtual === 2 ? 'Finalizar' : 'Próximo'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
