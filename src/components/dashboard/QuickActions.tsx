
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, FileText, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
        <CardDescription>
          Acesso rápido às principais funcionalidades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/novo-diagnostico">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>Novo Diagnóstico</span>
            </Button>
          </Link>
          <Link to="/perguntas">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <Settings className="h-6 w-6" />
              <span>Editar Perguntas</span>
            </Button>
          </Link>
          <Link to="/metricas">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <BarChart className="h-6 w-6" />
              <span>Ver Métricas</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
