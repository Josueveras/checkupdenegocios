
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

  // Validação dos dados
  const validateData = (): boolean => {
    // Validar empresa selecionada ou dados do novo cliente
    if (!isNewClient && !selectedEmpresaId) {
      toast({
        title: "Empresa obrigatória",
        description: "Selecione uma empresa para continuar.",
        variant: "destructive"
      });
      return false;
    }

    if (isNewClient) {
      if (!newClientData.empresaNome.trim() || !newClientData.clienteNome.trim()) {
        toast({
          title: "Dados do cliente obrigatórios",
          description: "Preencha o nome da empresa e do cliente.",
          variant: "destructive"
        });
        return false;
      }
    }

    // Validar dados da proposta
    if (!proposalData.objetivo.trim()) {
      toast({
        title: "Objetivo obrigatório",
        description: "Descreva o objetivo da proposta.",
        variant: "destructive"
      });
      return false;
    }

    if (!proposalData.valor.trim() || parseFloat(proposalData.valor) <= 0) {
      toast({
        title: "Valor inválido",
        description: "Informe um valor válido para a proposta.",
        variant: "destructive"
      });
      return false;
    }

    // Validar ações sugeridas (pelo menos uma não vazia)
    const acoesValidas = proposalData.acoes_sugeridas.filter(acao => acao.trim());
    if (acoesValidas.length === 0) {
      toast({
        title: "Ações obrigatórias",
        description: "Adicione pelo menos uma ação sugerida.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const createProposalMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('Iniciando criação de proposta personalizada:', data);
      
      let empresaId = selectedEmpresaId;
      
      // Se é um novo cliente, criar empresa primeiro
      if (isNewClient) {
        console.log('Criando nova empresa:', newClientData);
        const { data: newEmpresa, error: empresaError } = await supabase
          .from('empresas')
          .insert({
            nome: newClientData.empresaNome,
            cliente_nome: newClientData.clienteNome,
            cliente_email: newClientData.clienteEmail || null,
            cliente_telefone: newClientData.clienteTelefone || null,
            setor: newClientData.setor || null
          })
          .select()
          .single();
        
        if (empresaError) {
          console.error('Erro ao criar empresa:', empresaError);
          throw empresaError;
        }
        
        console.log('Empresa criada com sucesso:', newEmpresa);
        empresaId = newEmpresa.id;
      }

      // Criar diagnóstico com scores obrigatórios
      const diagnosticoData = {
        empresa_id: empresaId,
        score_estrategia: 50, // Valor padrão para proposta personalizada
        score_marketing: 50,
        score_vendas: 50,
        score_total: 50, // Média dos scores
        nivel: 'Personalizada',
        pontos_fortes: ['Proposta personalizada'],
        pontos_atencao: ['Avaliar implementação'],
        recomendacoes: {
          estrategia: ['Implementar ações sugeridas'],
          marketing: ['Avaliar estratégias de marketing'],
          vendas: ['Otimizar processo de vendas']
        },
        status: 'concluido'
      };

      console.log('Criando diagnóstico:', diagnosticoData);
      const { data: diagnostico, error: diagnosticoError } = await supabase
        .from('diagnosticos')
        .insert(diagnosticoData)
        .select()
        .single();
      
      if (diagnosticoError) {
        console.error('Erro ao criar diagnóstico:', diagnosticoError);
        throw diagnosticoError;
      }

      console.log('Diagnóstico criado com sucesso:', diagnostico);

      // Criar proposta
      const acoesLimpas = data.acoes_sugeridas.filter((acao: string) => acao.trim());
      const valorNumerico = parseFloat(data.valor) || 0;

      const propostaData = {
        diagnostico_id: diagnostico.id,
        objetivo: data.objetivo,
        valor: valorNumerico,
        prazo: data.prazo || null,
        acoes_sugeridas: acoesLimpas,
        status: 'rascunho'
      };

      console.log('Criando proposta:', propostaData);
      const { data: proposta, error: propostaError } = await supabase
        .from('propostas')
        .insert(propostaData)
        .select()
        .single();
      
      if (propostaError) {
        console.error('Erro ao criar proposta:', propostaError);
        throw propostaError;
      }

      console.log('Proposta criada com sucesso:', proposta);
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
      console.error('Erro detalhado ao criar proposta:', error);
      toast({
        title: "Erro ao criar proposta",
        description: "Não foi possível criar a proposta. Verifique os dados e tente novamente.",
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
    if (proposalData.acoes_sugeridas.length > 1) {
      setProposalData(prev => ({
        ...prev,
        acoes_sugeridas: prev.acoes_sugeridas.filter((_, i) => i !== index)
      }));
    }
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
    if (!validateData()) return;
    createProposalMutation.mutate(proposalData);
  };

  const handleBack = () => {
    navigate('/propostas');
  };

  const isLoading = createProposalMutation.isPending;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handleBack} disabled={isLoading}>
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
                disabled={isLoading}
              >
                Cliente Existente
              </Button>
              <Button
                variant={isNewClient ? "default" : "outline"}
                onClick={() => setIsNewClient(true)}
                className="flex-1"
                disabled={isLoading}
              >
                Novo Cliente
              </Button>
            </div>

            {!isNewClient ? (
              <div className="space-y-2">
                <Label>Selecionar Empresa *</Label>
                <Select value={selectedEmpresaId} onValueChange={setSelectedEmpresaId} disabled={isLoading}>
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
                  <Label>Nome da Empresa *</Label>
                  <Input
                    value={newClientData.empresaNome}
                    onChange={(e) => setNewClientData(prev => ({ ...prev, empresaNome: e.target.value }))}
                    placeholder="Digite o nome da empresa"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nome do Cliente *</Label>
                  <Input
                    value={newClientData.clienteNome}
                    onChange={(e) => setNewClientData(prev => ({ ...prev, clienteNome: e.target.value }))}
                    placeholder="Digite o nome do cliente"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    value={newClientData.clienteEmail}
                    onChange={(e) => setNewClientData(prev => ({ ...prev, clienteEmail: e.target.value }))}
                    placeholder="email@exemplo.com"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    value={newClientData.clienteTelefone}
                    onChange={(e) => setNewClientData(prev => ({ ...prev, clienteTelefone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Setor</Label>
                  <Input
                    value={newClientData.setor}
                    onChange={(e) => setNewClientData(prev => ({ ...prev, setor: e.target.value }))}
                    placeholder="Ex: Tecnologia, Varejo, Serviços"
                    disabled={isLoading}
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
              <Label>Objetivo *</Label>
              <Textarea
                value={proposalData.objetivo}
                onChange={(e) => setProposalData(prev => ({ ...prev, objetivo: e.target.value }))}
                placeholder="Descreva o objetivo da proposta..."
                className="min-h-[100px]"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Valor (R$) *</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={proposalData.valor}
                onChange={(e) => setProposalData(prev => ({ ...prev, valor: e.target.value }))}
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Prazo</Label>
              <Input
                value={proposalData.prazo}
                onChange={(e) => setProposalData(prev => ({ ...prev, prazo: e.target.value }))}
                placeholder="Ex: 30 dias, 3 meses"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Ações Sugeridas *</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddAction}
                  disabled={isLoading}
                >
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
                      disabled={isLoading}
                    />
                    {proposalData.acoes_sugeridas.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveAction(index)}
                        disabled={isLoading}
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
          disabled={isLoading}
          className="bg-petrol hover:bg-petrol/90 text-white"
        >
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Criando...' : 'Criar Proposta'}
        </Button>
      </div>
    </div>
  );
};

export default NovaPropostaPersonalizada;
