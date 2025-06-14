
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LeadStats } from '@/types/lead';

export const useLeadStats = () => {
  return useQuery({
    queryKey: ['lead-stats'],
    queryFn: async (): Promise<LeadStats> => {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('status, potencial_receita');
      
      if (error) throw error;

      const totalLeads = leads.length;
      const leadsNovos = leads.filter(lead => lead.status === 'novo').length;
      const leadsQualificados = leads.filter(lead => 
        ['qualificado', 'reuniao_agendada', 'proposta_enviada'].includes(lead.status)
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
    }
  });
};
