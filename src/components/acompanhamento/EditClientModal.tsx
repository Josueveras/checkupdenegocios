
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface EditClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  acompanhamento: any;
}

const EditClientModal = ({ open, onOpenChange, acompanhamento }: EditClientModalProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    pontos_fortes_desenvolvidos: acompanhamento?.pontos_fortes_desenvolvidos || '',
    gargalos_atuais: acompanhamento?.gargalos_atuais || '',
    estrategias_validadas: acompanhamento?.estrategias_validadas || '',
    virou_case: acompanhamento?.virou_case || false,
    destaque_case: acompanhamento?.destaque_case || ''
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('acompanhamentos')
        .update(data)
        .eq('id', acompanhamento.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acompanhamentos-detalhados'] });
      toast({
        title: "Sucesso",
        description: "Dados atualizados com sucesso!"
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar dados",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Resumo Estratégico</DialogTitle>
          <DialogDescription>
            Edite as informações estratégicas do cliente
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="pontos_fortes">Pontos Fortes Desenvolvidos</Label>
            <Textarea
              id="pontos_fortes"
              rows={4}
              value={formData.pontos_fortes_desenvolvidos}
              onChange={(e) => setFormData(prev => ({ ...prev, pontos_fortes_desenvolvidos: e.target.value }))}
              placeholder="Descreva os principais pontos fortes que foram desenvolvidos..."
            />
          </div>

          <div>
            <Label htmlFor="gargalos_atuais">Gargalos Atuais</Label>
            <Textarea
              id="gargalos_atuais"
              rows={4}
              value={formData.gargalos_atuais}
              onChange={(e) => setFormData(prev => ({ ...prev, gargalos_atuais: e.target.value }))}
              placeholder="Identifique os principais gargalos encontrados..."
            />
          </div>

          <div>
            <Label htmlFor="estrategias_validadas">Estratégias Validadas</Label>
            <Textarea
              id="estrategias_validadas"
              rows={4}
              value={formData.estrategias_validadas}
              onChange={(e) => setFormData(prev => ({ ...prev, estrategias_validadas: e.target.value }))}
              placeholder="Liste as estratégias que foram validadas e tiveram sucesso..."
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="virou_case" 
                checked={formData.virou_case}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, virou_case: !!checked }))}
              />
              <Label htmlFor="virou_case">Este projeto virou um case?</Label>
            </div>

            {formData.virou_case && (
              <div>
                <Label htmlFor="destaque_case">Destaques do Case</Label>
                <Textarea
                  id="destaque_case"
                  rows={4}
                  value={formData.destaque_case}
                  onChange={(e) => setFormData(prev => ({ ...prev, destaque_case: e.target.value }))}
                  placeholder="Descreva os principais destaques e resultados do case..."
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateMutation.isPending} className="bg-petrol hover:bg-petrol/90 text-white">
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientModal;
