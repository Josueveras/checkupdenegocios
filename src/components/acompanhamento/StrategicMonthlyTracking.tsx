
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Target, Plus } from 'lucide-react';
import { useEmpresas } from '@/hooks/useEmpresas';
import { useSaveAcompanhamento } from '@/hooks/useAcompanhamentos';
import { toast } from '@/hooks/use-toast';

const StrategicMonthlyTracking = () => {
  const [showCheckupForm, setShowCheckupForm] = useState(false);
  const { data: empresas } = useEmpresas();
  const saveAcompanhamento = useSaveAcompanhamento();
  
  const [checkupData, setCheckupData] = useState({
    empresa_id: '',
    mes: '',
    score_geral: '',
    faturamento: '',
    roi: '',
    destaque: '',
    recomendacoes: '',
    score_por_categoria: [{ categoria: '', score_anterior: '', score_atual: '', observacoes: '' }],
    acoes: [{ acao: '', status: 'pendente' }],
    observacoes: '',
    pontos_fortes_desenvolvidos: '',
    gargalos_atuais: '',
    estrategias_validadas: '',
    virou_case: false,
    destaque_case: ''
  });

  const handleSaveCheckup = async () => {
    // Validações básicas
    if (!checkupData.empresa_id) {
      toast({
        title: "Empresa obrigatória",
        description: "Por favor, selecione uma empresa antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    if (!checkupData.mes) {
      toast({
        title: "Mês obrigatório",
        description: "Por favor, selecione o mês de referência.",
        variant: "destructive"
      });
      return;
    }

    if (!checkupData.score_geral) {
      toast({
        title: "Score obrigatório",
        description: "Por favor, informe o score geral.",
        variant: "destructive"
      });
      return;
    }

    // Preparar dados para salvamento
    const acompanhamentoData = {
      empresa_id: checkupData.empresa_id,
      mes: checkupData.mes + '-01', // Converter para formato de data
      score_geral: parseInt(checkupData.score_geral),
      faturamento: checkupData.faturamento ? parseFloat(checkupData.faturamento) : null,
      roi: checkupData.roi ? parseFloat(checkupData.roi) : null,
      destaque: checkupData.destaque || null,
      recomendacoes: checkupData.recomendacoes || null,
      score_por_categoria: checkupData.score_por_categoria.filter(item => item.categoria).reduce((acc, item) => {
        acc[item.categoria] = {
          score_anterior: item.score_anterior ? parseInt(item.score_anterior) : null,
          score_atual: item.score_atual ? parseInt(item.score_atual) : null,
          observacoes: item.observacoes || null
        };
        return acc;
      }, {} as any),
      acoes: checkupData.acoes.filter(item => item.acao),
      observacoes: checkupData.observacoes || null,
      pontos_fortes_desenvolvidos: checkupData.pontos_fortes_desenvolvidos || null,
      gargalos_atuais: checkupData.gargalos_atuais || null,
      estrategias_validadas: checkupData.estrategias_validadas || null,
      virou_case: checkupData.virou_case,
      destaque_case: checkupData.virou_case ? checkupData.destaque_case : null
    };

    try {
      await saveAcompanhamento.mutateAsync(acompanhamentoData);
      setShowCheckupForm(false);
      // Reset form
      setCheckupData({
        empresa_id: '',
        mes: '',
        score_geral: '',
        faturamento: '',
        roi: '',
        destaque: '',
        recomendacoes: '',
        score_por_categoria: [{ categoria: '', score_anterior: '', score_atual: '', observacoes: '' }],
        acoes: [{ acao: '', status: 'pendente' }],
        observacoes: '',
        pontos_fortes_desenvolvidos: '',
        gargalos_atuais: '',
        estrategias_validadas: '',
        virou_case: false,
        destaque_case: ''
      });
    } catch (error) {
      console.error('Erro ao salvar acompanhamento:', error);
    }
  };

  const addEvolucaoCategoria = () => {
    setCheckupData(prev => ({
      ...prev,
      score_por_categoria: [...prev.score_por_categoria, { categoria: '', score_anterior: '', score_atual: '', observacoes: '' }]
    }));
  };

  const addAcaoMes = () => {
    setCheckupData(prev => ({
      ...prev,
      acoes: [...prev.acoes, { acao: '', status: 'pendente' }]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-petrol" />
          Acompanhamento Estratégico
        </CardTitle>
        <CardDescription>
          Registre mensalmente a evolução dos clientes com base nos diagnósticos, ações executadas e indicadores de resultado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={() => setShowCheckupForm(!showCheckupForm)}
          className="bg-petrol hover:bg-petrol/90 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Check-up Mensal
        </Button>

        {showCheckupForm && (
          <div className="mt-6 space-y-6 p-6 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold">Novo Check-up Mensal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="empresa_id">Empresa *</Label>
                <Select
                  value={checkupData.empresa_id}
                  onValueChange={(value) => setCheckupData(prev => ({ ...prev, empresa_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma empresa..." />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas?.map(empresa => (
                      <SelectItem key={empresa.id} value={empresa.id}>
                        {empresa.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!checkupData.empresa_id && (
                  <p className="text-sm text-red-600 mt-1">Campo obrigatório</p>
                )}
              </div>
              <div>
                <Label htmlFor="mes">Mês de Referência *</Label>
                <Input
                  id="mes"
                  type="month"
                  value={checkupData.mes}
                  onChange={(e) => setCheckupData(prev => ({ ...prev, mes: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="score_geral">Score Geral (%) *</Label>
                <Input
                  id="score_geral"
                  type="number"
                  min="0"
                  max="100"
                  value={checkupData.score_geral}
                  onChange={(e) => setCheckupData(prev => ({ ...prev, score_geral: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="faturamento">Faturamento Atual (R$)</Label>
                <Input
                  id="faturamento"
                  type="number"
                  value={checkupData.faturamento}
                  onChange={(e) => setCheckupData(prev => ({ ...prev, faturamento: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="roi">ROI Estimado (ex: 2.5x)</Label>
                <Input
                  id="roi"
                  type="number"
                  step="0.1"
                  value={checkupData.roi}
                  onChange={(e) => setCheckupData(prev => ({ ...prev, roi: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="destaque">Destaque do Mês</Label>
                <Input
                  id="destaque"
                  value={checkupData.destaque}
                  onChange={(e) => setCheckupData(prev => ({ ...prev, destaque: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="recomendacoes">Recomendações para o Próximo Ciclo</Label>
              <Textarea
                id="recomendacoes"
                rows={4}
                value={checkupData.recomendacoes}
                onChange={(e) => setCheckupData(prev => ({ ...prev, recomendacoes: e.target.value }))}
                placeholder="• Recomendação 1&#10;• Recomendação 2&#10;• Recomendação 3"
              />
            </div>

            {/* Evolução por Categoria */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Evolução por Categoria</Label>
                <Button type="button" variant="outline" size="sm" onClick={addEvolucaoCategoria}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {checkupData.score_por_categoria.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded">
                  <div>
                    <Label>Categoria</Label>
                    <Input
                      value={item.categoria}
                      onChange={(e) => {
                        const newItems = [...checkupData.score_por_categoria];
                        newItems[index].categoria = e.target.value;
                        setCheckupData(prev => ({ ...prev, score_por_categoria: newItems }));
                      }}
                    />
                  </div>
                  <div>
                    <Label>Score Anterior (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={item.score_anterior}
                      onChange={(e) => {
                        const newItems = [...checkupData.score_por_categoria];
                        newItems[index].score_anterior = e.target.value;
                        setCheckupData(prev => ({ ...prev, score_por_categoria: newItems }));
                      }}
                    />
                  </div>
                  <div>
                    <Label>Score Atual (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={item.score_atual}
                      onChange={(e) => {
                        const newItems = [...checkupData.score_por_categoria];
                        newItems[index].score_atual = e.target.value;
                        setCheckupData(prev => ({ ...prev, score_por_categoria: newItems }));
                      }}
                    />
                  </div>
                  <div>
                    <Label>Observações</Label>
                    <Input
                      value={item.observacoes}
                      onChange={(e) => {
                        const newItems = [...checkupData.score_por_categoria];
                        newItems[index].observacoes = e.target.value;
                        setCheckupData(prev => ({ ...prev, score_por_categoria: newItems }));
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Ações do Mês */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Ações do Mês</Label>
                <Button type="button" variant="outline" size="sm" onClick={addAcaoMes}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {checkupData.acoes.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded">
                  <div>
                    <Label>Ação</Label>
                    <Input
                      value={item.acao}
                      onChange={(e) => {
                        const newItems = [...checkupData.acoes];
                        newItems[index].acao = e.target.value;
                        setCheckupData(prev => ({ ...prev, acoes: newItems }));
                      }}
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={item.status}
                      onValueChange={(value) => {
                        const newItems = [...checkupData.acoes];
                        newItems[index].status = value;
                        setCheckupData(prev => ({ ...prev, acoes: newItems }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="em_andamento">Em Andamento</SelectItem>
                        <SelectItem value="concluido">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Label htmlFor="observacoes">Observações do Consultor</Label>
              <Textarea
                id="observacoes"
                rows={4}
                value={checkupData.observacoes}
                onChange={(e) => setCheckupData(prev => ({ ...prev, observacoes: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="pontos_fortes_desenvolvidos">Pontos Fortes Desenvolvidos</Label>
              <Textarea
                id="pontos_fortes_desenvolvidos"
                rows={4}
                value={checkupData.pontos_fortes_desenvolvidos}
                onChange={(e) => setCheckupData(prev => ({ ...prev, pontos_fortes_desenvolvidos: e.target.value }))}
                placeholder="Descreva os principais pontos fortes que foram desenvolvidos..."
              />
            </div>

            <div>
              <Label htmlFor="gargalos_atuais">Gargalos Atuais</Label>
              <Textarea
                id="gargalos_atuais"
                rows={4}
                value={checkupData.gargalos_atuais}
                onChange={(e) => setCheckupData(prev => ({ ...prev, gargalos_atuais: e.target.value }))}
                placeholder="Identifique os principais gargalos encontrados..."
              />
            </div>

            <div>
              <Label htmlFor="estrategias_validadas">Estratégias Validadas</Label>
              <Textarea
                id="estrategias_validadas"
                rows={4}
                value={checkupData.estrategias_validadas}
                onChange={(e) => setCheckupData(prev => ({ ...prev, estrategias_validadas: e.target.value }))}
                placeholder="Liste as estratégias que foram validadas e tiveram sucesso..."
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="virou_case"
                  checked={checkupData.virou_case}
                  onChange={(e) => setCheckupData(prev => ({ ...prev, virou_case: e.target.checked }))}
                />
                <Label htmlFor="virou_case">Este projeto virou um case?</Label>
              </div>

              {checkupData.virou_case && (
                <div>
                  <Label htmlFor="destaque_case">Destaques do Case</Label>
                  <Textarea
                    id="destaque_case"
                    rows={4}
                    value={checkupData.destaque_case}
                    onChange={(e) => setCheckupData(prev => ({ ...prev, destaque_case: e.target.value }))}
                  />
                </div>
              )}
            </div>

            <Button 
              onClick={handleSaveCheckup} 
              className="bg-petrol hover:bg-petrol/90 text-white"
              disabled={saveAcompanhamento.isPending}
            >
              {saveAcompanhamento.isPending ? 'Salvando...' : 'Salvar Check-up'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StrategicMonthlyTracking;
