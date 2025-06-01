
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

interface ProposalFormData {
  objetivo: string;
  valor: string;
  prazo: string;
  status: string;
  acoes_sugeridas: string[];
}

const EditarProposta = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const proposalId = searchParams.get('id');
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ProposalFormData>({
    objetivo: '',
    valor: '',
    prazo: '',
    status: 'rascunho',
    acoes_sugeridas: []
  });

  const { data: proposta, isLoading } = useProposalEdit(proposalId);

  const updateProposalMutation = useMutation({
    mutationFn: async (data: Partial<ProposalFormData>) => {
      if (!proposalId) throw new Error('ID da proposta não encontrado');
      
      const { error } = await supabase
        .from('propostas')
        .update({
          objetivo: data.objetivo,
          valor: data.valor ? parseFloat(data.valor) : null,
          prazo: data.prazo,
          status: data.status,
          acoes_sugeridas: data.acoes_sugeridas
        })
        .eq('id', proposalId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
      queryClient.invalidateQueries({ queryKey: ['proposal', proposalId] });
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

  const getAcoesSugeridas = (acoes: any): string[] => {
    if (!acoes) return [];
    if (typeof acoes === 'string') {
      try {
        const parsed = JSON.parse(acoes);
        return Array.isArray(parsed) ? parsed : [acoes];
      } catch {
        return [acoes];
      }
    }
    if (Array.isArray(acoes)) {
      return acoes.map(acao => String(acao));
    }
    return [];
  };

  useEffect(() => {
    if (proposta) {
      setFormData({
        objetivo: proposta.objetivo || '',
        valor: proposta.valor?.toString() || '',
        prazo: proposta.prazo || '',
        status: proposta.status || 'rascunho',
        acoes_sugeridas: getAcoesSugeridas(proposta.acoes_sugeridas)
      });
    }
  }, [proposta]);

  const handleSave = () => {
    if (!formData.objetivo.trim() || !formData.valor.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha objetivo e valor antes de salvar.",
        variant: "destructive"
      });
      return;
    }

    const valorNumerico = parseFloat(formData.valor);
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      toast({
        title: "Valor inválido",
        description: "O valor deve ser um número maior que zero.",
        variant: "destructive"
      });
      return;
    }

    updateProposalMutation.mutate(formData);
  };

  const handleCancel = () => {
    navigate('/propostas');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petrol mx-auto mb-4"></div>
          <p>Carregando proposta...</p>
        </div>
      </div>
    );
  }

  if (!proposta) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Proposta não encontrada.</p>
        <Button onClick={() => navigate('/propostas')} className="bg-petrol hover:bg-petrol/90 text-white">
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
            onClick={handleCancel}
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={updateProposalMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateProposalMutation.isPending}
            className="bg-petrol hover:bg-petrol/90 text-white flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {updateProposalMutation.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      {/* Company Information */}
      {empresa && (
        <Card>
          <CardHeader>
            <CardTitle>Informações da Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Nome da Empresa</p>
                <p className="text-lg">{empresa.nome}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Cliente</p>
                <p className="text-lg">{empresa.cliente_nome || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">E-mail</p>
                <p className="text-lg">{empresa.cliente_email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Telefone</p>
                <p className="text-lg">{empresa.cliente_telefone || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Proposal Data */}
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
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valor">Valor (R$) *</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor}
                onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
                placeholder="0.00"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="prazo">Prazo</Label>
              <Input
                id="prazo"
                value={formData.prazo}
                onChange={(e) => setFormData(prev => ({ ...prev, prazo: e.target.value }))}
                placeholder="Ex: 3 meses, 6 semanas..."
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
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
