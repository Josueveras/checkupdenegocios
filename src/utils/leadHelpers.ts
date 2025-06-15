
import { Lead } from '@/types/lead';
import { formatCurrency } from './formatters';

export const calculateLeadScore = (lead: Partial<Lead>): number => {
  let score = 0;
  
  // Pontuação por tamanho da empresa
  switch (lead.tamanho_empresa) {
    case 'micro': score += 1; break;
    case 'pequena': score += 2; break;
    case 'media': score += 3; break;
    case 'grande': score += 4; break;
  }
  
  // Pontuação por orçamento disponível
  if (lead.orcamento_disponivel) {
    if (lead.orcamento_disponivel >= 50000) score += 4;
    else if (lead.orcamento_disponivel >= 20000) score += 3;
    else if (lead.orcamento_disponivel >= 10000) score += 2;
    else score += 1;
  }
  
  // Pontuação por urgência
  switch (lead.urgencia) {
    case 'alta': score += 3; break;
    case 'media': score += 2; break;
    case 'baixa': score += 1; break;
  }
  
  return Math.min(score, 10); // Máximo 10 pontos
};

export const getLeadStatusColor = (status: Lead['status']): string => {
  switch (status) {
    case 'novo': return 'bg-blue-100 text-blue-800';
    case 'contactado': return 'bg-yellow-100 text-yellow-800';
    case 'qualificado': return 'bg-green-100 text-green-800';
    case 'reuniao_agendada': return 'bg-purple-100 text-purple-800';
    case 'ganho': return 'bg-emerald-100 text-emerald-800';
    case 'perdido': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getLeadStatusLabel = (status: Lead['status']): string => {
  switch (status) {
    case 'novo': return 'Novo';
    case 'contactado': return 'Contactado';
    case 'qualificado': return 'Qualificado';
    case 'reuniao_agendada': return 'Reunião Agendada';
    case 'ganho': return 'Ganho';
    case 'perdido': return 'Perdido';
    default: return 'Desconhecido';
  }
};

export const getUrgenciaColor = (urgencia: Lead['urgencia']): string => {
  switch (urgencia) {
    case 'alta': return 'text-red-600';
    case 'media': return 'text-yellow-600';
    case 'baixa': return 'text-green-600';
    default: return 'text-gray-600';
  }
};

// Exporta a função centralizada
export { formatCurrency };

export const getLeadQualificationLevel = (score: number): { level: string; color: string } => {
  if (score >= 8) return { level: 'Quente', color: 'text-red-600' };
  if (score >= 5) return { level: 'Morno', color: 'text-yellow-600' };
  return { level: 'Frio', color: 'text-blue-600' };
};
