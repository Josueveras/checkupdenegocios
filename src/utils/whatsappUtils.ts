
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

export const createDiagnosticWhatsAppMessage = (
  companyName: string, 
  clientName: string, 
  score: number, 
  level: string,
  pdfUrl: string
) => {
  const message = `Olá ${clientName}! 👋

Seu diagnóstico empresarial da *${companyName}* está pronto!
📊 *Score obtido:* ${score}% (${level})

📄 Você pode acessar o relatório completo no link abaixo:
${pdfUrl}

📅 Que tal agendarmos uma reunião para discutir os resultados e próximos passos?

Estou à disposição para tirar dúvidas e te ajudar no que for necessário. 😉

Att,
CheckUp de Negócios`;

  return message;
};

export const createProposalWhatsAppMessage = (companyName: string, clientName: string, proposalValue: number) => {
  let message = `Olá ${clientName}! 👋\n\n`;
  message += `Preparamos uma proposta personalizada para a *${companyName}* baseada no seu diagnóstico! 💼\n\n`;
  message += `💰 *Valor: ${proposalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}*\n\n`;
  message += `🚀 Vamos conversar sobre como podemos ajudar sua empresa a crescer?\n\n`;
  message += `📋 Confira todos os detalhes da nossa proposta comercial e as ações que iremos implementar para impulsionar seus resultados!`;
  
  return message;
};
