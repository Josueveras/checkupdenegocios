
import { useDiagnosticos } from '@/hooks/useSupabase';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentDiagnostics } from '@/components/dashboard/RecentDiagnostics';
import { LevelDistribution } from '@/components/dashboard/LevelDistribution';
import { QuickActions } from '@/components/dashboard/QuickActions';

const Dashboard = () => {
  const { data: diagnosticos = [] } = useDiagnosticos();

  // Calcular estatísticas reais
  const totalDiagnosticos = diagnosticos.length;
  const scoreMedia = diagnosticos.length > 0 
    ? Math.round(diagnosticos.reduce((sum, diag) => sum + diag.score_total, 0) / diagnosticos.length)
    : 0;

  // Últimos 3 diagnósticos
  const recentDiagnostics = diagnosticos
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  // Distribuição por nível
  const distribuicaoNivel = {
    'Avançado': diagnosticos.filter(d => d.score_total >= 80).length,
    'Intermediário': diagnosticos.filter(d => d.score_total >= 60 && d.score_total < 80).length,
    'Emergente': diagnosticos.filter(d => d.score_total >= 40 && d.score_total < 60).length,
    'Iniciante': diagnosticos.filter(d => d.score_total < 40).length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <DashboardHeader />
      
      <DashboardStats
        totalDiagnosticos={totalDiagnosticos}
        scoreMedia={scoreMedia}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentDiagnostics recentDiagnostics={recentDiagnostics} />
        <LevelDistribution distribuicaoNivel={distribuicaoNivel} />
      </div>

      <QuickActions />
    </div>
  );
};

export default Dashboard;
