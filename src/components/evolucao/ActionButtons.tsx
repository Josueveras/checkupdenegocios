
import { Button } from '@/components/ui/button';
import { Download, MessageCircle, ArrowLeft } from 'lucide-react';

export const ActionButtons = () => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button className="bg-petrol hover:bg-petrol/90 text-white">
        <Download className="mr-2 h-4 w-4" />
        Gerar Relatório PDF
      </Button>
      <Button variant="outline">
        <MessageCircle className="mr-2 h-4 w-4" />
        Enviar por WhatsApp
      </Button>
      <Button variant="outline" onClick={() => window.history.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar à Lista de Clientes
      </Button>
    </div>
  );
};
