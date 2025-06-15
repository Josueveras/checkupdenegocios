
export interface Plan {
  id?: string;
  nome: string;
  objetivo: string;
  servicos: string[];
  valor: number;
  categoria: string;
  ativo?: boolean;
}
