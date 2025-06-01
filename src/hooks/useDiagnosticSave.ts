import { toast } from '@/hooks/use-toast';
import { useSaveEmpresa, useSaveDiagnostico, useSaveRespostas } from '@/hooks/useSupabase';
import { detectBot, addSpamProtectionDelay } from '@/utils/botProtection';
import { getUserIP } from '@/utils/ipUtils';

interface SaveDiagnosticProps {
  companyData: any;
  diagnosticData: any;
  results: any;
  answers: {[key: string]: number};
  questions: any[];
  isEditing: boolean;
  onSuccess: () => void;
}

export const useDiagnosticSave = () => {
  const saveEmpresaMutation = useSaveEmpresa();
  const saveDiagnosticoMutation = useSaveDiagnostico();
  const saveRespostasMutation = useSaveRespostas();

  const saveDiagnostic = async ({
    companyData,
    diagnosticData,
    results,
    answers,
    questions,
    isEditing,
    onSuccess
  }: SaveDiagnosticProps) => {
    try {
      console.log('Starting diagnostic save process...');

      // Verificar proteção anti-bot
      const formElement = document.querySelector('form') || document.body;
      if (detectBot(formElement)) {
        toast({
          title: "Ação bloqueada",
          description: "Possível atividade de bot detectada.",
          variant: "destructive"
        });
        return;
      }

      // Delay artificial para proteção anti-spam
      await addSpamProtectionDelay();

      // Preencher dados padrão se não existirem
      const finalDiagnosticData = {
        planos: diagnosticData.planos || 'Planos personalizados baseados no diagnóstico realizado.',
        valores: diagnosticData.valores || '0',
        observacoes: diagnosticData.observacoes || 'Diagnóstico concluído automaticamente.'
      };

      if (isEditing) {
        toast({
          title: "Atualização em desenvolvimento",
          description: "A funcionalidade de atualização será implementada em breve.",
        });
        return;
      }

      // Obter IP do usuário para controle de spam
      const userIP = await getUserIP();

      // Salvar empresa primeiro
      const empresaData = {
        nome: companyData.companyName,
        cliente_nome: companyData.clientName,
        cliente_email: companyData.email,
        cliente_telefone: companyData.phone,
        site_instagram: companyData.website,
        setor: companyData.sector,
        funcionarios: companyData.employees,
        faturamento: companyData.revenue
      };

      const empresa = await saveEmpresaMutation.mutateAsync(empresaData);

      // Preparar dados do diagnóstico (incluindo IP para controle)
      const diagnosticoData = {
        empresa_id: empresa.id,
        score_total: results.overallScore,
        score_marketing: results.categoryScores.Marketing || 0,
        score_vendas: results.categoryScores.Vendas || 0,
        score_estrategia: results.categoryScores.Estratégia || 0,
        score_gestao: results.categoryScores.Gestão || 0,
        nivel: results.level,
        pontos_fortes: results.strongPoints,
        pontos_atencao: results.attentionPoints,
        recomendacoes: results.recommendations,
        planos: finalDiagnosticData.planos,
        valores: parseFloat(finalDiagnosticData.valores),
        observacoes: finalDiagnosticData.observacoes,
        status: 'concluido',
        // Nota: IP seria adicionado aqui se a coluna existisse na tabela
        // ip: userIP
      };

      const diagnostico = await saveDiagnosticoMutation.mutateAsync(diagnosticoData);

      // Salvar respostas
      const respostasData = Object.entries(answers).map(([perguntaId, score]) => {
        const question = questions.find(q => q.id === perguntaId);
        const resposta = question?.options.find(o => o.score === score)?.text || '';
        
        return {
          diagnostico_id: diagnostico.id,
          pergunta_id: perguntaId,
          score: score,
          resposta: resposta
        };
      });

      if (respostasData.length > 0) {
        await saveRespostasMutation.mutateAsync(respostasData);
      }

      toast({
        title: "Diagnóstico salvo",
        description: "O diagnóstico foi salvo com sucesso!",
      });

      onSuccess();

    } catch (error: any) {
      console.error('Erro detalhado ao salvar diagnóstico:', error);
      toast({
        title: "Erro ao salvar",
        description: `Ocorreu um erro ao salvar o diagnóstico: ${error?.message || 'Erro desconhecido'}`,
        variant: "destructive"
      });
    }
  };

  const isSaving = saveEmpresaMutation.isPending || saveDiagnosticoMutation.isPending;

  return {
    saveDiagnostic,
    isSaving
  };
};
