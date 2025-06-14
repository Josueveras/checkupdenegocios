
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { useDebugPerguntas } from '@/hooks/useDebugPerguntas';
import { ChevronDown, Bug, Trash2, TestTube, RefreshCw } from 'lucide-react';

export const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    analyzeData, 
    cleanCorruptedData, 
    testPersistence, 
    runAnalysis,
    isAnalyzing,
    isCleaning,
    isTesting
  } = useDebugPerguntas();

  const handleTestPersistence = () => {
    testPersistence.mutate({
      question: "Teste de Persistência - " + new Date().toISOString(),
      options: [
        { text: "Opção A", score: 0 },
        { text: "Opção B", score: 1 },
        { text: "Opção C", score: 2 }
      ]
    });
  };

  return (
    <Card className="border-orange-200 bg-orange-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-orange-100">
            <CardTitle className="flex items-center justify-between text-orange-800">
              <div className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Debug Panel
                <Badge variant="outline" className="text-orange-600">
                  Desenvolvimento
                </Badge>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={runAnalysis}
                disabled={isAnalyzing}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                {isAnalyzing ? 'Analisando...' : 'Analisar Dados'}
              </Button>
              
              <Button
                onClick={() => cleanCorruptedData.mutate()}
                disabled={isCleaning}
                variant="outline"
                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                {isCleaning ? 'Limpando...' : 'Limpar Corrompidos'}
              </Button>
              
              <Button
                onClick={handleTestPersistence}
                disabled={isTesting}
                variant="outline"
                className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <TestTube className="h-4 w-4" />
                {isTesting ? 'Testando...' : 'Testar Persistência'}
              </Button>
            </div>

            {analyzeData.data && (
              <div className="mt-4 p-4 bg-white rounded-lg border">
                <h4 className="font-semibold mb-2">Análise dos Dados:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Total de Perguntas:</strong> {analyzeData.data.totalQuestions}
                  </div>
                  <div>
                    <strong>Perguntas Corrompidas:</strong> 
                    <Badge variant={analyzeData.data.summary.totalCorrupted > 0 ? "destructive" : "secondary"} className="ml-2">
                      {analyzeData.data.summary.totalCorrupted}
                    </Badge>
                  </div>
                </div>
                
                {analyzeData.data.corruptedQuestions.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium text-red-600 mb-2">Perguntas com Problemas:</h5>
                    {analyzeData.data.corruptedQuestions.map((q) => (
                      <div key={q.id} className="mb-2 p-2 bg-red-50 rounded border-l-4 border-red-200">
                        <div className="font-medium">ID: {q.id} - {q.pergunta}</div>
                        <ul className="text-xs text-red-600 mt-1">
                          {q.errorDetails.map((error, idx) => (
                            <li key={idx}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {cleanCorruptedData.data && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Resultado da Limpeza:</h4>
                <p className="text-sm text-green-700">
                  {cleanCorruptedData.data.updatedCount} perguntas foram atualizadas.
                </p>
              </div>
            )}

            {testPersistence.data && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Resultado do Teste de Persistência:</h4>
                <div className="text-sm">
                  <Badge variant={testPersistence.data.success ? "secondary" : "destructive"}>
                    {testPersistence.data.success ? 'SUCESSO' : 'FALHOU'}
                  </Badge>
                  {!testPersistence.data.success && (
                    <div className="mt-2 text-red-600">
                      <p>Dados não persistiram corretamente!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
