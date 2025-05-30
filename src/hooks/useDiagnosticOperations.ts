import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { generateDiagnosticPDF, downloadPDF } from '@/utils/pdfGenerator';
import { sendWhatsAppMessage, createDiagnosticWhatsAppMessage } from '@/utils/whatsappUtils';
import { scheduleGoogleCalendarEvent } from '@/utils/calendarUtils';

export const useDiagnosticOperations = () => {
  const queryClient = useQueryClient();

  const deleteDiagnostic = useMutation({
    mutationFn: async (id: string) => {
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnosticos'] });
      toast({
        title: "Diagnóstico excluído",
        description: "O diagnóstico foi excluído com sucesso."
      });
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
    handleGenerateAndDownloadPDF,
    handleSendWhatsApp,
    handleScheduleCalendar,
    handleViewDiagnostic
  };
};
