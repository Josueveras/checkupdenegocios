
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { generateDiagnosticPDF, downloadPDF } from '@/utils/pdfGenerator';

export const useDiagnosticPDF = () => {
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

  return {
    generatePDFForSharing,
    uploadPDFToStorage,
    handleGenerateAndDownloadPDF
  };
};
