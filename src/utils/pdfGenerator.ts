
import jsPDF from 'jspdf';

interface DiagnosticData {
  empresa: string;
  cliente: string;
  scoreTotal: number;
  scoreMarketing: number;
  scoreVendas: number;
  scoreEstrategia: number;
  nivel: string;
  pontosFortes: string[];
  pontosAtencao: string[];
  recomendacoes: string[];
}

interface ProposalData {
  empresa: string;
  objetivo: string;
  acoesSugeridas: string[];
  valor: number;
  prazo: string;
}

export const generateDiagnosticPDF = (data: DiagnosticData): string => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(15, 50, 68); // #0F3244
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('CheckUp de Negócios', 20, 20);
  
  // Company info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.text(`Diagnóstico Empresarial - ${data.empresa}`, 20, 50);
  
  doc.setFontSize(12);
  doc.text(`Cliente: ${data.cliente}`, 20, 65);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 75);
  
  // Scores
  doc.setFontSize(14);
  doc.text('Pontuação Geral', 20, 95);
  
  doc.setFontSize(12);
  doc.text(`Score Total: ${data.scoreTotal}% - Nível ${data.nivel}`, 20, 110);
  doc.text(`Marketing: ${data.scoreMarketing}%`, 20, 125);
  doc.text(`Vendas: ${data.scoreVendas}%`, 20, 135);
  doc.text(`Estratégia: ${data.scoreEstrategia}%`, 20, 145);
  
  // Pontos Fortes
  doc.setFontSize(14);
  doc.text('Pontos Fortes', 20, 165);
  doc.setFontSize(10);
  let yPos = 175;
  data.pontosFortes.forEach((ponto, index) => {
    doc.text(`• ${ponto}`, 25, yPos);
    yPos += 8;
  });
  
  // Pontos de Atenção
  yPos += 10;
  doc.setFontSize(14);
  doc.text('Pontos de Atenção', 20, yPos);
  yPos += 10;
  doc.setFontSize(10);
  data.pontosAtencao.forEach((ponto) => {
    doc.text(`• ${ponto}`, 25, yPos);
    yPos += 8;
  });
  
  // Recomendações
  yPos += 10;
  doc.setFontSize(14);
  doc.text('Recomendações', 20, yPos);
  yPos += 10;
  doc.setFontSize(10);
  data.recomendacoes.forEach((rec) => {
    doc.text(`• ${rec}`, 25, yPos);
    yPos += 8;
  });
  
  // Generate blob URL
  const pdfBlob = doc.output('blob');
  return URL.createObjectURL(pdfBlob);
};

export const generateProposalPDF = (data: ProposalData): string => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(15, 50, 68);
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('Proposta Comercial', 20, 20);
  
  // Company info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.text(`Proposta para ${data.empresa}`, 20, 50);
  
  doc.setFontSize(12);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 65);
  
  // Objetivo
  doc.setFontSize(14);
  doc.text('Objetivo', 20, 85);
  doc.setFontSize(12);
  const objetivoLines = doc.splitTextToSize(data.objetivo, pageWidth - 40);
  doc.text(objetivoLines, 20, 100);
  
  // Ações Sugeridas
  let yPos = 100 + (objetivoLines.length * 7) + 15;
  doc.setFontSize(14);
  doc.text('Ações Sugeridas', 20, yPos);
  yPos += 10;
  doc.setFontSize(10);
  data.acoesSugeridas.forEach((acao) => {
    doc.text(`• ${acao}`, 25, yPos);
    yPos += 8;
  });
  
  // Investimento
  yPos += 15;
  doc.setFontSize(14);
  doc.text('Investimento', 20, yPos);
  yPos += 10;
  doc.setFontSize(12);
  doc.text(`Valor: R$ ${data.valor.toLocaleString('pt-BR')}`, 20, yPos);
  doc.text(`Prazo: ${data.prazo}`, 20, yPos + 10);
  
  const pdfBlob = doc.output('blob');
  return URL.createObjectURL(pdfBlob);
};

export const generateComparativePDF = (diagnosticos: DiagnosticData[]): string => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(15, 50, 68);
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('Relatório Comparativo', 20, 20);
  
  // Content
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text('Comparativo de Diagnósticos', 20, 50);
  
  let yPos = 70;
  diagnosticos.forEach((diag, index) => {
    doc.setFontSize(12);
    doc.text(`${index + 1}. ${diag.empresa}`, 20, yPos);
    doc.setFontSize(10);
    doc.text(`Score: ${diag.scoreTotal}% | Nível: ${diag.nivel}`, 25, yPos + 8);
    yPos += 20;
  });
  
  const pdfBlob = doc.output('blob');
  return URL.createObjectURL(pdfBlob);
};
