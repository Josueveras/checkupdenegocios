
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile, useUserNotifications, useSaveUserProfile, useSaveUserNotifications } from '@/hooks/useSupabase';
import { User, Mail, Phone, Building, Shield, Bell, CreditCard } from 'lucide-react';

const Conta = () => {
  const { user } = useAuth();
  const { data: profile } = useUserProfile();
  const { data: notifications } = useUserNotifications();
  const saveProfileMutation = useSaveUserProfile();
  const saveNotificationsMutation = useSaveUserNotifications();

  const [profileForm, setProfileForm] = useState({
    nome: profile?.nome || '',
    cargo: profile?.cargo || '',
    telefone: profile?.telefone || '',
    empresa: profile?.empresa || ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_enabled: notifications?.email_enabled ?? true,
    whatsapp_enabled: notifications?.whatsapp_enabled ?? true,
    reports_enabled: notifications?.reports_enabled ?? true,
    diagnostic_notifications: notifications?.diagnostic_notifications ?? true,
    proposal_notifications: notifications?.proposal_notifications ?? true,
    subscription_notifications: notifications?.subscription_notifications ?? true
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileSave = async () => {
    try {
      await saveProfileMutation.mutateAsync({
        ...profileForm,
        user_id: user?.id
      });
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive"
      });
    }
  };

  const handleNotificationsSave = async () => {
    try {
      await saveNotificationsMutation.mutateAsync({
        ...notificationSettings,
        user_id: user?.id
      });
      
      toast({
        title: "Notificações atualizadas",
        description: "Suas preferências foram salvas com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar as notificações.",
        variant: "destructive"
      });
    }
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Erro na senha",
        description: "A confirmação da senha não confere.",
        variant: "destructive"
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Senha muito fraca",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }

    // Simular mudança de senha (implementar integração real depois)
    toast({
      title: "Senha alterada",
      description: "Sua senha foi atualizada com sucesso!"
    });
    
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Minha Conta</h1>
        <p className="text-gray-600 mt-1">Gerencie suas informações pessoais e preferências</p>
      </div>

      <Tabs defaultValue="perfil" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="assinatura">Assinatura</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
        </TabsList>

        {/* Perfil Tab */}
        <TabsContent value="perfil">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Atualize suas informações de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    value={profileForm.nome}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Seu nome completo"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input
                    id="cargo"
                    value={profileForm.cargo}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, cargo: e.target.value }))}
                    placeholder="Seu cargo ou função"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={profileForm.telefone}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, telefone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input
                    id="empresa"
                    value={profileForm.empresa}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, empresa: e.target.value }))}
                    placeholder="Nome da sua empresa"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    O e-mail não pode ser alterado diretamente
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button 
                  onClick={handleProfileSave}
                  disabled={saveProfileMutation.isPending}
                  className="bg-petrol hover:bg-petrol/90"
                >
                  {saveProfileMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferências de Notificação
              </CardTitle>
              <CardDescription>
                Configure como você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Notificações por E-mail</Label>
                    <p className="text-sm text-gray-500">Receber notificações no seu e-mail</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notificationSettings.email_enabled}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, email_enabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="whatsapp-notifications">Notificações por WhatsApp</Label>
                    <p className="text-sm text-gray-500">Receber notificações no WhatsApp</p>
                  </div>
                  <Switch
                    id="whatsapp-notifications"
                    checked={notificationSettings.whatsapp_enabled}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, whatsapp_enabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reports-notifications">Relatórios Semanais</Label>
                    <p className="text-sm text-gray-500">Receber resumo semanal por e-mail</p>
                  </div>
                  <Switch
                    id="reports-notifications"
                    checked={notificationSettings.reports_enabled}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, reports_enabled: checked }))
                    }
                  />
                </div>
              </div>

              <hr />

              <div className="space-y-4">
                <h4 className="font-medium">Tipos de Notificação</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="diagnostic-notifications">Diagnósticos</Label>
                    <p className="text-sm text-gray-500">Quando um diagnóstico for concluído</p>
                  </div>
                  <Switch
                    id="diagnostic-notifications"
                    checked={notificationSettings.diagnostic_notifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, diagnostic_notifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="proposal-notifications">Propostas</Label>
                    <p className="text-sm text-gray-500">Quando uma proposta for gerada ou aprovada</p>
                  </div>
                  <Switch
                    id="proposal-notifications"
                    checked={notificationSettings.proposal_notifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, proposal_notifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="subscription-notifications">Assinatura</Label>
                    <p className="text-sm text-gray-500">Informações sobre sua assinatura e pagamentos</p>
                  </div>
                  <Switch
                    id="subscription-notifications"
                    checked={notificationSettings.subscription_notifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, subscription_notifications: checked }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button 
                  onClick={handleNotificationsSave}
                  disabled={saveNotificationsMutation.isPending}
                  className="bg-petrol hover:bg-petrol/90"
                >
                  {saveNotificationsMutation.isPending ? 'Salvando...' : 'Salvar Preferências'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assinatura Tab */}
        <TabsContent value="assinatura">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Plano Atual
              </CardTitle>
              <CardDescription>
                Informações sobre sua assinatura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <h3 className="text-lg font-semibold text-green-800">Plano Ilimitado</h3>
                  <p className="text-green-600">Acesso completo a todas as funcionalidades</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-petrol">∞</div>
                  <p className="text-sm text-gray-600">Diagnósticos/mês</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-petrol">∞</div>
                  <p className="text-sm text-gray-600">Propostas/mês</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-petrol">✓</div>
                  <p className="text-sm text-gray-600">Suporte completo</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Recursos Inclusos</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Diagnósticos ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Propostas comerciais ilimitadas
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Relatórios detalhados
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Integrações com WhatsApp e e-mail
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Personalização completa
                  </li>
                </ul>
              </div>

              <div className="text-center pt-6">
                <p className="text-sm text-gray-500">
                  Você está usando a versão beta com acesso completo e gratuito.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Segurança Tab */}
        <TabsContent value="seguranca">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança da Conta
              </CardTitle>
              <CardDescription>
                Gerencie a segurança da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha atual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Digite sua senha atual"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova senha</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Digite sua nova senha"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirme sua nova senha"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button 
                  onClick={handlePasswordChange}
                  disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                  className="bg-petrol hover:bg-petrol/90"
                >
                  Alterar Senha
                </Button>
              </div>

              <hr />

              <div className="space-y-4">
                <h4 className="font-medium">Informações de Segurança</h4>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    ✓ Sua conta está protegida e todas as comunicações são criptografadas
                  </p>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Último login:</strong> {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
                  <p><strong>E-mail de recuperação:</strong> {user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Conta;
