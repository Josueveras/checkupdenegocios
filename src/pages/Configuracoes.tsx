
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, Upload, Save, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Configuracoes = () => {
  const [settings, setSettings] = useState({
    // Marca
    companyName: 'Agência Digital Pro',
    logo: '',
    primaryColor: '#0F3244',
    secondaryColor: '#3C9CD6',
    accentColor: '#FBB03B',
    // Integrações
    calendlyUrl: 'https://calendly.com/agencia',
    whatsappNumber: '11999999999',
    whatsappApiKey: '',
    zapierWebhook: '',
    crmIntegration: 'none',
    // Personalização
    reportFooter: 'Relatório gerado por Agência Digital Pro',
    emailSignature: 'Atenciosamente,\nEquipe Agência Digital Pro',
    customDomain: '',
    // Notificações
    emailNotifications: true,
    whatsappNotifications: false,
    weeklyReports: true
  });

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso!"
    });
  };

  const handleLogoUpload = () => {
    toast({
      title: "Logo atualizada",
      description: "Sua nova logo foi carregada com sucesso!"
    });
  };

  const integrations = [
    {
      name: 'Calendly',
      description: 'Agendamento automático de reuniões',
      status: settings.calendlyUrl ? 'connected' : 'disconnected',
      action: 'Configurar'
    },
    {
      name: 'WhatsApp Business',
      description: 'Envio automático de relatórios',
      status: settings.whatsappApiKey ? 'connected' : 'disconnected',
      action: 'Configurar'
    },
    {
      name: 'Zapier',
      description: 'Automações avançadas',
      status: settings.zapierWebhook ? 'connected' : 'disconnected',
      action: 'Configurar'
    },
    {
      name: 'Agendor CRM',
      description: 'Sincronização de clientes',
      status: 'available',
      action: 'Conectar'
    },
    {
      name: 'Pipedrive',
      description: 'Gestão de pipeline',
      status: 'available',
      action: 'Conectar'
    }
  ];

  const getStatusBadge = (status: string) => {
    const colors = {
      connected: 'bg-green-100 text-green-800',
      disconnected: 'bg-red-100 text-red-800',
      available: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      connected: 'Conectado',
      disconnected: 'Desconectado',
      available: 'Disponível'
    };
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">Personalize sua plataforma e configure integrações</p>
      </div>

      <Tabs defaultValue="brand" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="brand">Marca</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="customization">Personalização</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        {/* Brand Tab */}
        <TabsContent value="brand" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Identidade Visual
              </CardTitle>
              <CardDescription>
                Configure a marca da sua agência nos relatórios e interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <Input
                      id="companyName"
                      value={settings.companyName}
                      onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                      placeholder="Digite o nome da sua agência"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Logo da Empresa</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-2">
                        Clique para fazer upload ou arraste sua logo aqui
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        PNG, JPG até 2MB • Recomendado: 300x100px
                      </p>
                      <Button variant="outline" onClick={handleLogoUpload}>
                        Escolher Arquivo
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="font-medium">Paleta de Cores</h5>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: settings.primaryColor }}
                      ></div>
                      <div className="flex-1">
                        <Label className="text-sm">Cor Primária</Label>
                        <Input
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                          className="w-full h-8"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: settings.secondaryColor }}
                      ></div>
                      <div className="flex-1">
                        <Label className="text-sm">Cor Secundária</Label>
                        <Input
                          type="color"
                          value={settings.secondaryColor}
                          onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                          className="w-full h-8"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: settings.accentColor }}
                      ></div>
                      <div className="flex-1">
                        <Label className="text-sm">Cor de Destaque</Label>
                        <Input
                          type="color"
                          value={settings.accentColor}
                          onChange={(e) => setSettings({...settings, accentColor: e.target.value})}
                          className="w-full h-8"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrações Disponíveis</CardTitle>
              <CardDescription>
                Conecte ferramentas externas para potencializar sua operação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.map((integration) => (
                <div key={integration.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h5 className="font-medium">{integration.name}</h5>
                      {getStatusBadge(integration.status)}
                    </div>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {integration.action}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendly</CardTitle>
                <CardDescription>Configure seu link de agendamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="calendlyUrl">URL do Calendly</Label>
                  <Input
                    id="calendlyUrl"
                    value={settings.calendlyUrl}
                    onChange={(e) => setSettings({...settings, calendlyUrl: e.target.value})}
                    placeholder="https://calendly.com/seu-usuario"
                  />
                </div>
                <Button size="sm" className="w-full">
                  <Check className="h-4 w-4 mr-2" />
                  Testar Integração
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Business</CardTitle>
                <CardDescription>Configure envio automático de relatórios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">Número do WhatsApp</Label>
                  <Input
                    id="whatsappNumber"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({...settings, whatsappNumber: e.target.value})}
                    placeholder="11999999999"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsappApiKey">API Key (opcional)</Label>
                  <Input
                    id="whatsappApiKey"
                    type="password"
                    value={settings.whatsappApiKey}
                    onChange={(e) => setSettings({...settings, whatsappApiKey: e.target.value})}
                    placeholder="Para envios automáticos"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customization Tab */}
        <TabsContent value="customization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personalização de Relatórios</CardTitle>
                <CardDescription>
                  Customize textos que aparecem nos seus relatórios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reportFooter">Rodapé dos Relatórios</Label>
                  <Textarea
                    id="reportFooter"
                    value={settings.reportFooter}
                    onChange={(e) => setSettings({...settings, reportFooter: e.target.value})}
                    placeholder="Texto que aparece no final dos relatórios"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emailSignature">Assinatura de E-mail</Label>
                  <Textarea
                    id="emailSignature"
                    value={settings.emailSignature}
                    onChange={(e) => setSettings({...settings, emailSignature: e.target.value})}
                    placeholder="Assinatura padrão para envio por e-mail"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Domínio Personalizado</CardTitle>
                <CardDescription>
                  Configure seu próprio domínio (plano Agency)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customDomain">Domínio Personalizado</Label>
                  <Input
                    id="customDomain"
                    value={settings.customDomain}
                    onChange={(e) => setSettings({...settings, customDomain: e.target.value})}
                    placeholder="diagnosticos.suaagencia.com"
                    disabled
                  />
                  <p className="text-xs text-gray-500">
                    Disponível apenas no plano Agency
                  </p>
                </div>
                
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Upgrade necessário
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure como e quando você quer receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h5 className="font-medium">Notificações por E-mail</h5>
                    <p className="text-sm text-gray-600">
                      Receba alertas importantes por e-mail
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, emailNotifications: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h5 className="font-medium">Notificações por WhatsApp</h5>
                    <p className="text-sm text-gray-600">
                      Receba lembretes no seu WhatsApp
                    </p>
                  </div>
                  <Switch
                    checked={settings.whatsappNotifications}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, whatsappNotifications: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h5 className="font-medium">Relatórios Semanais</h5>
                    <p className="text-sm text-gray-600">
                      Receba um resumo semanal das suas métricas
                    </p>
                  </div>
                  <Switch
                    checked={settings.weeklyReports}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, weeklyReports: checked})
                    }
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h5 className="font-medium mb-3">Tipos de Notificação</h5>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Novo diagnóstico completado</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Proposta gerada</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Limite de diagnósticos próximo</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Renovação de assinatura</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-petrol hover:bg-petrol/90">
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default Configuracoes;
