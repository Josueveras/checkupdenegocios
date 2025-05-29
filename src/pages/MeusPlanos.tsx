
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Package, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

type PlanooDB = Tables<'planos'>;

interface Plano {
  id: string;
  nome: string;
  objetivo: string;
  tarefas: string[];
  valor: number;
  categoria: string | null;
  ativo: boolean;
  created_at: string;
}

interface PlanoForm {
  nome: string;
  objetivo: string;
  tarefas: string;
  valor: string;
  categoria: string;
  ativo: boolean;
}

export default function MeusPlanos() {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [planoEditando, setPlanoEditando] = useState<Plano | null>(null);
  const [formData, setFormData] = useState<PlanoForm>({
    nome: '',
    objetivo: '',
    tarefas: '',
    valor: '',
    categoria: '',
    ativo: true
  });

  useEffect(() => {
    carregarPlanos();
  }, []);

  const carregarPlanos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('planos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Convert database format to component format
      const planosFormatted: Plano[] = (data || []).map((item: PlanooDB) => ({
        id: item.id,
        nome: item.nome,
        objetivo: item.objetivo,
        tarefas: Array.isArray(item.tarefas) ? item.tarefas as string[] : [],
        valor: Number(item.valor),
        categoria: item.categoria,
        ativo: item.ativo,
        created_at: item.created_at
      }));
      
      setPlanos(planosFormatted);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
      toast.error('Erro ao carregar planos');
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (plano?: Plano) => {
    if (plano) {
      setPlanoEditando(plano);
      setFormData({
        nome: plano.nome,
        objetivo: plano.objetivo,
        tarefas: plano.tarefas.join('\n'),
        valor: plano.valor.toString(),
        categoria: plano.categoria || '',
        ativo: plano.ativo
      });
    } else {
      setPlanoEditando(null);
      setFormData({
        nome: '',
        objetivo: '',
        tarefas: '',
        valor: '',
        categoria: '',
        ativo: true
      });
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setPlanoEditando(null);
    setFormData({
      nome: '',
      objetivo: '',
      tarefas: '',
      valor: '',
      categoria: '',
      ativo: true
    });
  };

  const salvarPlano = async () => {
    try {
      if (!formData.nome.trim() || !formData.objetivo.trim() || !formData.valor) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }

      const dadosPlano = {
        nome: formData.nome.trim(),
        objetivo: formData.objetivo.trim(),
        tarefas: formData.tarefas.split('\n').filter(t => t.trim()),
        valor: parseFloat(formData.valor),
        categoria: formData.categoria || null,
        ativo: formData.ativo
      };

      if (planoEditando) {
        const { error } = await supabase
          .from('planos')
          .update(dadosPlano)
          .eq('id', planoEditando.id);

        if (error) throw error;
        toast.success('Plano atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('planos')
          .insert(dadosPlano);

        if (error) throw error;
        toast.success('Plano criado com sucesso!');
      }

      fecharModal();
      carregarPlanos();
    } catch (error) {
      console.error('Erro ao salvar plano:', error);
      toast.error('Erro ao salvar plano');
    }
  };

  const excluirPlano = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este plano?')) return;

    try {
      const { error } = await supabase
        .from('planos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Plano excluído com sucesso!');
      carregarPlanos();
    } catch (error) {
      console.error('Erro ao excluir plano:', error);
      toast.error('Erro ao excluir plano');
    }
  };

  const toggleStatus = async (plano: Plano) => {
    try {
      const { error } = await supabase
        .from('planos')
        .update({ ativo: !plano.ativo })
        .eq('id', plano.id);

      if (error) throw error;
      toast.success(`Plano ${!plano.ativo ? 'ativado' : 'desativado'} com sucesso!`);
      carregarPlanos();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status do plano');
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getCategoriaColor = (categoria: string) => {
    const colors = {
      'Marketing': 'bg-blue-100 text-blue-800',
      'Vendas': 'bg-green-100 text-green-800',
      'Estratégia': 'bg-purple-100 text-purple-800',
      'Operacional': 'bg-orange-100 text-orange-800'
    };
    return colors[categoria as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
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
          <h1 className="text-2xl font-bold text-[#0F3244]">Meus Planos</h1>
          <p className="text-gray-600">Gerencie seus planos comerciais</p>
        </div>
        <Button 
          onClick={() => abrirModal()}
          className="bg-[#3C9CD6] hover:bg-[#3C9CD6]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      {/* Lista de Planos */}
      {planos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum plano criado</h3>
            <p className="text-gray-500 text-center mb-4">
              Crie seu primeiro plano comercial para começar a gerar propostas
            </p>
            <Button 
              onClick={() => abrirModal()}
              className="bg-[#3C9CD6] hover:bg-[#3C9CD6]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Plano
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planos.map((plano) => (
            <Card key={plano.id} className={`relative ${!plano.ativo ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-[#0F3244] text-lg mb-2">
                      {plano.nome}
                    </CardTitle>
                    {plano.categoria && (
                      <Badge className={getCategoriaColor(plano.categoria)}>
                        {plano.categoria}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => abrirModal(plano)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => excluirPlano(plano.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {plano.objetivo}
                </p>
                
                <div className="mb-4">
                  <h4 className="font-medium text-sm text-gray-900 mb-2">Tarefas incluídas:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {plano.tarefas.slice(0, 3).map((tarefa, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#3C9CD6] mr-2">•</span>
                        <span className="leading-relaxed">{tarefa}</span>
                      </li>
                    ))}
                    {plano.tarefas.length > 3 && (
                      <li className="text-gray-400 text-xs">
                        +{plano.tarefas.length - 3} tarefas adicionais
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center text-[#0F3244]">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="font-bold text-lg">
                      {formatarMoeda(plano.valor)}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant={plano.ativo ? "outline" : "default"}
                    onClick={() => toggleStatus(plano)}
                    className={plano.ativo ? "" : "bg-[#3C9CD6] hover:bg-[#3C9CD6]/90"}
                  >
                    {plano.ativo ? 'Desativar' : 'Ativar'}
                  </Button>
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
              {planoEditando ? 'Editar Plano' : 'Novo Plano'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome do Plano *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Plano Marketing Digital"
                />
              </div>
              <div>
                <Label htmlFor="categoria">Categoria</Label>
                <Select value={formData.categoria} onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Vendas">Vendas</SelectItem>
                    <SelectItem value="Estratégia">Estratégia</SelectItem>
                    <SelectItem value="Operacional">Operacional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="objetivo">Objetivo *</Label>
              <Input
                id="objetivo"
                value={formData.objetivo}
                onChange={(e) => setFormData(prev => ({ ...prev, objetivo: e.target.value }))}
                placeholder="Descreva o objetivo principal do plano"
              />
            </div>

            <div>
              <Label htmlFor="tarefas">Tarefas (uma por linha) *</Label>
              <Textarea
                id="tarefas"
                value={formData.tarefas}
                onChange={(e) => setFormData(prev => ({ ...prev, tarefas: e.target.value }))}
                placeholder="Criação de site responsivo
Configuração de Google Ads
Gestão de redes sociais"
                rows={6}
              />
            </div>

            <div>
              <Label htmlFor="valor">Valor (R$) *</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
                placeholder="0,00"
              />
            </div>

            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="ativo">Plano ativo</Label>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={fecharModal}>
                  Cancelar
                </Button>
                <Button onClick={salvarPlano} className="bg-[#3C9CD6] hover:bg-[#3C9CD6]/90">
                  {planoEditando ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
