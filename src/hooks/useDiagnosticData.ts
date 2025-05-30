
import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { useDiagnosticEdit } from '@/hooks/useDiagnosticEdit';
import { useDiagnosticQuestions } from '@/hooks/useDiagnosticQuestions';
import { useDiagnosticCalculations } from '@/hooks/useDiagnosticCalculations';

export const useDiagnosticData = (editId: string | null) => {
  const isEditing = !!editId;
  
  const [companyData, setCompanyData] = useState({
    clientName: '',
    companyName: '',
    email: '',
    phone: '',
    website: '',
    sector: '',
    employees: '',
    revenue: ''
  });

  const [answers, setAnswers] = useState<{[key: string]: number}>({});
  const [results, setResults] = useState<any>(null);
  const [diagnosticData, setDiagnosticData] = useState({
    planos: '',
    valores: '',
    observacoes: ''
  });

  const { questions, isLoading: questionsLoading, error: questionsError } = useDiagnosticQuestions();
  const { calculateResults } = useDiagnosticCalculations();
  const { data: editData, isLoading: editLoading } = useDiagnosticEdit(editId);

  const dataLoadedRef = useRef(false);

  // Carregar dados quando estiver editando
  useEffect(() => {
    if (isEditing && editData && !dataLoadedRef.current) {
      const { diagnostic, respostas } = editData;
      const empresa = diagnostic.empresas;

      // Preencher dados da empresa
      setCompanyData({
        clientName: empresa?.cliente_nome || '',
        companyName: empresa?.nome || '',
        email: empresa?.cliente_email || '',
        phone: empresa?.cliente_telefone || '',
        website: empresa?.site_instagram || '',
        sector: empresa?.setor || '',
        employees: empresa?.funcionarios || '',
        revenue: empresa?.faturamento || ''
      });

      // Preencher respostas
      const answersMap: {[key: string]: number} = {};
      respostas.forEach((resposta: any) => {
        answersMap[resposta.pergunta_id] = resposta.score;
      });
      setAnswers(answersMap);

      // Preencher dados do diagnóstico
      setDiagnosticData({
        planos: diagnostic.planos || '',
        valores: diagnostic.valores?.toString() || '',
        observacoes: diagnostic.observacoes || ''
      });

      // Calcular resultados baseado nas respostas
      if (Object.keys(answersMap).length > 0 && questions.length > 0) {
        const calculatedResults = calculateResults(answersMap, questions);
        setResults(calculatedResults);
      }

      // Marcar como carregado e exibir toast apenas uma vez
      dataLoadedRef.current = true;
      toast({
        title: "Dados carregados",
        description: "Os dados do diagnóstico foram carregados para edição."
      });
    }
  }, [editData, isEditing, questions, calculateResults]);

  const calculateResultsFromAnswers = () => {
    if (Object.keys(answers).length > 0 && questions.length > 0) {
      const calculatedResults = calculateResults(answers, questions);
      setResults(calculatedResults);
      return calculatedResults;
    }
    return null;
  };

  return {
    companyData,
    setCompanyData,
    answers,
    setAnswers,
    results,
    setResults,
    diagnosticData,
    setDiagnosticData,
    questions,
    questionsLoading,
    questionsError,
    editLoading,
    isEditing,
    calculateResultsFromAnswers
  };
};
