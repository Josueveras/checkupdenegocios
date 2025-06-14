
import { useState, useEffect } from 'react';
import { PipelineConfig, PipelineColumn, DEFAULT_PIPELINE_CONFIG } from '@/types/pipeline';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'pipeline-config';

export const usePipelineConfig = () => {
  const [config, setConfig] = useState<PipelineConfig>(DEFAULT_PIPELINE_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Carregar configuração do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedConfig = JSON.parse(saved);
        setConfig(parsedConfig);
      }
    } catch (error) {
      console.error('Erro ao carregar configuração do pipeline:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar configuração no localStorage
  const saveConfig = (newConfig: PipelineConfig) => {
    try {
      const configToSave = {
        ...newConfig,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configToSave));
      setConfig(configToSave);
      toast({
        title: "Configuração salva",
        description: "As colunas do pipeline foram atualizadas.",
      });
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    }
  };

  // Adicionar nova coluna
  const addColumn = (column: Omit<PipelineColumn, 'id' | 'order'>) => {
    const newColumn: PipelineColumn = {
      ...column,
      id: `col_${Date.now()}`,
      order: config.columns.length
    };
    
    const newConfig = {
      ...config,
      columns: [...config.columns, newColumn]
    };
    
    saveConfig(newConfig);
  };

  // Atualizar coluna existente
  const updateColumn = (id: string, updates: Partial<PipelineColumn>) => {
    const newConfig = {
      ...config,
      columns: config.columns.map(col => 
        col.id === id ? { ...col, ...updates } : col
      )
    };
    
    saveConfig(newConfig);
  };

  // Remover coluna
  const removeColumn = (id: string) => {
    // Não permitir remover se for a única coluna
    if (config.columns.length <= 1) {
      toast({
        title: "Ação não permitida",
        description: "Deve haver pelo menos uma coluna no pipeline.",
        variant: "destructive"
      });
      return;
    }

    const newConfig = {
      ...config,
      columns: config.columns
        .filter(col => col.id !== id)
        .map((col, index) => ({ ...col, order: index }))
    };
    
    saveConfig(newConfig);
  };

  // Reordenar colunas
  const reorderColumns = (columns: PipelineColumn[]) => {
    const newConfig = {
      ...config,
      columns: columns.map((col, index) => ({ ...col, order: index }))
    };
    
    saveConfig(newConfig);
  };

  // Resetar para configuração padrão
  const resetToDefault = () => {
    saveConfig(DEFAULT_PIPELINE_CONFIG);
  };

  // Obter colunas ordenadas
  const orderedColumns = config.columns.sort((a, b) => a.order - b.order);

  return {
    config,
    columns: orderedColumns,
    isLoading,
    addColumn,
    updateColumn,
    removeColumn,
    reorderColumns,
    resetToDefault,
    saveConfig
  };
};
