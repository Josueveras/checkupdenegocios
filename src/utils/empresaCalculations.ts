
import { EmpresaConsolidada, EmpresaRawData, AcompanhamentoData } from '@/types/empresa';

export const calculateConsolidatedMetrics = (empresa: EmpresaRawData): EmpresaConsolidada => {
  const acompanhamentos = empresa.acompanhamentos || [];

  // Calcular métricas consolidadas
  const totalCheckups = acompanhamentos.length;
  const scoreGeral = totalCheckups > 0
    ? Math.round(
        acompanhamentos.reduce(
          (sum, acomp) => sum + (acomp.score_geral || 0),
          0
        ) / totalCheckups
      )
    : 0;
  
  const acompanhamentosComROI = acompanhamentos.filter(
    acomp => acomp.roi !== undefined && acomp.roi !== null
  );
  const roiMedio = acompanhamentosComROI.length > 0
    ? Number(
        (
          acompanhamentosComROI.reduce(
            (sum, acomp) => sum + (acomp.roi || 0),
            0
          ) / acompanhamentosComROI.length
        ).toFixed(2)
      )
    : 0;
  
  const acompanhamentosComFaturamento = acompanhamentos.filter(
    acomp => acomp.faturamento !== undefined && acomp.faturamento !== null
  );
  const faturamentoMedio =
    acompanhamentosComFaturamento.length > 0
      ? acompanhamentosComFaturamento.reduce(
          (sum, acomp) => sum + (Number(acomp.faturamento) || 0),
          0
        ) / acompanhamentosComFaturamento.length
      : 0;

  // Contar ações concluídas com verificação de tipo
  const acoesConcluidasTotal = calculateCompletedActions(acompanhamentos);

  // Último check-up
  const ultimoCheckup = acompanhamentos
    .sort((a, b) => new Date(b.mes).getTime() - new Date(a.mes).getTime())[0]?.mes || '';

  // Status baseado no último check-up (se foi nos últimos 2 meses)
  const status = calculateCompanyStatus(ultimoCheckup);

  return {
    id: empresa.id,
    nome: empresa.nome,
    cliente_nome: empresa.cliente_nome,
    cliente_email: empresa.cliente_email,
    cliente_telefone: empresa.cliente_telefone,
    created_at: empresa.created_at,
    totalCheckups,
    scoreGeral,
    roiMedio,
    faturamentoMedio,
    acoesConcluidasTotal,
    ultimoCheckup,
    status
  };
};

const calculateCompletedActions = (acompanhamentos: AcompanhamentoData[]): number => {
  return acompanhamentos.reduce((total, acomp) => {
    if (!acomp.acoes) return total;
    
    let parsedAcoes = acomp.acoes;
    if (typeof acomp.acoes === 'string') {
      try {
        parsedAcoes = JSON.parse(acomp.acoes);
      } catch {
        return total;
      }
    }
    
    if (!Array.isArray(parsedAcoes)) return total;
    
    return total + parsedAcoes.filter(acao => {
      return acao && 
             typeof acao === 'object' && 
             acao !== null && 
             'status' in acao && 
             acao.status === 'concluido';
    }).length;
  }, 0);
};

const calculateCompanyStatus = (ultimoCheckup: string): 'ativo' | 'inativo' => {
  const agora = new Date();
  const ultimaData = new Date(ultimoCheckup);
  const diffMeses = (agora.getFullYear() - ultimaData.getFullYear()) * 12 + 
                   (agora.getMonth() - ultimaData.getMonth());
  return diffMeses <= 2 ? 'ativo' : 'inativo';
};
