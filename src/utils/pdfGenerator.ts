import jsPDF from 'jspdf';

export const generateDiagnosticPDF = (diagnosticData: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  let yPosition = margin;
  
  // Cores do sistema (mantendo identidade visual)
  const petrolColor = [15, 50, 68] as const; // #0F3244
  const blueLight = [60, 156, 214] as const; // #3C9CD6
  const grayLight = [248, 250, 252] as const;
  const grayBorder = [229, 231, 235] as const;
  const grayText = [107, 114, 128] as const;
  
  // Helper function para adicionar nova página se necessário
  const checkPageBreak = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };
  
  // Helper function para desenhar card com visual da interface
  const drawCard = (x: number, y: number, width: number, height: number, title?: string) => {
    // Fundo do card
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...grayBorder);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y, width, height, 3, 3, 'FD');
    
    // Sombra sutil
    doc.setFillColor(0, 0, 0, 0.05);
    doc.roundedRect(x + 1, y + 1, width, height, 3, 3, 'F');
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y, width, height, 3, 3, 'FD');
    
    // Título do card se fornecido
    if (title) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...petrolColor);
      doc.text(title, x + 15, y + 20);
    }
  };
  
  // Helper function para texto com quebra de linha
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return lines.length * (fontSize * 0.35);
  };
  
  // Header principal - mantendo design da plataforma
  doc.setFillColor(...petrolColor);
  doc.rect(0, 0, pageWidth, 70, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('Diagnostico Empresarial', pageWidth/2, 30, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(diagnosticData.empresas?.nome || 'Empresa', pageWidth/2, 45, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth/2, 60, { align: 'center' });
  
  yPosition = 90;
  doc.setTextColor(0, 0, 0);
  
  // Card de Informações da Empresa - igual ao layout da tela
  checkPageBreak(100);
  drawCard(margin, yPosition, contentWidth, 90, 'Informacoes da Empresa');
  
  const empresa = diagnosticData.empresas;
  const leftColumn = margin + 15;
  const rightColumn = margin + contentWidth/2 + 15;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayText);
  
  // Primeira linha
  doc.text('Nome da Empresa', leftColumn, yPosition + 40);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(empresa?.nome || 'N/A', leftColumn, yPosition + 50);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayText);
  doc.text('Cliente', rightColumn, yPosition + 40);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(empresa?.cliente_nome || 'N/A', rightColumn, yPosition + 50);
  
  // Segunda linha
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayText);
  doc.text('E-mail', leftColumn, yPosition + 65);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(empresa?.cliente_email || 'N/A', leftColumn, yPosition + 75);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayText);
  doc.text('Telefone', rightColumn, yPosition + 65);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(empresa?.cliente_telefone || 'N/A', rightColumn, yPosition + 75);
  
  yPosition += 110;
  
  // Cards de Score lado a lado - mantendo layout da tela
  checkPageBreak(140);
  
  const scoreCardWidth = (contentWidth - 20) / 2;
  
  // Card Score Geral
  drawCard(margin, yPosition, scoreCardWidth, 130, 'Score Geral');
  
  // Círculo do score centralizado
  const centerX = margin + scoreCardWidth/2;
  const centerY = yPosition + 80;
  
  doc.setFillColor(...blueLight);
  doc.circle(centerX, centerY, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(`${diagnosticData.score_total}%`, centerX, centerY - 3, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(diagnosticData.nivel, centerX, centerY + 12, { align: 'center' });
  
  // Card Scores por Categoria
  drawCard(margin + scoreCardWidth + 20, yPosition, scoreCardWidth, 130, 'Scores por Categoria');
  
  const categorias = [
    { nome: 'Marketing', score: diagnosticData.score_marketing },
    { nome: 'Vendas', score: diagnosticData.score_vendas },
    { nome: 'Estrategia', score: diagnosticData.score_estrategia },
    { nome: 'Gestao', score: diagnosticData.score_gestao }
  ];
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  categorias.forEach((cat, index) => {
    const catY = yPosition + 40 + (index * 18);
    const catX = margin + scoreCardWidth + 35;
    
    // Nome da categoria
    doc.text(`${cat.nome}:`, catX, catY);
    
    // Score com fundo colorido (simulando badge)
    const scoreColor = cat.score >= 80 ? [34, 197, 94] : 
                      cat.score >= 60 ? [234, 179, 8] : 
                      cat.score >= 40 ? [249, 115, 22] : [239, 68, 68];
    
    doc.setFillColor(...scoreColor);
    doc.roundedRect(catX + 60, catY - 8, 25, 12, 2, 2, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(`${cat.score}%`, catX + 72, catY - 1, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
  });
  
  yPosition += 150;
  
  // Cards de Pontos Fortes e Atenção lado a lado
  if (diagnosticData.pontos_fortes?.length > 0 || diagnosticData.pontos_atencao?.length > 0) {
    checkPageBreak(140);
    
    // Card Pontos Fortes
    if (diagnosticData.pontos_fortes?.length > 0) {
      drawCard(margin, yPosition, scoreCardWidth, 120, 'Pontos Fortes');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      diagnosticData.pontos_fortes.forEach((ponto: string, index: number) => {
        const pontoY = yPosition + 35 + (index * 14);
        if (pontoY < yPosition + 115) {
          // Bullet point verde
          doc.setFillColor(34, 197, 94);
          doc.circle(margin + 20, pontoY - 3, 2, 'F');
          doc.text(ponto, margin + 28, pontoY);
        }
      });
    }
    
    // Card Pontos de Atenção
    if (diagnosticData.pontos_atencao?.length > 0) {
      drawCard(margin + scoreCardWidth + 20, yPosition, scoreCardWidth, 120, 'Pontos de Atencao');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      diagnosticData.pontos_atencao.forEach((ponto: string, index: number) => {
        const pontoY = yPosition + 35 + (index * 14);
        if (pontoY < yPosition + 115) {
          // Bullet point laranja
          doc.setFillColor(249, 115, 22);
          doc.circle(margin + scoreCardWidth + 40, pontoY - 3, 2, 'F');
          doc.text(ponto, margin + scoreCardWidth + 48, pontoY);
        }
      });
    }
    
    yPosition += 140;
  }
  
  // Card de Recomendações
  if (diagnosticData.recomendacoes && Object.keys(diagnosticData.recomendacoes).length > 0) {
    checkPageBreak(100);
    
    const recHeight = Math.max(100, Object.keys(diagnosticData.recomendacoes).length * 50);
    drawCard(margin, yPosition, contentWidth, recHeight, 'Recomendacoes');
    
    let recY = yPosition + 35;
    
    Object.entries(diagnosticData.recomendacoes).forEach(([categoria, recomendacoes]: [string, any]) => {
      checkPageBreak(50);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...blueLight);
      doc.text(categoria, margin + 15, recY);
      recY += 15;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      recomendacoes.forEach((rec: string) => {
        // Bullet point azul
        doc.setFillColor(...blueLight);
        doc.circle(margin + 20, recY - 3, 1.5, 'F');
        
        const textHeight = addWrappedText(rec, margin + 28, recY, contentWidth - 40, 10);
        recY += textHeight + 8;
      });
      
      recY += 10;
    });
    
    yPosition = recY + 15;
  }
  
  // Card de Observações
  if (diagnosticData.observacoes) {
    checkPageBreak(80);
    
    const obsHeight = Math.max(80, Math.ceil(diagnosticData.observacoes.length / 80) * 20);
    drawCard(margin, yPosition, contentWidth, obsHeight, 'Observacoes');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    addWrappedText(diagnosticData.observacoes, margin + 15, yPosition + 35, contentWidth - 30, 10);
    
    yPosition += obsHeight + 20;
  }
  
  // Rodapé profissional
  checkPageBreak(40);
  
  // Linha separadora
  doc.setDrawColor(...grayBorder);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  
  yPosition += 15;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayText);
  doc.text('CheckUp de Negocios - Diagnostico Empresarial', margin, yPosition);
  doc.text(`Pagina ${doc.getCurrentPageInfo().pageNumber}`, pageWidth - margin, yPosition, { align: 'right' });
  
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
