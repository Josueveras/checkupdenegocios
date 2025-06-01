
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ActionPanelProps {
  selectedDiagnostics: string[];
  setSelectedDiagnostics: (value: string[]) => void;
}

const ActionPanel = ({ selectedDiagnostics, setSelectedDiagnostics }: ActionPanelProps) => {
  const handleCompareSelected = () => {
    if (selectedDiagnostics.length !== 2) {
      toast({
        title: "Seleção incompleta",
        description: "Selecione exatamente 2 diagnósticos para comparar.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Comparativo gerado",
      description: "PDF de comparação foi gerado com sucesso!"
    });
  };

  if (selectedDiagnostics.length === 0) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-blue-900">
              {selectedDiagnostics.length} diagnóstico(s) selecionado(s)
            </h4>
            <p className="text-sm text-blue-700">
              {selectedDiagnostics.length === 2 
                ? "Clique em 'Comparar' para gerar o relatório" 
                : "Selecione mais um diagnóstico para comparar"
              }
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedDiagnostics([])}
            >
              Limpar Seleção
            </Button>
            <Button
              onClick={handleCompareSelected}
              disabled={selectedDiagnostics.length !== 2}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Comparar Selecionados
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionPanel;
