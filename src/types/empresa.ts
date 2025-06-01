
export interface EmpresaConsolidada {
  id: string;
  nome: string;
  cliente_nome?: string;
  cliente_email?: string;
  cliente_telefone?: string;
  created_at: string;
  totalCheckups: number;
  scoreGeral: number;
  roiMedio: number;
  faturamentoMedio: number;
  acoesConcluidasTotal: number;
  ultimoCheckup: string;
  status: 'ativo' | 'inativo';
}

export interface EmpresaFilters {
  empresaId: string;
  mes: string;
  scoreMinimo: string;
  scoreMaximo: string;
  roiMinimo: string;
  roiMaximo: string;
  status: string;
}

export interface AcompanhamentoData {
  id: string;
  mes: string;
  score_geral: number;
  roi: number;
  faturamento: number;
  acoes: any;
  created_at: string;
}

export interface EmpresaRawData {
  id: string;
  nome: string;
  cliente_nome?: string;
  cliente_email?: string;
  cliente_telefone?: string;
  created_at: string;
  acompanhamentos: AcompanhamentoData[];
}
