
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Target, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const StrategicMonthlyTracking = () => {
  const [showCheckupForm, setShowCheckupForm] = useState(false);
  const [checkupData, setCheckupData] = useState({
    mes_referencia: '',
    nome_empresa: '',
    score_geral: '',
    faturamento_atual: '',
    roi_estimado: '',
    destaque_mes: '',
    recomendacoes: '',
    evolucao_categorias: [{ categoria: '', score_anterior: '', score_atual: '', observacoes: '' }],
    acoes_mes: [{ acao: '', status: 'pendente' }],
    observacoes_consultor: '',
    pontos_fortes_desenvolvidos: '',
    gargalos_atuais: '',
    estrategias_validadas: '',
    is_case: false,
    destaques_case: ''
  });

  const handleSaveCheckup = () => {
    toast({
      title: "Check-up salvo",
      description: "Acompanhamento mensal registrado com sucesso!"
    });
    setShowCheckupForm(false);
    setCheckupData({
      mes_referencia: '',
      nome_empresa: '',
      score_geral: '',
      faturamento_atual: '',
      roi_estimado: '',
      destaque_mes: '',
      recomendacoes: '',
      evolucao_categorias: [{ categoria: '', score_anterior: '', score_atual: '', observacoes: '' }],
      acoes_mes: [{ acao: '', status: 'pendente' }],
      observacoes_consultor: '',
      pontos_fortes_desenvolvidos: '',
      gargalos_atuais: '',
      estrategias_validadas: '',
      is_case: false,
      destaques_case: ''
    });
  };

  const addEvolucaoCategoria = () => {
    setCheckupData(prev => ({
      ...prev,
      evolucao_categorias: [...prev.evolucao_categorias, { categoria: '', score_anterior: '', score_atual: '', observacoes: '' }]
    }));
  };

  const addAcaoMes = () => {
    setCheckupData(prev => ({
      ...prev,
      acoes_mes: [...prev.acoes_mes, { acao: '', status: 'pendente' }]
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
                <Label htmlFor="mes_referencia">Mês de Referência</Label>
                <Input
                  id="mes_referencia"
                  type="month"
                  value={checkupData.mes_referencia}
                  onChange={(e) => setCheckupData(prev => ({ ...prev, mes_referencia: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="nome_empresa">Nome da Empresa</Label>
                <Input
                  id="nome_empresa"
                  value={checkupData.nome_empresa}
                  onChange={(e) => setCheckupData(prev => ({ ...prev, nome_empresa: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="score_geral">Score Geral (%)</Label>
                <Input
                  id="score_geral"
                  type="number"
                  min="0"
                  max="100"
                  value={checkupData.score_geral}
                  onChange={(e) => setCheckupData(prev => ({ ...prev, score_geral: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="faturamento_atual">Faturamento Atual (R$)</Label>
                <Input
                  id="faturamento_atual"
                  type="number"
                  value={checkupData.faturamento_atual}
                  onChange={(e) => setCheckupData(prev => ({ ...prev, faturamento_atual: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="roi_estimado">ROI Estimado (ex: 2.5x)</Label>
                <Input
                  id="roi_estimado"
                  type="number"
                  step="0.1"
                  value={checkupData.roi_estimado}
                  onChange={(e) => setCheckupData(prev => ({ ...prev, roi_estimado: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="destaque_mes">Destaque do Mês</Label>
                <Input
                  id="destaque_mes"
                  value={checkupData.destaque_mes}
                  onChange={(e) => setCheckupData(prev => ({ ...prev, destaque_mes: e.target.value }))}
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
              {checkupData.evolucao_categorias.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded">
                  <div>
                    <Label>Categoria</Label>
                    <Input
                      value={item.categoria}
                      onChange={(e) => {
                        const newItems = [...checkupData.evolucao_categorias];
                        newItems[index].categoria = e.target.value;
                        setCheckupData(prev => ({ ...prev, evolucao_categorias: newItems }));
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
                        const newItems = [...checkupData.evolucao_categorias];
                        newItems[index].score_anterior = e.target.value;
                        setCheckupData(prev => ({ ...prev, evolucao_categorias: newItems }));
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
                        const newItems = [...checkupData.evolucao_categorias];
                        newItems[index].score_atual = e.target.value;
                        setCheckupData(prev => ({ ...prev, evolucao_categorias: newItems }));
                      }}
                    />
                  </div>
                  <div>
                    <Label>Observações</Label>
                    <Input
                      value={item.observacoes}
                      onChange={(e) => {
                        const newItems = [...checkupData.evolucao_categorias];
                        newItems[index].observacoes = e.target.value;
                        setCheckupData(prev => ({ ...prev, evolucao_categorias: newItems }));
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
              {checkupData.acoes_mes.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded">
                  <div>
                    <Label>Ação</Label>
                    <Input
                      value={item.acao}
                      onChange={(e) => {
                        const newItems = [...checkupData.acoes_mes];
                        newItems[index].acao = e.target.value;
                        setCheckupData(prev => ({ ...prev, acoes_mes: newItems }));
                      }}
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={item.status}
                      onValueChange={(value) => {
                        const newItems = [...checkupData.acoes_mes];
                        newItems[index].status = value;
                        setCheckupData(prev => ({ ...prev, acoes_mes: newItems }));
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
              <Label htmlFor="observacoes_consultor">Observações do Consultor</Label>
              <Textarea
                id="observacoes_consultor"
                rows={4}
                value={checkupData.observacoes_consultor}
                onChange={(e) => setCheckupData(prev => ({ ...prev, observacoes_consultor: e.target.value }))}
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
                  id="is_case"
                  checked={checkupData.is_case}
                  onChange={(e) => setCheckupData(prev => ({ ...prev, is_case: e.target.checked }))}
                />
                <Label htmlFor="is_case">Este projeto virou um case?</Label>
              </div>

              {checkupData.is_case && (
                <div>
                  <Label htmlFor="destaques_case">Destaques do Case</Label>
                  <Textarea
                    id="destaques_case"
                    rows={4}
                    value={checkupData.destaques_case}
                    onChange={(e) => setCheckupData(prev => ({ ...prev, destaques_case: e.target.value }))}
                  />
                </div>
              )}
            </div>

            <Button onClick={handleSaveCheckup} className="bg-petrol hover:bg-petrol/90 text-white">
              Salvar Check-up
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StrategicMonthlyTracking;
