
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { usePerguntasManager } from '@/hooks/usePerguntasManager';
import { useCategories } from '@/hooks/useCategories';
import { QuestionCard } from '@/components/questions/QuestionCard';
import { QuestionHeader } from '@/components/questions/QuestionHeader';
import { QuestionDialog } from '@/components/questions/QuestionDialog';
import { CategoryDialog } from '@/components/questions/CategoryDialog';
import { EmptyState } from '@/components/questions/EmptyState';

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

  // Debug log quando questions mudarem
  useEffect(() => {
    console.log('Questions updated in component:', questions);
  }, [questions]);

  const handleEditQuestion = (question: Question) => {
    console.log('Editing question:', question);
    setEditingQuestion({ ...question });
    setIsNewQuestion(false);
    setDialogOpen(true);
  };

  const handleNewQuestion = () => {
    console.log('Creating new question');
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

    console.log('Attempting to save question:', editingQuestion);

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
      console.log('Calling saveQuestion mutation...');
      await saveQuestion.mutateAsync(editingQuestion);
      
      toast({
        title: isNewQuestion ? "Pergunta criada" : "Pergunta atualizada",
        description: isNewQuestion 
          ? "Nova pergunta adicionada com sucesso!" 
          : "Pergunta editada com sucesso!"
      });

      console.log('Question saved successfully, closing dialog');
      setDialogOpen(false);
      setEditingQuestion(null);
    } catch (error) {
      console.error('Erro ao salvar pergunta:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a pergunta. Verifique o console para mais detalhes.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    console.log('Attempting to delete question with id:', id);
    
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

  const handleAddCategory = (categoryName: string) => {
    const success = addCategory(categoryName);
    if (success) {
      toast({
        title: "Categoria adicionada",
        description: `Categoria "${categoryName}" criada com sucesso!`
      });
      return true;
    } else {
      toast({
        title: "Erro",
        description: "Categoria já existe ou é inválida.",
        variant: "destructive"
      });
      return false;
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

  console.log('Rendering questions list, count:', questions.length);

  return (
    <div className="space-y-6 animate-fade-in">
      <QuestionHeader 
        onNewQuestion={handleNewQuestion}
        onManageCategories={() => setCategoryDialogOpen(true)}
      />

      {/* Debug info - remover em produção */}
      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        Debug: {questions.length} perguntas carregadas
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question, index) => {
          console.log('Rendering question card:', question.id, 'with options:', question.options);
          return (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
              onEdit={handleEditQuestion}
              onDelete={handleDeleteQuestion}
              getCategoryColor={getCategoryColor}
            />
          );
        })}
      </div>

      <QuestionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        question={editingQuestion}
        isNewQuestion={isNewQuestion}
        categories={categories}
        onSave={handleSaveQuestion}
        onUpdateQuestion={setEditingQuestion}
        isSaving={saveQuestion.isPending}
      />

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        categories={categories}
        onAddCategory={handleAddCategory}
        onRemoveCategory={handleRemoveCategory}
        getCategoryColor={getCategoryColor}
      />

      {questions.length === 0 && !isLoading && (
        <EmptyState onNewQuestion={handleNewQuestion} />
      )}
    </div>
  );
};

export default Perguntas;
