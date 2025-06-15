
import jsPDF from 'jspdf';
import { PDF_STYLES } from './pdfStyles';

export const createSectionGenerators = (doc: jsPDF, helpers: any) => {
  const { pageWidth, margin, contentWidth, addTitle, addSubtitle, addText } = helpers;

  const generateHeader = (empresa: any, yPosition: number) => {
    // Simple centered title
    addTitle('Diagnóstico Empresarial', pageWidth / 2 - 50, yPosition);
    
    // Company name and date
    addText(`Empresa: ${empresa?.nome || 'N/A'}`, margin, yPosition + 25);
    addText(`Data: ${new Date().toLocaleDateString('pt-BR')}`, margin, yPosition + 40);
    
    return yPosition + 60;
  };

  const generateCompanyData = (empresa: any, yPosition: number) => {
    addSubtitle('Dados da Empresa', margin, yPosition);
    let currentY = yPosition + PDF_STYLES.layout.sectionSpacing;
    
    const data = [
      ['Cliente:', empresa?.cliente_nome || 'N/A'],
      ['E-mail:', empresa?.cliente_email || 'N/A'],
      ['Telefone:', empresa?.cliente_telefone || 'N/A'],
      ['Setor:', empresa?.setor || 'N/A']
    ];
    
    data.forEach(([label, value]) => {
      addText(label, margin, currentY, true);
      addText(value, margin + 60, currentY);
      currentY += PDF_STYLES.layout.lineHeight;
    });
    
    return currentY + PDF_STYLES.layout.sectionSpacing;
  };

  const generateResults = (diagnosticData: any, yPosition: number) => {
    addSubtitle('Resultados', margin, yPosition);
    let currentY = yPosition + PDF_STYLES.layout.sectionSpacing;
    
    // Score geral simples
    addText(`Score Geral: ${diagnosticData.score_total}%`, margin, currentY, true);
    currentY += PDF_STYLES.layout.lineHeight;
    
    addText(`Nível de Maturidade: ${diagnosticData.nivel}`, margin, currentY, true);
    currentY += PDF_STYLES.layout.sectionSpacing;
    
    // Scores por categoria
    addText('Pontuação por Categoria:', margin, currentY, true);
    currentY += PDF_STYLES.layout.lineHeight;
    
    const categories = [
      ['Marketing:', diagnosticData.score_marketing],
      ['Vendas:', diagnosticData.score_vendas],  
      ['Estratégia:', diagnosticData.score_estrategia],
      ['Gestão:', diagnosticData.score_gestao]
    ];
    
    categories.forEach(([category, score]) => {
      addText(`• ${category} ${score}%`, margin + 10, currentY);
      currentY += PDF_STYLES.layout.lineHeight;
    });
    
    return currentY + PDF_STYLES.layout.sectionSpacing;
  };

  const generatePointsSection = (diagnosticData: any, yPosition: number) => {
    let currentY = yPosition;
    
    // Pontos Fortes
    if (diagnosticData.pontos_fortes?.length > 0) {
      addSubtitle('Pontos Fortes', margin, currentY);
      currentY += PDF_STYLES.layout.sectionSpacing;
      
      diagnosticData.pontos_fortes.forEach((ponto: string) => {
        addText(`• ${ponto}`, margin, currentY);
        currentY += PDF_STYLES.layout.lineHeight;
      });
      
      currentY += PDF_STYLES.layout.sectionSpacing;
    }
    
    // Pontos de Atenção
    if (diagnosticData.pontos_atencao?.length > 0) {
      addSubtitle('Pontos de Atenção', margin, currentY);
      currentY += PDF_STYLES.layout.sectionSpacing;
      
      diagnosticData.pontos_atencao.forEach((ponto: string) => {
        addText(`• ${ponto}`, margin, currentY);
        currentY += PDF_STYLES.layout.lineHeight;
      });
      
      currentY += PDF_STYLES.layout.sectionSpacing;
    }
    
    return currentY;
  };

  const generateRecommendations = (diagnosticData: any, yPosition: number, checkPageBreak: (y: number, h: number) => number) => {
    if (!diagnosticData.recomendacoes) return yPosition;

    yPosition = checkPageBreak(yPosition, 60);
    
    addSubtitle('Recomendações', margin, yPosition);
    let currentY = yPosition + PDF_STYLES.layout.sectionSpacing;
    
    Object.entries(diagnosticData.recomendacoes).forEach(([categoria, recomendacoes]: [string, any]) => {
      if (recomendacoes && recomendacoes.length > 0) {
        currentY = checkPageBreak(currentY, 30);
        
        addText(`${categoria}:`, margin, currentY, true);
        currentY += PDF_STYLES.layout.lineHeight;
        
        recomendacoes.forEach((rec: string) => {
          addText(`• ${rec}`, margin + 10, currentY);
          currentY += PDF_STYLES.layout.lineHeight;
        });
        
        currentY += PDF_STYLES.layout.lineHeight;
      }
    });
    
    return currentY;
  };

  const generateObservations = (diagnosticData: any, yPosition: number, checkPageBreak: (y: number, h: number) => number) => {
    if (!diagnosticData.observacoes) return yPosition;

    yPosition = checkPageBreak(yPosition, 40);
    
    addSubtitle('Observações', margin, yPosition);
    let currentY = yPosition + PDF_STYLES.layout.sectionSpacing;
    
    const lines = doc.splitTextToSize(diagnosticData.observacoes, contentWidth - 20);
    lines.forEach((line: string) => {
      addText(line, margin, currentY);
      currentY += PDF_STYLES.layout.lineHeight;
    });
    
    return currentY + PDF_STYLES.layout.sectionSpacing;
  };

  const generateFinalSection = (yPosition: number, checkPageBreak: (y: number, h: number) => number) => {
    yPosition = checkPageBreak(yPosition, 40);
    
    // Simple thank you message
    addText('Obrigado pela confiança!', pageWidth / 2 - 40, yPosition);
    
    return yPosition + 30;
  };

  return {
    generateHeader,
    generateCompanyData,
    generateResults,
    generatePointsSection,
    generateRecommendations,
    generateObservations,
    generateFinalSection
  };
};
