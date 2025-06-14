import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, FileText, Settings, Trash2, Plus, X, Tag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { usePerguntasManager } from '@/hooks/usePerguntasManager';
import { useCategories } from '@/hooks/useCategories';

interface Question {
  id?: string;
  question: string;
  category: string;
  options: Array<{ text: string; score: number }>;
  required: boolean;
}

const Perguntas = () => {
  const { questions, isLoading, saveQuestion, deleteQuestion } = usePerguntasManager();
  const { categories, addCategory, removeCategory } = useCategories();
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isNewQuestion, setIsNewQuestion] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion({ ...question });
    setIsNewQuestion(false);
    setDialogOpen(true);
  };

  const handleNewQuestion = () => {
    setEditingQuestion({
      question: "",
      category: categories[0] || "Marketing",
      options: [
        { text: "", score: 0 },
        { text: "", score: 1 }
      ],
      required: false
    });
    setIsNewQuestion(true);
    setDialogOpen(true);
  };

  const handleSaveQuestion = async () => {
    if (!editingQuestion) return;

    // Validação básica
    if (!editingQuestion.question.trim()) {
      toast({
        title: "Erro de validação",
        description: "A pergunta não pode estar vazia.",
        variant: "destructive"
      });
      return;
    }

    if (editingQuestion.options.length < 2) {
      toast({
        title: "Erro de validação",
        description: "É necessário ter pelo menos 2 opções de resposta.",
        variant: "destructive"
      });
      return;
    }

    if (editingQuestion.options.some(opt => !opt.text.trim())) {
      toast({
        title: "Erro de validação",
        description: "Todas as opções devem ser preenchidas.",
        variant: "destructive"
      });
      return;
    }

    try {
      await saveQuestion.mutateAsync(editingQuestion);
      
      toast({
        title: isNewQuestion ? "Pergunta criada" : "Pergunta atualizada",
        description: isNewQuestion 
          ? "Nova pergunta adicionada com sucesso!" 
          : "Pergunta editada com sucesso!"
      });

      setDialogOpen(false);
      setEditingQuestion(null);
    } catch (error) {
      console.error('Erro ao salvar pergunta:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a pergunta.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      await deleteQuestion.mutateAsync(id);
      toast({
        title: "Pergunta removida",
        description: "Pergunta excluída com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao excluir pergunta:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir a pergunta.",
        variant: "destructive"
      });
    }
  };

  const updateOption = (index: number, field: 'text' | 'score', value: string | number) => {
    if (!editingQuestion) return;
    
    const newOptions = [...editingQuestion.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setEditingQuestion({ ...editingQuestion, options: newOptions });
  };

  const addOption = () => {
    if (!editingQuestion || editingQuestion.options.length >= 10) return;
    
    const newOptions = [
      ...editingQuestion.options,
      { text: "", score: editingQuestion.options.length }
    ];
    setEditingQuestion({ ...editingQuestion, options: newOptions });
  };

  const removeOption = (index: number) => {
    if (!editingQuestion || editingQuestion.options.length <= 2) return;
    
    const newOptions = editingQuestion.options.filter((_, i) => i !== index);
    setEditingQuestion({ ...editingQuestion, options: newOptions });
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const success = addCategory(newCategoryName);
      if (success) {
        toast({
          title: "Categoria adicionada",
          description: `Categoria "${newCategoryName}" criada com sucesso!`
        });
        setNewCategoryName('');
      } else {
        toast({
          title: "Erro",
          description: "Categoria já existe ou é inválida.",
          variant: "destructive"
        });
      }
    }
  };

  const handleRemoveCategory = (category: string) => {
    removeCategory(category);
    toast({
      title: "Categoria removida",
      description: `Categoria "${category}" removida com sucesso!`
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Marketing": "bg-blue-100 text-blue-800",
      "Vendas": "bg-green-100 text-green-800",
      "Estratégia": "bg-purple-100 text-purple-800",
      "Gestão": "bg-orange-100 text-orange-800",
      "Tecnologia": "bg-gray-100 text-gray-800"
    };
    return colors[category as keyof typeof colors] || "bg-slate-100 text-slate-800";
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editor de Perguntas</h1>
            <p className="text-gray-600 mt-1">Carregando perguntas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editor de Perguntas</h1>
          <p className="text-gray-600 mt-1">Gerencie as perguntas do diagnóstico empresarial</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCategoryDialogOpen(true)}
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            <Tag className="mr-2 h-4 w-4" />
            Categorias
          </Button>
          <Button onClick={handleNewQuestion} className="bg-petrol hover:bg-petrol/90 text-white">
            <Edit className="mr-2 h-4 w-4" />
            Nova Pergunta
          </Button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <Badge className={getCategoryColor(question.category)}>
                      {question.category}
                    </Badge>
                    {question.required && (
                      <Badge variant="destructive" className="text-xs">
                        Obrigatória
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{question.question}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditQuestion(question)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => question.id && handleDeleteQuestion(question.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h5 className="font-medium text-sm text-gray-700">Opções de resposta:</h5>
                <div className="grid gap-2">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="flex-1">{option.text}</span>
                      <Badge variant="outline" className="ml-2">
                        {option.score} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit/New Question Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
          
          {editingQuestion && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="question">Pergunta *</Label>
                <Textarea
                  id="question"
                  value={editingQuestion.question}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                  placeholder="Digite a pergunta..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select 
                    value={editingQuestion.category} 
                    onValueChange={(value) => setEditingQuestion({ ...editingQuestion, category: value })}
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
                      checked={editingQuestion.required}
                      onCheckedChange={(checked) => 
                        setEditingQuestion({ ...editingQuestion, required: !!checked })
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
                    disabled={editingQuestion.options.length >= 10}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
                {editingQuestion.options.map((option, index) => (
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
                        disabled={editingQuestion.options.length <= 2}
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
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveQuestion} 
              className="bg-petrol hover:bg-petrol/90"
              disabled={saveQuestion.isPending}
            >
              {saveQuestion.isPending 
                ? "Salvando..." 
                : (isNewQuestion ? "Criar Pergunta" : "Salvar Alterações")
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Management Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Gerenciar Categorias</DialogTitle>
            <DialogDescription>
              Adicione ou remova categorias para organizar suas perguntas
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nome da nova categoria..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <Button onClick={handleAddCategory} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>Categorias Existentes:</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <div key={category} className="flex items-center gap-1">
                    <Badge className={getCategoryColor(category)}>
                      {category}
                    </Badge>
                    {categories.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCategory(category)}
                        className="h-6 w-6 p-0 text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setCategoryDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {questions.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <Edit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma pergunta cadastrada</h3>
            <p className="text-gray-600 mb-6">
              Comece criando a primeira pergunta do seu diagnóstico.
            </p>
            <Button onClick={handleNewQuestion} className="bg-petrol hover:bg-petrol/90">
              <Edit className="mr-2 h-4 w-4" />
              Criar Primeira Pergunta
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Perguntas;
