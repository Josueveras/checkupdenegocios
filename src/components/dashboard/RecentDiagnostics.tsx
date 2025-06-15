
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Diagnostic {
  id: string;
  created_at: string;
  score_total: number;
  nivel: string;
  empresas?: {
    nome?: string;
    cliente_nome?: string;
  } | null;
}

interface RecentDiagnosticsProps {
  recentDiagnostics: Diagnostic[];
}

export const RecentDiagnostics = ({ recentDiagnostics }: RecentDiagnosticsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      "Avançado": "bg-green-100 text-green-800",
      "Intermediário": "bg-yellow-100 text-yellow-800",
      "Emergente": "bg-orange-100 text-orange-800",
      "Iniciante": "bg-red-100 text-red-800"
    };
    return colors[level as keyof typeof colors] || colors["Iniciante"];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-petrol" />
          Diagnósticos Recentes
        </CardTitle>
        <CardDescription>
          Últimos diagnósticos realizados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentDiagnostics.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum diagnóstico realizado ainda</p>
            <Link to="/novo-diagnostico">
              <Button className="mt-4 bg-petrol hover:bg-petrol/90">
                Criar Primeiro Diagnóstico
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {recentDiagnostics.map((diagnostic) => (
              <div key={diagnostic.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{diagnostic.empresas?.nome || 'Empresa'}</h4>
                  <p className="text-sm text-gray-600">{diagnostic.empresas?.cliente_nome || 'Cliente'}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(diagnostic.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="text-right space-y-2">
                  <div className={`text-2xl font-bold ${getScoreColor(diagnostic.score_total)}`}>
                    {diagnostic.score_total}%
                  </div>
                  <Badge className={getLevelBadge(diagnostic.nivel)}>
                    {diagnostic.nivel}
                  </Badge>
                </div>
              </div>
            ))}
            <Link to="/diagnosticos">
              <Button variant="outline" className="w-full mt-4">
                Ver Todos os Diagnósticos
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
};
