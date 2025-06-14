
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface EmptyStateProps {
  onNewQuestion: () => void;
}

export const EmptyState = ({ onNewQuestion }: EmptyStateProps) => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Edit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma pergunta cadastrada</h3>
        <p className="text-gray-600 mb-6">
          Comece criando a primeira pergunta do seu diagnóstico.
        </p>
        <Button onClick={onNewQuestion} className="bg-petrol hover:bg-petrol/90">
          <Edit className="mr-2 h-4 w-4" />
          Criar Primeira Pergunta
        </Button>
      </CardContent>
    </Card>
  );
};
