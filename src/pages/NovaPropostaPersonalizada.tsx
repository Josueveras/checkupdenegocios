
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from '@/hooks/useSupabase';
import { toast } from '@/hooks/use-toast';

const NovaPropostaPersonalizada = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: empresas = [] } = useEmpresas();
  
  const [isNewClient, setIsNewClient] = useState(false);
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string>('');
  
  // Dados do cliente (se novo)
  const [newClientData, setNewClientData] = useState({
    empresaNome: '',
    clienteNome: '',
    clienteEmail: '',
    clienteTelefone: '',
    setor: ''
  });

  // Dados da proposta
  const [proposalData, setProposalData] = useState({
    objetivo: '',
    valor: '',
    prazo: '',
    acoes_sugeridas: ['']
  });

  const createProposalMutation = useMutation({
    mutationFn: async (data: any) => {
      let empresaId = selectedEmpresaId;
      
      // Se é um novo cliente, criar empresa primeiro
      if (isNewClient) {
        const { data: newEmpresa, error: empresaError } = await supabase
          .from('empresas')
          .insert({
            nome: newClientData.empresaNome,
            cliente_nome: newClientData.clienteNome,
            cliente_email: newClientData.clienteEmail,
            cliente_telefone: newClientData.clienteTelefone,
            setor: newClientData.setor
          })
          .select()
          .single();
        
        if (empresaError) throw empresaError;
        empresaId = newEmpresa.id;
      }

      // Criar diagnóstico mínimo para vincular a proposta
      const { data: diagnostico, error: diagnosticoError } = await supabase
        .from('diagnosticos')
        .insert({
          empresa_id: empresaId,
          score_total: 0,
          nivel: 'Personalizada',
          pontos_fortes: [],
          pontos_atencao: [],
          recomendacoes: {}
        })
        .select()
        .single();
      
      if (diagnosticoError) throw diagnosticoError;

      // Criar proposta
      const { data: proposta, error: propostaError } = await supabase
        .from('propostas')
        .insert({
          diagnostico_id: diagnostico.id,
          objetivo: data.objetivo,
          valor: data.valor ? parseFloat(data.valor) : null,
          prazo: data.prazo,
          acoes_sugeridas: data.acoes_sugeridas.filter(acao => acao.trim()),
          status: 'rascunho',
          tipo: 'personalizada'
        })
        .select()
        .single();
      
      if (propostaError) throw propostaError;
      return proposta;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
      toast({
        title: "Proposta criada",
        description: "A proposta personalizada foi criada com sucesso."
      });
      navigate('/propostas');
    },
    onError: (error) => {
      console.error('Erro ao criar proposta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a proposta.",
        variant: "destructive"
      });
    }
  });

  const handleAddAction = () => {
    setProposalData(prev => ({
      ...prev,
      acoes_sugeridas: [...prev.acoes_sugeridas, '']
    }));
  };

  const handleRemoveAction = (index: number) => {
    setProposalData(prev => ({
      ...prev,
      acoes_sugeridas: prev.acoes_sugeridas.filter((_, i) => i !== index)
    }));
  };

  const handleActionChange = (index: number, value: string) => {
    setProposalData(prev => ({
      ...prev,
      acoes_sugeridas: prev.acoes_sugeridas.map((action, i) => 
        i === index ? value : action
      )
    }));
  };

  const handleSave = () => {
    createProposalMutation.mutate(proposalData);
  };

  const handleBack = () => {
    navigate('/propostas');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nova Proposta Personalizada</h1>
          <p className="text-gray-600 mt-1">Crie uma proposta customizada para seu cliente</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button
                variant={!isNewClient ? "default" : "outline"}
                onClick={() => setIsNewClient(false)}
                className="flex-1"
              >
                Cliente Existente
              </Button>
              <Button
                variant={isNewClient ? "default" : "outline"}
                onClick={() => setIsNewClient(true)}
                className="flex-1"
              >
                Novo Cliente
              </Button>
            </div>

            {!isNewClient ? (
              <div className="space-y-2">
                <Label>Selecionar Empresa</Label>
                <Select value={selectedEmpresaId} onValueChange={setSelectedEmpresaId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha uma empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas.map((empresa) => (
                      <SelectItem key={empresa.id} value={empresa.id}>
                        {empresa.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome da Empresa</Label>
                  <Input
                    value={newClientData.empresaNome}
                    onChange={(e) => setNewClientData(prev => ({ ...prev, empresaNome: e.target.value }))}
                    placeholder="Digite o nome da empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nome do Cliente</Label>
                  <Input
                    value={newClientData.clienteNome}
                    onChange={(e) => setNewClientData(prev => ({ ...prev, clienteNome: e.target.value }))}
                    placeholder="Digite o nome do cliente"
                  />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    value={newClientData.clienteEmail}
                    onChange={(e) => setNewClientData(prev => ({ ...prev, clienteEmail: e.target.value }))}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    value={newClientData.clienteTelefone}
                    onChange={(e) => setNewClientData(prev => ({ ...prev, clienteTelefone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Setor</Label>
                  <Input
                    value={newClientData.setor}
                    onChange={(e) => setNewClientData(prev => ({ ...prev, setor: e.target.value }))}
                    placeholder="Ex: Tecnologia, Varejo, Serviços"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Proposta */}
        <Card>
          <CardHeader>
            <CardTitle>Dados da Proposta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Objetivo</Label>
              <Textarea
                value={proposalData.objetivo}
                onChange={(e) => setProposalData(prev => ({ ...prev, objetivo: e.target.value }))}
                placeholder="Descreva o objetivo da proposta..."
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                value={proposalData.valor}
                onChange={(e) => setProposalData(prev => ({ ...prev, valor: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Prazo</Label>
              <Input
                value={proposalData.prazo}
                onChange={(e) => setProposalData(prev => ({ ...prev, prazo: e.target.value }))}
                placeholder="Ex: 30 dias, 3 meses"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Ações Sugeridas</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddAction}>
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
              </div>
              <div className="space-y-2">
                {proposalData.acoes_sugeridas.map((acao, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={acao}
                      onChange={(e) => handleActionChange(index, e.target.value)}
                      placeholder={`Ação ${index + 1}`}
                    />
                    {proposalData.acoes_sugeridas.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveAction(index)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={createProposalMutation.isPending}
          className="bg-petrol hover:bg-petrol/90 text-white"
        >
          <Save className="mr-2 h-4 w-4" />
          {createProposalMutation.isPending ? 'Criando...' : 'Criar Proposta'}
        </Button>
      </div>
    </div>
  );
};

export default NovaPropostaPersonalizada;
