
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Plan {
  id: number;
  name: string;
  objective: string;
  tasks: string[];
  suggestedValue: number;
  category: string;
}

const Planos = () => {
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: 1,
      name: "Plano Marketing Digital Completo",
      objective: "Estruturar presença digital da empresa e gerar leads qualificados",
      tasks: [
        "Criação de site institucional responsivo",
        "Configuração de Google Ads e Facebook Ads",
        "Gestão de redes sociais (Instagram, LinkedIn)",
        "Implementação de CRM e automação de marketing",
        "Criação de conteúdo e blog",
        "Configuração de Google Analytics e relatórios"
      ],
      suggestedValue: 15000,
      category: "Marketing"
    },
    {
      id: 2,
      name: "Consultoria em Vendas",
      objective: "Otimizar processo comercial e aumentar taxa de conversão",
      tasks: [
        "Mapeamento do funil de vendas atual",
        "Treinamento da equipe comercial",
        "Implementação de CRM de vendas",
        "Criação de script e material de apoio",
        "Definição de metas e KPIs",
        "Acompanhamento mensal de resultados"
      ],
      suggestedValue: 8500,
      category: "Vendas"
    },
    {
      id: 3,
      name: "Planejamento Estratégico",
      objective: "Definir direcionamento estratégico e plano de crescimento",
      tasks: [
        "Análise SWOT da empresa",
        "Definição de missão, visão e valores",
        "Planejamento estratégico 12 meses",
        "Definição de OKRs e metas",
        "Plano de ação detalhado",
        "Workshop de alinhamento com equipe"
      ],
      suggestedValue: 12000,
      category: "Estratégia"
    }
  ]);

  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isNewPlan, setIsNewPlan] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan({ ...plan });
    setIsNewPlan(false);
    setDialogOpen(true);
  };

  const handleNewPlan = () => {
    setEditingPlan({
      id: Date.now(),
      name: "",
      objective: "",
      tasks: [""],
      suggestedValue: 0,
      category: "Marketing"
    });
    setIsNewPlan(true);
    setDialogOpen(true);
  };

  const handleSavePlan = () => {
    if (!editingPlan) return;

    // Validação básica
    if (!editingPlan.name.trim() || !editingPlan.objective.trim()) {
      toast({
        title: "Erro de validação",
        description: "Nome e objetivo são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (editingPlan.tasks.some(task => !task.trim())) {
      toast({
        title: "Erro de validação",
        description: "Todas as tarefas devem ser preenchidas.",
        variant: "destructive"
      });
      return;
    }

    if (isNewPlan) {
      setPlans(prev => [...prev, editingPlan]);
      toast({
        title: "Plano criado",
        description: "Novo plano adicionado com sucesso!"
      });
    } else {
      setPlans(prev => prev.map(p => p.id === editingPlan.id ? editingPlan : p));
      toast({
        title: "Plano atualizado",
        description: "Plano editado com sucesso!"
      });
    }

    setDialogOpen(false);
    setEditingPlan(null);
  };

  const handleDeletePlan = (id: number) => {
    setPlans(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Plano removido",
      description: "Plano excluído com sucesso!"
    });
  };

  const addTask = () => {
    if (!editingPlan) return;
    setEditingPlan({ ...editingPlan, tasks: [...editingPlan.tasks, ""] });
  };

  const updateTask = (index: number, value: string) => {
    if (!editingPlan) return;
    const newTasks = [...editingPlan.tasks];
    newTasks[index] = value;
    setEditingPlan({ ...editingPlan, tasks: newTasks });
  };

  const removeTask = (index: number) => {
    if (!editingPlan || editingPlan.tasks.length <= 1) return;
    const newTasks = editingPlan.tasks.filter((_, i) => i !== index);
    setEditingPlan({ ...editingPlan, tasks: newTasks });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Marketing": "bg-blue-100 text-blue-800",
      "Vendas": "bg-green-100 text-green-800",
      "Estratégia": "bg-purple-100 text-purple-800",
      "Gestão": "bg-orange-100 text-orange-800"
    };
    return colors[category as keyof typeof colors] || colors["Marketing"];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planos Comerciais</h1>
          <p className="text-gray-600 mt-1">Gerencie pacotes de serviços para propostas comerciais</p>
        </div>
        <Button onClick={handleNewPlan} className="bg-petrol hover:bg-petrol/90 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Planos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plans.length > 0 
                ? (plans.reduce((sum, plan) => sum + plan.suggestedValue, 0) / plans.length).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                : 'R$ 0'
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketing</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plans.filter(p => p.category === 'Marketing').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plans.filter(p => p.category === 'Vendas').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans List */}
      <div className="grid gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <Badge className={getCategoryColor(plan.category)}>
                      {plan.category}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">
                    {plan.objective}
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="text-right sm:text-left">
                    <div className="text-2xl font-bold text-green-600">
                      {plan.suggestedValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                    <div className="text-sm text-gray-500">Valor sugerido</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPlan(plan)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePlan(plan.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <h5 className="font-medium text-sm text-gray-700 mb-3">Tarefas incluídas:</h5>
                <div className="grid gap-2">
                  {plan.tasks.map((task, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-petrol rounded-full"></div>
                      <span className="text-gray-700">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit/New Plan Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isNewPlan ? "Novo Plano" : "Editar Plano"}
            </DialogTitle>
            <DialogDescription>
              {isNewPlan 
                ? "Crie um novo plano comercial"
                : "Edite os detalhes do plano selecionado"
              }
            </DialogDescription>
          </DialogHeader>
          
          {editingPlan && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Plano *</Label>
                <Input
                  id="name"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  placeholder="Nome do plano..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objective">Objetivo *</Label>
                <Textarea
                  id="objective"
                  value={editingPlan.objective}
                  onChange={(e) => setEditingPlan({ ...editingPlan, objective: e.target.value })}
                  placeholder="Objetivo principal do plano..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <select 
                    id="category"
                    value={editingPlan.category}
                    onChange={(e) => setEditingPlan({ ...editingPlan, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petrol focus:border-transparent"
                  >
                    <option value="Marketing">Marketing</option>
                    <option value="Vendas">Vendas</option>
                    <option value="Estratégia">Estratégia</option>
                    <option value="Gestão">Gestão</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Valor Sugerido (R$)</Label>
                  <Input
                    id="value"
                    type="number"
                    min="0"
                    step="100"
                    value={editingPlan.suggestedValue}
                    onChange={(e) => setEditingPlan({ ...editingPlan, suggestedValue: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Tarefas *</Label>
                  <Button type="button" onClick={addTask} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
                {editingPlan.tasks.map((task, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={task}
                      onChange={(e) => updateTask(index, e.target.value)}
                      placeholder={`Tarefa ${index + 1}...`}
                      className="flex-1"
                    />
                    {editingPlan.tasks.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeTask(index)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePlan} className="bg-petrol hover:bg-petrol/90">
              {isNewPlan ? "Criar Plano" : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {plans.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum plano cadastrado</h3>
            <p className="text-gray-600 mb-6">
              Comece criando o primeiro plano comercial.
            </p>
            <Button onClick={handleNewPlan} className="bg-petrol hover:bg-petrol/90">
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Plano
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Planos;
