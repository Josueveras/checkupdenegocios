
import { Button } from '@/components/ui/button';
import { Edit, Tag } from 'lucide-react';

interface QuestionHeaderProps {
  onNewQuestion: () => void;
  onManageCategories: () => void;
}

export const QuestionHeader = ({ onNewQuestion, onManageCategories }: QuestionHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Editor de Perguntas</h1>
        <p className="text-gray-600 mt-1">Gerencie as perguntas do diagnóstico empresarial</p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onManageCategories}
          className="text-purple-600 border-purple-200 hover:bg-purple-50"
        >
          <Tag className="mr-2 h-4 w-4" />
          Categorias
        </Button>
        <Button onClick={onNewQuestion} className="bg-petrol hover:bg-petrol/90 text-white">
          <Edit className="mr-2 h-4 w-4" />
          Nova Pergunta
        </Button>
      </div>
    </div>
  );
};
