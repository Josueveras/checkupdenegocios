
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServicesList } from "@/components/planos/ServicesList";

interface Plan {
  id?: string;
  nome: string;
  objetivo: string;
  servicos: string[];
  valor: number;
  categoria: string;
  ativo?: boolean;
}

interface PlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan | null;
  onPlanChange: (plan: Plan | null) => void;
  onSave: () => void;
  isNew: boolean;
  isSaving: boolean;
}

export const PlanDialog = ({ 
  open, 
  onOpenChange, 
  plan, 
  onPlanChange, 
  onSave, 
  isNew, 
  isSaving 
}: PlanDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isNew ? "Novo Plano" : "Editar Plano"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input
              value={plan?.nome || ""}
              onChange={(e) =>
                onPlanChange(plan && { ...plan, nome: e.target.value })
              }
            />
          </div>
          
          <div className="space-y-2">
            <Label>Objetivo</Label>
            <Textarea
              value={plan?.objetivo || ""}
              onChange={(e) =>
                onPlanChange(plan && { ...plan, objetivo: e.target.value })
              }
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Input
              value={plan?.categoria || ""}
              onChange={(e) =>
                onPlanChange(plan && { ...plan, categoria: e.target.value })
              }
            />
          </div>
          
          <div className="space-y-2">
            <Label>Valor Sugerido</Label>
            <Input
              type="number"
              value={plan?.valor || 0}
              onChange={(e) =>
                onPlanChange(plan && { ...plan, valor: Number(e.target.value) })
              }
            />
          </div>
          
          <ServicesList
            services={plan?.servicos || []}
            onChange={(servicos) =>
              onPlanChange(plan && { ...plan, servicos })
            }
          />
        </div>
        <DialogFooter>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
