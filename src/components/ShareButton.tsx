
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Share2, Download, Copy, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ShareButtonProps {
  pdfBlob: Blob;
  fileName: string;
  companyName: string;
  pdfUrl?: string;
}

export const ShareButton = ({ pdfBlob, fileName, companyName, pdfUrl }: ShareButtonProps) => {
  const [showFallback, setShowFallback] = useState(false);

  const handleShare = async () => {
    // Verificar se o dispositivo suporta Web Share API com arquivos
    if (navigator.share && navigator.canShare) {
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
      
      // Verificar se pode compartilhar arquivos
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'CheckUp de Negócios',
            text: `Diagnóstico empresarial completo para ${companyName}`,
            files: [file]
          });
          
          toast({
            title: "Compartilhado com sucesso",
            description: "O PDF foi compartilhado via Web Share API"
          });
          return;
        } catch (error: any) {
          // Se o usuário cancelou o compartilhamento, não mostrar erro
          if (error.name !== 'AbortError') {
            console.error('Erro ao compartilhar:', error);
          }
        }
      }
    }
    
    // Fallback: mostrar opções alternativas
    setShowFallback(true);
  };

  const handleDownload = () => {
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download iniciado",
      description: "O PDF está sendo baixado"
    });
    setShowFallback(false);
  };

  const handleCopyLink = async () => {
    if (pdfUrl) {
      try {
        await navigator.clipboard.writeText(pdfUrl);
        toast({
          title: "Link copiado",
          description: "O link do PDF foi copiado para a área de transferência"
        });
      } catch (error) {
        console.error('Erro ao copiar link:', error);
        toast({
          title: "Erro",
          description: "Não foi possível copiar o link",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Link não disponível",
        description: "O PDF precisa ser salvo no servidor primeiro",
        variant: "destructive"
      });
    }
    setShowFallback(false);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `📊 *CheckUp de Negócios*\n\nOlá! Aqui está o diagnóstico empresarial completo para *${companyName}*.\n\n${pdfUrl ? `🔗 Link do PDF: ${pdfUrl}` : '📎 O PDF será enviado em anexo.'}\n\nAproveite a análise! 🚀`
    );
    
    const whatsappUrl = `https://web.whatsapp.com/send?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp aberto",
      description: "Mensagem preparada no WhatsApp Web"
    });
    setShowFallback(false);
  };

  return (
    <>
      <Button
        onClick={handleShare}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Share2 className="h-4 w-4" />
        Compartilhar PDF
      </Button>

      <Dialog open={showFallback} onOpenChange={setShowFallback}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compartilhar Diagnóstico</DialogTitle>
            <DialogDescription>
              Escolha uma das opções abaixo para compartilhar o PDF do diagnóstico
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            <Button
              onClick={handleDownload}
              variant="outline"
              className="w-full flex items-center gap-2 justify-start"
            >
              <Download className="h-4 w-4" />
              Baixar PDF
            </Button>
            
            {pdfUrl && (
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="w-full flex items-center gap-2 justify-start"
              >
                <Copy className="h-4 w-4" />
                Copiar Link do PDF
              </Button>
            )}
            
            <Button
              onClick={handleWhatsApp}
              variant="outline"
              className="w-full flex items-center gap-2 justify-start text-green-600 border-green-600 hover:bg-green-50"
            >
              <MessageCircle className="h-4 w-4" />
              Enviar via WhatsApp Web
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
