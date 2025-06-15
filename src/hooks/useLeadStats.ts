
import { useQuery } from '@tanstack/react-query';
import { LeadStats } from '@/types/lead';
import { useLeads } from './useLeads';

export const useLeadStats = () => {
  const { data: leads = [] } = useLeads();

  return useQuery({
    queryKey: ['lead-stats', leads.length],
    queryFn: async (): Promise<LeadStats> => {
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 300));

      const totalLeads = leads.length;
      const leadsNovos = leads.filter(lead => lead.status === 'novo').length;
      const leadsQualificados = leads.filter(lead => 
        ['qualificado', 'reuniao_agendada'].includes(lead.status)
      ).length;
      const leadsConvertidos = leads.filter(lead => lead.status === 'ganho').length;
      const taxaConversao = totalLeads > 0 ? (leadsConvertidos / totalLeads) * 100 : 0;
      const receitaPotencial = leads.reduce((acc, lead) => acc + (lead.potencial_receita || 0), 0);
      const ticketMedio = leadsConvertidos > 0 ? receitaPotencial / leadsConvertidos : 0;

      return {
        total_leads: totalLeads,
        leads_novos: leadsNovos,
        leads_qualificados: leadsQualificados,
        leads_convertidos: leadsConvertidos,
        taxa_conversao: Math.round(taxaConversao * 100) / 100,
        receita_potencial: receitaPotencial,
        ticket_medio: Math.round(ticketMedio * 100) / 100
      };
    },
    enabled: leads.length >= 0
  });
};
