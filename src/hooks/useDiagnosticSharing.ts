
import { toast } from '@/hooks/use-toast';
import { sendWhatsAppMessage, createDiagnosticWhatsAppMessage } from '@/utils/whatsappUtils';
import { scheduleGoogleCalendarEvent } from '@/utils/calendarUtils';
import { useDiagnosticPDF } from './useDiagnosticPDF';

export const useDiagnosticSharing = () => {
  const { uploadPDFToStorage } = useDiagnosticPDF();

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
    handleSendWhatsApp,
    handleScheduleCalendar,
    handleViewDiagnostic
  };
};
