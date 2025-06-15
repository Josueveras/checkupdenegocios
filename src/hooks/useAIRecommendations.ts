
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface DiagnosticData {
  companyName: string;
  sector: string;
  employees: string;
  revenue: string;
  overallScore: number;
  level: string;
  categoryScores: {[key: string]: number};
  strongPoints: string[];
  attentionPoints: string[];
}

interface AIRecommendations {
  recommendations: {[key: string]: string[]};
  priorityActions: string[];
  nextSteps: string;
  estimatedTimeframe: string;
  estimatedInvestment: string;
}

export const useAIRecommendations = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendations | null>(null);

  const generateRecommendations = useMutation({
    mutationFn: async (diagnosticData: DiagnosticData) => {
      console.log('🤖 Gerando recomendações IA para:', diagnosticData.companyName);
      
      const { data, error } = await supabase.functions.invoke('generate-ai-recommendations', {
        body: { diagnosticData }
      });

      if (error) {
        console.error('❌ Erro ao gerar recomendações IA:', error);
        throw error;
      }

      console.log('✅ Recomendações IA geradas:', data);
      return data.recommendations as AIRecommendations;
    },
    onSuccess: (data) => {
      setRecommendations(data);
      toast({
        title: "Recomendações IA geradas",
        description: "As recomendações personalizadas foram geradas com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('❌ Erro ao gerar recomendações:', error);
      toast({
        title: "Erro ao gerar recomendações",
        description: "Não foi possível gerar as recomendações personalizadas. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  const clearRecommendations = () => {
    setRecommendations(null);
  };

  return {
    recommendations,
    generateRecommendations: generateRecommendations.mutate,
    isGenerating: generateRecommendations.isPending,
    clearRecommendations
  };
};
