
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { generateProposalPDF, downloadPDF, getPDFDataURL } from '@/utils/pdfGenerator';
import { sendWhatsAppMessage, createProposalWhatsAppMessage } from '@/utils/whatsappUtils';
import { useNavigate } from 'react-router-dom';

export const useProposalOperations = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteProposal = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('propostas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
      toast({
        title: "Proposta excluída",
        description: "A proposta foi excluída com sucesso."
      });
    },
    onError: (error) => {
      console.error('Erro ao excluir proposta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a proposta.",
        variant: "destructive"
      });
    }
  });

  const handleEditProposal = (proposalId: string) => {
    navigate(`/editar-proposta?id=${proposalId}`);
  };

  const handleDownloadPDF = async (proposta: any) => {
    try {
      const pdf = generateProposalPDF(proposta);
      const empresa = proposta.diagnosticos?.empresas;
      const filename = `Proposta_${empresa?.nome || 'Empresa'}_${new Date(proposta.created_at).toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
      downloadPDF(pdf, filename);
      
      toast({
        title: "PDF baixado",
        description: "A proposta foi baixada com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o PDF da proposta.",
        variant: "destructive"
      });
    }
  };

  const handleSendWhatsApp = async (proposta: any) => {
    try {
      const empresa = proposta.diagnosticos?.empresas;
      
      if (!empresa?.cliente_telefone) {
        toast({
          title: "Telefone não encontrado",
          description: "O número de telefone do cliente não está cadastrado.",
          variant: "destructive"
        });
        return;
      }

      const pdf = generateProposalPDF(proposta);
      const pdfDataUrl = getPDFDataURL(pdf);
      
      const message = createProposalWhatsAppMessage(
        empresa.nome || 'Empresa',
        empresa.cliente_nome || 'Cliente',
        proposta.valor || 0
      );
      
      const messageWithPdf = `${message}\n\nPDF da proposta: ${pdfDataUrl}`;
      
      sendWhatsAppMessage(empresa.cliente_telefone, messageWithPdf);
      
      toast({
        title: "WhatsApp aberto",
        description: "A proposta foi preparada para envio via WhatsApp."
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar WhatsApp",
        description: "Não foi possível preparar o envio via WhatsApp.",
        variant: "destructive"
      });
    }
  };

  return {
    deleteProposal,
    handleEditProposal,
    handleDownloadPDF,
    handleSendWhatsApp
  };
};
