
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';

interface Question {
  id?: string;
  question: string;
  category: string;
  options: Array<{ text: string; score: number }>;
  required: boolean;
}

interface QuestionCardProps {
  question: Question;
  index: number;
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
  getCategoryColor: (category: string) => string;
}

export const QuestionCard = ({ 
  question, 
  index, 
  onEdit, 
  onDelete, 
  getCategoryColor 
}: QuestionCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
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
              onClick={() => onEdit(question)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => question.id && onDelete(question.id)}
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
  );
};
