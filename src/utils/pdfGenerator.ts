
import jsPDF from 'jspdf';

export const generateDiagnosticPDF = (diagnosticData: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('CheckUp de Negócios - Diagnóstico', 20, 30);
  
  // Empresa info
  doc.setFontSize(14);
  doc.text(`Empresa: ${diagnosticData.empresa?.nome || 'N/A'}`, 20, 50);
  doc.text(`Cliente: ${diagnosticData.empresa?.cliente_nome || 'N/A'}`, 20, 65);
  doc.text(`E-mail: ${diagnosticData.empresa?.cliente_email || 'N/A'}`, 20, 80);
  doc.text(`Data: ${new Date(diagnosticData.created_at).toLocaleDateString('pt-BR')}`, 20, 95);
  
  // Score
  doc.setFontSize(16);
  doc.text(`Score Total: ${diagnosticData.score_total}%`, 20, 120);
  doc.text(`Nível: ${diagnosticData.nivel}`, 20, 135);
  
  // Scores por categoria
  doc.setFontSize(12);
  doc.text(`Marketing: ${diagnosticData.score_marketing}%`, 20, 155);
  doc.text(`Vendas: ${diagnosticData.score_vendas}%`, 20, 170);
  doc.text(`Estratégia: ${diagnosticData.score_estrategia}%`, 20, 185);
  doc.text(`Gestão: ${diagnosticData.score_gestao}%`, 20, 200);
  
  // Pontos fortes
  if (diagnosticData.pontos_fortes?.length > 0) {
    doc.text('Pontos Fortes:', 20, 225);
    diagnosticData.pontos_fortes.forEach((ponto: string, index: number) => {
      doc.text(`• ${ponto}`, 25, 240 + (index * 10));
    });
  }
  
  // Pontos de atenção
  if (diagnosticData.pontos_atencao?.length > 0) {
    doc.addPage();
    doc.text('Pontos de Atenção:', 20, 30);
    diagnosticData.pontos_atencao.forEach((ponto: string, index: number) => {
      doc.text(`• ${ponto}`, 25, 45 + (index * 10));
    });
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

export const openPDFInNewTab = (doc: jsPDF) => {
  const pdfUrl = doc.output('dataurlstring');
  window.open(pdfUrl, '_blank');
};
