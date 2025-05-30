
export const sendWhatsAppMessage = (phoneNumber: string, message: string) => {
  // Remove caracteres não numéricos do telefone
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Adiciona código do país se não tiver
  const phone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  
  // Codifica a mensagem para URL
  const encodedMessage = encodeURIComponent(message);
  
  // Cria a URL do WhatsApp
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
  
  // Abre em nova aba
  window.open(whatsappUrl, '_blank');
};

export const createDiagnosticWhatsAppMessage = (companyName: string, clientName: string, score: number, pdfUrl?: string) => {
  let message = `Olá ${clientName}! 👋\n\n`;
  message += `Seu diagnóstico empresarial da ${companyName} está pronto! 📊\n\n`;
  message += `Score obtido: ${score}% 🎯\n\n`;
  
  if (pdfUrl) {
    message += `Você pode visualizar o relatório completo aqui: ${pdfUrl}\n\n`;
  }
  
  message += `Que tal agendarmos uma reunião para discutir os resultados e próximos passos? 📅`;
  
  return message;
};

export const createProposalWhatsAppMessage = (companyName: string, clientName: string, proposalValue: number) => {
  let message = `Olá ${clientName}! 👋\n\n`;
  message += `Preparamos uma proposta personalizada para a ${companyName} baseada no seu diagnóstico! 💼\n\n`;
  message += `Valor: ${proposalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n\n`;
  message += `Vamos conversar sobre como podemos ajudar sua empresa a crescer? 🚀`;
  
  return message;
};
