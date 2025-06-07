import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';

const EmpresaVisaoGeral = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['empresa-visao', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('diagnosticos')
        .select('*')
        .eq('empresa_id', id);

      if (error) throw new Error(error.message);
      return data;
    },
  });

  if (isLoading) return <div className="p-10">Carregando...</div>;
  if (error || !data || data.length === 0) return <div className="p-10">Erro ao carregar dados.</div>;

  const monthlyData = data.map((d) => ({
    month: d.mes,
    diagnosticos: d.diagnosticos,
    propostas: d.propostas,
    conversao: d.conversao,
  }));

  const totalDiagnostics = monthlyData.reduce((sum, item) => sum + item.diagnosticos, 0);
  const totalProposals = monthlyData.reduce((sum, item) => sum + item.propostas, 0);
  const avgConversion = Math.round(monthlyData.reduce((sum, item) => sum + item.conversao, 0) / monthlyData.length || 1);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Visão Geral da Empresa</h1>
        <p className="text-gray-600 mt-1">Análise dos dados da empresa com base nos diagnósticos realizados</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card><CardHeader><CardTitle>Total de Diagnósticos</CardTitle></CardHeader><CardContent>{totalDiagnostics}</CardContent></Card>
        <Card><CardHeader><CardTitle>Propostas Geradas</CardTitle></CardHeader><CardContent>{totalProposals}</CardContent></Card>
        <Card><CardHeader><CardTitle>Taxa de Conversão</CardTitle></CardHeader><CardContent>{avgConversion}%</CardContent></Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Evolução Mensal</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="diagnosticos" fill="#0F3244" />
                <Bar dataKey="propostas" fill="#3C9CD6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Taxa de Conversão</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Taxa de Conversão']} />
                <Line type="monotone" dataKey="conversao" stroke="#FBB03B" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmpresaVisaoGeral;
