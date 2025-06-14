
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface ProposalFormData {
  objetivo: string;
  valor: string;
  prazo: string;
  status: string;
  acoes_sugeridas: string[];
  empresa_id?: string;
}

interface ProposalData {
  objetivo?: string;
  valor?: number;
  prazo?: string;
  status?: string;
  acoes_sugeridas?: any;
}

interface PlanData {
  nome?: string;
  objetivo?: string;
  valor?: number;
  tarefas?: any; // Changed from string[] to any to handle Json type
}

export const useProposalForm = (proposta: ProposalData | null, plano: PlanData | null = null) => {
  const [formData, setFormData] = useState<ProposalFormData>({
    objetivo: '',
    valor: '',
    prazo: '',
    status: 'rascunho',
    acoes_sugeridas: [],
    empresa_id: ''
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

  const getTarefasArray = (tarefas: any): string[] => {
    if (!tarefas) return [];
    if (typeof tarefas === 'string') {
      try {
        const parsed = JSON.parse(tarefas);
        return Array.isArray(parsed) ? parsed.map(t => String(t)) : [tarefas];
      } catch {
        return [tarefas];
      }
    }
    if (Array.isArray(tarefas)) {
      return tarefas.map(t => String(t));
    }
    return [];
  };

  useEffect(() => {
    if (proposta) {
      // Carregar dados de proposta existente
      setFormData({
        objetivo: proposta.objetivo || '',
        valor: proposta.valor?.toString() || '',
        prazo: proposta.prazo || '',
        status: proposta.status || 'rascunho',
        acoes_sugeridas: getAcoesSugeridas(proposta.acoes_sugeridas),
        empresa_id: ''
      });
    } else if (plano) {
      // Carregar dados do plano para nova proposta
      const tarefasArray = getTarefasArray(plano.tarefas);

      setFormData({
        objetivo: plano.objetivo || '',
        valor: plano.valor?.toString() || '',
        prazo: '',
        status: 'rascunho',
        acoes_sugeridas: tarefasArray,
        empresa_id: ''
      });
    }
  }, [proposta, plano]);

  const updateFormData = (updates: Partial<ProposalFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateForm = (): boolean => {
    if (!formData.objetivo.trim() || !formData.valor.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha objetivo e valor antes de salvar.",
        variant: "destructive"
      });
      return false;
    }

    const valorNumerico = parseFloat(formData.valor);
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      toast({
        title: "Valor inválido",
        description: "O valor deve ser um número maior que zero.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  return {
    formData,
    updateFormData,
    validateForm
  };
};
