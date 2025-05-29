
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, HelpCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Pergunta {
  id: string;
  pergunta: string;
  categoria: string;
  tipo: string;
  opcoes: any[];
  obrigatoria: boolean;
  ativa: boolean;
  created_at: string;
}

interface PerguntaForm {
  pergunta: string;
  categoria: string;
  tipo: string;
  opcoes: string;
  obrigatoria: boolean;
  ativa: boolean;
}

export default function EditorPerguntas() {
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [perguntaEditando, setPerguntaEditando] = useState<Pergunta | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [formData, setFormData] = useState<PerguntaForm>({
    pergunta: '',
    categoria: '',
    tipo: 'multipla_escolha',
    opcoes: '',
    obrigatoria: false,
    ativa: true
  });

  useEffect(() => {
    carregarPerguntas();
  }, []);

  const carregarPerguntas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('perguntas')
        .select('*')
        .order('categoria, created_at');

      if (error) throw error;
      setPerguntas(data || []);
    } catch (error) {
      console.error('Erro ao carregar perguntas:', error);
      toast.error('Erro ao carregar perguntas');
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (pergunta?: Pergunta) => {
    if (pergunta) {
      setPerguntaEditando(pergunta);
      setFormData({
        pergunta: pergunta.pergunta,
        categoria: pergunta.categoria,
        tipo: pergunta.tipo,
        opcoes: pergunta.opcoes.map(o => `${o.texto}|${o.score}`).join('\n'),
        obrigatoria: pergunta.obrigatoria,
        ativa: pergunta.ativa
      });
    } else {
      setPerguntaEditando(null);
      setFormData({
        pergunta: '',
        categoria: '',
        tipo: 'multipla_escolha',
        opcoes: '',
        obrigatoria: false,
        ativa: true
      });
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setPerguntaEditando(null);
    setFormData({
      pergunta: '',
      categoria: '',
      tipo: 'multipla_escolha',
      opcoes: '',
      obrigatoria: false,
      ativa: true
    });
  };

  const salvarPergunta = async () => {
    try {
      if (!formData.pergunta.trim() || !formData.categoria) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }

      let opcoesParsed = [];
      if (formData.tipo === 'multipla_escolha' && formData.opcoes.trim()) {
        opcoesParsed = formData.opcoes.split('\n')
          .filter(linha => linha.trim())
          .map(linha => {
            const [texto, score] = linha.split('|');
            return {
              texto: texto.trim(),
              score: parseInt(score) || 0
            };
          });
      }

      const dadosPergunta = {
        pergunta: formData.pergunta.trim(),
        categoria: formData.categoria,
        tipo: formData.tipo,
        opcoes: opcoesParsed,
        obrigatoria: formData.obrigatoria,
        ativa: formData.ativa
      };

      if (perguntaEditando) {
        const { error } = await supabase
          .from('perguntas')
          .update(dadosPergunta)
          .eq('id', perguntaEditando.id);

        if (error) throw error;
        toast.success('Pergunta atualizada com sucesso!');
      } else {
        const { error } = await supabase
          .from('perguntas')
          .insert(dadosPergunta);

        if (error) throw error;
        toast.success('Pergunta criada com sucesso!');
      }

      fecharModal();
      carregarPerguntas();
    } catch (error) {
      console.error('Erro ao salvar pergunta:', error);
      toast.error('Erro ao salvar pergunta');
    }
  };

  const excluirPergunta = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta pergunta?')) return;

    try {
      const { error } = await supabase
        .from('perguntas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Pergunta excluída com sucesso!');
      carregarPerguntas();
    } catch (error) {
      console.error('Erro ao excluir pergunta:', error);
      toast.error('Erro ao excluir pergunta');
    }
  };

  const toggleStatus = async (pergunta: Pergunta) => {
    try {
      const { error } = await supabase
        .from('perguntas')
        .update({ ativa: !pergunta.ativa })
        .eq('id', pergunta.id);

      if (error) throw error;
      toast.success(`Pergunta ${!pergunta.ativa ? 'ativada' : 'desativada'} com sucesso!`);
      carregarPerguntas();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status da pergunta');
    }
  };

  const perguntasFiltradas = filtroCategoria 
    ? perguntas.filter(p => p.categoria === filtroCategoria)
    : perguntas;

  const categorias = [...new Set(perguntas.map(p => p.categoria))];

  const getCategoriaColor = (categoria: string) => {
    const colors = {
      'Marketing': 'bg-blue-100 text-blue-800',
      'Vendas': 'bg-green-100 text-green-800',
      'Estratégia': 'bg-purple-100 text-purple-800'
    };
    return colors[categoria as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0F3244]">Editor de Perguntas</h1>
          <p className="text-gray-600">Gerencie as perguntas dos diagnósticos</p>
        </div>
        <Button 
          onClick={() => abrirModal()}
          className="bg-[#3C9CD6] hover:bg-[#3C9CD6]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Pergunta
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <Label>Filtrar por categoria:</Label>
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as categorias</SelectItem>
                {categorias.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filtroCategoria && (
              <Button variant="outline" onClick={() => setFiltroCategoria('')}>
                Limpar filtro
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Perguntas */}
      {perguntasFiltradas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <HelpCircle className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma pergunta encontrada</h3>
            <p className="text-gray-500 text-center mb-4">
              {filtroCategoria 
                ? `Nenhuma pergunta encontrada para a categoria "${filtroCategoria}"`
                : 'Crie sua primeira pergunta para começar a fazer diagnósticos'
              }
            </p>
            <Button 
              onClick={() => abrirModal()}
              className="bg-[#3C9CD6] hover:bg-[#3C9CD6]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Pergunta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {perguntasFiltradas.map((pergunta) => (
            <Card key={pergunta.id} className={`${!pergunta.ativa ? 'opacity-60' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCategoriaColor(pergunta.categoria)}>
                        {pergunta.categoria}
                      </Badge>
                      {pergunta.obrigatoria && (
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          Obrigatória
                        </Badge>
                      )}
                      <Badge variant="outline" className={pergunta.ativa ? 'text-green-600 border-green-600' : 'text-gray-600 border-gray-600'}>
                        {pergunta.ativa ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-[#0F3244] mb-2">
                      {pergunta.pergunta}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Tipo: {pergunta.tipo === 'multipla_escolha' ? 'Múltipla escolha' : 'Texto livre'}
                    </p>
                    {pergunta.tipo === 'multipla_escolha' && pergunta.opcoes.length > 0 && (
                      <div className="text-sm text-gray-600">
                        <strong>Opções:</strong>
                        <ul className="mt-1 ml-4">
                          {pergunta.opcoes.map((opcao, index) => (
                            <li key={index} className="list-disc">
                              {opcao.texto} (Score: {opcao.score})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleStatus(pergunta)}
                      title={pergunta.ativa ? 'Desativar' : 'Ativar'}
                    >
                      {pergunta.ativa ? (
                        <ToggleRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => abrirModal(pergunta)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => excluirPergunta(pergunta.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Criação/Edição */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#0F3244]">
              {perguntaEditando ? 'Editar Pergunta' : 'Nova Pergunta'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="pergunta">Pergunta *</Label>
              <Textarea
                id="pergunta"
                value={formData.pergunta}
                onChange={(e) => setFormData(prev => ({ ...prev, pergunta: e.target.value }))}
                placeholder="Digite a pergunta..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categoria">Categoria *</Label>
                <Select value={formData.categoria} onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Estratégia">Estratégia</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Vendas">Vendas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tipo">Tipo de Resposta</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multipla_escolha">Múltipla Escolha</SelectItem>
                    <SelectItem value="texto_livre">Texto Livre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.tipo === 'multipla_escolha' && (
              <div>
                <Label htmlFor="opcoes">
                  Opções de Resposta (formato: Texto da opção|Score)
                </Label>
                <Textarea
                  id="opcoes"
                  value={formData.opcoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, opcoes: e.target.value }))}
                  placeholder="Não temos estratégia definida|0
Temos algumas ações isoladas|1
Temos estratégia básica implementada|2
Temos estratégia completa e bem executada|3"
                  rows={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Uma opção por linha. Use o formato: "Texto da opção|Score" (ex: "Sim, temos|3")
                </p>
              </div>
            )}

            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="obrigatoria"
                    checked={formData.obrigatoria}
                    onChange={(e) => setFormData(prev => ({ ...prev, obrigatoria: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="obrigatoria">Pergunta obrigatória</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="ativa"
                    checked={formData.ativa}
                    onChange={(e) => setFormData(prev => ({ ...prev, ativa: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="ativa">Pergunta ativa</Label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={fecharModal}>
                  Cancelar
                </Button>
                <Button onClick={salvarPergunta} className="bg-[#3C9CD6] hover:bg-[#3C9CD6]/90">
                  {perguntaEditando ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
