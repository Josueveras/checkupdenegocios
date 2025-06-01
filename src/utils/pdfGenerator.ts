import jsPDF from 'jspdf';

export const generateDiagnosticPDF = (diagnosticData: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 25;
  const contentWidth = pageWidth - (margin * 2);
  
  let yPosition = margin;
  
  // Paleta de cores
  const petrolColor = [15, 50, 68]; // #0F3244
  const textColor = [51, 51, 51]; // #333333
  const highlightColor = [251, 176, 59]; // #FBB03B
  const lightGray = [248, 248, 248];
  const white = [255, 255, 255];
  
  // Helper functions
  const checkPageBreak = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };
  
  const addTitle = (text: string, x: number, y: number, size: number, color?: number[], align?: 'left' | 'center' | 'right') => {
    const titleColor = color || petrolColor;
    doc.setFontSize(size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(titleColor[0], titleColor[1], titleColor[2]);
    if (align) {
      doc.text(text, x, y, { align });
    } else {
      doc.text(text, x, y);
    }
  };
  
  const addText = (text: string, x: number, y: number, size: number, style: string = 'normal', color?: number[], align?: 'left' | 'center' | 'right') => {
    const textCol = color || textColor;
    doc.setFontSize(size);
    doc.setFont('helvetica', style as any);
    doc.setTextColor(textCol[0], textCol[1], textCol[2]);
    if (align) {
      doc.text(text, x, y, { align });
    } else {
      doc.text(text, x, y);
    }
  };
  
  const drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number, fillColor?: number[]) => {
    if (fillColor) {
      doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
      doc.roundedRect(x, y, width, height, radius, radius, 'F');
    } else {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.roundedRect(x, y, width, height, radius, radius, 'S');
    }
  };
  
  const empresa = diagnosticData.empresas;
  const dataFormatada = new Date().toLocaleDateString('pt-BR');
  
  // 1. CABEÇALHO
  yPosition = 40;
  
  // Título principal centralizado
  addTitle('Diagnóstico Empresarial', pageWidth / 2, yPosition, 26, petrolColor, 'center');
  
  // Nome da empresa e data à direita
  addText(empresa?.nome || 'Empresa', pageWidth - margin, yPosition, 11, 'bold', petrolColor, 'right');
  addText(dataFormatada, pageWidth - margin, yPosition + 15, 9, 'normal', textColor, 'right');
  
  yPosition += 60;
  
  // 2. DADOS DA EMPRESA
  checkPageBreak(70);
  
  // Fundo do bloco
  drawRoundedRect(margin, yPosition - 5, contentWidth, 65, 5, lightGray);
  
  addTitle('Dados da Empresa', margin + 15, yPosition + 15, 14);
  yPosition += 35;
  
  const leftCol = margin + 15;
  const rightCol = margin + contentWidth / 2 + 10;
  
  addText('Cliente:', leftCol, yPosition, 9, 'bold');
  addText(empresa?.cliente_nome || 'N/A', leftCol + 35, yPosition, 9);
  
  addText('E-mail:', rightCol, yPosition, 9, 'bold');
  addText(empresa?.cliente_email || 'N/A', rightCol + 30, yPosition, 9);
  
  yPosition += 15;
  
  addText('Telefone:', leftCol, yPosition, 9, 'bold');
  addText(empresa?.cliente_telefone || 'N/A', leftCol + 40, yPosition, 9);
  
  addText('Setor:', rightCol, yPosition, 9, 'bold');
  addText(empresa?.setor || 'N/A', rightCol + 25, yPosition, 9);
  
  yPosition += 40;
  
  // 3. RESULTADOS
  checkPageBreak(120);
  
  addTitle('Resultados', margin, yPosition, 14);
  yPosition += 25;
  
  // Score geral em destaque
  const scoreCircleX = margin + 50;
  const scoreCircleY = yPosition + 30;
  const scoreRadius = 25;
  
  // Círculo do score
  doc.setFillColor(highlightColor[0], highlightColor[1], highlightColor[2]);
  doc.circle(scoreCircleX, scoreCircleY, scoreRadius, 'F');
  
  // Score em branco
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`${diagnosticData.score_total}%`, scoreCircleX, scoreCircleY - 2, { align: 'center' });
  
  doc.setFontSize(8);
  doc.text('SCORE GERAL', scoreCircleX, scoreCircleY + 12, { align: 'center' });
  
  // Nível de maturidade
  addText('Nível de Maturidade:', scoreCircleX + 60, scoreCircleY - 15, 10, 'bold', textColor);
  addTitle(diagnosticData.nivel, scoreCircleX + 60, scoreCircleY, 16, petrolColor);
  
  yPosition += 80;
  
  // Pontuação por categoria
  addText('Pontuação por Categoria:', margin, yPosition, 11, 'bold');
  yPosition += 20;
  
  const categories = [
    { name: 'Estratégia', score: diagnosticData.score_estrategia },
    { name: 'Vendas', score: diagnosticData.score_vendas },
    { name: 'Marketing', score: diagnosticData.score_marketing },
    { name: 'Gestão', score: diagnosticData.score_gestao }
  ];
  
  categories.forEach((cat, index) => {
    const x = margin + (index % 2) * (contentWidth / 2);
    const y = yPosition + Math.floor(index / 2) * 20;
    
    addText(`${cat.name}:`, x, y, 9, 'normal');
    addText(`${cat.score}%`, x + 50, y, 9, 'bold', highlightColor);
  });
  
  yPosition += 60;
  
  // 4. PONTOS FORTES E PONTOS DE ATENÇÃO
  checkPageBreak(100);
  
  if (diagnosticData.pontos_fortes?.length > 0 || diagnosticData.pontos_atencao?.length > 0) {
    addTitle('Pontos Fortes e Pontos de Atenção', margin, yPosition, 14);
    yPosition += 25;
    
    const colWidth = (contentWidth - 20) / 2;
    
    // Pontos Fortes
    if (diagnosticData.pontos_fortes?.length > 0) {
      drawRoundedRect(margin, yPosition - 5, colWidth, 80, 5, [240, 253, 244]);
      
      addTitle('Pontos Fortes', margin + 10, yPosition + 12, 11, [22, 163, 74]);
      
      diagnosticData.pontos_fortes.slice(0, 4).forEach((ponto: string, index: number) => {
        addText(`• ${ponto}`, margin + 10, yPosition + 30 + (index * 12), 8, 'normal', textColor);
      });
    }
    
    // Pontos de Atenção
    if (diagnosticData.pontos_atencao?.length > 0) {
      drawRoundedRect(margin + colWidth + 20, yPosition - 5, colWidth, 80, 5, [254, 242, 242]);
      
      addTitle('Pontos de Atenção', margin + colWidth + 30, yPosition + 12, 11, [220, 38, 38]);
      
      diagnosticData.pontos_atencao.slice(0, 4).forEach((ponto: string, index: number) => {
        addText(`• ${ponto}`, margin + colWidth + 30, yPosition + 30 + (index * 12), 8, 'normal', textColor);
      });
    }
    
    yPosition += 100;
  }
  
  // 5. RECOMENDAÇÕES
  checkPageBreak(120);
  
  if (diagnosticData.recomendacoes) {
    addTitle('Recomendações', margin, yPosition, 14);
    yPosition += 25;
    
    Object.entries(diagnosticData.recomendacoes).forEach(([categoria, recomendacoes]: [string, any], categoryIndex: number) => {
      if (recomendacoes && recomendacoes.length > 0) {
        checkPageBreak(40);
        
        addText(categoria, margin, yPosition, 10, 'bold', petrolColor);
        yPosition += 15;
        
        recomendacoes.slice(0, 3).forEach((rec: string, index: number) => {
          addText(`• ${rec}`, margin + 10, yPosition, 9, 'normal', textColor);
          yPosition += 12;
        });
        
        yPosition += 10;
      }
    });
  }
  
  // 6. OBSERVAÇÕES
  if (diagnosticData.observacoes) {
    checkPageBreak(60);
    
    addTitle('Observações', margin, yPosition, 14);
    yPosition += 20;
    
    const lines = doc.splitTextToSize(diagnosticData.observacoes, contentWidth - 20);
    lines.forEach((line: string, index: number) => {
      addText(line, margin, yPosition + (index * 12), 9, 'normal', textColor);
    });
    
    yPosition += lines.length * 12 + 20;
  }
  
  // 7. BLOCO FINAL - PRÓXIMOS PASSOS
  checkPageBreak(120);
  
  // Fundo azul petróleo
  doc.setFillColor(petrolColor[0], petrolColor[1], petrolColor[2]);
  doc.rect(0, yPosition - 10, pageWidth, 120, 'F');
  
  // Título em branco
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Próximos Passos', pageWidth / 2, yPosition + 20, { align: 'center' });
  
  // Frase principal
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Com base na análise realizada, identificamos', pageWidth / 2, yPosition + 45, { align: 'center' });
  doc.text('oportunidades estratégicas para impulsionar', pageWidth / 2, yPosition + 60, { align: 'center' });
  doc.text('o crescimento do seu negócio.', pageWidth / 2, yPosition + 75, { align: 'center' });
  
  // Frase destaque
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(highlightColor[0], highlightColor[1], highlightColor[2]);
  doc.text('Vamos juntos transformar seus resultados?', pageWidth / 2, yPosition + 95, { align: 'center' });
  
  // Botão visual
  const buttonWidth = 120;
  const buttonHeight = 20;
  const buttonX = (pageWidth - buttonWidth) / 2;
  const buttonY = yPosition + 105;
  
  doc.setFillColor(highlightColor[0], highlightColor[1], highlightColor[2]);
  doc.roundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 10, 10, 'F');
  
  doc.setTextColor(petrolColor[0], petrolColor[1], petrolColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Agendar reunião de apresentação', pageWidth / 2, buttonY + 13, { align: 'center' });
  
  return doc;
};

export const generateProposalPDF = (proposalData: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('CheckUp de Negócios - Proposta Comercial', 20, 30);
  
  // Empresa info
  doc.setFontSize(14);
  const empresa = proposalData.diagnosticos?.empresas;
  doc.text(`Empresa: ${empresa?.nome || 'N/A'}`, 20, 50);
  doc.text(`Cliente: ${empresa?.cliente_nome || 'N/A'}`, 20, 65);
  doc.text(`E-mail: ${empresa?.cliente_email || 'N/A'}`, 20, 80);
  doc.text(`Data: ${new Date(proposalData.created_at).toLocaleDateString('pt-BR')}`, 20, 95);
  
  // Proposta
  doc.setFontSize(16);
  doc.text(`Valor: ${proposalData.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 20, 120);
  doc.text(`Prazo: ${proposalData.prazo || 'A definir'}`, 20, 135);
  
  // Objetivo
  doc.setFontSize(12);
  doc.text('Objetivo:', 20, 155);
  doc.text(proposalData.objetivo, 20, 170, { maxWidth: 170 });
  
  // Ações sugeridas
  if (proposalData.acoes_sugeridas?.length > 0) {
    doc.text('Ações Sugeridas:', 20, 200);
    proposalData.acoes_sugeridas.forEach((acao: string, index: number) => {
      doc.text(`• ${acao}`, 25, 215 + (index * 10));
    });
  }
  
  return doc;
};

export const downloadPDF = (doc: jsPDF, filename: string) => {
  doc.save(filename);
};

export const getPDFDataURL = (doc: jsPDF) => {
  return doc.output('dataurlstring');
};
