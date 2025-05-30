
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProposalEdit } from '@/hooks/useProposalEdit';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const EditarProposta = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const proposalId = searchParams.get('id');
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    objetivo: '',
    valor: '',
    prazo: '',
    status: 'rascunho',
    acoes_sugeridas: [] as string[]
  });

  const { data: proposta, isLoading } = useProposalEdit(proposalId);

  const updateProposalMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('propostas')
        .update(data)
        .eq('id', proposalId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
      toast({
        title: "Proposta atualizada",
        description: "A proposta foi atualizada com sucesso."
      });
      navigate('/propostas');
    },
    onError: (error) => {
      console.error('Erro ao atualizar proposta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a proposta.",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (proposta) {
      setFormData({
        objetivo: proposta.objetivo || '',
        valor: proposta.valor?.toString() || '',
        prazo: proposta.prazo || '',
        status: proposta.status || 'rascunho',
        acoes_sugeridas: proposta.acoes_sugeridas || []
      });
    }
  }, [proposta]);

  const handleSave = () => {
    if (!formData.objetivo || !formData.valor) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha objetivo e valor antes de salvar.",
        variant: "destructive"
      });
      return;
    }

    updateProposalMutation.mutate({
      objetivo: formData.objetivo,
      valor: parseFloat(formData.valor),
      prazo: formData.prazo,
      status: formData.status,
      acoes_sugeridas: formData.acoes_sugeridas
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Carregando proposta...</div>;
  }

  if (!proposta) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Proposta não encontrada.</p>
        <Button onClick={() => navigate('/propostas')} className="mt-4">
          Voltar às Propostas
        </Button>
      </div>
    );
  }

  const empresa = proposta.diagnosticos?.empresas;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/propostas')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Proposta</h1>
            <p className="text-gray-600">{empresa?.nome || 'Empresa não informada'}</p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={updateProposalMutation.isPending}
          className="bg-petrol hover:bg-petrol/90 text-white flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {updateProposalMutation.isPending ? 'Salvando...' : 'Salvar'}
        </Button>
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
          </div>
        </CardContent>
      </Card>

      {/* Dados da Proposta */}
      <Card>
        <CardHeader>
          <CardTitle>Dados da Proposta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="objetivo">Objetivo *</Label>
            <Textarea
              id="objetivo"
              value={formData.objetivo}
              onChange={(e) => setFormData(prev => ({ ...prev, objetivo: e.target.value }))}
              placeholder="Descreva o objetivo da proposta"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valor">Valor (R$) *</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="prazo">Prazo</Label>
              <Input
                id="prazo"
                value={formData.prazo}
                onChange={(e) => setFormData(prev => ({ ...prev, prazo: e.target.value }))}
                placeholder="Ex: 3 meses, 6 semanas..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="rascunho">Rascunho</option>
              <option value="enviada">Enviada</option>
              <option value="aprovada">Aprovada</option>
              <option value="rejeitada">Rejeitada</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditarProposta;
