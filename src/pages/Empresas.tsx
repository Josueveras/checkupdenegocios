
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Plus, Loader2 } from 'lucide-react';
import { useEmpresas, useSaveEmpresa } from '@/hooks/useEmpresas';

const Empresas = () => {
  const [formData, setFormData] = useState({
    nome: '',
    setor: ''
  });
  
  const { data: empresas, isLoading, error } = useEmpresas();
  const saveEmpresa = useSaveEmpresa();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      return;
    }

    try {
      await saveEmpresa.mutateAsync({
        nome: formData.nome.trim(),
        setor: formData.setor.trim() || undefined
      });
      
      // Reset form
      setFormData({ nome: '', setor: '' });
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Empresas</h1>
        <p className="text-gray-600 mt-1">Gerencie as empresas cadastradas no sistema</p>
      </div>

      {/* Formulário para nova empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-petrol" />
            Nova Empresa
          </CardTitle>
          <CardDescription>
            Cadastre uma nova empresa no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome da Empresa *</Label>
                <Input
                  id="nome"
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Digite o nome da empresa..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="setor">Setor (Opcional)</Label>
                <Input
                  id="setor"
                  type="text"
                  value={formData.setor}
                  onChange={(e) => setFormData(prev => ({ ...prev, setor: e.target.value }))}
                  placeholder="Ex: Tecnologia, Varejo, Serviços..."
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="bg-petrol hover:bg-petrol/90 text-white"
              disabled={saveEmpresa.isPending || !formData.nome.trim()}
            >
              {saveEmpresa.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Empresa
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de empresas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-petrol" />
            Empresas Cadastradas
          </CardTitle>
          <CardDescription>
            Lista de todas as empresas cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Carregando empresas...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Erro ao carregar empresas. Tente novamente.
            </div>
          ) : empresas && empresas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {empresas.map((empresa) => (
                <Card key={empresa.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">{empresa.nome}</h4>
                      {empresa.setor && (
                        <p className="text-sm text-gray-600">{empresa.setor}</p>
                      )}
                      <div className="text-xs text-gray-500">
                        ID: {empresa.id}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhuma empresa cadastrada ainda
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Empresas;
