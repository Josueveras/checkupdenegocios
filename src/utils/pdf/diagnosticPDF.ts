
import jsPDF from 'jspdf';
import { createPDFHelpers } from './pdfHelpers';
import { createSectionGenerators } from './pdfSections';

export const generateDiagnosticPDF = (diagnosticData: any) => {
  const doc = new jsPDF();
  const helpers = createPDFHelpers(doc);
  const sections = createSectionGenerators(doc, helpers);
  
  let yPosition = helpers.margin;
  const empresa = diagnosticData.empresas;
  
  // 1. CABEÇALHO
  yPosition = 40;
  yPosition = sections.generateHeader(empresa, yPosition);
  
  // 2. DADOS DA EMPRESA
  yPosition = helpers.checkPageBreak(yPosition, 70);
  yPosition = sections.generateCompanyData(empresa, yPosition);
  
  // 3. RESULTADOS
  yPosition = helpers.checkPageBreak(yPosition, 120);
  yPosition = sections.generateResults(diagnosticData, yPosition);
  
  // 4. PONTOS FORTES E PONTOS DE ATENÇÃO
  yPosition = helpers.checkPageBreak(yPosition, 100);
  yPosition = sections.generatePointsSection(diagnosticData, yPosition);
  
  // 5. RECOMENDAÇÕES
  yPosition = sections.generateRecommendations(diagnosticData, yPosition, helpers.checkPageBreak);
  
  // 6. OBSERVAÇÕES
  yPosition = sections.generateObservations(diagnosticData, yPosition, helpers.checkPageBreak);
  
  // 7. BLOCO FINAL - PRÓXIMOS PASSOS
  sections.generateFinalSection(yPosition, helpers.checkPageBreak);
  
  return doc;
};
