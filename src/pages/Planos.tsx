
import { useEffect, useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Plan {
  id?: string;
  nome: string;
  objetivo: string;
  tarefas: string[];
  valor: number;
  categoria: string;
  ativo?: boolean;
}

const Planos = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isNewPlan, setIsNewPlan] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase.from("planos").select("*");
      if (error) {
        console.error(error);
      } else {
        // Transform the data to match our Plan interface
        const transformedPlans = data.map(plan => ({
          ...plan,
          tarefas: Array.isArray(plan.tarefas) 
            ? plan.tarefas.map(t => String(t)) 
            : typeof plan.tarefas === 'string' 
            ? [plan.tarefas] 
            : []
        }));
        setPlans(transformedPlans);
      }
    };
    fetchPlans();
  }, []);

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan({ ...plan });
    setIsNewPlan(false);
    setDialogOpen(true);
  };

  const handleNewPlan = () => {
    setEditingPlan({
      nome: "",
      objetivo: "",
      tarefas: [""],
      valor: 0,
      categoria: "Marketing",
    });
    setIsNewPlan(true);
    setDialogOpen(true);
  };

  const handleSavePlan = async () => {
    if (!editingPlan) return;
    const { data, error } = await supabase.from("planos").upsert([editingPlan]);
    if (error) {
      toast({ title: "Erro ao salvar plano" });
    } else {
      toast({ title: "Plano salvo com sucesso" });
      setDialogOpen(false);
      const updatedPlans = await supabase.from("planos").select("*");
      if (updatedPlans.data) {
        const transformedPlans = updatedPlans.data.map(plan => ({
          ...plan,
          tarefas: Array.isArray(plan.tarefas) 
            ? plan.tarefas.map(t => String(t)) 
            : typeof plan.tarefas === 'string' 
            ? [plan.tarefas] 
            : []
        }));
        setPlans(transformedPlans);
      }
    }
  };

  const handleDeletePlan = async (id: string) => {
    const { error } = await supabase.from("planos").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao excluir plano" });
    } else {
      toast({ title: "Plano excluído" });
      const updatedPlans = await supabase.from("planos").select("*");
      if (updatedPlans.data) {
        const transformedPlans = updatedPlans.data.map(plan => ({
          ...plan,
          tarefas: Array.isArray(plan.tarefas) 
            ? plan.tarefas.map(t => String(t)) 
            : typeof plan.tarefas === 'string' 
            ? [plan.tarefas] 
            : []
        }));
        setPlans(transformedPlans);
      }
    }
  };

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
              <ul className="list-disc pl-5">
                {plan.tarefas.map((task, idx) => (
                  <li key={idx}>{task}</li>
                ))}
              </ul>
              <p className="mt-2 font-bold">R$ {plan.valor.toFixed(2)}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" onClick={() => handleEditPlan(plan)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" onClick={() => handleDeletePlan(plan.id!)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isNewPlan ? "Novo Plano" : "Editar Plano"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label>Nome</Label>
            <Input
              value={editingPlan?.nome || ""}
              onChange={(e) =>
                setEditingPlan((prev) => prev && { ...prev, nome: e.target.value })
              }
            />
            <Label>Objetivo</Label>
            <Textarea
              value={editingPlan?.objetivo || ""}
              onChange={(e) =>
                setEditingPlan((prev) =>
                  prev && { ...prev, objetivo: e.target.value }
                )
              }
            />
            <Label>Categoria</Label>
            <Input
              value={editingPlan?.categoria || ""}
              onChange={(e) =>
                setEditingPlan((prev) =>
                  prev && { ...prev, categoria: e.target.value }
                )
              }
            />
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
            <Label>Tarefas (separadas por vírgula)</Label>
            <Textarea
              value={editingPlan?.tarefas.join(", ") || ""}
              onChange={(e) =>
                setEditingPlan((prev) =>
                  prev && { ...prev, tarefas: e.target.value.split(",").map(t => t.trim()) }
                )
              }
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSavePlan}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Planos;
