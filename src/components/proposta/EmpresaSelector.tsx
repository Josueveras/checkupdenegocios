
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Building2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

interface EmpresaSelectorProps {
  selectedEmpresaId: string;
  onChange: (diagnosticoId: string) => void;
}

interface DiagnosticoOption {
  id: string;
  empresa: {
    id: string;
    nome: string;
    cliente_nome?: string;
    cliente_email?: string;
  };
}

export const EmpresaSelector = ({ selectedEmpresaId, onChange }: EmpresaSelectorProps) => {
  const [diagnosticos, setDiagnosticos] = useState<DiagnosticoOption[]>([]);
  const [filteredDiagnosticos, setFilteredDiagnosticos] = useState<DiagnosticoOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDiagnosticos = async () => {
      try {
        const { data, error } = await supabase
          .from('diagnosticos')
          .select(`
            id,
            empresas!diagnosticos_empresa_id_fkey (
              id,
              nome,
              cliente_nome,
              cliente_email
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const diagnosticosFormatted = (data || []).map(diag => ({
          id: diag.id,
          empresa: (diag as any).empresas
        })).filter(diag => diag.empresa);

        setDiagnosticos(diagnosticosFormatted);
        setFilteredDiagnosticos(diagnosticosFormatted);
      } catch (error) {
        console.error('Erro ao buscar diagnósticos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiagnosticos();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredDiagnosticos(diagnosticos);
    } else {
      const filtered = diagnosticos.filter(diag =>
        diag.empresa.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        diag.empresa.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDiagnosticos(filtered);
    }
  }, [searchTerm, diagnosticos]);

  const selectedDiagnostico = diagnosticos.find(d => d.id === selectedEmpresaId);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-2 sm:p-3">
        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Selecionar Empresa
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-3 pt-0 space-y-3">
        <div>
          <Label className="text-sm">Buscar empresa *</Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Digite o nome da empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-petrol mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Carregando empresas...</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredDiagnosticos.length > 0 ? (
              filteredDiagnosticos.map((diagnostico) => (
                <div
                  key={diagnostico.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedEmpresaId === diagnostico.id
                      ? 'border-petrol bg-petrol/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onChange(diagnostico.id)}
                >
                  <div className="font-medium text-sm">{diagnostico.empresa.nome}</div>
                  {diagnostico.empresa.cliente_nome && (
                    <div className="text-xs text-gray-600">
                      Cliente: {diagnostico.empresa.cliente_nome}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                {searchTerm ? 'Nenhuma empresa encontrada' : 'Nenhuma empresa disponível'}
              </div>
            )}
          </div>
        )}

        {selectedDiagnostico && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm font-medium text-green-800">
              Empresa selecionada: {selectedDiagnostico.empresa.nome}
            </div>
            {selectedDiagnostico.empresa.cliente_nome && (
              <div className="text-xs text-green-600">
                Cliente: {selectedDiagnostico.empresa.cliente_nome}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
