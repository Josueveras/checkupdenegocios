
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

  const addTitle = (text: string, x: number, y: number, size: number, color?: [number, number, number], align?: 'left' | 'center' | 'right') => {
    const titleColor = color || PDF_STYLES.colors.petrol;
    doc.setFontSize(size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(titleColor[0], titleColor[1], titleColor[2]);
    if (align) {
      doc.text(text, x, y, { align });
    } else {
      doc.text(text, x, y);
    }
  };

  const addText = (text: string, x: number, y: number, size: number, style: string = 'normal', color?: [number, number, number], align?: 'left' | 'center' | 'right') => {
    const textCol = color || PDF_STYLES.colors.text;
    doc.setFontSize(size);
    doc.setFont('helvetica', style as any);
    doc.setTextColor(textCol[0], textCol[1], textCol[2]);
    if (align) {
      doc.text(text, x, y, { align });
    } else {
      doc.text(text, x, y);
    }
  };

  const drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number, fillColor?: [number, number, number]) => {
    if (fillColor) {
      doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
      doc.roundedRect(x, y, width, height, radius, radius, 'F');
    } else {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.roundedRect(x, y, width, height, radius, radius, 'S');
    }
  };

  return {
    pageWidth,
    pageHeight,
    margin,
    contentWidth,
    checkPageBreak,
    addTitle,
    addText,
    drawRoundedRect
  };
};
