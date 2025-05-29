
export const createWhatsAppLink = (phone: string, message: string) => {
  // Remove todos os caracteres não numéricos do telefone
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Adiciona código do país se não tiver
  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  
  // Encode da mensagem para URL
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
};

export const sendDiagnosticWhatsApp = (clientName: string, companyName: string, phone: string, pdfUrl?: string) => {
  const message = `Olá ${clientName}! 👋

Seu diagnóstico empresarial da ${companyName} foi finalizado!

📊 Acesse seu relatório completo aqui: ${pdfUrl || 'Em breve você receberá o link'}

Qualquer dúvida, estamos à disposição!

Atenciosamente,
Equipe CheckUp de Negócios`;

  const whatsappUrl = createWhatsAppLink(phone, message);
  window.open(whatsappUrl, '_blank');
  
  return whatsappUrl;
};

export const sendProposalWhatsApp = (clientName: string, companyName: string, phone: string, value: number, objective: string, pdfUrl?: string) => {
  const message = `Olá ${clientName}! 👋

Segue a proposta comercial personalizada para ${companyName}.

💼 Valor: ${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
🎯 Objetivo: ${objective}

📄 Acesse a proposta completa aqui: ${pdfUrl || 'Em breve você receberá o link'}

Estamos à disposição para esclarecimentos!

Atenciosamente,
Equipe CheckUp de Negócios`;

  const whatsappUrl = createWhatsAppLink(phone, message);
  window.open(whatsappUrl, '_blank');
  
  return whatsappUrl;
};

export const sendWhatsAppMessage = ({ phone, clientName, companyName, score, level, pdfUrl }: {
  phone: string;
  clientName: string;
  companyName: string;
  score: number;
  level: string;
  pdfUrl?: string;
}) => {
  const message = `Olá ${clientName}! 👋

Seu diagnóstico empresarial da ${companyName} foi finalizado!

📊 Score: ${score}%
📈 Nível: ${level}

📄 Acesse seu relatório completo aqui: ${pdfUrl || 'Em breve você receberá o link'}

Qualquer dúvida, estamos à disposição!

Atenciosamente,
Equipe CheckUp de Negócios`;

  const whatsappUrl = createWhatsAppLink(phone, message);
  window.open(whatsappUrl, '_blank');
  
  return whatsappUrl;
};
