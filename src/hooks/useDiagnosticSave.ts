import { toast } from '@/hooks/use-toast';
import { useSaveEmpresa, useUpdateEmpresa } from '@/hooks/useEmpresas';
import { useSaveDiagnostico, useUpdateDiagnostico } from '@/hooks/useDiagnosticos';
import { useSaveRespostas, useUpdateRespostas } from '@/hooks/useRespostas';
import { detectBot, addSpamProtectionDelay } from '@/utils/botProtection';
import { getUserIP } from '@/utils/ipUtils';
import { supabase } from '@/integrations/supabase/client';

interface SaveDiagnosticProps {
  companyData: any;
  diagnosticData: any;
  results: any;
  answers: {[key: string]: number};
  questions: any[];
  isEditing: boolean;
  editId?: string;
  onSuccess: () => void;
}

// Função para mapear categorias dinâmicas para as 4 colunas fixas
const mapCategoryToColumn = (category: string): string => {
  const categoryLower = category.toLowerCase();
  
  // Mapeamento inteligente de categorias para as 4 colunas existentes
  if (categoryLower.includes('marketing') || categoryLower.includes('comunicação')) {
    return 'marketing';
  } else if (categoryLower.includes('vendas') || categoryLower.includes('comercial')) {
    return 'vendas';
  } else if (categoryLower.includes('estratégia') || categoryLower.includes('planejamento') || categoryLower.includes('financeiro')) {
    return 'estrategia';
  } else {
    // Tecnologia, RH, Gestão, etc. -> gestão
    return 'gestao';
  }
};

export const useDiagnosticSave = () => {
  const saveEmpresaMutation = useSaveEmpresa();
  const saveDiagnosticoMutation = useSaveDiagnostico();
  const saveRespostasMutation = useSaveRespostas();
  const updateEmpresaMutation = useUpdateEmpresa();
  const updateDiagnosticoMutation = useUpdateDiagnostico();
  const updateRespostasMutation = useUpdateRespostas();

  const saveDiagnostic = async ({
    companyData,
    diagnosticData,
    results,
    answers,
    questions,
    isEditing,
    editId,
    onSuccess
  }: SaveDiagnosticProps) => {
    try {
      console.log('🔄 Iniciando', isEditing ? 'atualização' : 'salvamento', 'do diagnóstico...');
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

      // Obter IP do usuário para controle de spam
      const userIP = await getUserIP();

      // Mapear categorias dinâmicas para as 4 colunas fixas
      const mappedScores = {
        marketing: 0,
        vendas: 0,
        estrategia: 0,
        gestao: 0
      };

      // Distribuir scores das categorias dinâmicas nas 4 colunas fixas
      Object.entries(results.categoryScores).forEach(([category, score]) => {
        const columnKey = mapCategoryToColumn(category);
        // Se várias categorias mapeiam para a mesma coluna, usar a maior pontuação
        mappedScores[columnKey as keyof typeof mappedScores] = Math.max(
          mappedScores[columnKey as keyof typeof mappedScores], 
          score as number
        );
      });

      console.log('🗂️ Mapeamento de categorias:', results.categoryScores, '→', mappedScores);

      let empresa: any;
      let diagnostico: any;

      if (isEditing && editId) {
        console.log('🔄 Modo de edição ativado para ID:', editId);
        
        // Buscar dados do diagnóstico atual para obter empresa_id
        const { data: currentDiagnostic } = await supabase
          .from('diagnosticos')
          .select('empresa_id, empresas(*)')
          .eq('id', editId)
          .single();

        if (!currentDiagnostic) {
          throw new Error('Diagnóstico não encontrado para edição');
        }

        // Atualizar dados da empresa
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

        console.log('🏢 Atualizando empresa:', empresaData);
        empresa = await updateEmpresaMutation.mutateAsync({
          id: currentDiagnostic.empresa_id,
          empresaData
        });
        console.log('✅ Empresa atualizada:', empresa);

        // Preparar dados do diagnóstico para atualização
        const diagnosticoData = {
          score_total: results.overallScore,
          score_marketing: mappedScores.marketing,
          score_vendas: mappedScores.vendas,
          score_estrategia: mappedScores.estrategia,
          score_gestao: mappedScores.gestao,
          nivel: results.level,
          pontos_fortes: results.strongPoints,
          pontos_atencao: results.attentionPoints,
          recomendacoes: results.recommendations,
          planos: finalDiagnosticData.planos,
          valores: parseFloat(finalDiagnosticData.valores),
          observacoes: finalDiagnosticData.observacoes,
          status: 'concluido'
        };

        console.log('💾 Atualizando diagnóstico:', diagnosticoData);
        diagnostico = await updateDiagnosticoMutation.mutateAsync({
          id: editId,
          diagnosticoData
        });
        console.log('✅ Diagnóstico atualizado:', diagnostico);

        // Atualizar respostas (deletar antigas e inserir novas)
        const respostasData = Object.entries(answers).map(([perguntaId, score]) => {
          const question = questions.find(q => q.id === perguntaId);
          const resposta = question?.options.find(o => o.score === score)?.text || '';
          
          return {
            diagnostico_id: editId,
            pergunta_id: perguntaId,
            score: score,
            resposta: resposta
          };
        });

        if (respostasData.length > 0) {
          console.log('📝 Atualizando respostas:', respostasData.length, 'respostas');
          await updateRespostasMutation.mutateAsync({
            diagnosticoId: editId,
            respostasData
          });
          console.log('✅ Respostas atualizadas');
        }

        toast({
          title: "Diagnóstico atualizado",
          description: "O diagnóstico foi atualizado com sucesso!",
        });

      } else {
        // Fluxo original de criação
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
        empresa = await saveEmpresaMutation.mutateAsync(empresaData);
        console.log('✅ Empresa salva:', empresa);

        // Preparar dados do diagnóstico usando apenas as 4 colunas existentes
        const diagnosticoData = {
          empresa_id: empresa.id,
          score_total: results.overallScore,
          score_marketing: mappedScores.marketing,
          score_vendas: mappedScores.vendas,
          score_estrategia: mappedScores.estrategia,
          score_gestao: mappedScores.gestao,
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
        diagnostico = await saveDiagnosticoMutation.mutateAsync(diagnosticoData);
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

        toast({
          title: "Diagnóstico salvo",
          description: "O diagnóstico foi salvo com sucesso!",
        });
      }

      console.log('🎉 Diagnóstico', isEditing ? 'atualizado' : 'salvo', 'com sucesso!');
      onSuccess();

    } catch (error: any) {
      console.error('❌ Erro detalhado ao', isEditing ? 'atualizar' : 'salvar', 'diagnóstico:', error);
      console.error('📊 Results que causaram erro:', results);
      toast({
        title: isEditing ? "Erro ao atualizar" : "Erro ao salvar",
        description: `Ocorreu um erro ao ${isEditing ? 'atualizar' : 'salvar'} o diagnóstico: ${error?.message || 'Erro desconhecido'}`,
        variant: "destructive"
      });
    }
  };

  const isSaving = saveEmpresaMutation.isPending || saveDiagnosticoMutation.isPending || 
                  updateEmpresaMutation.isPending || updateDiagnosticoMutation.isPending;

  return {
    saveDiagnostic,
    isSaving
  };
};
