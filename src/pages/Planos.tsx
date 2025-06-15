
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PlanCard } from "@/components/planos/PlanCard";
import { PlanDialog } from "@/components/planos/PlanDialog";
import { usePlanos } from "@/hooks/usePlanos";
import { useCreatePlano, useUpdatePlano, useDeletePlano } from "@/hooks/usePlanosOperations";
import { Plan } from "@/types/plan";

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
          <PlanCard
            key={plan.id}
            plan={plan}
            onEdit={handleEditPlan}
            onDelete={handleDeletePlan}
          />
        ))}
      </div>

      <PlanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        plan={editingPlan}
        onPlanChange={setEditingPlan}
        onSave={handleSavePlan}
        isNew={isNewPlan}
        isSaving={createPlano.isPending || updatePlano.isPending}
      />
    </div>
  );
};

export default Planos;
