
import jsPDF from 'jspdf';

export const generateDiagnosticPDF = (diagnosticData: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  let yPosition = margin;
  
  // Cores do sistema
  const petrolColor = [15, 50, 68] as const; // #0F3244
  const blueLight = [60, 156, 214] as const; // #3C9CD6
  const grayLight = [248, 250, 252] as const;
  const grayText = [107, 114, 128] as const;
  
  // Helper function para adicionar nova página se necessário
  const checkPageBreak = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };
  
  // Helper function para desenhar card
  const drawCard = (x: number, y: number, width: number, height: number) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y, width, height, 3, 3, 'FD');
  };
  
  // Helper function para texto com quebra de linha
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return lines.length * (fontSize * 0.35); // Altura aproximada das linhas
  };
  
  // Header do diagnóstico
  doc.setFillColor(15, 50, 68);
  doc.rect(0, 0, pageWidth, 60, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Relatório de Diagnóstico Empresarial', pageWidth/2, 25, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(diagnosticData.empresas?.nome || 'Empresa', pageWidth/2, 40, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth/2, 50, { align: 'center' });
  
  yPosition = 80;
  doc.setTextColor(0, 0, 0);
  
  // Informações da Empresa
  checkPageBreak(80);
  drawCard(margin, yPosition, contentWidth, 70);
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 50, 68);
  doc.text('Informações da Empresa', margin + 10, yPosition + 15);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const empresa = diagnosticData.empresas;
  const leftColumn = margin + 10;
  const rightColumn = margin + contentWidth/2 + 10;
  
  doc.text('Nome da Empresa:', leftColumn, yPosition + 30);
  doc.setFont('helvetica', 'bold');
  doc.text(empresa?.nome || 'N/A', leftColumn, yPosition + 38);
  
  doc.setFont('helvetica', 'normal');
  doc.text('Cliente:', rightColumn, yPosition + 30);
  doc.setFont('helvetica', 'bold');
  doc.text(empresa?.cliente_nome || 'N/A', rightColumn, yPosition + 38);
  
  doc.setFont('helvetica', 'normal');
  doc.text('E-mail:', leftColumn, yPosition + 50);
  doc.setFont('helvetica', 'bold');
  doc.text(empresa?.cliente_email || 'N/A', leftColumn, yPosition + 58);
  
  doc.setFont('helvetica', 'normal');
  doc.text('Telefone:', rightColumn, yPosition + 50);
  doc.setFont('helvetica', 'bold');
  doc.text(empresa?.cliente_telefone || 'N/A', rightColumn, yPosition + 58);
  
  yPosition += 90;
  
  // Score Geral e Scores por Categoria lado a lado
  checkPageBreak(120);
  
  // Score Geral (lado esquerdo)
  const scoreCardWidth = (contentWidth - 10) / 2;
  drawCard(margin, yPosition, scoreCardWidth, 100);
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 50, 68);
  doc.text('Score Geral', margin + 10, yPosition + 15);
  
  // Círculo do score
  const centerX = margin + scoreCardWidth/2;
  const centerY = yPosition + 55;
  
  doc.setFillColor(60, 156, 214);
  doc.circle(centerX, centerY, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`${diagnosticData.score_total}%`, centerX, centerY - 2, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(diagnosticData.nivel, centerX, centerY + 8, { align: 'center' });
  
  // Scores por Categoria (lado direito)
  drawCard(margin + scoreCardWidth + 10, yPosition, scoreCardWidth, 100);
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 50, 68);
  doc.text('Scores por Categoria', margin + scoreCardWidth + 20, yPosition + 15);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const categorias = [
    { nome: 'Marketing', score: diagnosticData.score_marketing },
    { nome: 'Vendas', score: diagnosticData.score_vendas },
    { nome: 'Estratégia', score: diagnosticData.score_estrategia },
    { nome: 'Gestão', score: diagnosticData.score_gestao }
  ];
  
  categorias.forEach((cat, index) => {
    const catY = yPosition + 30 + (index * 15);
    doc.text(`${cat.nome}:`, margin + scoreCardWidth + 20, catY);
    doc.setFont('helvetica', 'bold');
    doc.text(`${cat.score}%`, margin + scoreCardWidth + 20 + 80, catY);
    doc.setFont('helvetica', 'normal');
  });
  
  yPosition += 120;
  
  // Pontos Fortes e de Atenção lado a lado
  if (diagnosticData.pontos_fortes?.length > 0 || diagnosticData.pontos_atencao?.length > 0) {
    checkPageBreak(120);
    
    // Pontos Fortes (lado esquerdo)
    if (diagnosticData.pontos_fortes?.length > 0) {
      drawCard(margin, yPosition, scoreCardWidth, 100);
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(34, 197, 94); // green-500
      doc.text('🎯 Pontos Fortes', margin + 10, yPosition + 15);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      diagnosticData.pontos_fortes.forEach((ponto: string, index: number) => {
        const pontoY = yPosition + 30 + (index * 12);
        if (pontoY < yPosition + 95) {
          doc.text(`✅ ${ponto}`, margin + 15, pontoY);
        }
      });
    }
    
    // Pontos de Atenção (lado direito)
    if (diagnosticData.pontos_atencao?.length > 0) {
      drawCard(margin + scoreCardWidth + 10, yPosition, scoreCardWidth, 100);
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(239, 68, 68); // red-500
      doc.text('⚠️ Pontos de Atenção', margin + scoreCardWidth + 20, yPosition + 15);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      diagnosticData.pontos_atencao.forEach((ponto: string, index: number) => {
        const pontoY = yPosition + 30 + (index * 12);
        if (pontoY < yPosition + 95) {
          doc.text(`🔴 ${ponto}`, margin + scoreCardWidth + 25, pontoY);
        }
      });
    }
    
    yPosition += 120;
  }
  
  // Recomendações
  if (diagnosticData.recomendacoes && Object.keys(diagnosticData.recomendacoes).length > 0) {
    checkPageBreak(80);
    
    const recHeight = Math.max(80, Object.keys(diagnosticData.recomendacoes).length * 40);
    drawCard(margin, yPosition, contentWidth, recHeight);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 50, 68);
    doc.text('💡 Recomendações', margin + 10, yPosition + 15);
    
    let recY = yPosition + 30;
    
    Object.entries(diagnosticData.recomendacoes).forEach(([categoria, recomendacoes]: [string, any]) => {
      checkPageBreak(40);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 156, 214);
      doc.text(categoria, margin + 15, recY);
      recY += 15;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      recomendacoes.forEach((rec: string) => {
        const textHeight = addWrappedText(`• ${rec}`, margin + 20, recY, contentWidth - 30, 10);
        recY += textHeight + 5;
      });
      
      recY += 5;
    });
    
    yPosition = recY + 10;
  }
  
  // Observações
  if (diagnosticData.observacoes) {
    checkPageBreak(60);
    
    const obsHeight = Math.max(60, Math.ceil(diagnosticData.observacoes.length / 80) * 20);
    drawCard(margin, yPosition, contentWidth, obsHeight);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 50, 68);
    doc.text('Observações', margin + 10, yPosition + 15);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    addWrappedText(diagnosticData.observacoes, margin + 15, yPosition + 30, contentWidth - 20, 10);
  }
  
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
