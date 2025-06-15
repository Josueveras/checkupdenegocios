
import jsPDF from 'jspdf';
import { PDF_STYLES } from './pdfStyles';

export const createPDFHelpers = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const { margin } = PDF_STYLES.layout;
  const contentWidth = pageWidth - (margin * 2);

  const checkPageBreak = (yPosition: number, requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage();
      return margin;
    }
    return yPosition;
  };

  const addTitle = (text: string, x: number, y: number) => {
    doc.setFontSize(PDF_STYLES.fonts.title);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(PDF_STYLES.colors.petrol[0], PDF_STYLES.colors.petrol[1], PDF_STYLES.colors.petrol[2]);
    doc.text(text, x, y);
  };

  const addSubtitle = (text: string, x: number, y: number) => {
    doc.setFontSize(PDF_STYLES.fonts.subtitle);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(PDF_STYLES.colors.black[0], PDF_STYLES.colors.black[1], PDF_STYLES.colors.black[2]);
    doc.text(text, x, y);
  };

  const addText = (text: string, x: number, y: number, bold: boolean = false) => {
    doc.setFontSize(PDF_STYLES.fonts.text);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setTextColor(PDF_STYLES.colors.black[0], PDF_STYLES.colors.black[1], PDF_STYLES.colors.black[2]);
    doc.text(text, x, y);
  };

  return {
    pageWidth,
    pageHeight,
    margin,
    contentWidth,
    checkPageBreak,
    addTitle,
    addSubtitle,
    addText
  };
};
