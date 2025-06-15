
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, Plus } from "lucide-react";
import { ServicesList } from "@/components/planos/ServicesList";
import { usePlanos } from "@/hooks/usePlanos";
import { useCreatePlano, useUpdatePlano, useDeletePlano } from "@/hooks/usePlanosOperations";

interface Plan {
  id?: string;
  nome: string;
  objetivo: string;
  servicos: string[];
  valor: number;
  categoria: string;
  ativo?: boolean;
}

const Planos = () => {
  const { data: plans = [], isLoading } = usePlanos();
  const createPlano = useCreatePlano();
  const updatePlano = useUpdatePlano();
  const deletePlano = useDeletePlano();
  
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
      nome: "",
      objetivo: "",
      servicos: [],
      valor: 0,
      categoria: "Marketing",
    });
    setIsNewPlan(true);
    setDialogOpen(true);
  };

  const handleSavePlan = async () => {
    if (!editingPlan) return;
    
    try {
      if (isNewPlan) {
        await createPlano.mutateAsync(editingPlan);
      } else {
        await updatePlano.mutateAsync(editingPlan);
      }
      setDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar plano:', error);
    }
  };

  const handleDeletePlan = async (id: string) => {
    try {
      await deletePlano.mutateAsync(id);
    } catch (error) {
      console.error('Erro ao excluir plano:', error);
    }
  };

  if (isLoading) {
    return <div className="p-4">Carregando planos...</div>;
  }

  return (
    <div className="p-4">
      <Button onClick={handleNewPlan} className="mb-4">
        <Plus className="mr-2 h-4 w-4" /> Novo Plano
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.nome}</CardTitle>
              <CardDescription>{plan.objetivo}</CardDescription>
              <Badge>{plan.categoria}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Serviços:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {plan.servicos.map((servico, idx) => (
                    <li key={idx} className="text-sm">{servico}</li>
                  ))}
                </ul>
              </div>
              <p className="mt-3 font-bold">R$ {plan.valor.toFixed(2)}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" onClick={() => handleEditPlan(plan)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o plano "{plan.nome}"? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeletePlan(plan.id!)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isNewPlan ? "Novo Plano" : "Editar Plano"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={editingPlan?.nome || ""}
                onChange={(e) =>
                  setEditingPlan((prev) => prev && { ...prev, nome: e.target.value })
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label>Objetivo</Label>
              <Textarea
                value={editingPlan?.objetivo || ""}
                onChange={(e) =>
                  setEditingPlan((prev) =>
                    prev && { ...prev, objetivo: e.target.value }
                  )
                }
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Input
                value={editingPlan?.categoria || ""}
                onChange={(e) =>
                  setEditingPlan((prev) =>
                    prev && { ...prev, categoria: e.target.value }
                  )
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label>Valor Sugerido</Label>
              <Input
                type="number"
                value={editingPlan?.valor || 0}
                onChange={(e) =>
                  setEditingPlan((prev) =>
                    prev && { ...prev, valor: Number(e.target.value) }
                  )
                }
              />
            </div>
            
            <ServicesList
              services={editingPlan?.servicos || []}
              onChange={(servicos) =>
                setEditingPlan((prev) =>
                  prev && { ...prev, servicos }
                )
              }
            />
          </div>
          <DialogFooter>
            <Button 
              onClick={handleSavePlan}
              disabled={createPlano.isPending || updatePlano.isPending}
            >
              {(createPlano.isPending || updatePlano.isPending) ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Planos;
