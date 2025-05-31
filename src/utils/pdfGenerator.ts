
import jsPDF from 'jspdf';

export const generateDiagnosticPDF = (diagnosticData: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  let yPosition = margin;
  
  // Paleta de cores
  const petrolColor = [15, 50, 68];
  const mustardColor = [251, 176, 59];
  const textColor = [51, 51, 51];
  const lightGray = [245, 245, 245];
  const white = [255, 255, 255];
  
  // Helper functions
  const checkPageBreak = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };
  
  const addTitle = (text: string, x: number, y: number, size: number, color: number[] = petrolColor) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(text, x, y);
  };
  
  const addText = (text: string, x: number, y: number, size: number = 10, style: string = 'normal', color: number[] = textColor) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', style as any);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(text, x, y);
  };
  
  const drawBlock = (x: number, y: number, width: number, height: number, backgroundColor: number[] = lightGray) => {
    doc.setFillColor(backgroundColor[0], backgroundColor[1], backgroundColor[2]);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, width, height, 3, 3, 'FD');
  };
  
  // CABEÇALHO
  addTitle('Diagnóstico Empresarial', margin, yPosition + 15, 24);
  
  const empresa = diagnosticData.empresas;
  const empresaInfo = `${empresa?.nome || 'N/A'}`;
  const dataInfo = `Data: ${new Date().toLocaleDateString('pt-BR')}`;
  
  // Informações da empresa e data à direita
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(empresaInfo, pageWidth - margin, yPosition + 10, { align: 'right' });
  doc.text(dataInfo, pageWidth - margin, yPosition + 25, { align: 'right' });
  
  yPosition += 50;
  
  // BLOCO: DADOS DA EMPRESA
  checkPageBreak(60);
  drawBlock(margin, yPosition, contentWidth, 55);
  addTitle('Dados da Empresa', margin + 10, yPosition + 15, 14);
  
  addText(`Cliente: ${empresa?.cliente_nome || 'N/A'}`, margin + 10, yPosition + 30, 10);
  addText(`E-mail: ${empresa?.cliente_email || 'N/A'}`, margin + 10, yPosition + 42, 10);
  addText(`Telefone: ${empresa?.cliente_telefone || 'N/A'}`, margin + 100, yPosition + 30, 10);
  addText(`Setor: ${empresa?.setor || 'N/A'}`, margin + 100, yPosition + 42, 10);
  
  yPosition += 75;
  
  // BLOCO: RESULTADOS
  checkPageBreak(140);
  drawBlock(margin, yPosition, contentWidth, 135);
  addTitle('Resultados', margin + 10, yPosition + 15, 14);
  
  // Score geral em destaque
  const centerX = pageWidth / 2;
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(petrolColor[0], petrolColor[1], petrolColor[2]);
  doc.text(`${diagnosticData.score_total}%`, centerX, yPosition + 45, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nível: ${diagnosticData.nivel}`, centerX, yPosition + 60, { align: 'center' });
  
  // Pontuação por categoria
  const categorias = [
    { nome: 'Estratégia', score: diagnosticData.score_estrategia },
    { nome: 'Vendas', score: diagnosticData.score_vendas },
    { nome: 'Marketing', score: diagnosticData.score_marketing },
    { nome: 'Gestão', score: diagnosticData.score_gestao }
  ];
  
  let catY = yPosition + 80;
  categorias.forEach((cat, index) => {
    const catX = margin + 15 + (index % 2) * (contentWidth / 2);
    if (index === 2) catY += 15;
    
    addText(`${cat.nome}: ${cat.score}%`, catX, catY + (index >= 2 ? 0 : 0), 10, 'bold');
    
    // Barra de progresso simples
    const barWidth = 60;
    const barHeight = 4;
    const barX = catX + 60;
    const barY = catY - 3 + (index >= 2 ? 0 : 0);
    
    // Fundo da barra
    doc.setFillColor(220, 220, 220);
    doc.rect(barX, barY, barWidth, barHeight, 'F');
    
    // Progresso
    const progressWidth = (barWidth * cat.score) / 100;
    const progressColor = cat.score >= 70 ? [34, 197, 94] : cat.score >= 50 ? mustardColor : [239, 68, 68];
    doc.setFillColor(progressColor[0], progressColor[1], progressColor[2]);
    doc.rect(barX, barY, progressWidth, barHeight, 'F');
  });
  
  yPosition += 155;
  
  // BLOCO: PONTOS FORTES E PONTOS DE ATENÇÃO
  if (diagnosticData.pontos_fortes?.length > 0 || diagnosticData.pontos_atencao?.length > 0) {
    checkPageBreak(100);
    
    const blockWidth = (contentWidth - 10) / 2;
    
    // Pontos Fortes
    if (diagnosticData.pontos_fortes?.length > 0) {
      drawBlock(margin, yPosition, blockWidth, 95);
      addTitle('Pontos Fortes', margin + 10, yPosition + 15, 12, [34, 197, 94]);
      
      diagnosticData.pontos_fortes.slice(0, 5).forEach((ponto: string, index: number) => {
        addText(`• ${ponto}`, margin + 10, yPosition + 30 + (index * 12), 9);
      });
    }
    
    // Pontos de Atenção
    if (diagnosticData.pontos_atencao?.length > 0) {
      drawBlock(margin + blockWidth + 10, yPosition, blockWidth, 95);
      addTitle('Pontos de Atenção', margin + blockWidth + 20, yPosition + 15, 12, [239, 68, 68]);
      
      diagnosticData.pontos_atencao.slice(0, 5).forEach((ponto: string, index: number) => {
        addText(`• ${ponto}`, margin + blockWidth + 20, yPosition + 30 + (index * 12), 9);
      });
    }
    
    yPosition += 115;
  }
  
  // BLOCO: RECOMENDAÇÕES
  checkPageBreak(80);
  drawBlock(margin, yPosition, contentWidth, 75);
  addTitle('Recomendações', margin + 10, yPosition + 15, 14);
  
  const recomendacoes = [
    'Implementar sistema de CRM para melhor gestão de clientes',
    'Desenvolver estratégia de marketing digital mais estruturada',
    'Criar processos padronizados para vendas',
    'Estabelecer métricas de acompanhamento de resultados'
  ];
  
  recomendacoes.forEach((rec, index) => {
    addText(`• ${rec}`, margin + 10, yPosition + 30 + (index * 10), 9);
  });
  
  yPosition += 95;
  
  // BLOCO: OBSERVAÇÕES
  if (diagnosticData.observacoes) {
    checkPageBreak(60);
    drawBlock(margin, yPosition, contentWidth, 55);
    addTitle('Observações', margin + 10, yPosition + 15, 14);
    
    const lines = doc.splitTextToSize(diagnosticData.observacoes, contentWidth - 20);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(lines, margin + 10, yPosition + 30);
    
    yPosition += 75;
  }
  
  // BLOCO FINAL - PRÓXIMOS PASSOS
  checkPageBreak(120);
  
  // Fundo azul petróleo
  doc.setFillColor(petrolColor[0], petrolColor[1], petrolColor[2]);
  doc.roundedRect(margin, yPosition, contentWidth, 115, 8, 8, 'F');
  
  // Título em branco
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Próximos Passos', centerX, yPosition + 25, { align: 'center' });
  
  // Texto em branco
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Com base na análise realizada, identificamos', centerX, yPosition + 45, { align: 'center' });
  doc.text('oportunidades estratégicas para impulsionar', centerX, yPosition + 58, { align: 'center' });
  doc.text('o crescimento do seu negócio.', centerX, yPosition + 71, { align: 'center' });
  
  // Frase destaque
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(mustardColor[0], mustardColor[1], mustardColor[2]);
  doc.text('Vamos juntos transformar seus resultados?', centerX, yPosition + 90, { align: 'center' });
  
  // Botão visual
  const buttonWidth = 140;
  const buttonHeight = 18;
  const buttonX = centerX - (buttonWidth / 2);
  const buttonY = yPosition + 95;
  
  doc.setFillColor(mustardColor[0], mustardColor[1], mustardColor[2]);
  doc.roundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 9, 9, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(petrolColor[0], petrolColor[1], petrolColor[2]);
  doc.text('Agendar reunião de apresentação', centerX, buttonY + 12, { align: 'center' });
  
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
