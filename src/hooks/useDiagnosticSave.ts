
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
      console.log('🔄 Iniciando salvamento do diagnóstico...');
      console.log('📊 Results recebidos:', results);
      console.log('📊 Category scores:', results.categoryScores);

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

      console.log('🏢 Salvando empresa:', empresaData);
      const empresa = await saveEmpresaMutation.mutateAsync(empresaData);
      console.log('✅ Empresa salva:', empresa);

      // Preparar dados do diagnóstico com scores dinâmicos
      const diagnosticoData = {
        empresa_id: empresa.id,
        score_total: results.overallScore,
        // Manter as 4 colunas principais para compatibilidade com dados antigos
        score_marketing: results.categoryScores.Marketing || results.categoryScores.marketing || 0,
        score_vendas: results.categoryScores.Vendas || results.categoryScores.vendas || 0,
        score_estrategia: results.categoryScores.Estratégia || results.categoryScores.estrategia || 0,
        score_gestao: results.categoryScores.Gestão || results.categoryScores.gestao || 0,
        // IMPORTANTE: Salvar todos os scores em formato JSON para suportar categorias dinâmicas
        scores_por_categoria: results.categoryScores,
        nivel: results.level,
        pontos_fortes: results.strongPoints,
        pontos_atencao: results.attentionPoints,
        recomendacoes: results.recommendations,
        planos: finalDiagnosticData.planos,
        valores: parseFloat(finalDiagnosticData.valores),
        observacoes: finalDiagnosticData.observacoes,
        status: 'concluido'
      };

      console.log('💾 Dados do diagnóstico para salvar:', diagnosticoData);
      console.log('📊 Scores por categoria (JSON):', diagnosticoData.scores_por_categoria);

      const diagnostico = await saveDiagnosticoMutation.mutateAsync(diagnosticoData);
      console.log('✅ Diagnóstico salvo:', diagnostico);

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
        console.log('📝 Salvando respostas:', respostasData.length, 'respostas');
        await saveRespostasMutation.mutateAsync(respostasData);
        console.log('✅ Respostas salvas');
      }

      console.log('🎉 Diagnóstico completo salvo com sucesso!');

      toast({
        title: "Diagnóstico salvo",
        description: "O diagnóstico foi salvo com sucesso!",
      });

      onSuccess();

    } catch (error: any) {
      console.error('❌ Erro detalhado ao salvar diagnóstico:', error);
      console.error('📊 Results que causaram erro:', results);
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
