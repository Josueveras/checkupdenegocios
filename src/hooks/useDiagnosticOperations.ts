
import { useDiagnosticDeletion } from './useDiagnosticDeletion';
import { useDiagnosticPDF } from './useDiagnosticPDF';
import { useDiagnosticSharing } from './useDiagnosticSharing';

export const useDiagnosticOperations = () => {
  const { deleteDiagnostic } = useDiagnosticDeletion();
  const { generatePDFForSharing, handleGenerateAndDownloadPDF } = useDiagnosticPDF();
  const { handleSendWhatsApp, handleScheduleCalendar, handleViewDiagnostic } = useDiagnosticSharing();

  return {
    deleteDiagnostic,
    generatePDFForSharing,
    handleGenerateAndDownloadPDF,
    handleSendWhatsApp,
    handleScheduleCalendar,
    handleViewDiagnostic
  };
};
