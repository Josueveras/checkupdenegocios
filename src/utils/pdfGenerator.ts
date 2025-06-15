
import jsPDF from 'jspdf';
import { generateDiagnosticPDF } from './pdf/diagnosticPDF';

export { generateDiagnosticPDF };

export const downloadPDF = (doc: jsPDF, filename: string) => {
  doc.save(filename);
};

export const getPDFDataURL = (doc: jsPDF) => {
  return doc.output('dataurlstring');
};
