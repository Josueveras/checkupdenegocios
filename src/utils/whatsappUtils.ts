
export const sendWhatsAppMessage = (phone: string, message: string) => {
  // Remover caracteres especiais do telefone
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Garantir que tenha código do país (55 para Brasil)
  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  
  // Criar URL do WhatsApp
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  
  // Abrir em nova aba
  window.open(whatsappUrl, '_blank');
};

export const sendDiagnosticWhatsApp = (phone: string, pdfUrl: string, companyName: string) => {
  const message = `Olá! Segue seu diagnóstico empresarial da ${companyName}. Clique aqui para visualizar: ${pdfUrl}`;
  sendWhatsAppMessage(phone, message);
};

export const sendProposalWhatsApp = (phone: string, pdfUrl: string, companyName: string) => {
  const message = `Olá! Segue a proposta comercial personalizada para ${companyName}. Clique aqui para visualizar: ${pdfUrl}`;
  sendWhatsAppMessage(phone, message);
};
