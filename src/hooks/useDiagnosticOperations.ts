import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { generateDiagnosticPDF, downloadPDF } from '@/utils/pdfGenerator';
import { sendWhatsAppMessage, createDiagnosticWhatsAppMessage } from '@/utils/whatsappUtils';
import { scheduleGoogleCalendarEvent } from '@/utils/calendarUtils';

export const useDiagnosticOperations = () => {
  const queryClient = useQueryClient();

  const checkRelatedProposals = async (diagnosticId: string) => {
    const { data, error } = await supabase
      .from('propostas')
      .select('id, objetivo')
      .eq('diagnostico_id', diagnosticId);
    
    if (error) throw error;
    return data;
  };

  const deleteDiagnosticWithProposalCheck = async (id: string, forceDelete: boolean = false) => {
    // Verificar se existem propostas relacionadas
    const relatedProposals = await checkRelatedProposals(id);
    
    if (relatedProposals.length > 0 && !forceDelete) {
      // Retornar informação sobre propostas para o usuário decidir
      return {
        hasProposals: true,
        proposalCount: relatedProposals.length,
        proposals: relatedProposals
      };
    }

    // Se não há propostas ou usuário confirmou, prosseguir com exclusão
    // Primeiro deletar respostas relacionadas
    const { error: respostasError } = await supabase
      .from('respostas')
      .delete()
      .eq('diagnostico_id', id);
    
    if (respostasError) throw respostasError;

    // Depois deletar o diagnóstico
    const { error } = await supabase
      .from('diagnosticos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;

    return { hasProposals: false, deleted: true };
  };

  const deleteDiagnostic = useMutation({
    mutationFn: async ({ id, forceDelete = false }: { id: string; forceDelete?: boolean }) => {
      return await deleteDiagnosticWithProposalCheck(id, forceDelete);
    },
    onSuccess: (result, variables) => {
      if (result.hasProposals) {
        // Mostrar dialog de confirmação
        const proposalCount = result.proposalCount;
        const message = proposalCount === 1 
          ? `Este diagnóstico possui 1 proposta relacionada. Deseja mesmo excluir apenas o diagnóstico? A proposta permanecerá no sistema.`
          : `Este diagnóstico possui ${proposalCount} propostas relacionadas. Deseja mesmo excluir apenas o diagnóstico? As propostas permanecerão no sistema.`;
        
        if (window.confirm(message)) {
          // Usuário confirmou, deletar forçadamente
          deleteDiagnostic.mutate({ id: variables.id, forceDelete: true });
        }
        return;
      }

      if (result.deleted) {
        queryClient.invalidateQueries({ queryKey: ['diagnosticos'] });
        toast({
          title: "Diagnóstico excluído",
          description: "O diagnóstico foi excluído com sucesso. As propostas relacionadas foram mantidas."
        });
      }
    },
    onError: (error) => {
      console.error('Erro ao excluir diagnóstico:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o diagnóstico.",
        variant: "destructive"
      });
    }
  });

  const generatePDFForSharing = async (diagnostic: any): Promise<{ blob: Blob; url?: string }> => {
    try {
      // Gerar o PDF
      const doc = generateDiagnosticPDF(diagnostic);
      const pdfBytes = doc.output('arraybuffer');
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      // Nome do arquivo
      const fileName = `diagnostico-${diagnostic.empresas?.nome || 'empresa'}-${diagnostic.id}-${new Date().getTime()}.pdf`;
      
      try {
        // Tentar fazer upload para obter URL pública
        const { data, error } = await supabase.storage
          .from('diagnosticos')
          .upload(fileName, pdfBytes, {
            contentType: 'application/pdf',
            upsert: true
          });

        if (!error) {
          // Obter URL pública
          const { data: urlData } = supabase.storage
            .from('diagnosticos')
            .getPublicUrl(fileName);

          return { blob, url: urlData.publicUrl };
        }
      } catch (uploadError) {
        console.warn('Não foi possível fazer upload do PDF, mas o blob está disponível:', uploadError);
      }

      return { blob };
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  };

  const uploadPDFToStorage = async (diagnostic: any): Promise<string> => {
    try {
      // Gerar o PDF
      const doc = generateDiagnosticPDF(diagnostic);
      const pdfBytes = doc.output('arraybuffer');
      
      // Nome do arquivo
      const fileName = `diagnostico-${diagnostic.empresas?.nome || 'empresa'}-${diagnostic.id}-${new Date().getTime()}.pdf`;
      
      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('diagnosticos')
        .upload(fileName, pdfBytes, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (error) throw error;

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('diagnosticos')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload do PDF:', error);
      throw error;
    }
  };

  const handleGenerateAndDownloadPDF = async (diagnostic: any) => {
    try {
      const doc = generateDiagnosticPDF(diagnostic);
      const filename = `diagnostico-${diagnostic.empresas?.nome || 'empresa'}-${new Date().toISOString().split('T')[0]}.pdf`;
      downloadPDF(doc, filename);
      
      toast({
        title: "PDF gerado",
        description: "O PDF foi gerado e baixado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF.",
        variant: "destructive"
      });
    }
  };

  const handleSendWhatsApp = async (diagnostic: any) => {
    try {
      const empresa = diagnostic.empresas;
      if (!empresa?.cliente_telefone) {
        toast({
          title: "Telefone não disponível",
          description: "Número de WhatsApp não cadastrado para este cliente.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Gerando PDF...",
        description: "Preparando link para envio"
      });

      // Fazer upload do PDF e obter URL pública
      const pdfUrl = await uploadPDFToStorage(diagnostic);
      
      // Criar mensagem simples com o link
      const message = createDiagnosticWhatsAppMessage(
        empresa.nome || 'Empresa',
        empresa.cliente_nome || 'Cliente',
        pdfUrl
      );
      
      sendWhatsAppMessage(empresa.cliente_telefone, message);
      
      toast({
        title: "WhatsApp aberto",
        description: `Mensagem preparada para ${empresa.nome}`,
      });
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      toast({
        title: "Erro",
        description: "Não foi possível preparar a mensagem do WhatsApp.",
        variant: "destructive"
      });
    }
  };

  const handleScheduleCalendar = (diagnostic: any) => {
    try {
      const empresa = diagnostic.empresas;
      const title = `Apresentação Diagnóstico - ${empresa?.nome || 'Empresa'}`;
      const description = `Reunião para apresentar os resultados do diagnóstico empresarial para ${empresa?.nome} com ${empresa?.cliente_nome}.`;
      
      scheduleGoogleCalendarEvent(title, description, empresa?.cliente_email);
      
      toast({
        title: "Agenda aberta",
        description: "Evento criado no Google Calendar"
      });
    } catch (error) {
      console.error('Erro ao agendar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o evento na agenda.",
        variant: "destructive"
      });
    }
  };

  const handleViewDiagnostic = (diagnosticId: string) => {
    // Criar uma página de visualização do diagnóstico (implementar depois)
    // Por enquanto, vamos abrir em nova aba com os dados
    window.open(`/diagnostico-view/${diagnosticId}`, '_blank');
  };

  return {
    deleteDiagnostic,
    generatePDFForSharing,
    handleGenerateAndDownloadPDF,
    handleSendWhatsApp,
    handleScheduleCalendar,
    handleViewDiagnostic
  };
};
