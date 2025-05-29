import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { User, CreditCard, FileText, Settings, Upload, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const Conta = () => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.email?.split('@')[0] || 'Usuário',
    email: user?.email || 'usuario@agenciadigital.com',
    phone: '(11) 99999-9999',
    company: 'Agência Digital Pro',
    position: 'CEO',
    avatar: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const paymentHistory = [
    {
      id: 1,
      date: '2024-01-15',
      description: 'Plano Professional - Mensal',
      amount: 197.00,
      status: 'Pago',
      invoice: 'INV-2024-001'
    },
    {
      id: 2,
      date: '2023-12-15',
      description: 'Plano Professional - Mensal',
      amount: 197.00,
      status: 'Pago',
      invoice: 'INV-2023-012'
    },
    {
      id: 3,
      date: '2023-11-15',
      description: 'Plano Professional - Mensal',
      amount: 197.00,
      status: 'Pago',
      invoice: 'INV-2023-011'
    }
  ];

  const currentPlan = {
    name: 'Professional',
    price: 197,
    nextBilling: '2024-02-15',
    diagnosticsUsed: 47,
    diagnosticsTotal: 100,
    features: [
      'Até 100 diagnósticos/mês',
      'Templates ilimitados',
      'Relatórios personalizados',
      'WhatsApp Business API',
      'Calendly integrado',
      'Suporte prioritário'
    ]
  };

  const handleSaveProfile = () => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso!"
    });
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Senha alterada",
      description: "Sua senha foi atualizada com sucesso!"
    });
    
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleCancelAccount = () => {
    if (confirm('Tem certeza que deseja cancelar sua conta? Esta ação não pode ser desfeita.')) {
      toast({
        title: "Conta cancelada",
        description: "Sua conta foi cancelada. Você receberá um e-mail de confirmação.",
        variant: "destructive"
      });
    }
  };

  const usagePercentage = (currentPlan.diagnosticsUsed / currentPlan.diagnosticsTotal) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Minha Conta</h1>
        <p className="text-gray-600 mt-1">Gerencie suas informações pessoais, assinatura e configurações</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="subscription">Assinatura</TabsTrigger>
          <TabsTrigger value="billing">Faturamento</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Mantenha seus dados atualizados para melhor experiência
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileData.avatar} />
                  <AvatarFallback className="text-xl bg-petrol text-white">
                    {profileData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Alterar Foto
                  </Button>
                  <p className="text-sm text-gray-500">JPG, PNG até 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    value={profileData.company}
                    onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Cargo</Label>
                  <Input
                    id="position"
                    value={profileData.position}
                    onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} className="bg-petrol hover:bg-petrol/90">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Plano Atual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                    <p className="text-gray-600">
                      R$ {currentPlan.price}/mês
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Próxima cobrança:</span>
                    <span className="font-medium">
                      {new Date(currentPlan.nextBilling).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium">Funcionalidades incluídas:</h5>
                  <ul className="space-y-1">
                    {currentPlan.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-petrol rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    Alterar Plano
                  </Button>
                  <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                    Cancelar Assinatura
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uso Atual</CardTitle>
                <CardDescription>
                  Acompanhe o consumo do seu plano este mês
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Diagnósticos utilizados</span>
                    <span className="font-medium">
                      {currentPlan.diagnosticsUsed} de {currentPlan.diagnosticsTotal}
                    </span>
                  </div>
                  <Progress value={usagePercentage} className="h-3" />
                  <p className="text-xs text-gray-500">
                    {Math.round(100 - usagePercentage)}% restante neste ciclo
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-petrol">53</div>
                    <p className="text-xs text-gray-600">Diagnósticos restantes</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <p className="text-xs text-gray-600">Dias até renovação</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium">Histórico de Uso</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Janeiro 2024</span>
                      <span>47/100</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Dezembro 2023</span>
                      <span>82/100</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Novembro 2023</span>
                      <span>76/100</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Histórico de Pagamentos
              </CardTitle>
              <CardDescription>
                Visualize e baixe suas faturas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h5 className="font-medium">{payment.description}</h5>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{new Date(payment.date).toLocaleDateString('pt-BR')}</span>
                        <span>•</span>
                        <span>{payment.invoice}</span>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="font-semibold">
                        R$ {payment.amount.toFixed(2)}
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {payment.status}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" className="ml-4">
                      Baixar PDF
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Forma de Pagamento</CardTitle>
              <CardDescription>
                Gerencie seus métodos de pagamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• 4532</p>
                    <p className="text-sm text-gray-600">Expira em 12/2026</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                    Remover
                  </Button>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                + Adicionar Método de Pagamento
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Alterar Senha
              </CardTitle>
              <CardDescription>
                Mantenha sua conta segura com uma senha forte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                />
              </div>

              <Button onClick={handleChangePassword} className="bg-petrol hover:bg-petrol/90">
                Alterar Senha
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-700">Zona de Perigo</CardTitle>
              <CardDescription>
                Ações irreversíveis que afetam sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <h5 className="font-medium text-red-700 mb-2">Cancelar Conta</h5>
                <p className="text-sm text-red-600 mb-4">
                  Esta ação irá cancelar sua conta permanentemente. Todos os seus dados, 
                  diagnósticos e configurações serão perdidos.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleCancelAccount}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Cancelar Conta Permanentemente
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Conta;
