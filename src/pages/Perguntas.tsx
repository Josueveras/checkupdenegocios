
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, FileText, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Question {
  id: number;
  question: string;
  category: string;
  options: Array<{ text: string; score: number }>;
  required: boolean;
}

const Perguntas = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      question: "Sua empresa possui uma estratégia de marketing digital estruturada?",
      category: "Marketing",
      options: [
        { text: "Não temos estratégia definida", score: 0 },
        { text: "Temos algumas ações isoladas", score: 1 },
        { text: "Temos estratégia básica implementada", score: 2 },
        { text: "Temos estratégia completa e bem executada", score: 3 }
      ],
      required: true
    },
    {
      id: 2,
      question: "Como é o processo de vendas da sua empresa?",
      category: "Vendas",
      options: [
        { text: "Não temos processo estruturado", score: 0 },
        { text: "Processo básico e informal", score: 1 },
        { text: "Processo definido com algumas ferramentas", score: 2 },
        { text: "Processo otimizado com CRM e automações", score: 3 }
      ],
      required: true
    },
    {
      id: 3,
      question: "Sua empresa possui planejamento estratégico definido?",
      category: "Estratégia",
      options: [
        { text: "Não temos planejamento", score: 0 },
        { text: "Planejamento informal/básico", score: 1 },
        { text: "Planejamento anual estruturado", score: 2 },
        { text: "Planejamento estratégico completo com metas", score: 3 }
      ],
      required: false
    }
  ]);

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isNewQuestion, setIsNewQuestion] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const categories = ["Marketing", "Vendas", "Estratégia", "Gestão", "Tecnologia"];

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion({ ...question });
    setIsNewQuestion(false);
    setDialogOpen(true);
  };

  const handleNewQuestion = () => {
    setEditingQuestion({
      id: Date.now(),
      question: "",
      category: "Marketing",
      options: [
        { text: "", score: 0 },
        { text: "", score: 1 },
        { text: "", score: 2 },
        { text: "", score: 3 }
      ],
      required: false
    });
    setIsNewQuestion(true);
    setDialogOpen(true);
  };

  const handleSaveQuestion = () => {
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

    if (editingQuestion.options.some(opt => !opt.text.trim())) {
      toast({
        title: "Erro de validação",
        description: "Todas as opções devem ser preenchidas.",
        variant: "destructive"
      });
      return;
    }

    if (isNewQuestion) {
      setQuestions(prev => [...prev, editingQuestion]);
      toast({
        title: "Pergunta criada",
        description: "Nova pergunta adicionada com sucesso!"
      });
    } else {
      setQuestions(prev => prev.map(q => q.id === editingQuestion.id ? editingQuestion : q));
      toast({
        title: "Pergunta atualizada",
        description: "Pergunta editada com sucesso!"
      });
    }

    setDialogOpen(false);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    toast({
      title: "Pergunta removida",
      description: "Pergunta excluída com sucesso!"
    });
  };

  const updateOption = (index: number, field: 'text' | 'score', value: string | number) => {
    if (!editingQuestion) return;
    
    const newOptions = [...editingQuestion.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setEditingQuestion({ ...editingQuestion, options: newOptions });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Marketing": "bg-blue-100 text-blue-800",
      "Vendas": "bg-green-100 text-green-800",
      "Estratégia": "bg-purple-100 text-purple-800",
      "Gestão": "bg-orange-100 text-orange-800",
      "Tecnologia": "bg-gray-100 text-gray-800"
    };
    return colors[category as keyof typeof colors] || colors["Marketing"];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editor de Perguntas</h1>
          <p className="text-gray-600 mt-1">Gerencie as perguntas do diagnóstico empresarial</p>
        </div>
        <Button onClick={handleNewQuestion} className="bg-petrol hover:bg-petrol/90 text-white">
          <Edit className="mr-2 h-4 w-4" />
          Nova Pergunta
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Perguntas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{questions.length}</div>
          </CardContent>
        </Card>
        {categories.slice(0, 3).map(category => (
          <Card key={category}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{category}</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {questions.filter(q => q.category === category).length}
              </div>
            </CardContent>
          </Card>
        ))}
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
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Excluir
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
                <Label>Opções de Resposta *</Label>
                {editingQuestion.options.map((option, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-1">
                      <Label className="text-xs text-gray-500">#{index + 1}</Label>
                    </div>
                    <div className="col-span-8">
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
                          max="3"
                          value={option.score}
                          onChange={(e) => updateOption(index, 'score', parseInt(e.target.value) || 0)}
                          className="w-16"
                        />
                        <span className="text-xs text-gray-500">pts</span>
                      </div>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-gray-500">
                  💡 Dica: Use pontuações de 0 a 3, onde 0 = inexistente e 3 = excelente
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveQuestion} className="bg-petrol hover:bg-petrol/90">
              {isNewQuestion ? "Criar Pergunta" : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {questions.length === 0 && (
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
