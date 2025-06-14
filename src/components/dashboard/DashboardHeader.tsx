
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral dos seus diagnósticos e métricas</p>
      </div>
      <Link to="/novo-diagnostico">
        <Button className="bg-petrol hover:bg-petrol/90 text-white">
          <FileText className="mr-2 h-4 w-4" />
          Novo Diagnóstico
        </Button>
      </Link>
    </div>
  );
};
