
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from '@/hooks/useEmpresas';
import { CheckupHeader } from '@/components/checkup/CheckupHeader';
import { CheckupForm } from '@/components/checkup/CheckupForm';

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

const NovoCheckup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const empresaId = searchParams.get('empresa_id') || '';
  const queryClient = useQueryClient();

  const { data: empresas } = useEmpresas();
  const empresa = empresas?.find(e => e.id === empresaId) || null;

  const [formData, setFormData] = useState<CheckupFormData>({
    empresa_id: empresaId,
    mes: new Date().toISOString().slice(0, 7),
    score_geral: 0,
    roi: 0,
    faturamento: 0,
    destaque: '',
    recomendacoes: '',
    score_por_categoria: [
      { categoria: 'Estratégia', score_anterior: 0, score_atual: 0 },
      { categoria: 'Marketing', score_anterior: 0, score_atual: 0 },
      { categoria: 'Vendas', score_anterior: 0, score_atual: 0 },
      { categoria: 'Gestão', score_anterior: 0, score_atual: 0 }
    ],
    acoes: [{ acao: '', status: 'pendente' }],
    observacoes: ''
  });

  const saveCheckupMutation = useMutation({
    mutationFn: async (data: CheckupFormData) => {
      const { error } = await supabase
        .from('acompanhamentos')
        .insert({
          empresa_id: data.empresa_id,
          mes: data.mes + '-01',
          score_geral: data.score_geral,
          roi: data.roi,
          faturamento: data.faturamento,
          destaque: data.destaque,
          recomendacoes: data.recomendacoes,
          score_por_categoria: data.score_por_categoria,
          acoes: data.acoes,
          observacoes: data.observacoes
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acompanhamentos'] });
      toast({
        title: "Check-up salvo",
        description: "O check-up mensal foi salvo com sucesso."
      });
      navigate('/acompanhamento');
    },
    onError: (error) => {
      console.error('Erro ao salvar check-up:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o check-up.",
        variant: "destructive"
      });
    }
  });

  const handleSave = () => {
    if (!formData.empresa_id) {
      toast({
        title: "Empresa obrigatória",
        description: "Selecione uma empresa para continuar.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.mes) {
      toast({
        title: "Mês obrigatório",
        description: "Informe o mês de referência.",
        variant: "destructive"
      });
      return;
    }

    saveCheckupMutation.mutate(formData);
  };

  const handleCancel = () => {
    navigate('/acompanhamento');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <CheckupHeader
        empresaNome={empresa?.nome}
        onCancel={handleCancel}
        onSave={handleSave}
        isSaving={saveCheckupMutation.isPending}
      />

      <CheckupForm
        formData={formData}
        onChange={setFormData}
        empresaNome={empresa?.nome}
      />
    </div>
  );
};

export default NovoCheckup;
