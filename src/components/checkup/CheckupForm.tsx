import { useEmpresas } from '@/hooks/useEmpresas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface CheckupFormData {
  empresa_id: string;
  mes: string;
  score_geral: number;
  roi: number;
  faturamento: number;
  destaque: string;
  recomendacoes: string;
  score_por_categoria: { categoria: string; score_anterior: number; score_atual: number }[];
  acoes: { acao: string; status: string }[];
  observacoes: string;
}

interface CheckupFormProps {
  formData: CheckupFormData;
  onChange: (data: CheckupFormData) => void;
  empresaNome?: string;
}

export const CheckupForm = ({ formData, onChange, empresaNome }: CheckupFormProps) => {
  const updateField = (field: keyof CheckupFormData, value: any) => {
    onChange({ ...formData, [field]: value });
  };

  const updateCategoria = (index: number, field: 'score_anterior' | 'score_atual', value: number) => {
    const newCategorias = [...formData.score_por_categoria];
    newCategorias[index] = { ...newCategorias[index], [field]: value };
    updateField('score_por_categoria', newCategorias);
  };

  const addAcao = () => {
    updateField('acoes', [...formData.acoes, { acao: '', status: 'pendente' }]);
  };

  const removeAcao = (index: number) => {
    const newAcoes = formData.acoes.filter((_, i) => i !== index);
    updateField('acoes', newAcoes);
  };

  const updateAcao = (index: number, field: 'acao' | 'status', value: string) => {
    const newAcoes = [...formData.acoes];
    newAcoes[index] = { ...newAcoes[index], [field]: value };
    updateField('acoes', newAcoes);
  };

  const { data: empresas } = useEmpresas();

  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader><CardTitle>Informações Básicas</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {empresaNome ? (
            <div>
              <Label htmlFor="empresa">Empresa</Label>
              <Input id="empresa" value={empresaNome} disabled className="bg-gray-100 mt-1" />
            </div>
          ) : (
            <div>
              <Label htmlFor="empresa_id">Empresa</Label>
              <select
                id="empresa_id"
                value={formData.empresa_id}
                onChange={(e) => updateField('empresa_id', e.target.value)}
                className="w-full border rounded p-2 mt-1"
              >
                <option value="">Selecione uma empresa</option>
                {empresas?.map((empresa) => (
                  <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mes">Mês *</Label>
              <Input
                id="mes"
                type="month"
                value={formData.mes}
                onChange={(e) => updateField('mes', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="score_geral">Score Geral (%)</Label>
              <Input
                id="score_geral"
                type="number"
                min="0"
                max="100"
                value={formData.score_geral}
                onChange={(e) => updateField('score_geral', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roi">ROI Estimado</Label>
              <Input
                id="roi"
                type="number"
                step="0.1"
                value={formData.roi}
                onChange={(e) => updateField('roi', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="faturamento">Faturamento (R$)</Label>
              <Input
                id="faturamento"
                type="number"
                value={formData.faturamento}
                onChange={(e) => updateField('faturamento', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Destaques e Recomendações */}
      <Card>
        <CardHeader><CardTitle>Destaques e Recomendações</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="destaque">Destaque do Mês</Label>
            <Textarea
              id="destaque"
              value={formData.destaque}
              onChange={(e) => updateField('destaque', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="recomendacoes">Recomendações</Label>
            <Textarea
              id="recomendacoes"
              value={formData.recomendacoes}
              onChange={(e) => updateField('recomendacoes', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Evolução por Categoria */}
      <Card>
        <CardHeader><CardTitle>Evolução por Categoria</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {formData.score_por_categoria.map((categoria, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
              <div>
                <Label>{categoria.categoria}</Label>
              </div>
              <div>
                <Label>Score Anterior</Label>
                <Input
                  type="number"
                  value={categoria.score_anterior}
                  onChange={(e) => updateCategoria(index, 'score_anterior', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Score Atual</Label>
                <Input
                  type="number"
                  value={categoria.score_atual}
                  onChange={(e) => updateCategoria(index, 'score_atual', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Ações do Mês */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Ações do Mês
            <Button type="button" size="sm" variant="outline" onClick={addAcao}>
              <Plus className="w-4 h-4 mr-1" /> Adicionar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.acoes.map((acao, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
              <div className="md:col-span-2">
                <Label>Ação</Label>
                <Input
                  value={acao.acao}
                  onChange={(e) => updateAcao(index, 'acao', e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>Status</Label>
                  <select
                    value={acao.status}
                    onChange={(e) => updateAcao(index, 'status', e.target.value)}
                    className="w-full h-10 border rounded px-2"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em_andamento">Em andamento</option>
                    <option value="concluida">Concluída</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
                {formData.acoes.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeAcao(index)}
                    className="mt-6"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Observações Finais */}
      <Card>
        <CardHeader><CardTitle>Observações Finais</CardTitle></CardHeader>
        <CardContent>
          <Textarea
            value={formData.observacoes}
            onChange={(e) => updateField('observacoes', e.target.value)}
            rows={4}
            placeholder="Análises adicionais sobre o mês, contexto ou plano de ação futuro..."
          />
        </CardContent>
      </Card>
    </div>
  );
};
