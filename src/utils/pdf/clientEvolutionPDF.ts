
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientEvolutionPDFData {
  empresa: any;
  acompanhamentos: any[];
  indicadores: any;
  ultimoAcompanhamento: any;
}

export const generateClientEvolutionPDF = (data: ClientEvolutionPDFData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPosition = margin;

  // Configurações de fonte
  doc.setFont('helvetica');

  // Título principal
  doc.setFontSize(20);
  doc.setTextColor(15, 50, 68); // Cor petrol
  doc.text('Relatório de Evolução do Cliente', margin, yPosition);
  yPosition += 15;

  // Nome da empresa
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(data.empresa.nome, margin, yPosition);
  yPosition += 10;

  // Data do relatório
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, margin, yPosition);
  yPosition += 20;

  // Informações da empresa
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Informações da Empresa', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  const empresaInfo = [
    `E-mail: ${data.empresa.cliente_email || 'Não informado'}`,
    `Telefone: ${data.empresa.cliente_telefone || 'Não informado'}`,
    `Data de entrada: ${format(new Date(data.empresa.created_at), 'dd/MM/yyyy', { locale: ptBR })}`
  ];

  empresaInfo.forEach(info => {
    doc.text(info, margin, yPosition);
    yPosition += 7;
  });
  yPosition += 10;

  // Indicadores principais
  if (data.indicadores) {
    doc.setFontSize(14);
    doc.text('Indicadores Principais', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    const indicadores = [
      `Score Médio Geral: ${data.indicadores.scoreMedio}%`,
      `ROI Médio: ${data.indicadores.roiMedio}x`,
      `Faturamento Médio: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.indicadores.faturamentoMedio)}`,
      `Total de Check-ups: ${data.indicadores.totalCheckups}`,
      `Ações Concluídas: ${data.indicadores.totalAcoesConcluidas}`
    ];

    indicadores.forEach(indicador => {
      doc.text(indicador, margin, yPosition);
      yPosition += 7;
    });
    yPosition += 15;
  }

  // Histórico de acompanhamentos
  if (data.acompanhamentos && data.acompanhamentos.length > 0) {
    doc.setFontSize(14);
    doc.text('Histórico de Check-ups', margin, yPosition);
    yPosition += 10;

    data.acompanhamentos.forEach((acomp, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFontSize(12);
      doc.setTextColor(15, 50, 68);
      doc.text(format(new Date(acomp.mes), 'MMMM/yyyy', { locale: ptBR }), margin, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const acompInfo = [
        `Score Geral: ${acomp.score_geral}%`,
        `ROI: ${acomp.roi || 'N/A'}x`,
        `Faturamento: ${acomp.faturamento ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(acomp.faturamento) : 'N/A'}`
      ];

      acompInfo.forEach(info => {
        doc.text(info, margin + 10, yPosition);
        yPosition += 6;
      });

      if (acomp.destaque) {
        doc.text(`Destaque: ${acomp.destaque}`, margin + 10, yPosition);
        yPosition += 6;
      }
      yPosition += 8;
    });
  }

  // Nova página para resumo estratégico
  doc.addPage();
  yPosition = margin;

  // Resumo estratégico
  if (data.ultimoAcompanhamento) {
    doc.setFontSize(14);
    doc.setTextColor(15, 50, 68);
    doc.text('Resumo Estratégico', margin, yPosition);
    yPosition += 15;

    const resumoSections = [
      { title: 'Pontos Fortes Desenvolvidos', content: data.ultimoAcompanhamento.pontos_fortes_desenvolvidos },
      { title: 'Gargalos Atuais', content: data.ultimoAcompanhamento.gargalos_atuais },
      { title: 'Estratégias Validadas', content: data.ultimoAcompanhamento.estrategias_validadas }
    ];

    resumoSections.forEach(section => {
      if (section.content) {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(section.title + ':', margin, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        const lines = doc.splitTextToSize(section.content, pageWidth - 2 * margin);
        doc.text(lines, margin, yPosition);
        yPosition += lines.length * 5 + 10;
      }
    });

    if (data.ultimoAcompanhamento.virou_case) {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Status do Case: SIM', margin, yPosition);
      yPosition += 8;

      if (data.ultimoAcompanhamento.destaque_case) {
        doc.setFontSize(10);
        const lines = doc.splitTextToSize(data.ultimoAcompanhamento.destaque_case, pageWidth - 2 * margin);
        doc.text(lines, margin, yPosition);
      }
    }
  }

  return doc;
};
