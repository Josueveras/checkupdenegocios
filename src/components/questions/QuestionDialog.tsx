
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, X } from 'lucide-react';

interface Question {
  id?: string;
  question: string;
  category: string;
  options: Array<{ text: string; score: number }>;
  required: boolean;
}

interface QuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: Question | null;
  isNewQuestion: boolean;
  categories: string[];
  onSave: () => void;
  onUpdateQuestion: (question: Question) => void;
  isSaving: boolean;
}

export const QuestionDialog = ({
  open,
  onOpenChange,
  question,
  isNewQuestion,
  categories,
  onSave,
  onUpdateQuestion,
  isSaving
}: QuestionDialogProps) => {
  if (!question) return null;

  const updateOption = (index: number, field: 'text' | 'score', value: string | number) => {
    const newOptions = [...question.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onUpdateQuestion({ ...question, options: newOptions });
  };

  const addOption = () => {
    if (question.options.length >= 10) return;
    
    const newOptions = [
      ...question.options,
      { text: "", score: question.options.length }
    ];
    onUpdateQuestion({ ...question, options: newOptions });
  };

  const removeOption = (index: number) => {
    if (question.options.length <= 2) return;
    
    const newOptions = question.options.filter((_, i) => i !== index);
    onUpdateQuestion({ ...question, options: newOptions });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isNewQuestion ? "Nova Pergunta" : "Editar Pergunta"}
          </DialogTitle>
          <DialogDescription>
            {isNewQuestion 
              ? "Crie uma nova pergunta para o diagnóstico"
              : "Edite os detalhes da pergunta selecionada"
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question">Pergunta *</Label>
            <Textarea
              id="question"
              value={question.question}
              onChange={(e) => onUpdateQuestion({ ...question, question: e.target.value })}
              placeholder="Digite a pergunta..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select 
                value={question.category} 
                onValueChange={(value) => onUpdateQuestion({ ...question, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Configurações</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="required"
                  checked={question.required}
                  onCheckedChange={(checked) => 
                    onUpdateQuestion({ ...question, required: !!checked })
                  }
                />
                <Label htmlFor="required" className="text-sm">
                  Pergunta obrigatória
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Opções de Resposta * (mín: 2, máx: 10)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                disabled={question.options.length >= 10}
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>
            {question.options.map((option, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-center p-3 border rounded-lg">
                <div className="col-span-1">
                  <Label className="text-xs text-gray-500">#{index + 1}</Label>
                </div>
                <div className="col-span-7">
                  <Input
                    value={option.text}
                    onChange={(e) => updateOption(index, 'text', e.target.value)}
                    placeholder={`Opção ${index + 1}...`}
                  />
                </div>
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      value={option.score}
                      onChange={(e) => updateOption(index, 'score', parseInt(e.target.value) || 0)}
                      className="w-16"
                    />
                    <span className="text-xs text-gray-500">pts</span>
                  </div>
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(index)}
                    disabled={question.options.length <= 2}
                    className="text-red-600 p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-500">
              💡 Dica: Use pontuações crescentes, onde menor = inexistente e maior = excelente
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={onSave} 
            className="bg-petrol hover:bg-petrol/90"
            disabled={isSaving}
          >
            {isSaving 
              ? "Salvando..." 
              : (isNewQuestion ? "Criar Pergunta" : "Salvar Alterações")
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
