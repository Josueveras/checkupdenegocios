
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLeadStats } from '@/hooks/useLeadStats';
import { formatCurrency } from '@/utils/leadHelpers';
import { TrendingUp, Users, Target, DollarSign, Percent, Calculator } from 'lucide-react';

export function LeadStats() {
  const { data: stats, isLoading } = useLeadStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statsData = [
    {
      title: "Total de Leads",
      value: stats.total_leads,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Leads Novos",
      value: stats.leads_novos,
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Qualificados",
      value: stats.leads_qualificados,
      icon: Target,
      color: "text-purple-600"
    },
    {
      title: "Convertidos",
      value: stats.leads_convertidos,
      icon: Calculator,
      color: "text-emerald-600"
    },
    {
      title: "Taxa de Conversão",
      value: `${stats.taxa_conversao}%`,
      icon: Percent,
      color: "text-orange-600"
    },
    {
      title: "Receita Potencial",
      value: formatCurrency(stats.receita_potencial),
      icon: DollarSign,
      color: "text-red-600"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
