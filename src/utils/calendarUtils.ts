
export const createCalendarEvent = (title: string, date: Date, details: string) => {
  const startDate = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endDate = new Date(date.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startDate}/${endDate}`,
    details: details,
    location: '',
    sf: 'true',
    output: 'xml'
  });
  
  const calendarUrl = `https://calendar.google.com/calendar/render?${params.toString()}`;
  window.open(calendarUrl, '_blank');
};

export const scheduleGoogleCalendarEvent = (title: string, description: string, clientEmail?: string) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(14, 0, 0, 0); // 14:00

  const startDate = tomorrow.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endDate = new Date(tomorrow.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startDate}/${endDate}`,
    details: description,
    add: clientEmail || '',
    location: '',
    sf: 'true',
    output: 'xml'
  });
  
  const calendarUrl = `https://calendar.google.com/calendar/render?${params.toString()}`;
  window.open(calendarUrl, '_blank');
};

export const scheduleDiagnosticMeeting = (companyName: string, clientName: string) => {
  const title = `Reunião de Apresentação - ${companyName}`;
  const details = `Reunião para apresentar os resultados do diagnóstico empresarial da ${companyName} com ${clientName}.`;
  const date = new Date();
  date.setDate(date.getDate() + 1); // Agendar para amanhã
  date.setHours(14, 0, 0, 0); // 14:00
  
  createCalendarEvent(title, date, details);
};

export const scheduleProposalMeeting = (companyName: string, clientName: string) => {
  const title = `Reunião Comercial - ${companyName}`;
  const details = `Reunião para apresentar a proposta comercial para ${companyName} com ${clientName}.`;
  const date = new Date();
  date.setDate(date.getDate() + 2); // Agendar para depois de amanhã
  date.setHours(15, 0, 0, 0); // 15:00
  
  createCalendarEvent(title, date, details);
};
