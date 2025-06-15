
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, HelpCircle, Target, Settings, Users, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmpresas, useDiagnosticos, usePropostas } from '@/hooks/useSupabase';
import { usePlanos } from '@/hooks/usePlanos';

const Admin = () => {
  const navigate = useNavigate();
  const { data: diagnosticos = [] } = useDiagnosticos();
  const { data: empresas = [] } = useEmpresas();
  const { data: propostas = [] } = usePropostas();
  const { data: planos = [] } = usePlanos();

  const adminSections = [
    {
      title: 'Empresas',
      description: 'Gerenciar empresas cadastradas no sistema',
      icon: Building2,
      count: empresas.length || 0,
      route: '/empresas',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      title: 'Perguntas',
      description: 'Gerenciar perguntas dos diagnósticos',
      icon: HelpCircle,
      count: 0, // Will be updated when we have question count
      route: '/perguntas',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      title: 'Planos',
      description: 'Gerenciar planos de propostas',
      icon: Target,
      count: planos.length || 0,
      route: '/planos',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      title: 'Propostas',
      description: 'Visualizar todas as propostas',
      icon: FileText,
      count: propostas.length || 0,
      route: '/propostas',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    }
  ];

  const stats = [
    { label: 'Total de Empresas', value: empresas.length || 0, icon: Building2 },
    { label: 'Diagnósticos', value: diagnosticos.length || 0, icon: FileText },
    { label: 'Propostas', value: propostas.length || 0, icon: Target },
    { label: 'Planos Ativos', value: planos.length || 0, icon: Settings }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="h-8 w-8 text-petrol" />
          Administração do Sistema
        </h1>
        <p className="text-gray-600 mt-1">Gerencie todos os dados e configurações do sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-petrol">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminSections.map((section) => (
          <Card key={section.title} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${section.color} text-white`}>
                  <section.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span>{section.title}</span>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                      {section.count}
                    </span>
                  </div>
                </div>
              </CardTitle>
              <CardDescription>
                {section.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate(section.route)}
                className={`w-full ${section.color} ${section.hoverColor} text-white`}
              >
                Gerenciar {section.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesso rápido às funcionalidades mais utilizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/novo-diagnostico')}
              className="flex items-center gap-2 h-12"
            >
              <FileText className="h-5 w-5" />
              Novo Diagnóstico
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/nova-proposta-plano')}
              className="flex items-center gap-2 h-12"
            >
              <Target className="h-5 w-5" />
              Nova Proposta
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/novo-lead')}
              className="flex items-center gap-2 h-12"
            >
              <Users className="h-5 w-5" />
              Novo Lead
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
