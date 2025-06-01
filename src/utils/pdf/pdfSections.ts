
import jsPDF from 'jspdf';
import { PDF_STYLES } from './pdfStyles';

export const createSectionGenerators = (doc: jsPDF, helpers: any) => {
  const { pageWidth, margin, contentWidth, addTitle, addText, drawRoundedRect } = helpers;

  const generateHeader = (empresa: any, yPosition: number) => {
    const dataFormatada = new Date().toLocaleDateString('pt-BR');
    
    // Título principal centralizado
    addTitle('Diagnóstico Empresarial', pageWidth / 2, yPosition, PDF_STYLES.fonts.mainTitle, PDF_STYLES.colors.petrol, 'center');
    
    // Nome da empresa e data à direita
    addText(empresa?.nome || 'Empresa', pageWidth - margin, yPosition, PDF_STYLES.fonts.large, 'bold', PDF_STYLES.colors.petrol, 'right');
    addText(dataFormatada, pageWidth - margin, yPosition + 15, PDF_STYLES.fonts.normal, 'normal', PDF_STYLES.colors.text, 'right');
    
    return yPosition + 60;
  };

  const generateCompanyData = (empresa: any, yPosition: number) => {
    // Fundo do bloco
    drawRoundedRect(margin, yPosition - 5, contentWidth, 65, PDF_STYLES.layout.radius, PDF_STYLES.colors.lightGray);
    
    addTitle('Dados da Empresa', margin + 15, yPosition + 15, PDF_STYLES.fonts.heading);
    let currentY = yPosition + 35;
    
    const leftCol = margin + 15;
    const rightCol = margin + contentWidth / 2 + 10;
    
    addText('Cliente:', leftCol, currentY, PDF_STYLES.fonts.normal, 'bold');
    addText(empresa?.cliente_nome || 'N/A', leftCol + 35, currentY, PDF_STYLES.fonts.normal);
    
    addText('E-mail:', rightCol, currentY, PDF_STYLES.fonts.normal, 'bold');
    addText(empresa?.cliente_email || 'N/A', rightCol + 30, currentY, PDF_STYLES.fonts.normal);
    
    currentY += 15;
    
    addText('Telefone:', leftCol, currentY, PDF_STYLES.fonts.normal, 'bold');
    addText(empresa?.cliente_telefone || 'N/A', leftCol + 40, currentY, PDF_STYLES.fonts.normal);
    
    addText('Setor:', rightCol, currentY, PDF_STYLES.fonts.normal, 'bold');
    addText(empresa?.setor || 'N/A', rightCol + 25, currentY, PDF_STYLES.fonts.normal);
    
    return yPosition + 80;
  };

  const generateResults = (diagnosticData: any, yPosition: number) => {
    addTitle('Resultados', margin, yPosition, PDF_STYLES.fonts.heading);
    let currentY = yPosition + 25;
    
    // Score geral em destaque
    const scoreCircleX = margin + 50;
    const scoreCircleY = currentY + 30;
    const scoreRadius = 25;
    
    // Círculo do score
    doc.setFillColor(PDF_STYLES.colors.highlight[0], PDF_STYLES.colors.highlight[1], PDF_STYLES.colors.highlight[2]);
    doc.circle(scoreCircleX, scoreCircleY, scoreRadius, 'F');
    
    // Score em branco
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(PDF_STYLES.fonts.score);
    doc.setFont('helvetica', 'bold');
    doc.text(`${diagnosticData.score_total}%`, scoreCircleX, scoreCircleY - 2, { align: 'center' });
    
    doc.setFontSize(PDF_STYLES.fonts.small);
    doc.text('SCORE GERAL', scoreCircleX, scoreCircleY + 12, { align: 'center' });
    
    // Nível de maturidade
    addText('Nível de Maturidade:', scoreCircleX + 60, scoreCircleY - 15, PDF_STYLES.fonts.medium, 'bold', PDF_STYLES.colors.text);
    addTitle(diagnosticData.nivel, scoreCircleX + 60, scoreCircleY, PDF_STYLES.fonts.title, PDF_STYLES.colors.petrol);
    
    currentY += 80;
    
    // Pontuação por categoria
    addText('Pontuação por Categoria:', margin, currentY, PDF_STYLES.fonts.large, 'bold');
    currentY += 20;
    
    const categories = [
      { name: 'Estratégia', score: diagnosticData.score_estrategia },
      { name: 'Vendas', score: diagnosticData.score_vendas },
      { name: 'Marketing', score: diagnosticData.score_marketing },
      { name: 'Gestão', score: diagnosticData.score_gestao }
    ];
    
    categories.forEach((cat, index) => {
      const x = margin + (index % 2) * (contentWidth / 2);
      const y = currentY + Math.floor(index / 2) * 20;
      
      addText(`${cat.name}:`, x, y, PDF_STYLES.fonts.normal, 'normal');
      addText(`${cat.score}%`, x + 50, y, PDF_STYLES.fonts.normal, 'bold', PDF_STYLES.colors.highlight);
    });
    
    return currentY + 60;
  };

  const generatePointsSection = (diagnosticData: any, yPosition: number) => {
    if (!diagnosticData.pontos_fortes?.length && !diagnosticData.pontos_atencao?.length) {
      return yPosition;
    }

    addTitle('Pontos Fortes e Pontos de Atenção', margin, yPosition, PDF_STYLES.fonts.heading);
    let currentY = yPosition + 25;
    
    const colWidth = (contentWidth - 20) / 2;
    
    // Pontos Fortes
    if (diagnosticData.pontos_fortes?.length > 0) {
      drawRoundedRect(margin, currentY - 5, colWidth, 80, PDF_STYLES.layout.radius, PDF_STYLES.colors.greenBg);
      
      addTitle('Pontos Fortes', margin + 10, currentY + 12, PDF_STYLES.fonts.large, PDF_STYLES.colors.greenText);
      
      diagnosticData.pontos_fortes.slice(0, 4).forEach((ponto: string, index: number) => {
        addText(`• ${ponto}`, margin + 10, currentY + 30 + (index * 12), PDF_STYLES.fonts.small, 'normal', PDF_STYLES.colors.text);
      });
    }
    
    // Pontos de Atenção
    if (diagnosticData.pontos_atencao?.length > 0) {
      drawRoundedRect(margin + colWidth + 20, currentY - 5, colWidth, 80, PDF_STYLES.layout.radius, PDF_STYLES.colors.redBg);
      
      addTitle('Pontos de Atenção', margin + colWidth + 30, currentY + 12, PDF_STYLES.fonts.large, PDF_STYLES.colors.redText);
      
      diagnosticData.pontos_atencao.slice(0, 4).forEach((ponto: string, index: number) => {
        addText(`• ${ponto}`, margin + colWidth + 30, currentY + 30 + (index * 12), PDF_STYLES.fonts.small, 'normal', PDF_STYLES.colors.text);
      });
    }
    
    return currentY + 100;
  };

  const generateRecommendations = (diagnosticData: any, yPosition: number, checkPageBreak: (y: number, h: number) => number) => {
    if (!diagnosticData.recomendacoes) return yPosition;

    yPosition = checkPageBreak(yPosition, 120);
    
    addTitle('Recomendações', margin, yPosition, PDF_STYLES.fonts.heading);
    let currentY = yPosition + 25;
    
    Object.entries(diagnosticData.recomendacoes).forEach(([categoria, recomendacoes]: [string, any]) => {
      if (recomendacoes && recomendacoes.length > 0) {
        currentY = checkPageBreak(currentY, 40);
        
        addText(categoria, margin, currentY, PDF_STYLES.fonts.medium, 'bold', PDF_STYLES.colors.petrol);
        currentY += 15;
        
        recomendacoes.slice(0, 3).forEach((rec: string) => {
          addText(`• ${rec}`, margin + 10, currentY, PDF_STYLES.fonts.normal, 'normal', PDF_STYLES.colors.text);
          currentY += 12;
        });
        
        currentY += 10;
      }
    });
    
    return currentY;
  };

  const generateObservations = (diagnosticData: any, yPosition: number, checkPageBreak: (y: number, h: number) => number) => {
    if (!diagnosticData.observacoes) return yPosition;

    yPosition = checkPageBreak(yPosition, 60);
    
    addTitle('Observações', margin, yPosition, PDF_STYLES.fonts.heading);
    let currentY = yPosition + 20;
    
    const lines = doc.splitTextToSize(diagnosticData.observacoes, contentWidth - 20);
    lines.forEach((line: string, index: number) => {
      addText(line, margin, currentY + (index * 12), PDF_STYLES.fonts.normal, 'normal', PDF_STYLES.colors.text);
    });
    
    return currentY + lines.length * 12 + 20;
  };

  const generateFinalSection = (yPosition: number, checkPageBreak: (y: number, h: number) => number) => {
    yPosition = checkPageBreak(yPosition, 120);
    
    // Fundo azul petróleo
    doc.setFillColor(PDF_STYLES.colors.petrol[0], PDF_STYLES.colors.petrol[1], PDF_STYLES.colors.petrol[2]);
    doc.rect(0, yPosition - 10, pageWidth, 120, 'F');
    
    // Título em branco
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(PDF_STYLES.fonts.bigTitle);
    doc.setFont('helvetica', 'bold');
    doc.text('Próximos Passos', pageWidth / 2, yPosition + 20, { align: 'center' });
    
    // Frase principal
    doc.setFontSize(PDF_STYLES.fonts.large);
    doc.setFont('helvetica', 'normal');
    doc.text('Com base na análise realizada, identificamos', pageWidth / 2, yPosition + 45, { align: 'center' });
    doc.text('oportunidades estratégicas para impulsionar', pageWidth / 2, yPosition + 60, { align: 'center' });
    doc.text('o crescimento do seu negócio.', pageWidth / 2, yPosition + 75, { align: 'center' });
    
    // Frase destaque
    doc.setFontSize(PDF_STYLES.fonts.heading);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(PDF_STYLES.colors.highlight[0], PDF_STYLES.colors.highlight[1], PDF_STYLES.colors.highlight[2]);
    doc.text('Vamos juntos transformar seus resultados?', pageWidth / 2, yPosition + 95, { align: 'center' });
    
    // Botão visual
    const buttonWidth = 120;
    const buttonHeight = 20;
    const buttonX = (pageWidth - buttonWidth) / 2;
    const buttonY = yPosition + 105;
    
    doc.setFillColor(PDF_STYLES.colors.highlight[0], PDF_STYLES.colors.highlight[1], PDF_STYLES.colors.highlight[2]);
    doc.roundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 10, 10, 'F');
    
    doc.setTextColor(PDF_STYLES.colors.petrol[0], PDF_STYLES.colors.petrol[1], PDF_STYLES.colors.petrol[2]);
    doc.setFontSize(PDF_STYLES.fonts.medium);
    doc.setFont('helvetica', 'bold');
    doc.text('Agendar reunião de apresentação', pageWidth / 2, buttonY + 13, { align: 'center' });
    
    return yPosition + 120;
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
