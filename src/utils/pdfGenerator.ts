import jsPDF from 'jspdf';

export const generateDiagnosticPDF = (diagnosticData: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  let yPosition = margin;
  
  // Paleta de cores do novo design
  const petrolColor = [15, 50, 68] as const;
  const blueLight = [60, 156, 214] as const;
  const mustard = [251, 176, 59] as const;
  const grayLight = [245, 245, 245] as const;
  const grayText = [107, 114, 128] as const;
  const white = [255, 255, 255] as const;
  
  // Helper functions
  const checkPageBreak = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };
  
  const drawModernCard = (x: number, y: number, width: number, height: number, backgroundColor?: number[]) => {
    const bgColor = backgroundColor || grayLight;
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, width, height, 8, 8, 'FD');
  };
  
  const addTitle = (text: string, x: number, y: number, size: number, color?: number[]) => {
    const textColor = color || petrolColor;
    doc.setFontSize(size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(text, x, y);
  };
  
  const addText = (text: string, x: number, y: number, size: number, style: string = 'normal', color?: number[]) => {
    const textColor = color || [0, 0, 0];
    doc.setFontSize(size);
    doc.setFont('helvetica', style as any);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(text, x, y);
  };
  
  // PÁGINA DE CAPA
  doc.setFillColor(white[0], white[1], white[2]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Título principal
  addTitle('Relatório de Diagnóstico Empresarial', pageWidth/2, 80, 24);
  doc.text('Relatório de Diagnóstico Empresarial', pageWidth/2, 80, { align: 'center' });
  
  // Subtítulo
  addText('Análise completa do seu negócio', pageWidth/2, 100, 16, 'normal', grayText);
  doc.text('Análise completa do seu negócio', pageWidth/2, 100, { align: 'center' });
  
  // Card central com informações
  drawModernCard(margin + 20, 130, contentWidth - 40, 120, white);
  
  const empresa = diagnosticData.empresas;
  const cardCenterX = pageWidth / 2;
  
  // Informações da empresa
  addTitle('Nome da empresa:', cardCenterX, 160, 12, grayText);
  doc.text('Nome da empresa:', cardCenterX, 160, { align: 'center' });
  
  addText(empresa?.nome || 'N/A', cardCenterX, 175, 14, 'bold');
  doc.text(empresa?.nome || 'N/A', cardCenterX, 175, { align: 'center' });
  
  addTitle('Responsável:', cardCenterX, 200, 12, grayText);
  doc.text('Responsável:', cardCenterX, 200, { align: 'center' });
  
  addText(empresa?.cliente_nome || 'N/A', cardCenterX, 215, 14, 'bold');
  doc.text(empresa?.cliente_nome || 'N/A', cardCenterX, 215, { align: 'center' });
  
  addTitle('Data:', cardCenterX, 240, 12, grayText);
  doc.text('Data:', cardCenterX, 240, { align: 'center' });
  
  addText(new Date().toLocaleDateString('pt-BR'), cardCenterX, 255, 14, 'bold');
  doc.text(new Date().toLocaleDateString('pt-BR'), cardCenterX, 255, { align: 'center' });
  
  // NOVA PÁGINA - RESUMO
  doc.addPage();
  yPosition = margin;
  
  // Título da página
  addTitle('Resumo Executivo', margin, yPosition + 20, 22);
  yPosition += 50;
  
  // Card do score geral
  drawModernCard(margin, yPosition, contentWidth, 140, white);
  
  // Score circular em destaque
  const centerX = pageWidth / 2;
  const centerY = yPosition + 70;
  
  // Círculo grande para o score
  doc.setFillColor(blueLight[0], blueLight[1], blueLight[2]);
  doc.circle(centerX, centerY, 35, 'F');
  
  // Score em branco
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text(`${diagnosticData.score_total}%`, centerX, centerY - 5, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text('SCORE GERAL', centerX, centerY + 15, { align: 'center' });
  
  // Status do negócio
  addTitle(diagnosticData.nivel, centerX, yPosition + 130, 18);
  doc.text(diagnosticData.nivel, centerX, yPosition + 130, { align: 'center' });
  
  yPosition += 160;
  
  // PÁGINAS DAS ÁREAS AVALIADAS
  const categorias = [
    { nome: 'Marketing', emoji: '📣', score: diagnosticData.score_marketing },
    { nome: 'Vendas', emoji: '📈', score: diagnosticData.score_vendas },
    { nome: 'Estratégia', emoji: '🎯', score: diagnosticData.score_estrategia },
    { nome: 'Gestão', emoji: '⚙️', score: diagnosticData.score_gestao }
  ];
  
  categorias.forEach((categoria) => {
    checkPageBreak(180);
    
    // Card da categoria
    drawModernCard(margin, yPosition, contentWidth, 160, grayLight);
    
    // Título da área com emoji
    addTitle(`${categoria.emoji} ${categoria.nome}`, margin + 20, yPosition + 30, 20);
    
    // Score da área
    const scoreColor = categoria.score >= 80 ? [34, 197, 94] : 
                      categoria.score >= 60 ? mustard : 
                      categoria.score >= 40 ? [249, 115, 22] : [239, 68, 68];
    
    // Barra de progresso
    const barWidth = 120;
    const barHeight = 12;
    const barX = margin + 20;
    const barY = yPosition + 50;
    
    // Fundo da barra
    doc.setFillColor(220, 220, 220);
    doc.roundedRect(barX, barY, barWidth, barHeight, 6, 6, 'F');
    
    // Progresso da barra
    const progressWidth = (barWidth * categoria.score) / 100;
    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.roundedRect(barX, barY, progressWidth, barHeight, 6, 6, 'F');
    
    // Texto do score
    addText(`${categoria.score}%`, barX + barWidth + 10, barY + 8, 14, 'bold', scoreColor);
    
    // Status da área
    const status = categoria.score >= 80 ? 'Avançado' : 
                   categoria.score >= 60 ? 'Em Desenvolvimento' : 
                   categoria.score >= 40 ? 'Iniciante' : 'Crítico';
    
    addText(`Status: ${status}`, margin + 20, yPosition + 80, 12, 'normal', grayText);
    
    // Espaço para diagnóstico detalhado (simulado)
    addText('Diagnóstico detalhado da área:', margin + 20, yPosition + 100, 10, 'bold');
    addText('Esta área apresenta oportunidades de melhoria que podem', margin + 20, yPosition + 115, 10);
    addText('ser desenvolvidas através de estratégias específicas.', margin + 20, yPosition + 125, 10);
    addText('Recomendamos foco em ações prioritárias para evolução.', margin + 20, yPosition + 135, 10);
    
    yPosition += 180;
  });
  
  // Pontos Fortes e de Atenção (se existirem)
  if (diagnosticData.pontos_fortes?.length > 0 || diagnosticData.pontos_atencao?.length > 0) {
    checkPageBreak(160);
    
    // Pontos Fortes
    if (diagnosticData.pontos_fortes?.length > 0) {
      drawModernCard(margin, yPosition, contentWidth/2 - 10, 140, white);
      addTitle('🎯 Pontos Fortes', margin + 15, yPosition + 25, 14, [34, 197, 94]);
      
      diagnosticData.pontos_fortes.slice(0, 4).forEach((ponto: string, index: number) => {
        addText(`✓ ${ponto}`, margin + 15, yPosition + 45 + (index * 20), 10, 'normal', [34, 197, 94]);
      });
    }
    
    // Pontos de Atenção
    if (diagnosticData.pontos_atencao?.length > 0) {
      drawModernCard(margin + contentWidth/2 + 10, yPosition, contentWidth/2 - 10, 140, white);
      addTitle('⚠️ Pontos de Atenção', margin + contentWidth/2 + 25, yPosition + 25, 14, [249, 115, 22]);
      
      diagnosticData.pontos_atencao.slice(0, 4).forEach((ponto: string, index: number) => {
        addText(`• ${ponto}`, margin + contentWidth/2 + 25, yPosition + 45 + (index * 20), 10, 'normal', [249, 115, 22]);
      });
    }
    
    yPosition += 160;
  }
  
  // ÚLTIMA PÁGINA - ENCERRAMENTO
  doc.addPage();
  
  // Fundo escuro para a página final
  doc.setFillColor(petrolColor[0], petrolColor[1], petrolColor[2]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Título em branco
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('Próximos Passos', pageWidth/2, 80, { align: 'center' });
  
  // Emoji foguete
  doc.setFontSize(40);
  doc.text('🚀', pageWidth/2, 120, { align: 'center' });
  
  // Recomendações finais
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('Com base na análise realizada, identificamos', pageWidth/2, 150, { align: 'center' });
  doc.text('oportunidades estratégicas para impulsionar', pageWidth/2, 170, { align: 'center' });
  doc.text('o crescimento do seu negócio.', pageWidth/2, 190, { align: 'center' });
  
  // Frase de impacto
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(mustard[0], mustard[1], mustard[2]);
  doc.text('Vamos juntos transformar seus resultados?', pageWidth/2, 230, { align: 'center' });
  
  // Botão visual
  doc.setFillColor(mustard[0], mustard[1], mustard[2]);
  doc.roundedRect(pageWidth/2 - 60, 245, 120, 25, 12, 12, 'F');
  
  doc.setTextColor(petrolColor[0], petrolColor[1], petrolColor[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Agendar reunião de apresentação', pageWidth/2, 260, { align: 'center' });
  
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
