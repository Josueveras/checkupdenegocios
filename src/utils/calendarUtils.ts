
export const createGoogleCalendarEvent = (empresa: string, clienteEmail?: string) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1); // Tomorrow
  startDate.setHours(14, 0, 0, 0); // 2 PM
  
  const endDate = new Date(startDate);
  endDate.setHours(15, 0, 0, 0); // 3 PM
  
  const eventDetails = {
    text: `Reunião - Apresentação Diagnóstico ${empresa}`,
    dates: `${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}`,
    details: `Reunião para apresentação do diagnóstico empresarial da ${empresa}`,
    location: 'Reunião Online',
    sf: 'true', // Convert boolean to string
    output: 'xml'
  };
  
  const params = new URLSearchParams(eventDetails);
  
  if (clienteEmail) {
    params.append('add', clienteEmail);
  }
  
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&${params.toString()}`;
  
  window.open(googleCalendarUrl, '_blank');
};

const formatDateForGoogle = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

export const openCalendlyLink = () => {
  // Replace with your actual Calendly link
  const calendlyUrl = 'https://calendly.com/seu-usuario/30min';
  window.open(calendlyUrl, '_blank');
};
