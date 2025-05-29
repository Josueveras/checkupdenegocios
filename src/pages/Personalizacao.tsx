
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, Upload, Eye, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Configuracao {
  id: string;
  nome_agencia: string;
  logo_url: string;
  cor_primaria: string;
  cor_secundaria: string;
  fonte: string;
  dominio_proprio: string;
}

export default function Personalizacao() {
  const [config, setConfig] = useState<Configuracao>({
    id: '',
    nome_agencia: '',
    logo_url: '',
    cor_primaria: '#0F3244',
    cor_secundaria: '#3C9CD6',
    fonte: 'Poppins',
    dominio_proprio: ''
  });
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarConfiguracao();
  }, []);

  const carregarConfiguracao = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setConfig({
          id: data.id,
          nome_agencia: data.nome_agencia || '',
          logo_url: data.logo_url || '',
          cor_primaria: data.cor_primaria || '#0F3244',
          cor_secundaria: data.cor_secundaria || '#3C9CD6',
          fonte: data.fonte || 'Poppins',
          dominio_proprio: data.dominio_proprio || ''
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const salvarConfiguracao = async () => {
    try {
      setSalvando(true);
      
      const dadosConfig = {
        nome_agencia: config.nome_agencia,
        logo_url: config.logo_url,
        cor_primaria: config.cor_primaria,
        cor_secundaria: config.cor_secundaria,
        fonte: config.fonte,
        dominio_proprio: config.dominio_proprio
      };

      if (config.id) {
        const { error } = await supabase
          .from('configuracoes')
          .update(dadosConfig)
          .eq('id', config.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('configuracoes')
          .insert(dadosConfig)
          .select()
          .single();

        if (error) throw error;
        setConfig(prev => ({ ...prev, id: data.id }));
      }

      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSalvando(false);
    }
  };

  const uploadLogo = () => {
    toast.info('Funcionalidade de upload será implementada em breve');
  };

  const previewSite = () => {
    toast.info('Preview da personalização será implementado');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {[1,2,3].map(i => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0F3244]">Personalização (White Label)</h1>
          <p className="text-gray-600">Customize a aparência da sua plataforma</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={previewSite}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button 
            onClick={salvarConfiguracao}
            disabled={salvando}
            className="bg-[#3C9CD6] hover:bg-[#3C9CD6]/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {salvando ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações */}
        <div className="space-y-6">
          {/* Identidade Visual */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#0F3244] flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Identidade Visual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nome_agencia">Nome da Agência</Label>
                <Input
                  id="nome_agencia"
                  value={config.nome_agencia}
                  onChange={(e) => setConfig(prev => ({ ...prev, nome_agencia: e.target.value }))}
                  placeholder="Ex: Minha Agência Digital"
                />
              </div>

              <div>
                <Label>Logo da Agência</Label>
                <div className="flex items-center gap-4">
                  {config.logo_url && (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img 
                        src={config.logo_url} 
                        alt="Logo" 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                  <Button variant="outline" onClick={uploadLogo}>
                    <Upload className="h-4 w-4 mr-2" />
                    {config.logo_url ? 'Alterar Logo' : 'Upload Logo'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Recomendado: PNG ou SVG, máximo 2MB
                </p>
              </div>

              <div>
                <Label htmlFor="logo_url">URL da Logo (alternativo)</Label>
                <Input
                  id="logo_url"
                  value={config.logo_url}
                  onChange={(e) => setConfig(prev => ({ ...prev, logo_url: e.target.value }))}
                  placeholder="https://exemplo.com/logo.png"
                />
              </div>
            </CardContent>
          </Card>

          {/* Cores */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#0F3244]">Esquema de Cores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cor_primaria">Cor Primária</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="cor_primaria"
                      value={config.cor_primaria}
                      onChange={(e) => setConfig(prev => ({ ...prev, cor_primaria: e.target.value }))}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      value={config.cor_primaria}
                      onChange={(e) => setConfig(prev => ({ ...prev, cor_primaria: e.target.value }))}
                      placeholder="#0F3244"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cor_secundaria">Cor Secundária</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="cor_secundaria"
                      value={config.cor_secundaria}
                      onChange={(e) => setConfig(prev => ({ ...prev, cor_secundaria: e.target.value }))}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      value={config.cor_secundaria}
                      onChange={(e) => setConfig(prev => ({ ...prev, cor_secundaria: e.target.value }))}
                      placeholder="#3C9CD6"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setConfig(prev => ({ 
                    ...prev, 
                    cor_primaria: '#0F3244', 
                    cor_secundaria: '#3C9CD6' 
                  }))}
                >
                  Cores Padrão
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setConfig(prev => ({ 
                    ...prev, 
                    cor_primaria: '#1a365d', 
                    cor_secundaria: '#3182ce' 
                  }))}
                >
                  Azul
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setConfig(prev => ({ 
                    ...prev, 
                    cor_primaria: '#2d3748', 
                    cor_secundaria: '#38a169' 
                  }))}
                >
                  Verde
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tipografia e Domínio */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#0F3244]">Configurações Avançadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fonte">Fonte Principal</Label>
                <Input
                  id="fonte"
                  value={config.fonte}
                  onChange={(e) => setConfig(prev => ({ ...prev, fonte: e.target.value }))}
                  placeholder="Poppins"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use fontes do Google Fonts
                </p>
              </div>

              <div>
                <Label htmlFor="dominio_proprio">Domínio Próprio</Label>
                <Input
                  id="dominio_proprio"
                  value={config.dominio_proprio}
                  onChange={(e) => setConfig(prev => ({ ...prev, dominio_proprio: e.target.value }))}
                  placeholder="diagnosticos.minhaagencia.com.br"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Configure um subdomínio personalizado (planos Pro+)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#0F3244]">Preview da Personalização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              {/* Mockup do header */}
              <div 
                className="h-16 flex items-center justify-between px-6"
                style={{ backgroundColor: config.cor_primaria }}
              >
                <div className="flex items-center gap-3">
                  {config.logo_url ? (
                    <img 
                      src={config.logo_url} 
                      alt="Logo" 
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    <div 
                      className="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: config.cor_secundaria }}
                    >
                      {config.nome_agencia?.charAt(0) || 'A'}
                    </div>
                  )}
                  <div className="text-white">
                    <h2 className="font-semibold text-sm" style={{ fontFamily: config.fonte }}>
                      {config.nome_agencia || 'Sua Agência'}
                    </h2>
                    <p className="text-xs opacity-80">CheckUp de Negócios</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20"></div>
              </div>

              {/* Mockup do conteúdo */}
              <div className="p-6 bg-gray-50">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600">Métrica {i}</span>
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: config.cor_secundaria }}
                        ></div>
                      </div>
                      <div 
                        className="text-lg font-bold"
                        style={{ color: config.cor_primaria }}
                      >
                        {i * 25}%
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 
                    className="font-semibold mb-3"
                    style={{ color: config.cor_primaria }}
                  >
                    Últimos Diagnósticos
                  </h3>
                  <div className="space-y-2">
                    {['Empresa A', 'Empresa B', 'Empresa C'].map((empresa, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-sm">{empresa}</span>
                        <div 
                          className="px-2 py-1 rounded text-xs text-white"
                          style={{ backgroundColor: config.cor_secundaria }}
                        >
                          {70 + i * 10}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
