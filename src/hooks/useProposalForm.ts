
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface ProposalFormData {
  objetivo: string;
  valor: string;
  prazo: string;
  status: string;
  acoes_sugeridas: string[];
}

interface ProposalData {
  objetivo?: string;
  valor?: number;
  prazo?: string;
  status?: string;
  acoes_sugeridas?: any;
}

export const useProposalForm = (proposta: ProposalData | null) => {
  const [formData, setFormData] = useState<ProposalFormData>({
    objetivo: '',
    valor: '',
    prazo: '',
    status: 'rascunho',
    acoes_sugeridas: []
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
