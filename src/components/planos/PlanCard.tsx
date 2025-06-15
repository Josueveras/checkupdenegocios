
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface Plan {
  id?: string;
  nome: string;
  objetivo: string;
  servicos: string[];
  valor: number;
  categoria: string;
  ativo?: boolean;
}

interface PlanCardProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onDelete: (id: string) => void;
}

export const PlanCard = ({ plan, onEdit, onDelete }: PlanCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const SERVICES_LIMIT = 3;
  
  const visibleServices = isExpanded 
    ? plan.servicos 
    : plan.servicos.slice(0, SERVICES_LIMIT);
  
  const hasMoreServices = plan.servicos.length > SERVICES_LIMIT;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{plan.nome}</CardTitle>
        <CardDescription>{plan.objetivo}</CardDescription>
        <Badge>{plan.categoria}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Serviços:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {visibleServices.map((servico, idx) => (
              <li key={idx} className="text-sm">{servico}</li>
            ))}
          </ul>
          
          {hasMoreServices && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 p-0 h-auto text-xs text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Ver menos
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Ver mais ({plan.servicos.length - SERVICES_LIMIT} serviços)
                </>
              )}
            </Button>
          )}
        </div>
        
        <p className="mt-3 font-bold">R$ {plan.valor.toFixed(2)}</p>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={() => onEdit(plan)}>
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
                  onClick={() => onDelete(plan.id!)}
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
  );
};
