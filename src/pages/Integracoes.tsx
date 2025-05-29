
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  MessageCircle, 
  Calendar, 
  Mail, 
  Zap, 
  Settings, 
  Plus,
  CheckCircle,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Integracao {
  id: string;
  tipo: string;
  configuracao: any;
  ativa: boolean;
}

interface IntegracaoConfig {
  tipo: string;
  nome: string;
  descricao: string;
  icon: any;
  cor: string;
  campos: any[];
}

const tiposIntegracao: IntegracaoConfig[] = [
  {
    tipo: 'whatsapp',
    nome: 'WhatsApp Business API',
    descricao: 'Envie diagnósticos e propostas via WhatsApp automaticamente',
    icon: MessageCircle,
    cor: 'text-green-600',
    campos: [
      { nome: 'access_token', label: 'Token de Acesso', tipo: 'password', obrigatorio: true },
      { nome: 'phone_number_id', label: 'ID do Número', tipo: 'text', obrigatorio: true },
      { nome: 'webhook_verify_token', label: 'Token de Verificação', tipo: 'password', obrigatorio: false }
    ]
  },
  {
    tipo: 'google_calendar',
    nome: 'Google Calendar',
    descricao: 'Agende reuniões automaticamente após diagnósticos',
    icon: Calendar,
    cor: 'text-blue-600',
    campos: [
      { nome: 'client_id', label: 'Client ID', tipo: 'text', obrigatorio: true },
      { nome: 'client_secret', label: 'Client Secret', tipo: 'password', obrigatorio: true },
      { nome: 'calendar_id', label: 'ID do Calendário', tipo: 'text', obrigatorio: false }
    ]
  },
  {
    tipo: 'calendly',
    nome: 'Calendly',
    descricao: 'Integração com Calendly para agendamentos',
    icon: Calendar,
    cor: 'text-orange-600',
    campos: [
      { nome: 'api_key', label: 'API Key', tipo: 'password', obrigatorio: true },
      { nome: 'event_type_uuid', label: 'UUID do Tipo de Evento', tipo: 'text', obrigatorio: true }
    ]
  },
  {
    tipo: 'smtp',
    nome: 'SMTP / E-mail',
    descricao: 'Configure envio de e-mails personalizados',
    icon: Mail,
    cor: 'text-purple-600',
    campos: [
      { nome: 'host', label: 'Servidor SMTP', tipo: 'text', obrigatorio: true },
      { nome: 'port', label: 'Porta', tipo: 'number', obrigatorio: true },
      { nome: 'username', label: 'Usuário', tipo: 'text', obrigatorio: true },
      { nome: 'password', label: 'Senha', tipo: 'password', obrigatorio: true },
      { nome: 'from_email', label: 'E-mail Remetente', tipo: 'email', obrigatorio: true },
      { nome: 'from_name', label: 'Nome Remetente', tipo: 'text', obrigatorio: false }
    ]
  },
  {
    tipo: 'zapier',
    nome: 'Zapier',
    descricao: 'Conecte com mais de 5000 aplicações via Zapier',
    icon: Zap,
    cor: 'text-yellow-600',
    campos: [
      { nome: 'webhook_url', label: 'Webhook URL', tipo: 'url', obrigatorio: true },
      { nome: 'api_key', label: 'API Key (opcional)', tipo: 'password', obrigatorio: false }
    ]
  },
  {
    tipo: 'make',
    nome: 'Make (Integromat)',
    descricao: 'Automações avançadas com Make',
    icon: Settings,
    cor: 'text-indigo-600',
    campos: [
      { nome: 'webhook_url', label: 'Webhook URL', tipo: 'url', obrigatorio: true },
      { nome: 'api_key', label: 'API Key (opcional)', tipo: 'password', obrigatorio: false }
    ]
  }
];

export default function Integracoes() {
  const [integracoes, setIntegracoes] = useState<Integracao[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [integracaoSelecionada, setIntegracaoSelecionada] = useState<IntegracaoConfig | null>(null);
  const [integracaoEditando, setIntegracaoEditando] = useState<Integracao | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    carregarIntegracoes();
  }, []);

  const carregarIntegracoes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('integracoes')
        .select('*')
        .order('tipo');

      if (error) throw error;
      setIntegracoes(data || []);
    } catch (error) {
      console.error('Erro ao carregar integrações:', error);
      toast.error('Erro ao carregar integrações');
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (tipoIntegracao: IntegracaoConfig, integracaoExistente?: Integracao) => {
    setIntegracaoSelecionada(tipoIntegracao);
    setIntegracaoEditando(integracaoExistente || null);
    
    // Inicializar form data
    const dadosIniciais: any = {};
    tipoIntegracao.campos.forEach(campo => {
      dadosIniciais[campo.nome] = integracaoExistente?.configuracao?.[campo.nome] || '';
    });
    setFormData(dadosIniciais);
    
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setIntegracaoSelecionada(null);
    setIntegracaoEditando(null);
    setFormData({});
  };

  const salvarIntegracao = async () => {
    if (!integracaoSelecionada) return;

    try {
      // Validar campos obrigatórios
      const camposObrigatorios = integracaoSelecionada.campos.filter(c => c.obrigatorio);
      for (const campo of camposObrigatorios) {
        if (!formData[campo.nome]?.trim()) {
          toast.error(`Campo "${campo.label}" é obrigatório`);
          return;
        }
      }

      const dadosIntegracao = {
        tipo: integracaoSelecionada.tipo,
        configuracao: formData,
        ativa: true
      };

      if (integracaoEditando) {
        const { error } = await supabase
          .from('integracoes')
          .update(dadosIntegracao)
          .eq('id', integracaoEditando.id);

        if (error) throw error;
        toast.success('Integração atualizada com sucesso!');
      } else {
        const { error } = await supabase
          .from('integracoes')
          .insert(dadosIntegracao);

        if (error) throw error;
        toast.success('Integração configurada com sucesso!');
      }

      fecharModal();
      carregarIntegracoes();
    } catch (error) {
      console.error('Erro ao salvar integração:', error);
      toast.error('Erro ao salvar integração');
    }
  };

  const toggleIntegracao = async (integracao: Integracao) => {
    try {
      const { error } = await supabase
        .from('integracoes')
        .update({ ativa: !integracao.ativa })
        .eq('id', integracao.id);

      if (error) throw error;
      toast.success(`Integração ${!integracao.ativa ? 'ativada' : 'desativada'} com sucesso!`);
      carregarIntegracoes();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status da integração');
    }
  };

  const excluirIntegracao = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta integração?')) return;

    try {
      const { error } = await supabase
        .from('integracoes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Integração excluída com sucesso!');
      carregarIntegracoes();
    } catch (error) {
      console.error('Erro ao excluir integração:', error);
      toast.error('Erro ao excluir integração');
    }
  };

  const getIntegracaoAtiva = (tipo: string) => {
    return integracoes.find(i => i.tipo === tipo && i.ativa);
  };

  const testarIntegracao = (integracao: Integracao) => {
    toast.info(`Teste da integração ${integracao.tipo} será implementado`);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F3244]">Integrações</h1>
        <p className="text-gray-600">Conecte sua plataforma com ferramentas externas</p>
      </div>

      {/* Grid de Integrações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiposIntegracao.map((tipo) => {
          const integracaoAtiva = getIntegracaoAtiva(tipo.tipo);
          const Icon = tipo.icon;

          return (
            <Card key={tipo.tipo} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gray-100 ${tipo.cor}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-[#0F3244] text-lg">
                        {tipo.nome}
                      </CardTitle>
                      {integracaoAtiva && (
                        <Badge className="bg-green-100 text-green-800 mt-1">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ativa
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {tipo.descricao}
                </p>
                
                <div className="flex gap-2">
                  {integracaoAtiva ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => abrirModal(tipo, integracaoAtiva)}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Configurar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testarIntegracao(integracaoAtiva)}
                      >
                        Testar
                      </Button>
                      <Button
                        size="sm"
                        variant={integracaoAtiva.ativa ? "outline" : "default"}
                        onClick={() => toggleIntegracao(integracaoAtiva)}
                      >
                        {integracaoAtiva.ativa ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => abrirModal(tipo)}
                      className="bg-[#3C9CD6] hover:bg-[#3C9CD6]/90"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Conectar
                    </Button>
                  )}
                </div>

                {integracaoAtiva && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500">
                      Configurado em {new Date(integracaoAtiva.id).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Seção de Documentação */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0F3244]">Documentação e Suporte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Guias de Configuração</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <a href="#" className="text-[#3C9CD6] hover:underline">WhatsApp Business API</a></li>
                <li>• <a href="#" className="text-[#3C9CD6] hover:underline">Google Calendar OAuth</a></li>
                <li>• <a href="#" className="text-[#3C9CD6] hover:underline">Configuração SMTP</a></li>
                <li>• <a href="#" className="text-[#3C9CD6] hover:underline">Webhooks Zapier/Make</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Suporte Técnico</h3>
              <p className="text-sm text-gray-600 mb-2">
                Precisa de ajuda? Nossa equipe está pronta para auxiliar.
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir Ticket
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Configuração */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#0F3244] flex items-center gap-2">
              {integracaoSelecionada && (
                <>
                  <integracaoSelecionada.icon className={`h-5 w-5 ${integracaoSelecionada.cor}`} />
                  {integracaoEditando ? 'Editar' : 'Configurar'} {integracaoSelecionada.nome}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {integracaoSelecionada && (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                {integracaoSelecionada.descricao}
              </p>
              
              <div className="space-y-4">
                {integracaoSelecionada.campos.map((campo) => (
                  <div key={campo.nome}>
                    <Label htmlFor={campo.nome}>
                      {campo.label}
                      {campo.obrigatorio && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {campo.tipo === 'textarea' ? (
                      <Textarea
                        id={campo.nome}
                        value={formData[campo.nome] || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          [campo.nome]: e.target.value 
                        }))}
                        rows={3}
                      />
                    ) : (
                      <Input
                        id={campo.nome}
                        type={campo.tipo}
                        value={formData[campo.nome] || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          [campo.nome]: e.target.value 
                        }))}
                        placeholder={`Digite ${campo.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t">
                <div>
                  {integracaoEditando && (
                    <Button
                      variant="destructive"
                      onClick={() => excluirIntegracao(integracaoEditando.id)}
                    >
                      Excluir
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={fecharModal}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={salvarIntegracao} 
                    className="bg-[#3C9CD6] hover:bg-[#3C9CD6]/90"
                  >
                    {integracaoEditando ? 'Atualizar' : 'Salvar'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
