
export const sendDiagnosticWhatsApp = (phone: string, pdfUrl: string, empresa: string) => {
  const cleanPhone = phone.replace(/\D/g, '');
  const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  
  const message = `Olá! Segue seu diagnóstico da empresa ${empresa}. Clique aqui para visualizar: ${pdfUrl}`;
  const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
  
  window.open(whatsappUrl, '_blank');
};

export const sendProposalWhatsApp = (phone: string, pdfUrl: string, empresa: string) => {
  const cleanPhone = phone.replace(/\D/g, '');
  const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  
  const message = `Olá! Sua proposta comercial para ${empresa} está pronta. Acesse aqui: ${pdfUrl}`;
  const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
  
  window.open(whatsappUrl, '_blank');
};
