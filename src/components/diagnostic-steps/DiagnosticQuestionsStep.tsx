
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Question {
  id: number;
  question: string;
  category: string;
  options: Array<{
    text: string;
    score: number;
  }>;
  required: boolean;
}

interface DiagnosticQuestionsStepProps {
  questions: Question[];
  answers: {[key: number]: number};
  setAnswers: (answers: {[key: number]: number}) => void;
}

export const DiagnosticQuestionsStep = ({ questions, answers, setAnswers }: DiagnosticQuestionsStepProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnóstico Empresarial</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="space-y-3">
            <div className="flex items-start gap-2">
              <h4 className="font-medium text-gray-900">{question.question}</h4>
              {question.required && <span className="text-red-500">*</span>}
            </div>
            <div className="pl-4 border-l-2 border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Categoria: {question.category}</p>
              <RadioGroup
                value={answers[question.id]?.toString() || ""}
                onValueChange={(value) => setAnswers({...answers, [question.id]: parseInt(value)})}
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.score.toString()} id={`q${question.id}_${index}`} />
                    <Label htmlFor={`q${question.id}_${index}`} className="text-sm">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
