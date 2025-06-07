import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EmpresaVisaoGeral = () => {
  const { id } = useParams();

  const { data: diagnosticos, isLoading, error } = useQuery(['diagnosticos', id], async () => {
    const { data, error } = await supabase
      .from('diagnosticos')
      .select('*')
      .eq('empresa_id', id);

    if (error) throw error;
    return data;
  });

  if (isLoading) return <div className="p-6">Carregando dados...</div>;
  if (error) return <div className="p-6 text-red-500">Erro ao carregar dados.</div>;

  // Cálculos simples de exemplo
const total = diagnosticos.length;
const mediaScore = total > 0
  ? Math.round(diagnosticos.reduce((sum, d) => sum + (d.score_geral || 0), 0) / total)
  : 0;

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Visão Geral da Empresa</h1>
        <p className="text-gray-600 mt-1">Análise com base nos diagnósticos já realizados</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-petrol">
          <CardHeader>
            <CardTitle>Total de Diagnósticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{total}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-mustard">
          <CardHeader>
            <CardTitle>Média do Score Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{mediaScore}%</div>
          </CardContent>
        </Card>

        {/* Adicione mais cards com outras análises se quiser */}
      </div>
    </div>
  );
};

export default EmpresaVisaoGeral;
