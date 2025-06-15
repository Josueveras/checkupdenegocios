
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { generateProposalPDF, downloadPDF, getPDFDataURL } from '@/utils/pdfGenerator';
import { sendWhatsAppMessage, createProposalWhatsAppMessage } from '@/utils/whatsappUtils';
import { useNavigate } from 'react-router-dom';
import { useDiagnosticNotifications } from './useDiagnosticNotifications';

export const useProposalOperations = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { notifyProposalGenerated } = useDiagnosticNotifications();

  const deleteProposal = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('propostas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidar ambas as queries sempre
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
      queryClient.invalidateQueries({ queryKey: ['propostas-planos'] });
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
      // Buscar empresa: pode vir do diagnóstico ou diretamente da proposta
      const empresa = proposta.diagnosticos?.empresas || proposta.empresas;
      const filename = `Proposta_${empresa?.nome || 'Empresa'}_${new Date(proposta.created_at).toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
      downloadPDF(pdf, filename);
      
      toast({
        title: "PDF baixado",
        description: "A proposta foi baixada com sucesso."
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o PDF da proposta.",
        variant: "destructive"
      });
    }
  };

  const handleSendWhatsApp = async (proposta: any) => {
    try {
      // Buscar empresa: pode vir do diagnóstico ou diretamente da proposta
      const empresa = proposta.diagnosticos?.empresas || proposta.empresas;
      
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
      console.error('Erro ao enviar WhatsApp:', error);
      toast({
        title: "Erro ao enviar WhatsApp",
        description: "Não foi possível preparar o envio via WhatsApp.",
        variant: "destructive"
      });
    }
  };

  const createProposal = useMutation({
    mutationFn: async (proposalData: any) => {
      const { data, error } = await supabase
        .from('propostas')
        .insert(proposalData)
        .select(`
          *,
          diagnosticos!propostas_diagnostico_id_fkey (
            empresas!diagnosticos_empresa_id_fkey (nome)
          )
        `)
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidar ambas as queries sempre
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
      queryClient.invalidateQueries({ queryKey: ['propostas-planos'] });
      const empresaNome = data?.diagnosticos?.empresas?.nome;
      if (empresaNome) {
        notifyProposalGenerated(empresaNome, data.id);
      }
      toast({
        title: "Proposta criada",
        description: "A proposta foi criada com sucesso."
      });
    },
    onError: (error) => {
      console.error('Erro ao criar proposta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a proposta.",
        variant: "destructive"
      });
    }
  });

  return {
    deleteProposal,
    handleEditProposal,
    handleDownloadPDF,
    handleSendWhatsApp,
    createProposal
  };
};
