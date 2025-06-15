
import { useCreateNotification } from './useNotifications';

export const useDiagnosticNotifications = () => {
  const createNotification = useCreateNotification();

  const notifyDiagnosticCompleted = (empresaNome: string, diagnosticoId: string) => {
    createNotification.mutate({
      titulo: 'Novo Diagnóstico',
      descricao: `Diagnóstico da ${empresaNome} foi concluído`,
      tipo: 'diagnostico',
      lida: false,
      link_pdf: `/diagnostico-view?id=${diagnosticoId}`
    });
  };

  const notifySystemMessage = (titulo: string, descricao: string) => {
    createNotification.mutate({
      titulo,
      descricao,
      tipo: 'sistema',
      lida: false
    });
  };

  return {
    notifyDiagnosticCompleted,
    notifySystemMessage
  };
};
