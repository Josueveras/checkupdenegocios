
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Users, TrendingUp, Eye } from 'lucide-react';
import { useEmpresasComDiagnosticos } from '@/hooks/useAcompanhamentos';

interface CompanySelectorProps {
  selectedCompany: string;
  onCompanyChange: (companyId: string) => void;
}

const CompanySelector = ({ selectedCompany, onCompanyChange }: CompanySelectorProps) => {
  const navigate = useNavigate();
  const { data: empresas, isLoading, error } = useEmpresasComDiagnosticos();

  const handleCompanyNameClick = (companyId: string) => {
    navigate(`/clientes/${companyId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-petrol" />
          🏢 Selecionar Cliente
        </CardTitle>
        <CardDescription>
          Escolha uma empresa para visualizar seus check-ups mensais e evolução.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-petrol mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Carregando empresas...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">
            Erro ao carregar empresas. Tente novamente.
          </div>
        ) : (
          <div className="space-y-4">
            <Select value={selectedCompany} onValueChange={onCompanyChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma empresa..." />
              </SelectTrigger>
              <SelectContent>
                {empresas?.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id}>
                    {empresa.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCompany && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 
                      className="font-semibold text-lg cursor-pointer hover:text-petrol transition-colors"
                      onClick={() => handleCompanyNameClick(selectedCompany)}
                    >
                      {empresas?.find(e => e.id === selectedCompany)?.nome}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Users className="h-3 w-3 mr-1" />
                        Cliente Ativo
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCompanyNameClick(selectedCompany)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Evolução Completa
                  </Button>
                </div>
              </div>
            )}

            {empresas && empresas.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma empresa com diagnóstico encontrada.</p>
                <p className="text-sm mt-1">Realize diagnósticos para começar os acompanhamentos.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanySelector;
