
export interface CheckupData {
  score_geral?: number;
  roi?: number;
  faturamento?: number | string;
  acoes?: any;
  mes: string | Date;
}

export const calculateScoreVariation = (checkups: CheckupData[]): number => {
  if (!checkups || checkups.length < 2) return 0;
  
  const first = checkups[0]?.score_geral || 0;
  const last = checkups[checkups.length - 1]?.score_geral || 0;
  
  return first === 0 ? 0 : Math.round(((last - first) / first) * 100);
};

export const calculateROIVariation = (checkups: CheckupData[]): number => {
  if (!checkups || checkups.length < 2) return 0;
  
  const checkupsWithROI = checkups.filter(c => c.roi);
  if (checkupsWithROI.length < 2) return 0;
  
  const first = checkupsWithROI[0].roi || 0;
  const last = checkupsWithROI[checkupsWithROI.length - 1].roi || 0;
  
  return first === 0 ? 0 : Math.round(((last - first) / first) * 100);
};

export const calculateAverageScore = (checkups: CheckupData[]): number => {
  if (!checkups || checkups.length === 0) return 0;
  
  const total = checkups.reduce((sum, c) => sum + (c.score_geral || 0), 0);
  return Math.round(total / checkups.length);
};

export const calculateAverageROI = (checkups: CheckupData[]): number => {
  if (!checkups || checkups.length === 0) return 0;
  
  const checkupsWithROI = checkups.filter(c => c.roi);
  if (checkupsWithROI.length === 0) return 0;
  
  const total = checkupsWithROI.reduce((sum, c) => sum + (c.roi || 0), 0);
  return Number((total / checkupsWithROI.length).toFixed(2));
};

export const calculateAverageRevenue = (checkups: CheckupData[]): number => {
  if (!checkups || checkups.length === 0) return 0;
  
  const checkupsWithRevenue = checkups.filter(c => c.faturamento);
  if (checkupsWithRevenue.length === 0) return 0;
  
  const total = checkupsWithRevenue.reduce((sum, c) => {
    const revenue = typeof c.faturamento === 'string' 
      ? parseFloat(c.faturamento) 
      : c.faturamento || 0;
    return sum + revenue;
  }, 0);
  
  return total / checkupsWithRevenue.length;
};

export const getTotalCompletedActions = (checkups: CheckupData[]): number => {
  if (!checkups) return 0;
  
  return checkups.reduce((total, checkup) => {
    return total + getCompletedActionsCount(checkup.acoes);
  }, 0);
};

export const getCompletedActionsCount = (acoes: any): number => {
  if (!acoes) return 0;
  
  let parsedAcoes = acoes;
  if (typeof acoes === 'string') {
    try {
      parsedAcoes = JSON.parse(acoes);
    } catch {
      return 0;
    }
  }
  
  if (!Array.isArray(parsedAcoes)) return 0;
  
  return parsedAcoes.filter(acao => {
    return acao && 
           typeof acao === 'object' && 
           acao !== null && 
           'status' in acao && 
           acao.status === 'concluido';
  }).length;
};

export const getDaysSinceLastCheckup = (checkups: CheckupData[]): number => {
  if (!checkups || checkups.length === 0) return 0;
  
  const lastCheckup = checkups[checkups.length - 1];
  const lastDate = new Date(lastCheckup.mes);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastDate.getTime());
  
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getCheckupsWithoutActions = (checkups: CheckupData[]): number => {
  if (!checkups) return 0;
  
  return checkups.filter(checkup => {
    return getCompletedActionsCount(checkup.acoes) === 0;
  }).length;
};

export const getAverageActionsPerMonth = (checkups: CheckupData[]): number => {
  if (!checkups || checkups.length === 0) return 0;
  
  const totalActions = getTotalCompletedActions(checkups);
  return Number((totalActions / checkups.length).toFixed(1));
};
